import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from server.services.StripeService import StripeService
from svix.webhooks import Webhook, WebhookVerificationError

from data.database import Database
from data.models.user_model import UserModel

load_dotenv()

app = FastAPI()
db = Database()


class ClerkEvent(BaseModel):
    type: str
    data: dict


@app.post("/webhooks/clerk")
async def clerk_webhook(request: Request, event: ClerkEvent):
    svix_secret = os.getenv("SVIX_KEY")
    if not svix_secret:
        raise HTTPException(status_code=500, detail="Svix secret not found")

    svix_id = request.headers.get("svix-id")
    svix_timestamp = request.headers.get("svix-timestamp")
    svix_signature = request.headers.get("svix-signature")

    if not svix_id or not svix_timestamp or not svix_signature:
        raise HTTPException(status_code=400, detail="Missing Svix headers")

    try:
        wh = Webhook(svix_secret)
        payload = await request.body()
        wh.verify(
            payload,
            {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            },
        )
    except WebhookVerificationError:
        raise HTTPException(status_code=400, detail="Invalid Svix signature")

    if event.type == "user.created":
        clerk_id = event.data["id"]
        email = event.data["email_addresses"][0]["email_address"]
        name = event.data["first_name"] + " " + event.data["last_name"]

        # Create Stripe customer
        stripe_customer_id = StripeService.create_customer(email, name)

        user = UserModel(
            id=clerk_id, stripe_id=stripe_customer_id, email=email, name=name
        )
        await db.create(user)

    return {"success": True}

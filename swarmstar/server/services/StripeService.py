from stripe import Charge, Customer


class StripeService:
    @staticmethod
    def create_customer(email: str, name: str) -> str:
        customer = Customer.create(email=email, name=name)
        return customer.id

    @staticmethod
    def create_charge(customer_id: str, amount: int, currency: str) -> str:
        charge = Charge.create(
            customer=customer_id,
            amount=amount,
            currency=currency,
            description="Charge for service",
        )
        return charge.id

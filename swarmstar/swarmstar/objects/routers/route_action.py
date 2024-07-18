from swarmstar.actions.routers.base_router import BaseRouter

class RouteAction(BaseRouter):
    ROUTE_INSTRUCTIONS = (
        "Decide what action path to take based on the directive and the available actions. "
        "If there is no good action path to take, describe what type of action is needed "
        "in detail in the failure message, and leave index empty."
    )

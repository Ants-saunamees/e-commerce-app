from typing import Callable, Dict, List
from core.events.event import Event


class EventBus:
    def __init__(self):
        self._subscribers: Dict[str, List[Callable]] = {}

    def subscribe(self, event_name: str, handler: Callable):
        if event_name not in self._subscribers:
            self._subscribers[event_name] = []
        self._subscribers[event_name].append(handler)

    async def publish(self, event: Event):
        handlers = self._subscribers.get(event.name, [])

        for handler in handlers:
            await handler(event)


event_bus = EventBus()
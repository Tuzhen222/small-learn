import json
import asyncio
from typing import Set

from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse

router = APIRouter()


class EventManager:
    def __init__(self):
        self.connections: Set[asyncio.Queue] = set()

    async def broadcast(self, event_type: str, data: dict):
        dead = set()
        for queue in self.connections:
            try:
                await queue.put({"event": event_type, "data": data})
            except Exception:
                dead.add(queue)
        self.connections -= dead

    async def connect(self) -> asyncio.Queue:
        queue = asyncio.Queue()
        self.connections.add(queue)
        return queue

    def disconnect(self, queue: asyncio.Queue):
        self.connections.discard(queue)


event_manager = EventManager()


@router.get("/stream")
async def stream_events(request: Request):
    async def event_generator():
        queue = await event_manager.connect()
        try:
            while True:
                if await request.is_disconnected():
                    break
                try:
                    event = await asyncio.wait_for(queue.get(), timeout=30)
                    yield {
                        "event": event["event"],
                        "data": json.dumps(event["data"]),
                    }
                except asyncio.TimeoutError:
                    yield {
                        "event": "ping",
                        "data": "",
                    }
        finally:
            event_manager.disconnect(queue)

    return EventSourceResponse(event_generator())

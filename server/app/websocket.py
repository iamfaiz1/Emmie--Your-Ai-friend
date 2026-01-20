from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio, random

from app.instant_engine import instant_reply
from app.groq_agent import groq_reply

router = APIRouter()

FILLERS = ["hmm", "wait", "lol wait", "one sec", "uhh"]

@router.websocket("/ws/chat")
async def chat(ws: WebSocket):
    await ws.accept()

    try:
        while True:
            user_msg = await ws.receive_text()

            #1 instant replies (0 ms)
            instant = instant_reply(user_msg)
            if instant:
                await ws.send_text(instant)
                continue

            #2 typing illusion (optional now, Groq is fast)
            await asyncio.sleep(random.uniform(0.2, 0.4))

            if random.random() < 0.4:
                await ws.send_text(random.choice(FILLERS))
                await asyncio.sleep(random.uniform(0.2, 0.5))

            #3️ Groq online model
            reply = groq_reply(user_msg)
            await ws.send_text(reply)

    except WebSocketDisconnect:
        print("client disconnected")

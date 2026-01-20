from fastapi import FastAPI
from app.websocket import router as ws_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5173/ws/chat",
        "http://localhost:5173",
        "http://localhost:5173/ws/chat",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(ws_router)


# run:
#  uvicorn app.main:app --reload

# to run on phone

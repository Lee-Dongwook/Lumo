from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.flows.agent_loop import handle_chat_stream
from app.middlewares.auth import get_current_user_ws
from app.supa.client import save_request

router = APIRouter()

@router.websocket('/ws/chat')
async def chat_websocket(websocket:WebSocket):
    await websocket.accept()
    try:
      user = await get_current_user_ws(websocket)

      while True:
         data = await websocket.receive_text()
         full_response = ""

         async for chunk in handle_chat_stream(data):
            full_response += chunk
            await websocket.send_text(chunk)

         save_request(
           user_id=user["id"],
           request_type="chat",
           source=data,
           content={"response": full_response}
         ) 
    except WebSocketDisconnect:
        print("WebSocket disconnected") 
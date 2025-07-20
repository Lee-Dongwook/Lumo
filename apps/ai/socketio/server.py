import socketio


mgr = socketio.AsyncRedisManager('redis://localhost:6379')
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*', client_manager=mgr)
sio_app = socketio.ASGIApp(sio)
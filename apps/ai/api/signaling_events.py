from ai.socketio.server import sio

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.event
async def join(sid, data):
    await sio.save_session(sid, {'user_id': data['userId']})
    await sio.enter_room(sid, data['userId'])

@sio.event
async def offer(sid, data):
    await sio.emit('offer', data, room=data['to'])

@sio.event
async def answer(sid, data):
    await sio.emit('answer', data, room=data['to'])

@sio.event
async def ice_candidate(sid, data):
    await sio.emit('ice-candidate', data, room=data['to'])

@sio.event
async def hangup(sid, data):
    print(f"Hangup from {data['from']} to {data['to']}")
import os
from shutil import copyfile
from app.services.socketio_server import sio
from app.services.webrtc_handler import track_to_wav, transcribe_wav
from app.services.gpt_mock_response import generate_mock_response
from app.services.tts_emit import synthesize_tts_gtts
from aiortc import RTCPeerConnection, RTCSessionDescription


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
    print(f"[AI 서버] Offer received from {data['from']}")

    pc = RTCPeerConnection()

    @pc.on('track')
    async def on_track(track): # noqa
        print(f"🎤 Audio track received from {data['from']}")

        # 1. 사용자의 오디오 → 텍스트
        wav_path = await track_to_wav(track)
        transcript = transcribe_wav(wav_path)
        print("📝 Whisper 인식 결과:", transcript)

        # 2. GPT 모의 응답 생성
        reply = generate_mock_response(transcript)
        print("🤖 GPT 응답:", reply)

        # 3. gTTS로 mp3 생성
        mp3_path = synthesize_tts_gtts(reply)
        filename = os.path.basename(mp3_path)

        # 4. mp3 파일을 정적 폴더로 복사 (./static/audio)
        static_path = os.path.join("static", "audio", filename)
        copyfile(mp3_path, static_path)

        # 5. 클라이언트에 응답 전송
        await sio.emit("tts_audio", {
            "text": reply,
            "url": f"/static/audio/{filename}",
        }, room=data["from"])

    
    offer = RTCSessionDescription(sdp=data['sdp'], type='offer')
    await pc.setRemoteDescription(offer)

    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)


    await sio.emit("answer", {
        "to": data["from"],
        "from": data["to"],
        "sdp": pc.localDescription.sdp,
    }, room=data["from"])

@sio.event
async def answer(sid, data):
    await sio.emit('answer', data, room=data['to'])

@sio.event
async def ice_candidate(sid, data):
    await sio.emit('ice-candidate', data, room=data['to'])

@sio.event
async def hangup(sid, data):
    print(f"Hangup from {data['from']} to {data['to']}") 
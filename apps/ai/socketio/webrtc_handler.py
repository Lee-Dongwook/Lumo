import os
import wave
import uuid
import tempfile
import asyncio
from aiortc import MediaStreamTrack
from av.audio.frame import AudioFrame
import whisper

whisper_model = whisper.load_model('base')

def write_frames_to_wav(frames: list[AudioFrame], filename: str):
     with wave.open(filename, 'wb') as wf:
          wf.setnchannels(1)
          wf.setsampwidth(2)
          wf.setframerate(48000)

          for frame in frames:
              pcm = frame.to_ndarray().tobytes()
              wf.writeframes(pcm)

async def track_to_wav(track: MediaStreamTrack, duration_sec: int = 5) -> str:
     frames = []
     start = asyncio.get_event_loop().time()

     while asyncio.get_event_loop.time() - start < duration_sec:
         frame = await track.recv()
         frames.append(frame)

     tmp_wav_path = os.path.join(tempfile.gettempdir(), f"audio_{uuid.uuid4().hex}.wav")
     await asyncio.to_thread(write_frames_to_wav, frames, tmp_wav_path)
     return tmp_wav_path

def transcribe_wav(path: str) -> str:
    try:
        result = whisper_model.transcribe(path)
        text = result.get("text", "")
        if isinstance(text, str):
            return text
        return ""
    finally:
        # 예외 여부와 상관없이 파일 삭제
        if os.path.exists(path):
            os.remove(path)

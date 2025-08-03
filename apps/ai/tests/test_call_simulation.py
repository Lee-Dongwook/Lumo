from app.services.call_handler import CallHandler

if __name__ == "__main__":
    handler = CallHandler(voice_id="YOUR_ELEVENLABS_VOICE_ID")
    audio_response = handler.handle_audio_file("/path/to/twilio_audio.wav")

    with open("response.mp3", "wb") as f:
        f.write(audio_response)
    print("✅ response saved to response.mp3")

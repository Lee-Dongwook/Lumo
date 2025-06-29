import requests

"""
xi-api-key 필요
"""

def synthesize(text, voice_id):
    response = requests.post(
        "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
        json={"text": text},
        headers={"xi-api-key":""}
    )
    return response.content
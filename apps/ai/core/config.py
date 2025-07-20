import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    JWT_SECRET: str = os.getenv("JWT_SECRET", "changeme")

settings = Settings()

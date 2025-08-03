# This file is deprecated. Use core.settings instead.
from .settings import settings

# Backward compatibility
class Settings:
    JWT_SECRET: str = settings.jwt_secret

# Keep the old interface for backward compatibility
settings_old = Settings()

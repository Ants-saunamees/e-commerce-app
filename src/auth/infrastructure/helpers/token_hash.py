import hashlib
import hmac
from core.config.settings import settings


def hash_token(raw_token: str) -> str:
    key = settings.REFRESH_TOKEN_KEY.encode()  # FIX: convert to bytes
    return hmac.new(key, raw_token.encode(), hashlib.sha256).hexdigest()



def verify_token(raw_token: str, hashed_token: str) -> bool:
    expected = hash_token(raw_token)
    return hmac.compare_digest(expected, hashed_token)

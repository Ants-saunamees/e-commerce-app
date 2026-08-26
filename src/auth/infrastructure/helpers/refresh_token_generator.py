from datetime import datetime, timedelta
import secrets
from auth.domain.entities.refresh_token import RefreshToken

def generate_refresh_token(user_id: int, minutes: int = 60 * 24 * 7) -> RefreshToken:
    expires = datetime.utcnow() + timedelta(minutes=minutes)
    token = secrets.token_urlsafe(64)

    return RefreshToken(
        id=None,
        user_id=user_id,
        token=token,
        expires_at=expires,
        created_at=datetime.utcnow(),
        revoked=False,
    )

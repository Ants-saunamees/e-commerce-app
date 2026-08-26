from datetime import datetime

async def is_token_expired(expires_at: datetime) -> bool:
    return expires_at <= datetime.utcnow()

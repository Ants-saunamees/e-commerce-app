from fastapi import Request
from auth.domain.services.auth_domain_service import AuthDomainService
from auth.infrastructure.repositories.user_repo_impl import UserRepository
from core.security.jwt import create_access_token

def get_token_from_request(request: Request):
    return (
        request.cookies.get("access_token"),
        request.cookies.get("refresh_token")
    )


async def attach_user_to_request(request: Request, user_id: int, session):
    repo = UserRepository(session)
    user = await repo.find_by_id(user_id)
    request.state.user = user
    return user


def issue_new_access_token(user_id: int):
    return create_access_token({"sub": str(user_id)})

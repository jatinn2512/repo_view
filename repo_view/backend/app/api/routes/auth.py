from fastapi import APIRouter, HTTPException, status

from app.schemas.auth import AuthUser, LoginRequest, LoginResponse

router = APIRouter(prefix="/api", tags=["authentication"])

DEMO_IDENTIFIER_VALUES = {"demo", "demo@repoview.dev"}
DEMO_PASSWORD = "Password123!"


@router.get("/health")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest) -> LoginResponse:
    normalized_identifier = payload.identifier.strip().lower()

    if (
        normalized_identifier not in DEMO_IDENTIFIER_VALUES
        or payload.password != DEMO_PASSWORD
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Use the documented demo account.",
        )

    return LoginResponse(
        access_token="demo-access-token",
        user=AuthUser(
            id="demo-user-001",
            name="Demo User",
            email="demo@repoview.dev",
            role="Administrator",
        ),
    )


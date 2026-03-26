from enum import Enum

from pydantic import BaseModel, Field


class GenderEnum(str, Enum):
    male = "Male"
    female = "Female"
    other = "Other"


class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=64)
    password: str = Field(min_length=6, max_length=128)
    age: int = Field(ge=1, le=120)
    gender: GenderEnum


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

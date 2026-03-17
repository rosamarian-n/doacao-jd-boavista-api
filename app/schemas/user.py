from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str
    cidade: Optional[str] = None
    telefone: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    nome: str
    email: str
    cidade: Optional[str] = None
    telefone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
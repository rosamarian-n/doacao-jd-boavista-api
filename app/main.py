from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import SessionLocal, engine, Base
from app import models, schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=" Doação Jd Boa Vista API",
    description="API para doação de itens - Conectando doadores e interessados",
    version="0.2.0"
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "Bem-vindo à Doação Jd Boa Vista", "status": "online"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "0.2.0"}

@app.post("/users", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Verificar se email já existe
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    
    novo_usuario = models.User(
        nome=user.nome,
        email=user.email,
        senha_hash=user.senha,
        cidade=user.cidade,
        telefone=user.telefone
    )
    
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    
    return novo_usuario

@app.get("/users", response_model=List[schemas.UserResponse])
def list_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users
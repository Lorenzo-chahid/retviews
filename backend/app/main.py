import json
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from . import (
    crud,
    models,
    schemas,
    database,
)
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

models.Base.metadata.create_all(bind=database.engine)
app = FastAPI()

SECRET_KEY = "8B478AD74FB2D4DBD7EA2DDA83B14"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

origins = [
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


def populate_db_with_clothing_data(db: Session):
    with open("./clothing_data.json") as file:
        data = json.load(file)
        for item_data in data:
            category = (
                db.query(models.ClothingCategory)
                .filter(models.ClothingCategory.name == item_data["category"])
                .first()
            )
            if not category:
                category = models.ClothingCategory(name=item_data["category"])
                db.add(category)
                db.commit()

            item = models.ClothingItem(
                name=item_data["name"],
                description=item_data["description"],
                image_url=item_data["image_url"],
                category=category,
            )
            db.add(item)
        db.commit()


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(db: Session, username: str, password: str):
    print("AUTHENTICATE")
    user = crud.get_user_by_username(db, username=username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    print("CHIPPOS")
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Informations d'identification incorrectes",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires,
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db=db, user=user)


@app.get("/clothing-items/", response_model=List[schemas.ClothingItem])
def read_clothing_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clothing_items = crud.get_clothing_items(db, skip=skip, limit=limit)
    return clothing_items


db = database.SessionLocal()
populate_db_with_clothing_data(db)
db.close()

from pydantic import BaseModel, EmailStr

class SUserAuth(BaseModel):
    email: EmailStr
    password: str

class SUser(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str

class SUserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str
    access_token: str
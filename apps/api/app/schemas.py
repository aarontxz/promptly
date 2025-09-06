from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional


class FlashcardBase(BaseModel):
    front: str
    back: str


class FlashcardCreate(FlashcardBase):
    pass


class FlashcardUpdate(BaseModel):
    front: Optional[str] = None
    back: Optional[str] = None


class DeckBase(BaseModel):
    name: str
    description: Optional[str] = None


class DeckCreate(DeckBase):
    pass


class DeckUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class UserBase(BaseModel):
    email: str
    name: str


class UserCreate(UserBase):
    google_id: Optional[str] = None
    picture: Optional[str] = None


# Simple response schemas without relationships
class FlashcardResponse(FlashcardBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    deck_id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None


class DeckResponse(DeckBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    owner_id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    google_id: Optional[str] = None
    picture: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None


# Complex schemas with relationships (for when you need them)
class DeckWithFlashcards(DeckResponse):
    flashcards: List[FlashcardResponse] = []


class UserWithDecks(UserResponse):
    decks: List[DeckResponse] = []


# Keep the original names for backward compatibility
Flashcard = FlashcardResponse
Deck = DeckResponse  
User = UserResponse

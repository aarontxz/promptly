from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from typing import ForwardRef


class FlashcardBase(BaseModel):
    front: str
    back: str


class FlashcardCreate(FlashcardBase):
    pass


class FlashcardUpdate(BaseModel):
    front: Optional[str] = None
    back: Optional[str] = None


class Flashcard(FlashcardBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    deck_id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None


class DeckBase(BaseModel):
    name: str
    description: Optional[str] = None


class DeckCreate(DeckBase):
    pass


class DeckUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class Deck(DeckBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    owner_id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    flashcards: List["Flashcard"] = []


class UserBase(BaseModel):
    email: str
    name: str


class UserCreate(UserBase):
    google_id: Optional[str] = None
    picture: Optional[str] = None


class User(UserBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    google_id: Optional[str] = None
    picture: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    decks: List["Deck"] = []


# Update forward references
Deck.model_rebuild()
User.model_rebuild()

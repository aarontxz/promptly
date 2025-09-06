from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..auth import get_current_user
from .. import db_models, schemas

router = APIRouter(prefix="/flashcards", tags=["flashcards"])


@router.post("/deck/{deck_id}", response_model=schemas.Flashcard)
def create_flashcard(
    deck_id: int,
    flashcard: schemas.FlashcardCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    # Verify the deck belongs to the current user
    deck = db.query(db_models.Deck).filter(
        db_models.Deck.id == deck_id,
        db_models.Deck.owner_id == current_user.id,
        db_models.Deck.is_active == True
    ).first()
    
    if not deck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deck not found"
        )
    
    db_flashcard = db_models.Flashcard(
        front=flashcard.front,
        back=flashcard.back,
        deck_id=deck_id
    )
    db.add(db_flashcard)
    db.commit()
    db.refresh(db_flashcard)
    return db_flashcard


@router.get("/deck/{deck_id}", response_model=List[schemas.Flashcard])
def get_deck_flashcards(
    deck_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    # Verify the deck belongs to the current user
    deck = db.query(db_models.Deck).filter(
        db_models.Deck.id == deck_id,
        db_models.Deck.owner_id == current_user.id,
        db_models.Deck.is_active == True
    ).first()
    
    if not deck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deck not found"
        )
    
    flashcards = db.query(db_models.Flashcard).filter(
        db_models.Flashcard.deck_id == deck_id,
        db_models.Flashcard.is_active == True
    ).offset(skip).limit(limit).all()
    
    return flashcards


@router.get("/{flashcard_id}", response_model=schemas.Flashcard)
def get_flashcard(
    flashcard_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    flashcard = db.query(db_models.Flashcard).join(db_models.Deck).filter(
        db_models.Flashcard.id == flashcard_id,
        db_models.Deck.owner_id == current_user.id,
        db_models.Flashcard.is_active == True
    ).first()
    
    if not flashcard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found"
        )
    
    return flashcard


@router.put("/{flashcard_id}", response_model=schemas.Flashcard)
def update_flashcard(
    flashcard_id: int,
    flashcard_update: schemas.FlashcardUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    flashcard = db.query(db_models.Flashcard).join(db_models.Deck).filter(
        db_models.Flashcard.id == flashcard_id,
        db_models.Deck.owner_id == current_user.id,
        db_models.Flashcard.is_active == True
    ).first()
    
    if not flashcard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found"
        )
    
    update_data = flashcard_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(flashcard, field, value)
    
    db.commit()
    db.refresh(flashcard)
    return flashcard


@router.delete("/{flashcard_id}")
def delete_flashcard(
    flashcard_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    flashcard = db.query(db_models.Flashcard).join(db_models.Deck).filter(
        db_models.Flashcard.id == flashcard_id,
        db_models.Deck.owner_id == current_user.id,
        db_models.Flashcard.is_active == True
    ).first()
    
    if not flashcard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Flashcard not found"
        )
    
    flashcard.is_active = False
    db.commit()
    return {"message": "Flashcard deleted successfully"}

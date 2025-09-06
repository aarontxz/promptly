from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..auth import get_current_user
from .. import db_models, schemas

router = APIRouter(prefix="/decks", tags=["decks"])


@router.post("/", response_model=schemas.Deck)
def create_deck(
    deck: schemas.DeckCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    db_deck = db_models.Deck(
        name=deck.name,
        description=deck.description,
        owner_id=current_user.id
    )
    db.add(db_deck)
    db.commit()
    db.refresh(db_deck)
    return db_deck


@router.get("/", response_model=List[schemas.Deck])
def get_user_decks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    decks = db.query(db_models.Deck).filter(
        db_models.Deck.owner_id == current_user.id,
        db_models.Deck.is_active == True
    ).offset(skip).limit(limit).all()
    return decks


@router.get("/{deck_id}", response_model=schemas.Deck)
def get_deck(
    deck_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
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
    
    return deck


@router.put("/{deck_id}", response_model=schemas.Deck)
def update_deck(
    deck_id: int,
    deck_update: schemas.DeckUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
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
    
    update_data = deck_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(deck, field, value)
    
    db.commit()
    db.refresh(deck)
    return deck


@router.delete("/{deck_id}")
def delete_deck(
    deck_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
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
    
    deck.is_active = False
    db.commit()
    return {"message": "Deck deleted successfully"}

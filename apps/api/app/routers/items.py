from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from ..models import Item, ItemCreate, ItemUpdate, HealthResponse
from ..database import get_db
from .. import crud

router = APIRouter()

@router.get("/", response_model=HealthResponse)
async def root():
    return {"status": "ok", "message": "Promptly API is running with PostgreSQL"}

@router.get("/health", response_model=HealthResponse)
async def health_check(db: Session = Depends(get_db)):
    try:
        # Test database connection
        db.execute("SELECT 1")
        return {"status": "healthy", "message": "API and database are operational"}
    except Exception as e:
        return {"status": "unhealthy", "message": f"Database connection failed: {str(e)}"}

@router.get("/items", response_model=List[Item])
async def get_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = crud.get_items(db, skip=skip, limit=limit)
    return items

@router.post("/items", response_model=Item)
async def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    return crud.create_item(db=db, item=item)

@router.get("/items/{item_id}", response_model=Item)
async def get_item(item_id: int, db: Session = Depends(get_db)):
    db_item = crud.get_item(db, item_id=item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item

@router.put("/items/{item_id}", response_model=Item)
async def update_item(item_id: int, item: ItemUpdate, db: Session = Depends(get_db)):
    db_item = crud.update_item(db, item_id=item_id, item=item)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item

@router.delete("/items/{item_id}")
async def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = crud.delete_item(db, item_id=item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"message": "Item deleted successfully"}

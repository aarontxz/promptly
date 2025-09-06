from sqlalchemy.orm import Session
from . import db_models, models

def get_item(db: Session, item_id: int):
    return db.query(db_models.Item).filter(db_models.Item.id == item_id).first()

def get_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(db_models.Item).filter(db_models.Item.is_active == True).offset(skip).limit(limit).all()

def create_item(db: Session, item: models.ItemCreate):
    db_item = db_models.Item(name=item.name, description=item.description)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_item(db: Session, item_id: int, item: models.ItemUpdate):
    db_item = db.query(db_models.Item).filter(db_models.Item.id == item_id).first()
    if db_item:
        update_data = item.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
    return db_item

def delete_item(db: Session, item_id: int):
    db_item = db.query(db_models.Item).filter(db_models.Item.id == item_id).first()
    if db_item:
        # Soft delete by setting is_active to False
        db_item.is_active = False
        db.commit()
        db.refresh(db_item)
    return db_item

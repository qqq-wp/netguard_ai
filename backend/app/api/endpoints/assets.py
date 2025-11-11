from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.asset import Asset
from app.schemas.asset import Asset as AssetSchema

router = APIRouter()

@router.get("/assets/", response_model=List[AssetSchema])
def read_assets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        assets = db.query(Asset).filter(Asset.is_active == True).offset(skip).limit(limit).all()
        return assets
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/assets/{asset_id}", response_model=AssetSchema)
def read_asset(asset_id: int, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if asset is None:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset
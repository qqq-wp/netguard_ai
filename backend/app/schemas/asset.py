from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class AssetPortBase(BaseModel):
    port: int
    protocol: str
    service_name: Optional[str] = None
    service_version: Optional[str] = None
    state: Optional[str] = None

class AssetPortCreate(AssetPortBase):
    asset_id: int

class AssetPort(AssetPortBase):
    id: int
    asset_id: int
    last_scanned: datetime

    class Config:
        from_attributes = True

class AssetBase(BaseModel):
    ip_address: str
    mac_address: Optional[str] = None
    hostname: Optional[str] = None
    os_name: Optional[str] = None
    os_version: Optional[str] = None
    device_type: Optional[str] = None
    vendor: Optional[str] = None

class AssetCreate(AssetBase):
    pass

class Asset(AssetBase):
    id: int
    first_seen: datetime
    last_seen: datetime
    is_active: bool
    ports: List[AssetPort] = []

    class Config:
        from_attributes = True
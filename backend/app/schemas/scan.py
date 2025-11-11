from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any

class ScanNetworkBase(BaseModel):
    name: str
    cidr_range: str
    description: Optional[str] = None

class ScanNetworkCreate(ScanNetworkBase):
    pass

class ScanNetwork(ScanNetworkBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ScanTaskBase(BaseModel):
    network_id: int
    scan_type: str
    nmap_arguments: Optional[str] = None

class ScanTaskCreate(ScanTaskBase):
    pass

class ScanTask(ScanTaskBase):
    id: int
    status: str
    # created_by: int  # Временно убираем
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    results: Optional[Any] = None

    class Config:
        from_attributes = True
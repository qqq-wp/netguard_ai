from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import CIDR
from app.database import Base

class ScanNetwork(Base):
    __tablename__ = "scan_networks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    cidr_range = Column(CIDR, nullable=False)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ScanTask(Base):
    __tablename__ = "scan_tasks"

    id = Column(Integer, primary_key=True, index=True)
    network_id = Column(Integer, ForeignKey("scan_networks.id"))
    scan_type = Column(String(50), nullable=False)
    nmap_arguments = Column(Text)
    status = Column(String(20), nullable=False, default="pending")
    # Временно убираем created_by, так как нет модели User
    # created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    results = Column(JSON)
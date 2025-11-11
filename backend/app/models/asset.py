from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import INET, MACADDR
from sqlalchemy.orm import relationship
from app.database import Base

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(INET, nullable=False)
    mac_address = Column(MACADDR)
    hostname = Column(String(255))
    os_name = Column(String(100))
    os_version = Column(String(100))
    device_type = Column(String(50))
    vendor = Column(String(100))
    first_seen = Column(DateTime(timezone=True), server_default=func.now())
    last_seen = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    
    # Relationships
    ports = relationship("AssetPort", back_populates="asset")

class AssetPort(Base):
    __tablename__ = "asset_ports"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"))
    port = Column(Integer, nullable=False)
    protocol = Column(String(10), nullable=False)
    service_name = Column(String(100))
    service_version = Column(String(100))
    state = Column(String(20))
    last_scanned = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    asset = relationship("Asset", back_populates="ports")
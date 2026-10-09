from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class HostedZone(Base):
    __tablename__ = "hosted_zones"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    records = relationship("DNSRecord", back_populates="zone", cascade="all, delete-orphan")

class DNSRecord(Base):
    __tablename__ = "dns_records"
    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, ForeignKey("hosted_zones.id"))
    name = Column(String, index=True)
    record_type = Column(String) # A, AAAA, CNAME, etc.
    value = Column(String)
    ttl = Column(Integer, default=300)
    zone = relationship("HostedZone", back_populates="records")
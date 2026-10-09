from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, computed_field
from typing import List, Optional
import models, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Route53 Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DNSRecordBase(BaseModel):
    name: str
    record_type: str
    value: str
    ttl: int = 300

class DNSRecordCreate(DNSRecordBase):
    pass

class DNSRecordResponse(DNSRecordBase):
    id: int
    zone_id: int
    class Config:
        from_attributes = True

class HostedZoneBase(BaseModel):
    name: str
    description: Optional[str] = None

class HostedZoneCreate(HostedZoneBase):
    pass

class HostedZoneResponse(HostedZoneBase):
    id: int
    records: List[DNSRecordResponse] = []

    @computed_field
    @property
    def record_count(self) -> int:
        return len(self.records)

    class Config:
        from_attributes = True



@app.post("/zones/", response_model=HostedZoneResponse)
def create_zone(zone: HostedZoneCreate, db: Session = Depends(database.get_db)):
    db_zone = models.HostedZone(**zone.dict())
    db.add(db_zone)
    db.commit()
    db.refresh(db_zone)
    return db_zone

@app.get("/zones/", response_model=List[HostedZoneResponse])
def get_zones(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    return db.query(models.HostedZone).offset(skip).limit(limit).all()

@app.get("/zones/{zone_id}", response_model=HostedZoneResponse)
def get_zone(zone_id: int, db: Session = Depends(database.get_db)):
    db_zone = db.query(models.HostedZone).filter(models.HostedZone.id == zone_id).first()
    if not db_zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    return db_zone

@app.delete("/zones/{zone_id}")
def delete_zone(zone_id: int, db: Session = Depends(database.get_db)):
    db_zone = db.query(models.HostedZone).filter(models.HostedZone.id == zone_id).first()
    if not db_zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    db.delete(db_zone)
    db.commit()
    return {"message": "Zone deleted successfully"}

@app.get("/zones/{zone_id}/records/", response_model=List[DNSRecordResponse])
def get_records(zone_id: int, db: Session = Depends(database.get_db)):
    records = db.query(models.DNSRecord).filter(models.DNSRecord.zone_id == zone_id).all()
    return records

@app.post("/zones/{zone_id}/records/", response_model=DNSRecordResponse)
def create_record(zone_id: int, record: DNSRecordCreate, db: Session = Depends(database.get_db)):
    db_record = models.DNSRecord(**record.dict(), zone_id=zone_id)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@app.delete("/zones/{zone_id}/records/{record_id}")
def delete_record(zone_id: int, record_id: int, db: Session = Depends(database.get_db)):
    db_record = db.query(models.DNSRecord).filter(models.DNSRecord.id == record_id, models.DNSRecord.zone_id == zone_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(db_record)
    db.commit()
    return {"message": "Record deleted successfully"}

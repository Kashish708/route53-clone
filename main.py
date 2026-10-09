# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# # Keep any other imports you already have here (like models, SessionLocal, etc.)

# app = FastAPI()

# # Paste this CORS block directly below app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"], 
#     allow_credentials=True,
#     allow_methods=["*"], 
#     allow_headers=["*"],
# )

# # --- KEEP ALL YOUR EXISTING @app.get AND @app.post ROUTES BELOW THIS LINE! ---
# from fastapi import FastAPI, Depends, HTTPException
# from sqlalchemy.orm import Session
# from pydantic import BaseModel
# from typing import List, Optional
# import models, database
# from fastapi.middleware.cors import CORSMiddleware


from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import models, database

app = FastAPI()

# CORS Middleware configuration for Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# YOUR EXISTING CODE STARTS HERE
# (Keep your models.Base.metadata.create_all and @app routes exactly as they are below this line)
# ---------------------------------------------------------

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Route53 Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
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
    class Config:
        orm_mode = True

# --- API Endpoints ---

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

@app.delete("/zones/{zone_id}")
def delete_zone(zone_id: int, db: Session = Depends(database.get_db)):
    db_zone = db.query(models.HostedZone).filter(models.HostedZone.id == zone_id).first()
    if not db_zone:
        raise HTTPException(status_code=404, detail="Zone not found")
    db.delete(db_zone)
    db.commit()
    return {"message": "Zone deleted successfully"}

@app.post("/zones/{zone_id}/records/", response_model=DNSRecordResponse)
def create_record(zone_id: int, record: DNSRecordCreate, db: Session = Depends(database.get_db)):
    db_record = models.DNSRecord(**record.dict(), zone_id=zone_id)
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@app.delete("/records/{record_id}")
def delete_record(record_id: int, db: Session = Depends(database.get_db)):
    db_record = db.query(models.DNSRecord).filter(models.DNSRecord.id == record_id).first()
    if not db_record:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(db_record)
    db.commit()
    return {"message": "Record deleted successfully"}
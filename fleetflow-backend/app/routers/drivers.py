# app/routers/drivers.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, database
from typing import List

router = APIRouter(
    prefix="/drivers",
    tags=["Driver Performance"]
)

@router.get("/", response_model=List[schemas.DriverResponse])
def get_drivers(db: Session = Depends(database.get_db)):
    return db.query(models.Driver).all()

@router.post("/", response_model=schemas.DriverResponse, status_code=status.HTTP_201_CREATED)
def add_driver(driver: schemas.DriverCreate, db: Session = Depends(database.get_db)):
    new_driver = models.Driver(
        name=driver.name,
        license_number=driver.license_number,
        expiry_date=driver.expiry_date,
        status="On Duty"
    )
    db.add(new_driver)
    db.commit()
    db.refresh(new_driver)
    return new_driver

@router.put("/{driver_id}/status")
def update_driver_status(driver_id: int, status_update: schemas.DriverUpdateStatus, db: Session = Depends(database.get_db)):
    driver = db.query(models.Driver).filter(models.Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    # Restrict status changes
    valid_statuses = ["On Duty", "Off Duty", "Suspended"]
    if status_update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")
        
    driver.status = status_update.status
    db.commit()
    db.refresh(driver)
    return driver
# app/routers/vehicles.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, database
from typing import List

router = APIRouter(
    prefix="/vehicles",
    tags=["Vehicle Registry"]
)

@router.get("/", response_model=List[schemas.VehicleResponse])
def get_vehicles(db: Session = Depends(database.get_db)):
    return db.query(models.Vehicle).all()

@router.post("/", response_model=schemas.VehicleResponse, status_code=status.HTTP_201_CREATED)
def create_vehicle(vehicle: schemas.VehicleCreate, db: Session = Depends(database.get_db)):
    # Convert tons from frontend to kg for strict math validation later
    capacity_in_kg = vehicle.maxPayload * 1000 
    
    new_vehicle = models.Vehicle(
        plate=vehicle.licensePlate,
        model=vehicle.model,
        type=vehicle.type,
        capacity_kg=capacity_in_kg,
        odometer=vehicle.initialOdometer,
        status="Available"
    )
    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)
    return new_vehicle

@router.put("/{vehicle_id}/retire")
def retire_vehicle(vehicle_id: int, db: Session = Depends(database.get_db)):
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    vehicle.status = "Out of Service"
    db.commit()
    return {"message": "Vehicle marked as Out of Service"}
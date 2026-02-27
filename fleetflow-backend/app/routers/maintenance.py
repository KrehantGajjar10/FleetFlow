# app/routers/maintenance.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, database
from typing import List

router = APIRouter(
    prefix="/maintenance",
    tags=["Maintenance Logs"]
)

@router.get("/", response_model=List[schemas.MaintenanceResponse])
def get_maintenance_logs(db: Session = Depends(database.get_db)):
    logs = db.query(models.MaintenanceLog).all()
    # Attach vehicle model name for frontend convenience
    for log in logs:
        vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == log.vehicle_id).first()
        log.vehicle_name = vehicle.model if vehicle else "Unknown"
    return logs

@router.post("/", response_model=schemas.MaintenanceResponse, status_code=status.HTTP_201_CREATED)
def create_service_log(log_data: schemas.MaintenanceCreate, db: Session = Depends(database.get_db)):
    # 1. Verify the vehicle exists
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == log_data.vehicleId).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    # 2. Create the maintenance log
    new_log = models.MaintenanceLog(
        vehicle_id=log_data.vehicleId,
        issue=log_data.issue,
        date=log_data.date,
        cost=log_data.cost,
        status="Pending"
    )
    
    # 3. AUTO-HIDE RULE: Update vehicle status to "In Shop"
    vehicle.status = "In Shop"

    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    
    new_log.vehicle_name = vehicle.model
    return new_log
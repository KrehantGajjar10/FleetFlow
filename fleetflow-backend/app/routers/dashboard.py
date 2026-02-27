# app/routers/dashboard.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import models, schemas, database
from typing import List

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/stats", response_model=schemas.DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(database.get_db)):
    # Calculate KPIs based on PDF rules
    total_fleet = db.query(models.Vehicle).count()
    active_fleet = db.query(models.Vehicle).filter(models.Vehicle.status == "On Trip").count() # [cite: 196]
    maintenance_alerts = db.query(models.Vehicle).filter(models.Vehicle.status == "In Shop").count() # [cite: 197]
    pending_cargo = db.query(models.Trip).filter(models.Trip.status == "Dispatched").count() # [cite: 199]
    
    utilization = 0
    if total_fleet > 0:
        # Utilization Rate: % of fleet assigned vs idle 
        utilization = int((active_fleet / total_fleet) * 100)
        
    return {
        "activeFleet": active_fleet,
        "maintenanceAlerts": maintenance_alerts,
        "pendingCargo": pending_cargo,
        "utilizationRate": f"{utilization}%"
    }

@router.get("/active-trips", response_model=List[schemas.ActiveTripDTO])
def get_active_trips(db: Session = Depends(database.get_db)):
    # Join Trip, Vehicle, and Driver for the frontend table
    trips = db.query(models.Trip).filter(models.Trip.status.in_(["Dispatched", "On Trip"])).all()
    
    result = []
    for trip in trips:
        vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == trip.vehicle_id).first()
        driver = db.query(models.Driver).filter(models.Driver.id == trip.driver_id).first()
        
        result.append({
            "id": trip.id,
            "vehicle": f"{vehicle.plate} {vehicle.type}" if vehicle else "Unknown",
            "driver": driver.name if driver else "Unknown",
            "status": trip.status
        })
    return result
# app/routers/trips.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date
from .. import models, schemas, database
from typing import List

router = APIRouter(
    prefix="/trips",
    tags=["Trip Dispatcher"]
)

@router.get("/available-resources", response_model=schemas.AvailableResourcesResponse)
def get_available_resources(db: Session = Depends(database.get_db)):
    """Fetches data for the Dispatcher form dropdowns, strictly enforcing business rules."""
    today = date.today()
    
    # Only fetch vehicles that are strictly "Available"
    available_vehicles = db.query(models.Vehicle).filter(models.Vehicle.status == "Available").all()
    
    # SAFETY LOCK RULE: Only fetch drivers who are "On Duty" AND license is not expired
    available_drivers = db.query(models.Driver).filter(
        models.Driver.status == "On Duty",
        models.Driver.expiry_date >= today
    ).all()
    
    # Fetch active trips to display in the table
    active_trips = db.query(models.Trip).all()
    
    return {
        "vehicles": available_vehicles,
        "drivers": available_drivers,
        "trips": active_trips
    }

@router.post("/dispatch", response_model=schemas.TripResponse, status_code=status.HTTP_201_CREATED)
def dispatch_trip(trip: schemas.TripCreate, db: Session = Depends(database.get_db)):
    # 1. Fetch the selected vehicle and driver
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == trip.vehicleId).first()
    driver = db.query(models.Driver).filter(models.Driver.id == trip.driverId).first()

    if not vehicle or vehicle.status != "Available":
        raise HTTPException(status_code=400, detail="Vehicle is invalid or not available.")
    
    if not driver or driver.status != "On Duty" or driver.expiry_date < date.today():
        raise HTTPException(status_code=400, detail="Driver is invalid, off duty, or license is expired.")

    # 2. VALIDATION RULE: Cargo Weight vs Max Capacity
    if trip.cargoWeight > vehicle.capacity_kg:
        raise HTTPException(
            status_code=400, 
            detail=f"Too heavy! The selected {vehicle.type} has a maximum capacity of {vehicle.capacity_kg} kg."
        )

    # 3. Create the Trip
    new_trip = models.Trip(
        vehicle_id=trip.vehicleId,
        driver_id=trip.driverId,
        cargo_weight=trip.cargoWeight,
        origin=trip.origin,
        destination=trip.destination,
        estimated_fuel_cost=trip.estimatedFuelCost,
        status="Dispatched"
    )
    
    # 4. Status Updates: Mark both Vehicle and Driver as "On Trip"
    vehicle.status = "On Trip"
    driver.status = "On Trip"

    # Save all changes to the database in one atomic transaction
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    
    return new_trip
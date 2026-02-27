# app/schemas.py
from pydantic import BaseModel
from datetime import date
from typing import Optional, List, Any, Dict

# --- USER SCHEMAS ---
class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "Dispatcher"

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    class Config:
        from_attributes = True

# --- VEHICLE SCHEMAS ---
class VehicleCreate(BaseModel):
    licensePlate: str
    model: str
    type: str
    maxPayload: int
    initialOdometer: int

class VehicleResponse(BaseModel):
    id: int
    plate: str
    model: str
    type: str
    capacity_kg: int
    odometer: int
    status: str
    class Config:
        from_attributes = True

# --- DRIVER SCHEMAS ---
class DriverCreate(BaseModel):
    name: str
    license_number: str
    expiry_date: date

class DriverUpdateStatus(BaseModel):
    status: str

class DriverResponse(BaseModel):
    id: int
    name: str
    license_number: str
    expiry_date: date
    completion_rate: float
    safety_score: float
    complaints: int
    status: str
    class Config:
        from_attributes = True

# --- TRIP SCHEMAS ---
class TripCreate(BaseModel):
    vehicleId: int
    driverId: int
    cargoWeight: int
    origin: str
    destination: str
    estimatedFuelCost: float

class TripResponse(BaseModel):
    id: int
    vehicle_id: int
    driver_id: int
    cargo_weight: int
    origin: str
    destination: str
    status: str
    class Config:
        from_attributes = True

class AvailableResourcesResponse(BaseModel):
    vehicles: List[VehicleResponse]
    drivers: List[DriverResponse]
    trips: List[TripResponse]

# --- MAINTENANCE SCHEMAS ---
class MaintenanceCreate(BaseModel):
    vehicleId: int
    issue: str
    date: date
    cost: Optional[float] = 0.0

class MaintenanceResponse(BaseModel):
    id: int
    vehicle_id: int
    issue: str
    date: date
    cost: float
    status: str
    vehicle_name: Optional[str] = None
    class Config:
        from_attributes = True

# --- EXPENSE SCHEMAS ---
class ExpenseCreate(BaseModel):
    tripId: int
    distance: int
    fuelCost: float
    miscExpense: float
    driverName: Optional[str] = None

class ExpenseResponse(BaseModel):
    id: int
    trip_id: int
    driver_name: str
    distance_km: int
    fuel_cost: float
    misc_expense: float
    status: str
    class Config:
        from_attributes = True

# --- NEW SCHEMAS FOR CHAPTER 6 ---
class DashboardStatsResponse(BaseModel):
    activeFleet: int
    maintenanceAlerts: int
    pendingCargo: int
    utilizationRate: str

class ActiveTripDTO(BaseModel):
    id: int
    vehicle: str
    driver: str
    status: str

class AnalyticsResponse(BaseModel):
    kpis: Dict[str, str]
    fuelEfficiencyTrend: List[Dict[str, Any]]
    costliestVehicles: List[Dict[str, Any]]
    financialSummary: List[Dict[str, Any]]
# app/models.py
from sqlalchemy import Column, Integer, String, Date, Float, ForeignKey
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="Dispatcher")

class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    plate = Column(String, unique=True, index=True)
    model = Column(String)
    type = Column(String) 
    capacity_kg = Column(Integer) 
    odometer = Column(Integer)
    status = Column(String, default="Available") 

class Driver(Base):
    __tablename__ = "drivers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    license_number = Column(String, unique=True, index=True)
    expiry_date = Column(Date)
    completion_rate = Column(Float, default=100.0) 
    safety_score = Column(Float, default=100.0) 
    complaints = Column(Integer, default=0)
    status = Column(String, default="On Duty") 

class Trip(Base):
    __tablename__ = "trips"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    driver_id = Column(Integer, ForeignKey("drivers.id"))
    cargo_weight = Column(Integer)
    origin = Column(String)
    destination = Column(String)
    estimated_fuel_cost = Column(Float)
    status = Column(String, default="Dispatched")

# --- NEW TABLES FOR CHAPTER 5 ---

class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    issue = Column(String)
    date = Column(Date)
    cost = Column(Float, nullable=True) # Can be updated later when service is done
    status = Column(String, default="Pending") # Pending, In Progress, Completed

class ExpenseLog(Base):
    __tablename__ = "expense_logs"
    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"))
    driver_name = Column(String) # Stored directly for easier history tracking [cite: 122]
    distance_km = Column(Integer)
    fuel_cost = Column(Float)
    misc_expense = Column(Float)
    status = Column(String, default="Done")
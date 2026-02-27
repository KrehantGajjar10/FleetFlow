# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
# Import ALL our completed routers
from .routers import auth, vehicles, drivers, trips, maintenance, expenses, dashboard, analytics 

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FleetFlow API",
    description="Backend for the Modular Fleet & Logistics Management System",
    version="1.0.0"
)

origins = ["http://localhost:5173", "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# Mount all the endpoints
app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(drivers.router)
app.include_router(trips.router)
app.include_router(maintenance.router)
app.include_router(expenses.router)
app.include_router(dashboard.router)
app.include_router(analytics.router)

@app.get("/")
def read_root():
    return {"status": "success", "message": "FleetFlow API System is fully connected and Operational."}
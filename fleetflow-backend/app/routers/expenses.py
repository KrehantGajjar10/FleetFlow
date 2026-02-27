# app/routers/expenses.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, database
from typing import List

router = APIRouter(
    prefix="/expenses",
    tags=["Expense Logging"]
)

@router.get("/", response_model=List[schemas.ExpenseResponse])
def get_expenses(db: Session = Depends(database.get_db)):
    return db.query(models.ExpenseLog).all()

@router.post("/", response_model=schemas.ExpenseResponse, status_code=status.HTTP_201_CREATED)
def log_expense(expense: schemas.ExpenseCreate, db: Session = Depends(database.get_db)):
    # 1. Find the associated trip
    trip = db.query(models.Trip).filter(models.Trip.id == expense.tripId).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    # 2. Auto-fetch the driver's name if not manually provided
    driver_name = expense.driverName
    if not driver_name:
        driver = db.query(models.Driver).filter(models.Driver.id == trip.driver_id).first()
        driver_name = driver.name if driver else "Unknown"

    # 3. Save the financial record
    new_expense = models.ExpenseLog(
        trip_id=expense.tripId,
        driver_name=driver_name,
        distance_km=expense.distance,
        fuel_cost=expense.fuelCost,
        misc_expense=expense.miscExpense,
        status="Done"
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense
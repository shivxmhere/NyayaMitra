from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String, nullable=False)
    phone = Column(String(15))
    language = Column(String(20), default="hindi")
    role = Column(String(20), default="citizen")
    district = Column(String(100))
    state = Column(String(100), default="Uttar Pradesh")
    created_at = Column(DateTime, default=datetime.utcnow)

    cases = relationship("Case", back_populates="user")
    bail_applications = relationship("BailApplication", back_populates="user")
    chat_messages = relationship("ChatMessage", back_populates="user")


class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    prisoner_name = Column(String(100), nullable=False)
    prisoner_age = Column(Integer)
    fir_number = Column(String(50))
    police_station = Column(String(100))
    district = Column(String(100))
    state = Column(String(100))
    charges = Column(String(500))
    case_status = Column(String(50), default="undertrial")
    court_name = Column(String(150))
    judge_name = Column(String(100))
    arrest_date = Column(Date)
    last_hearing = Column(Date)
    next_hearing = Column(Date)
    ai_summary_hindi = Column(String(2000))
    ai_summary_english = Column(String(2000))
    bail_eligibility = Column(String(20), default="unknown")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="cases")
    bail_applications = relationship("BailApplication", back_populates="case")
    hearings = relationship("Hearing", back_populates="case")
    chat_messages = relationship("ChatMessage", back_populates="case")


class BailApplication(Base):
    __tablename__ = "bail_applications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    generated_text = Column(String(5000))
    generated_text_english = Column(String(5000))
    applicant_name = Column(String(100))
    advocate_name = Column(String(100), nullable=True)
    court_address = Column(String(200))
    grounds = Column(String(1000))
    status = Column(String(20), default="draft")
    generated_at = Column(DateTime, default=datetime.utcnow)
    filed_at = Column(DateTime, nullable=True)

    case = relationship("Case", back_populates="bail_applications")
    user = relationship("User", back_populates="bail_applications")


class Hearing(Base):
    __tablename__ = "hearings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    hearing_date = Column(Date, nullable=False)
    court_name = Column(String(150))
    judge_name = Column(String(100))
    hearing_type = Column(String(50))
    outcome = Column(String(500), nullable=True)
    next_date = Column(Date, nullable=True)
    notes = Column(String(500), nullable=True)
    reminder_sent = Column(Boolean, default=False)

    case = relationship("Case", back_populates="hearings")


class Lawyer(Base):
    __tablename__ = "lawyers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    bar_council_number = Column(String(50))
    district = Column(String(100))
    state = Column(String(100))
    specialization = Column(String(200))
    phone = Column(String(15))
    email = Column(String(100), nullable=True)
    is_legal_aid = Column(Boolean, default=False)
    languages = Column(String(200))
    cases_handled = Column(Integer, default=0)
    rating = Column(Float, default=4.0)
    available = Column(Boolean, default=True)


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=True)
    message = Column(String(1000))
    response = Column(String(3000))
    language = Column(String(20))
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chat_messages")
    case = relationship("Case", back_populates="chat_messages")

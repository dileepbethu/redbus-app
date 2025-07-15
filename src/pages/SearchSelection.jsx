import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SeatSelection = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const bus = state?.bus; // ✅ FIXED: define bus

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const allBookings = Array.isArray(storedBookings) ? storedBookings : [];

    const booked = allBookings
      .filter((b) => b.bus.id === state?.bus?.id)
      .flatMap((b) => b.selectedSeats);
    setBookedSeats(booked);
  }, [state]);

  const rows = ["A", "B", "C", "D", "E"];
  const lastRow = "F";
  const seatPrice = bus?.price || 0;

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleConfirm = () => {
    navigate("/passenger-details", {
      state: { bus, selectedSeats,seatPrice },
    });
  };
  

  const getBtnClass = (seat) => {
    if (bookedSeats.includes(seat)) return "btn btn-secondary";
    if (selectedSeats.includes(seat)) return "btn btn-success";
    return "btn btn-outline-primary";
  };

  return (
<div className="container mt-5">
  <h2 className="mb-4 text-center fw-bold">Select Your Seats</h2>

  <div className="d-flex justify-content-center mb-3">
    <div className="bg-dark text-white px-4 py-1 rounded-pill">Driver</div>
  </div>

  <div className="d-flex flex-column align-items-center gap-3">

    {rows.map((row) => (
      <div className="d-flex align-items-center gap-3" key={row}>
        <strong style={{ width: "25px" }}>{row}</strong>

        {/* Left seat */}
        <button
          className={`seat-btn ${getBtnClass(`${row}1`)}`}
          onClick={() => toggleSeat(`${row}1`)}
          disabled={bookedSeats.includes(`${row}1`)}
        >
          {row}1
        </button>

        <div className="mx-2" style={{ width: "40px" }}></div> {/* aisle gap */}

        {/* Right seats */}
        {[2, 3].map((num) => {
          const seat = `${row}${num}`;
          return (
            <button
              key={seat}
              className={`seat-btn ${getBtnClass(seat)}`}
              onClick={() => toggleSeat(seat)}
              disabled={bookedSeats.includes(seat)}
            >
              {seat}
            </button>
          );
        })}
      </div>
    ))}

    {/* Row F */}
    <div className="d-flex align-items-center gap-3">
      <strong style={{ width: "25px" }}>{lastRow}</strong>
      {["F1", "F2", "F3", "F4"].map((seat) => (
        <button
          key={seat}
          className={`seat-btn ${getBtnClass(seat)}`}
          onClick={() => toggleSeat(seat)}
          disabled={bookedSeats.includes(seat)}
        >
          {seat}
        </button>
      ))}
    </div>
  </div>

  <div className="mt-4 text-center">
    <p><strong>Selected Seats:</strong> {selectedSeats.length ? selectedSeats.join(", ") : "None"}</p>
    <p><strong>Total Price:</strong> ₹{selectedSeats.length * seatPrice}</p>
    <button
      className="btn btn-primary px-4"
      onClick={handleConfirm}
      disabled={selectedSeats.length === 0}
    >
      Confirm Booking
    </button>
  </div>
</div>
  )
};

export default SeatSelection;

// src/pages/PassengerDetails.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const PassengerDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { bus, selectedSeats, seatPrice } = state || {};

  const [passengerData, setPassengerData] = useState(
    selectedSeats.map((seat) => ({
      seat,
      name: "",
      age: "",
      gender: "",
    }))
  );

  const handleChange = (index, field, value) => {
    const updated = [...passengerData];
    updated[index][field] = value;
    setPassengerData(updated);
  };

const handleSubmit = () => {
  const bookingDetails = {
    bus,
    selectedSeats,
    passengers: passengerData,
    date: bus.date,
  };
  localStorage.setItem("latestBooking", JSON.stringify(bookingDetails));

  navigate("/confirm", {
    state: {
      bus,
      selectedSeats,
      passengerDetails: passengerData, 
      // totalPrice,
      // seatPrice,// ✅ Fixed this line
    },
  });
};



  if (!selectedSeats?.length) return <p>No seats selected.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Enter Passenger Details</h2>
      {passengerData.map((passenger, index) => (
        <div key={passenger.seat} className="border p-4 mb-4 rounded">
          <h3 className="font-semibold w-80 mb-2">Seat {passenger.seat}</h3>
          <input
            className="block w-60 mb-2 border px-2 py-1"
            placeholder="Name"
            value={passenger.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
          />
          <input
            className="block w-60 mb-2 border px-2 py-1"
            placeholder="Age"
            type="number"
            value={passenger.age}
            onChange={(e) => handleChange(index, "age", e.target.value)}
          />
          <select
            className="block w-60 mb-2 border px-2 py-1"
            value={passenger.gender}
            onChange={(e) => handleChange(index, "gender", e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-danger text-white px-4 py-2 rounded"
      >
        Proceed to Confirm
      </button>
    </div>
  );
};

export default PassengerDetails;

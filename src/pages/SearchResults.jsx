import { useLocation, useNavigate } from "react-router-dom";
import { buses } from "../data/busData";
import { useState, useEffect } from "react";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state?.state || location.state || {};
  const { source, destination, date } = state;

  const [sortOrder, setSortOrder] = useState("asc");
  const [timeFilters, setTimeFilters] = useState([]);
  const [budgetFilters, setBudgetFilters] = useState([]);
  const [busTypeFilters, setBusTypeFilters] = useState([]);
  const [arrivalFilters, setArrivalFilters] = useState([]);

  useEffect(() => {
    console.log(state, "stateinRes");
  }, []);

  if (!state) {
    return <p>⚠️ No search data found. Please search from the homepage.</p>;
  }

const applyFilters = (bus) => {
  const getHour = (timeStr) => parseInt(timeStr.split(":")[0]);

  // Departure Time
  if (timeFilters.length > 0) {
    const hour = getHour(bus.departure);
    const isValidTime =
      (timeFilters.includes("morning") && hour >= 5 && hour < 12) ||
      (timeFilters.includes("afternoon") && hour >= 12 && hour < 17) ||
      (timeFilters.includes("evening") && hour >= 17 && hour < 21) ||
      (timeFilters.includes("night") && (hour >= 21 || hour < 5));
    if (!isValidTime) return false;
  }

  // Budget Filter
  const price = bus.price;
  if (budgetFilters.length > 0) {
    const isValidBudget =
      (budgetFilters.includes("low") && price < 1000) ||
      (budgetFilters.includes("mid") && price >= 1000 && price <= 1500) ||
      (budgetFilters.includes("high") && price > 1500);
    if (!isValidBudget) return false;
  }

  // Bus Type Filter
  if (busTypeFilters.length > 0 && !busTypeFilters.includes(bus.type)) {
    return false;
  }

  // Arrival Time
  const arrivalHour = getHour(bus.arrival);
  if (arrivalFilters.length > 0) {
    const isValidArrival =
      (arrivalFilters.includes("before6") && arrivalHour < 6) ||
      (arrivalFilters.includes("after6") && arrivalHour >= 6 && arrivalHour <= 12);
    if (!isValidArrival) return false;
  }

  return true;
};


  let filteredResults = buses.filter(
    (bus) =>
      bus.source.toLowerCase() === source.toLowerCase() &&
      bus.destination.toLowerCase() === destination.toLowerCase() &&
      applyFilters(bus)
  );

  if (sortOrder === "asc") {
    filteredResults.sort((a, b) => a.price - b.price);
  } else {
    filteredResults.sort((a, b) => b.price - a.price);
  }

  return (

    <div className="container mt-4">
      <div className="row g-4 px-2">
  {/* Filters */}
  <div className="col-12 col-md-3">
    <div className="bg-light p-3 rounded shadow-sm">
      <h5 className="fw-bold mb-3">Filters</h5>
            <div className="mb-3 border-top pt-2">
              <label className="form-label fw-semibold">🕒 Departure Time</label>
              {["morning", "afternoon", "evening", "night"].map((slot) => (
                <div className="form-check mb-1" key={slot}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={slot}
                    checked={timeFilters.includes(slot)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...timeFilters, slot]
                        : timeFilters.filter((t) => t !== slot);
                      setTimeFilters(updated);
                    }}
                  />
                  <label className="form-check-label text-capitalize" htmlFor={slot}>
                    {slot}
                  </label>
                </div>
              ))}
            </div>

            <div className="mb-3 border-top pt-2">
              <label className="form-label fw-semibold">💰 Budget</label>
              {[
                { label: "Below ₹1000", value: "low" },
                { label: "₹1000 - ₹1500", value: "mid" },
                { label: "Above ₹1500", value: "high" },
              ].map((opt) => (
                <div className="form-check mb-1" key={opt.value}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={opt.value}
                    checked={budgetFilters.includes(opt.value)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...budgetFilters, opt.value]
                        : budgetFilters.filter((t) => t !== opt.value);
                      setBudgetFilters(updated);
                    }}
                  />
                  <label className="form-check-label" htmlFor={opt.value}>
                    {opt.label}
                  </label>
                </div>
              ))}
            </div>

            <div className="mb-3 border-top pt-2">
              <label className="form-label fw-semibold">🚌 Bus Type</label>
              {["AC Seater", "AC Sleeper", "Non AC Seater", "Non AC Sleeper"].map((type) => (
                <div className="form-check mb-1" key={type}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={type}
                    checked={busTypeFilters.includes(type)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...busTypeFilters, type]
                        : busTypeFilters.filter((t) => t !== type);
                      setBusTypeFilters(updated);
                    }}
                  />
                  <label className="form-check-label" htmlFor={type}>
                    {type}
                  </label>
                </div>
              ))}
            </div>

            <div className="mb-3 border-top pt-2">
              <label className="form-label fw-semibold">⏰ Arrival Time</label>
              {[
                { label: "Before 6 AM", value: "before6" },
                { label: "6 AM - 12 PM", value: "after6" },
              ].map((opt) => (
                <div className="form-check mb-1" key={opt.value}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={opt.value}
                    checked={arrivalFilters.includes(opt.value)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...arrivalFilters, opt.value]
                        : arrivalFilters.filter((t) => t !== opt.value);
                      setArrivalFilters(updated);
                    }}
                  />
                  <label className="form-check-label" htmlFor={opt.value}>
                    {opt.label}
                  </label>
                </div>
                
              ))}
              
            </div>
            
          </div>
          
        </div>
        

        {/* Bus Results Section */}
          <div className="col-12 col-md-9">
    <h4 className="mb-3 fw-bold text-center text-md-start">
      Buses from {source} to {destination} on {date}
    </h4>

          <div className="d-flex justify-content-end mb-3">
            <select
              className="form-select w-auto"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Sort by Price: Low to High</option>
              <option value="desc">Sort by Price: High to Low</option>
            </select>
          </div>

          {filteredResults.length > 0 ? (
            filteredResults.map((bus) => (
              <div key={bus.id} className="border p-4 rounded shadow-sm mb-3">
                <h5 className="card-title text-primary">🚌 {bus.operator}</h5>
                <p className="card-text">
                  <strong>Departure:</strong> {bus.departure} <br />
                  <strong>Arrival:</strong> {bus.arrival} <br />
                  <strong>Type:</strong> {bus.type} <br />
                  <strong>From:</strong> {bus.source} <br />
                  <strong>To:</strong> {bus.destination} <br />
                  <strong>Price:</strong> ₹{bus.price}
                </p>
                <button
                  className="btn btn-danger mt-2"
                  onClick={() => navigate("/seats", { state: { bus } })}
                >
                  View Seats
                </button>
              </div>
            ))
          ) : (
            <p className="text-danger">❌ No buses found matching your search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

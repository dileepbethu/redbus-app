import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchForm = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!source || !destination || !date) {
      alert("Please fill in all fields.");
      return;
    }

    navigate("/results", {
      state: { source, destination, date },
    });
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        <div className="row g-2">
          {/* Source */}
          <div className="col-12 col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="From"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>

          {/* Destination */}
          <div className="col-12 col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="To"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          {/* Date */}
          <div className="col-12 col-md-3">
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Submit */}
          <div className="col-12 col-md-3 d-grid">
            <button className="btn btn-danger" type="submit">
              🔍 Search Buses
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;

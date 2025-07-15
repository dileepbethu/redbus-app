import { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

const BookingConfirmation = () => {
  const { currentUser, logout } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const printRef = useRef();
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if no state
  if (!state) {
    navigate("/");
    return null;
  }

  const { bus, selectedSeats, passengerDetails, totalPrice, date } = state;

  const handleAuthFailure = () => {
    toast.error("Session expired. Please login again.");
    logout();
    navigate("/login");
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        handleAuthFailure();
        throw new Error("No refresh token available");
      }

      const response = await axios.post(
        "http://localhost:5000/api/auth/refresh-token",
        { refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      return response.data.token;
    } catch (error) {
      console.error("Token refresh failed:", error);
      handleAuthFailure();
      throw error;
    }
  };

  const saveToLocalStorage = (bookingData) => {
    try {
      const allBookings = JSON.parse(localStorage.getItem("bookings")) || {};
      const userEmail = currentUser.email;

      const bookingWithMetadata = {
        ...bookingData,
        time: new Date().toISOString(),
        status: "confirmed",
        pnr: Math.random().toString(36).substring(2, 10).toUpperCase(),
      };

      allBookings[userEmail] = allBookings[userEmail] || [];
      allBookings[userEmail].push(bookingWithMetadata);
      
      localStorage.setItem("bookings", JSON.stringify(allBookings));
      return true;
    } catch (error) {
      console.error("LocalStorage save failed:", error);
      return false;
    }
  };

  const confirmBooking = async () => {
    if (!currentUser?.email) {
      toast.error("Please login to save your booking");
      return;
    }

    setIsSaving(true);
     const calculatedTotalPrice = totalPrice || 
    (bus?.price && selectedSeats?.length ? bus.price * selectedSeats.length : 0);

  const bookingData = {
    user: currentUser.email,
    bus,
    seats: selectedSeats,
    passengerDetails,
    totalPrice: calculatedTotalPrice, // Ensure this is always a number
    date
  };

  // Validate data before sending
  if (isNaN(bookingData.totalPrice)) {
    toast.error("Invalid price calculation");
    setIsSaving(false);
    return;
  }
  if (bookingData.totalPrice <= 0) {
    toast.error("Price must be greater than zero");
    setIsSaving(false);
    return;
  }

    try {
      // First attempt with current token
      let token = localStorage.getItem("token");
      let response = await attemptApiSave(token, bookingData);
      
      // If first attempt fails with 401, try refresh
      if (response === null) {
        token = await refreshToken();
        response = await attemptApiSave(token, bookingData);
      }

      if (response) {
        toast.success("Booking saved successfully!");
        return;
      }

      // If API save failed completely, fallback to localStorage
      if (saveToLocalStorage(bookingData)) {
        toast.warning(
          "Booking saved locally. Please check your internet connection."
        );
      } else {
        toast.error("Failed to save booking. Please take a screenshot.");
      }
    } catch (error) {
      console.error("Booking save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const attemptApiSave = async (token, bookingData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return null; // Signal that we should try refresh
      }
      throw error;
    }
  };

  useEffect(() => {
    confirmBooking();
  }, []);

  const downloadPDF = () => {
    const input = printRef.current;
    toast.promise(
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`booking-${Date.now()}.pdf`);
      }),
      {
        pending: "Generating PDF...",
        success: "PDF downloaded successfully!",
        error: "Failed to generate PDF",
      }
    );
  };

  return (
    <div className="container py-4">
      <div ref={printRef} className="border p-4 rounded bg-light">
        <h2 className="text-success">✅ Booking Confirmed!</h2>
        <h4>
          Thank you {currentUser?.name || currentUser?.email || "Guest"} for
          booking with us!
        </h4>
        <hr />
        <h5 className="mb-3">{bus.operator}</h5>
        <p>
          <strong>Route:</strong> {bus.source} → {bus.destination}
        </p>
        <p>
          <strong>Departure:</strong> {bus.departure}
        </p>
        <p>
          <strong>Date:</strong> {date}
        </p>
        <p>
          <strong>Seats:</strong> {selectedSeats.join(", ")}
        </p>
        <p>
          <strong>Total Price:</strong> ₹
          {totalPrice ||
            (bus?.price && selectedSeats?.length
              ? bus.price * selectedSeats.length
              : "N/A")}
        </p>

        {passengerDetails.length > 0 && (
          <>
            <h5 className="mt-4">Passenger Details</h5>
            <ul className="list-group mb-3">
              {passengerDetails.map((p, i) => (
                <li key={i} className="list-group-item">
                  <strong>Seat {p.seat}</strong>: {p.name}, Age: {p.age}, Gender:{" "}
                  {p.gender}
                </li>
              ))}
            </ul>
          </>
        )}
        <p className="text-muted mt-3">
          Booking ID:{" "}
          {Math.random().toString(36).substring(2, 10).toUpperCase()}
        </p>
        {isSaving && (
          <div className="text-center mt-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Saving...</span>
            </div>
            <p>Saving your booking...</p>
          </div>
        )}
      </div>

      <div className="no-print mt-3 d-flex justify-content-center gap-2">
        <button
          className="btn btn-danger me-2"
          onClick={downloadPDF}
          disabled={isSaving}
        >
          🖨️ Download PDF
        </button>
        <button
          className="btn btn-outline-danger me-2"
          onClick={() => window.print()}
          disabled={isSaving}
        >
          🖨️ Print
        </button>
        <button
          className="btn btn-outline-danger"
          onClick={() => navigate("/mybookings")}
          disabled={isSaving}
        >
          View My Bookings
        </button>
        <button
          className="btn btn-outline-danger"
          onClick={() => navigate("/")}
          disabled={isSaving}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
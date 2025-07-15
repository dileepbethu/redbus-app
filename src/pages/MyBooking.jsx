import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, User } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import axios from 'axios';

const MyBooking = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingLocalStorage, setUsingLocalStorage] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [currentUser]);

  const fetchBookings = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem('token'); // Get token from storage
    
    const response = await axios.get('http://localhost:5000/api/bookings', {
      headers: {
        Authorization: `Bearer ${token}` // Add authorization header
      }
    });
    
    setBookings(response.data);
    setError(null);
  } catch (err) {
    setError('Failed to fetch bookings. Please try again.');
    console.error('Error fetching bookings:', err);
  } finally {
    setLoading(false);
  }
};

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return <Badge bg="success">Confirmed</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      case 'completed':
        return <Badge bg="secondary">Completed</Badge>;
      default:
        return <Badge bg="primary">Booked</Badge>;
    }
  };

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return (
      <Container className="mt-5 pt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your bookings...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col lg={12}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold mb-1">My Bookings</h3>
              <p className="text-muted mb-0">
                Welcome back, {currentUser.name || currentUser.email}
              </p>
            </div>
            <Button variant="danger" onClick={() => navigate('/')}>
              Book New Ticket
            </Button>
          </div>

          {error && (
            <Alert variant={usingLocalStorage ? 'warning' : 'danger'} className="mb-4">
              {error}
            </Alert>
          )}

          {bookings.length === 0 ? (
            <Card className="text-center p-5">
              <Card.Body>
                <Calendar size={64} className="text-muted mb-3" />
                <h5>No bookings found</h5>
                <p className="text-muted mb-4">
                  You haven't made any bus bookings yet.
                </p>
                <Button variant="danger" onClick={() => navigate('/')}>
                  Book Your First Ticket
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              {bookings.map((booking) => (
                <Col lg={6} key={booking._id || booking.id || booking.pnr || `booking-${Date.now()}-${Math.random()}`} 
                 className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h6 className="fw-bold mb-1">
                            {booking.pnr || `BOOKING-${Math.random().toString(36).substring(2, 8).toUpperCase()}`}
                          </h6>
                          <p className="text-muted small mb-0">
                            Booked on {new Date(booking.time || booking.bookingDate).toLocaleString()}
                          </p>
                        </div>
                        {getStatusBadge(booking.status || 'confirmed')}
                      </div>

                      <div className="mb-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <MapPin size={16} className="text-muted" />
                          <span className="small">
                            {booking.bus?.source || 'Unknown'} → {booking.bus?.destination || 'Unknown'}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <User size={16} className="text-muted" />
                          <span className="small">
                            {booking.passengers?.length || booking.seats?.length || 0} passenger
                            {(booking.passengers?.length || booking.seats?.length || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="fw-bold text-danger mb-0">
                            ₹{booking.totalPrice || booking.totalAmount || 
                              (booking.bus?.price * booking.seats?.length) || 'N/A'}
                          </p>
                          <p className="small text-muted mb-0">
                            Seats: {booking.seats?.map(seat => 
                              typeof seat === 'string' ? seat : seat.seatNumber
                            ).join(', ') || 'Not specified'}
                          </p>
                        </div>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => navigate(`/booking/${booking.id || booking.time}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MyBooking;
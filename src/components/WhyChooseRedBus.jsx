import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { MapPin, Search, Calendar } from "lucide-react";

const WhyChooseRedBus = () => {
  return (
    <Container className="mt-5 pt-5">
      <Row>
        <Col lg={8} className="mx-auto text-center mb-5">
          <h2 className="fw-bold mb-3">Why Choose redBus?</h2>
          <p className="text-muted">
            Experience the best online bus booking service with thousands of routes across India
          </p>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={4}>
          <Card className="redbus-card h-100 text-center p-4">
            <Card.Body>
              <div
                className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: "80px", height: "80px" }}
              >
                <MapPin size={32} className="text-primary" />
              </div>
              <h5 className="fw-bold">Extensive Network</h5>
              <p className="text-muted mb-0">
                Over 100,000+ routes across 3,500+ cities and towns in India
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="redbus-card h-100 text-center p-4">
            <Card.Body>
              <div
                className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: "80px", height: "80px" }}
              >
                <Search size={32} className="text-primary" />
              </div>
              <h5 className="fw-bold">Easy Booking</h5>
              <p className="text-muted mb-0">
                Simple and secure online bus ticket booking in just a few clicks
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="redbus-card h-100 text-center p-4">
            <Card.Body>
              <div
                className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: "80px", height: "80px" }}
              >
                <Calendar size={32} className="text-primary" />
              </div>
              <h5 className="fw-bold">24/7 Support</h5>
              <p className="text-muted mb-0">
                Round-the-clock customer support for all your travel needs
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WhyChooseRedBus;

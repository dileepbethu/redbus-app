import React from "react";
import signup from "../components/signup";

const SignupPage = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(120deg, #a1c4fd, #c2e9fb)' }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center mb-4">
            <h1 className="display-4 fw-bold text-primary">Bus Booking System</h1>
            <p className="lead">Create your account to book tickets and manage your journeys</p>
          </div>
        </div>
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
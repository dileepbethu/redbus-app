import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginForm from './LoginForm';
import Signup from './components/signup';
import SearchSelection from './pages/SearchSelection';
import SearchResults from './pages/SearchResults';
import PassengerDetails from './pages/PassengerDetails';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBooking from './pages/MyBooking';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute'; // Add this
import { AuthProvider } from './context/AuthContext'; // Add this

function App() {
  return (
    <AuthProvider>
        {/* <Header /> */}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route path ="/" element={<ProtectedRoute>
            <Home/>
          </ProtectedRoute>
              }/>
            <Route path="/seats" element={<SearchSelection />} />
            <Route path="/results" element={<SearchResults />} />
            <Route path="/passenger-details" element={<PassengerDetails />} />
            <Route path="/confirm" element={<BookingConfirmation />} />
            <Route path="/mybookings" element={<MyBooking />} />
          
          
          {/* Fallback route */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
    </AuthProvider>
  );
}

export default App;
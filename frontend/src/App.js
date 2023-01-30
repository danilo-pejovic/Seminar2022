import { React } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layouts/Header";
import Register from "./components/accounts/Register";
import Login from "./components/accounts/Login";
import Landing from "./components/layouts/Landing";
import Footer from "./components/layouts/Footer";
import WithPrivateRoute from "./utils/WithPrivateRoute";
import {AuthProvider} from "./context/AuthContext"
import Profile from "./components/accounts/Profile";
import CourtsAvailable from "./components/timeslots/CourtsAvailable";
import CalendarDetail from "./components/timeslots/CalendarDetail";
import RegisterCalendar from "./components/timeslots/RegisterCalendar";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/courts" element={<CourtsAvailable />} />
          <Route exact path="/courts/:id" element={<CalendarDetail />} />
          <Route exact path="/courts/:id" element={<CalendarDetail />} />
          <Route exact path="/courts/create" element={<RegisterCalendar />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

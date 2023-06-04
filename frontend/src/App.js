import { React } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layouts/Header";
import Register from "./components/accounts/Register";
import Login from "./components/accounts/Login";
import Landing from "./components/layouts/Landing";
import Footer from "./components/layouts/Footer";
import Sidebar from "./components/layouts/Sidebar";
import PrivateRoute from "./utils/PrivateRoute";
import ProviderRoute from "./utils/ProviderRoute";
import {AuthProvider} from "./context/AuthContext"
import Profile from "./components/accounts/Profile";
import CourtsAvailable from "./components/timeslots/CourtsAvailable";
import CalendarDetail from "./components/timeslots/CalendarDetail";
import RegisterCalendar from "./components/timeslots/RegisterCalendar";
import API_IP from './utils/config';
//import 'bootstrap/dist/css/bootstrap.min.css';


export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        
        
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
         
          <Route exact path='/' element={<PrivateRoute/>}>
            <Route exact path="/courts" element={<CourtsAvailable />} />
            <Route exact path="/courts/:id" element={<CalendarDetail />} />
            <Route exact path="/courts/:id" element={<CalendarDetail />} />
            <Route exact path="/profile" element={<Profile />} />
          </Route>
         
          <Route exact path='/' element={<ProviderRoute/>}>
            <Route exact path='/courts/create' element={<RegisterCalendar/>}/>
          </Route>
         
          
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
    
  );
}

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import lockImage from "./lock_image.png"; 
import { format } from "date-fns";
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState([]);
  const [filterDate, setFilterDate] = useState("");

  const formatDate = (dateTime) => {
    return format(new Date(dateTime), "MMM dd, yyyy");
  };

  const formatTime = (dateTime) => {
    return format(new Date(dateTime), "hh:mm a");
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("http://3.91.252.174:5000/api/auth/status", {
          withCredentials: true,
        });
        if (response.data.isAuthenticated) {
          setIsLoggedIn(true);
          fetchEvents();
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };
    checkLoginStatus();
  }, []);

  
  const handleLogin = () => {
    window.location.href = "http://3.91.252.174:5000/auth/google";
  };

  
  const fetchEvents = async () => {
    console.log("Filter Date:", filterDate); 
    try {
      const response = await axios.get("http://3.91.252.174:5000/api/events", {
        params: { date: filterDate },
        withCredentials: true,
      });
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  
  const handleLogout = async () => {
    try {
      await axios.get("http://3.91.252.174:5000/logout", {
        withCredentials: true, 
      });
      setIsLoggedIn(false);
      setEvents([]); 
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="app-container">
      {!isLoggedIn ? (
        
        <motion.div
          className="login-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.img
            src={lockImage} 
            alt="Login Image"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          />
          <motion.button
            onClick={handleLogin}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Login with Google
          </motion.button>
        </motion.div>
      ) : (
       
        <motion.div
          className="calendar-events-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="header"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1>Events List</h1>
          </motion.div>
          <motion.div
            className="filter-container"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            <motion.button
              onClick={fetchEvents}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Filter
            </motion.button>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{ marginLeft: "10px", backgroundColor: "#ff4d4d" }}
            >
              Logout
            </motion.button>
          </motion.div>
          <motion.table
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <motion.tr
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <td>{event.summary}</td>
                  <td>{formatDate(event.start.dateTime || event.start.date)}</td>
                  <td>{formatTime(event.start.dateTime || event.start.date)}</td>
                  <td>{event.location || "No location"}</td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </motion.div>
      )}
    </div>
  );
};

export default App;

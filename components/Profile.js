import React, { useState, useEffect,useContext } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AuthContext from "../context/AuthContext";
import API_IP from '../utils/config';

const ManageReservationsButton = (props) => {
  const [showModalCancel, setShowModalCancel] = useState(false);
  const { id, is_available, timeslot_date, start_time, calendar_id, updateTimeslots } = props;
  const [calendarData, setCalendarData] = useState();
  const [calendarOwnerData, setCalendarOwnerData] = useState();

  const handleCancelReservation = (id) => {
    const token = JSON.parse(localStorage.getItem("authTokens"));

    fetch(`${API_IP}/schedule/timeslots/delete/${id}/`, {
      method: 'PUT',
      body: JSON.stringify({ is_available: true }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.access}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setShowModalCancel(false);
        updateTimeslots();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleCancel = async () => {
    const calendarResponse = await fetch(`${API_IP}/schedule/${calendar_id}/`);
    const calendarJson = await calendarResponse.json();
    setCalendarData(calendarJson);

    setShowModalCancel(true);
  };

  const handleRefresh = async () => {
    const calendarResponse = await fetch(`${API_IP}/schedule/${calendar_id}/`);
    const calendarJson = await calendarResponse.json();
    setCalendarData(calendarJson);

    setShowModalCancel(true);
  };

  return (
    <>
      <TouchableOpacity style={{ fontSize: 20, padding: 10, margin: 2, backgroundColor: 'teal' }} onPress={handleCancel}>
        {props.children}
      </TouchableOpacity>
      {showModalCancel && (
        <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -50 }, { translateY: -50 }], padding: 20, backgroundColor: 'black' }}>
            <Text>Do you want to cancel your reservation at {calendarData.owner} at {timeslot_date}/{start_time}?</Text>
            <Button title="Confirm" onPress={() => handleCancelReservation(id)} />
            <Button title="Deny" onPress={() => setShowModalCancel(false)} />
          </View>
        </View>
      )}
    </>
  );
};

export default function Profile() {
  const { user } = useContext(AuthContext);

//   const [username, setUsername] = useState(user.username);
//   const [email, setEmail] = useState(user.email);

  const [picture, setPicture] = useState(null);
  let {authTokens} = useContext(AuthContext)

  const [opassword, setOpassword] = useState(null);
  const [npassword, setNpassword] = useState(null);
  const [npassword2, setNpassword2] = useState(null);

  const [timeslots, setTimeslots] = useState([]);
  const [pastTimeslots, setPastTimeslots] = useState([]);
  const [upcomingTimeslots, setUpcomingTimeslots] = useState([]);

  

  

  return (
    <View>
      {/* <Text>Username: {username}</Text>
      <Text>Email: {email}</Text> */}

      <Text>Upcoming Reservations:</Text>
      {upcomingTimeslots.length > 0 ? (
        upcomingTimeslots.map(timeslot => (
          <ManageReservationsButton key={timeslot.id} id={timeslot.id} is_available={timeslot.is_available} timeslot_date={timeslot.timeslot_date} start_time={timeslot.start_time} calendar_id={timeslot.calendar_id} updateTimeslots={fetchTimeslots}>
            <Text>{timeslot.timeslot_date} - {timeslot.start_time}</Text>
          </ManageReservationsButton>
        ))
      ) : (
        <Text>No upcoming reservations.</Text>
      )}

      <Text>Past Reservations:</Text>
      {pastTimeslots.length > 0 ? (
        pastTimeslots.map(timeslot => (
          <Text key={timeslot.id}>{timeslot.timeslot_date} - {timeslot.start_time}</Text>
        ))
      ) : (
        <Text>No past reservations.</Text>
      )}

    </View>
  );
}

import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Dimensions, StyleSheet } from 'react-native';
import AuthContext from '../context/AuthContext';
import { useIsFocused } from '@react-navigation/native';
import jwt_decode from "jwt-decode";
import API_IP from '../utils/config';
const ManageReservationsButton = ({
  id,
  is_available,
  timeslot_date,
  start_time,
  calendar_id,
  calendar_owner,
  updateTimeslots
}) => {
  const [showModalCancel, setShowModalCancel] = useState(false);
  let {user, authTokens} = useContext(AuthContext);

  const handleCancelReservation = (id) => {
    

    fetch(`${API_IP}/schedule/timeslots/delete/${id}/`, {
        method: 'PUT',
        body: JSON.stringify({is_available: true}),
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${authTokens.access}`
        }
    })
    .then(res => res.json())
    .then(data => {
        // handle response
        setShowModalCancel(false);
        updateTimeslots();
        
        
        //window.location.reload(false);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
const handleCancel = async () => {

// const calendarResponse = await fetch(`${API_IP}/schedule/${calendar_id}/`);
// const calendarJson = await calendarResponse.json();
// console.log(calendarJson);
// setCalendarData(calendarJson);
setShowModalCancel(true);
};

  return (
    <>
      <TouchableOpacity onPress={handleCancel} style={styles.button}>
        <Text style={styles.buttonText}>{timeslot_date} at {start_time}</Text>
      </TouchableOpacity>

      <Modal visible={showModalCancel} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          
              <Text style={styles.modalText}>
                Do you want to cancel your reservation at {calendar_owner}/{calendar_id} at {timeslot_date}/{start_time}?
              </Text>
            
            <TouchableOpacity style={styles.confirmButton} onPress={() => handleCancelReservation(id)}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.denyButton} onPress={() => setShowModalCancel(false)}>
              <Text style={styles.buttonText}>Deny</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'teal',
    padding: 10,
    margin: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 20,
    color: 'white'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContent: {
    backgroundColor: 'black',
    padding: 20
  },
  modalText: {
    color: 'white',
    marginBottom: 10
  },
  confirmButton: {
    backgroundColor: 'teal',
    marginBottom: 10,
    padding: 10,
    alignItems: 'center'
  },
  denyButton: {
    backgroundColor: 'teal',
    padding: 10,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  timeslotContainer: {
    marginBottom: 10,
  },
  timeslotText: {
    fontSize: 16,
  },
});

const UpcomingTimeslots = () => {
    const [upcomingTimeslots, setUpcomingTimeslots] = useState([]);
    const [pastTimeslots, setPastTimeslots] = useState([]);
    const [timeslots, setTimeslots] = useState([]);
    const isFocused = useIsFocused();
    const { user } = useContext(AuthContext);
    useEffect(() => {
      fetchTimeslots();
    }, [isFocused]);
  
    const fetchTimeslots = () => {
    
        fetch(`${API_IP}/schedule/timeslots/player/?owner=${user.user_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        })
          .then(response => response.json())
          .then(data => {
            setTimeslots(data.results);
    
            const today = new Date().setHours(0, 0, 0, 0);
            const past = [];
            const upcoming = [];
    
            data.results.forEach(timeslot => {
              const timeslotDate = new Date(timeslot.timeslote_date).setHours(0, 0, 0, 0);
              if (timeslotDate < today) {
                past.push(timeslot);
              } else {
                upcoming.push(timeslot);
              }
            });
            setUpcomingTimeslots(upcoming);
          })
          .catch(error => {
            console.error('Error fetching timeslots:', error);
          });
      };
      const updateTimeslots = () => {
        fetchTimeslots();
      };
  
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Upcoming Timeslots</Text>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            {upcomingTimeslots.map(timeslot => (
              <View key={timeslot.id} style={styles.timeslotContainer}>
                <ManageReservationsButton
              key={timeslot.id}
              start_time={timeslot.start_time}
              timeslot_date={timeslot.timeslote_date}
              id={timeslot.id}
              calendar_id={timeslot.calendar}
              calendar_owner={timeslot.calendar_owner}
              updateTimeslots={updateTimeslots}
            >
              {timeslot.timeslote_date}/{timeslot.start_time} at {timeslot.calendar_owner}/{timeslot.calendar}
            </ManageReservationsButton>
              </View>
            ))}
          </ScrollView>
        </View>
      );
    };
    
   
  export default UpcomingTimeslots;

import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Dimensions, StyleSheet } from 'react-native';
import AuthContext from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import jwt_decode from "jwt-decode";
import API_IP from '../utils/config';

const PastTimeslots = () => {
    const [pastTimeslots, setPastTimeslots] = useState([]);
    const [timeslots, setTimeslots] = useState([]);
    const { user } = useContext(AuthContext);
    useEffect(() => {
      fetchTimeslots();
    }, []);
  
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
    
            data.results.forEach(timeslot => {
              const timeslotDate = new Date(timeslot.timeslote_date).setHours(0, 0, 0, 0);
              if (timeslotDate < today) {
                past.push(timeslot);
              }
            });
            setPastTimeslots(past);
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
          <Text style={styles.title}>Past Timeslots</Text>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            {pastTimeslots.map(timeslot => (
              <View key={timeslot.id} style={styles.timeslotContainer}>
                <Text style={styles.timeslotText}>{timeslot.timeslote_date}/{timeslot.start_time} at {timeslot.calendar_owner}/{timeslot.calendar} </Text>
              </View>
            ))}
          </ScrollView>
        </View>
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
   
  export default PastTimeslots;
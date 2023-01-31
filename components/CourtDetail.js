import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import AuthContext from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const LargeButton = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [isAvailable, setIsAvailable] = useState(props.is_available);
  let {authTokens} = useContext(AuthContext)

  const handleConfirm = async (id) => {
    
    const token = authTokens

    await fetch(`http://192.168.43.187:8000/schedule/timeslots/update/${id}/`, {
      method: 'PUT',
      body: JSON.stringify({ is_available: false }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.access}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setShowModal(false);
        setIsAvailable(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleClick = () => {
    setShowModal(true);
  };

  return (
    <View>
      <TouchableOpacity
        style={{
          padding: 10,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: isAvailable ? 'green' : 'red',
        }}
        onPress={handleClick}
      >
        <Text style={{ fontSize: 20 }}>{props.children}</Text>
      </TouchableOpacity>
      <Modal transparent visible={showModal}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 10,
            }}
          >
            <Text>Confirm or deny booking?</Text>
            <TouchableOpacity
              style={{ marginBottom: 10 }}
              onPress={() => handleConfirm(props.id)}
            >
              <Text>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginBottom: 10 }}
              onPress={() => setShowModal(false)}
            >
              <Text>Deny</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const CourtDetail = ({ route: { params } }) => {
    const [date, setDate] = useState(new Date());
    
   const ownerId = params;
   const [data, setData] = useState([]);

   const showPicker = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date,
        mode: 'calendar',
      });
      if (action === DatePickerAndroid.dateSetAction) {
        setDate(new Date(year, month, day));
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  };

  const fetchData = async (date) => {
    try {
      
      const response = await fetch(`http://192.168.43.187:8000/schedule/?owner=${ownerId.ownerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to get the list of IDs');
      }
  
      const data = await response.json();
      const ids = data.results;
  
      const promises = ids.map((id) => fetchObject(id.id, date));
      const objects = await Promise.all(promises);
  
      setData(objects);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchObject = async (id, date) => {
    try {
      const response = await fetch(`http://192.168.43.187:8000/schedule/timeslots/?calendar=${id}&timeslote_date=${date.toISOString().substring(0, 10)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get object with ID: ${id}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
};

  useEffect(() => {
    fetchData(date);
  }, []);




  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
  <TouchableOpacity
    style={{
      backgroundColor: 'blue',
      padding: 10,
      width: '20%',
      alignItems: 'center',
    }}
    onPress={() => {
      setDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() - 7)));
      fetchData(date);
    }}
  >
    <Text style={{ color: 'white' }}>{"<<"}</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={{
      backgroundColor: 'blue',
      padding: 10,
      width: '20%',
      alignItems: 'center',
    }}
    onPress={() => {
      setDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() - 1)));
      fetchData(date);
    }}
  >
    <Text style={{ color: 'white' }}>{"<"}</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={{
      backgroundColor: 'blue',
      padding: 10,
      width: '30%',
      alignItems: 'center',
    }}
    onPress={showPicker}
  >
    <Text style={{ color: 'white' }}>{date.toDateString()}</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={{
      backgroundColor: 'blue',
      padding: 10,
      width: '20%',
      alignItems: 'center',
    }}
    onPress={() => {
      setDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() + 1)));
      fetchData(date);
    }}
  >
    <Text style={{ color: 'white' }}>{">"}</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={{
      backgroundColor: 'blue',
      padding: 10,
      width: '20%',
      alignItems: 'center',
    }}
    onPress={() => {
      setDate(prevDate => new Date(prevDate.setDate(prevDate.getDate() + 7)));
      fetchData(date);
    }}
  >
    <Text style={{ color: 'white' }}>{">>"}</Text>
  </TouchableOpacity>
</View>
<ScrollView horizontal={true} vertical={true} style={{flexDirection: 'row'}}>
{data.map((court, index1) => (
        <View key={index1} style={{flex: 1, width: Dimensions.get('window').width / 4}}>
        <Text> Court {index1}</Text>
            {court.results.map((timeslot, index) => (
                <LargeButton key={timeslot.id} is_available={timeslot.is_available} id={timeslot.id}>
                <Text>{timeslot.start_time}</Text>
                </LargeButton>
                                ))}
                    </View>
                    ))}
</ScrollView>
 </View>
    
  );
};

export default CourtDetail

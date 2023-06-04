import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import AuthContext from '../context/AuthContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import jwt_decode from "jwt-decode";
import API_IP from '../utils/config';

const LargeButton = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalCancel, setShowModalCancel] = useState(false);
  const [isAvailable, setIsAvailable] = useState(props.is_available);
  let {authTokens,user} = useContext(AuthContext)
  let [owner, setOwner] = useState(props.owner);
  
  useEffect(() => {
    
    setIsAvailable(props.is_available);
    
  }, [props.is_available]);

  const handleConfirm = async (id) => {
    
    const token = authTokens
    
    await fetch(`${API_IP}/schedule/timeslots/update/${id}/`, {
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
        console.log(owner)
        setOwner(user.user_id);
        console.log(owner)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };


  const handleCancelReservation = (id) => {
    const token = authTokens
    

    fetch(`${API_IP}/schedule/timeslots/delete/${id}/`, {
        method: 'PUT',
        body: JSON.stringify({is_available: true}),
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token.access}`
        }
    })
    .then(res => res.json())
    .then(data => {
        // handle response
        setShowModalCancel(false);
        setIsAvailable(true);
        
        //window.location.reload(false);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

  const handleClick = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModalCancel(true);
  };


  return (
    <View>
      { isAvailable ? <TouchableOpacity
        style={{
          padding: 10,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'green',
        }}
        onPress={handleClick}
      >
        <Text style={{ fontSize: 20 }}>{props.children}</Text>
      </TouchableOpacity> : 
      <TouchableOpacity
      style={{
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'red',
      }}
      onPress={handleCancel}
    ><Text style={{ fontSize: 20 }}>{props.children}</Text>
    </TouchableOpacity> }
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
      <Modal transparent visible={showModalCancel && (owner==user.user_id)}>
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
            <Text>Are you sure you want to cancel this reservation?</Text>
            <TouchableOpacity
              style={{ marginBottom: 10 }}
              onPress={() => handleCancelReservation(props.id)}
            >
              <Text>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginBottom: 10 }}
              onPress={() => setShowModalCancel(false)}
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
   const isFocused = useIsFocused();

   useEffect(() => {
    fetchData(date);
    console.log(data)
  }, [isFocused]);

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
      console.log(ownerId.ownerId)
      const response = await fetch(`${API_IP}/schedule/?owner=${ownerId.ownerId}`, {
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
      //console.log(ids)
      //console.log(date.toISOString().substring(0, 10))
  
      const promises = ids.map((id) => fetchObject(id.id, date));
      const objects = await Promise.all(promises);
      
      setData(objects);

    } catch (error) {
      console.error(error);
    }
  };

  const fetchObject = async (id, date) => {
    try {
      const response = await fetch(`${API_IP}/schedule/timeslots/?calendar=${id}&timeslote_date=${date.toISOString().substring(0, 10)}`, {
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
                <LargeButton key={timeslot.id} is_available={timeslot.is_available} id={timeslot.id} owner={timeslot.owner}>
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

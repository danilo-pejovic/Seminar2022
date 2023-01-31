import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon, UilTennisBall } from '@iconscout/react-unicons'

const CourtsAvailable = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetch('http://seminar2022:8000/user/user/?is_provider=true', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => setData(data.results))
      .catch(error => console.log(error));
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      alignItems: 'center',
      padding: 20,
    },
    icon: {
      width: 50,
      height: 50,
    },
    text: {
      fontSize: 20,
      marginTop: 10,
    },
  });
  
  

  return (
    <View style={styles.container}>
  {data.map((owner, index) => (
    <TouchableOpacity
      key={owner.id}
      style={[
        styles.button,
        {
          borderRadius: Math.min(Dimensions.get("window").width, Dimensions.get("window").height) / 2,
        },
      ]}
      onPress={() => navigation.navigate('CourtDetail',{ownerId: owner.id})}
    >
      
      <Text style={styles.text}>{owner.username}</Text>
    </TouchableOpacity>
  ))}
</View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default CourtsAvailable;
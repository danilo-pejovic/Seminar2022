import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../context/AuthContext';
import API_IP from '../utils/config';


const CourtsAvailable = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  let {user, authTokens} = useContext(AuthContext);
  useEffect(() => {
    console.log("*****************")
    console.log(authTokens);
    console.log(user);
    console.log("*****************")
    fetch(`${API_IP}/user/user/?is_provider=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => setData(data.results))
      .catch(error => console.log(error));
  }, []);

  return (
    <View style={styles.container}>
      {data.map((owner, index) => (
        <Button
          key={owner.id}
          title={owner.username}
          onPress={() => navigation.navigate('CourtDetail',{ownerId: owner.id})}
        />
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
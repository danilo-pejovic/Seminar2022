import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CourtsAvailable = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetch('http://192.168.43.187:8000/user/user/?is_provider=true', {
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
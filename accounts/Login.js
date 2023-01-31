

import React, { useContext, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AuthContext from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  let {loginUser} = useContext(AuthContext)
  const navigation = useNavigation();

  const handleSubmit = e => {
    e.preventDefault();
    loginUser(username, password);
  };

return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <Button title="Login" onPress={handleSubmit} />
      <Button title="Dont have an account? Register!" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10
  }
});

export default Login;
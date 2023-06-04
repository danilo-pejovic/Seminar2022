import React, { useState, useEffect,useContext } from "react";
import { Text, View, TouchableOpacity, TextInput, Picker } from "react-native";
import AuthContext from "../context/AuthContext";
import { useNavigation } from '@react-navigation/native';



export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const navigation = useNavigation();

  let handleFormSubmit = async () => {
    
    console.log(JSON.stringify({
      'username': name,
      'email': email,
      'password': password,
      'password2': confirmpassword,
      'first_name': firstname,
    
      'last_name': lastname
      
    }))
    

    let response = await fetch(`${API_IP}/user/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        'username': name,
        'email': email,
        'password': password,
        'password2': confirmpassword,
        'first_name': firstname,
        'last_name': lastname
        
      }),
    });
    let data = await response.json();
    if (response.status === 201) {
      console.log("Success");
      navigation.navigate('Login')
    } else {
      console.log("Something went wrong! Check your entries");
    }
  };

  return (
    <View>
      <Text>Court schedule creation</Text>
      <View>
        <TextInput
          placeholder="Username"
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          placeholder="E-mail"
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          placeholder="Password"
          onChangeText={(password) => setPassword(password)}
        />
        <TextInput
          placeholder="Confirm Password"
          onChangeText={(password) => setConfirmPassword(password)}
        />
        <TextInput
          placeholder="First Name"
          onChangeText={(text) => setFirstName(text)}
        />
       <TextInput
          placeholder="Last Name"
          onChangeText={(text) => setLastName(text)}
        />
    </View>
    <TouchableOpacity onPress={() => handleFormSubmit(navigation)}>
  <Text>Submit</Text>
</TouchableOpacity>
</View>
);
}

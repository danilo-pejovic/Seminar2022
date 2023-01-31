import React, { useState, useEffect,useContext } from "react";
import { Text, View, TouchableOpacity, TextInput, Picker } from "react-native";
import AuthContext from "../context/AuthContext";



export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  

  let handleFormSubmit = async () => {
    
    console.log(JSON.stringify({
      'username': name,
      'email': startDate,
      'password': password,
      'password2': confirmpassword,
      'first_name': firstname,
    
      'last_name': lastname
      
    }))
    

    let response = await fetch("http://192.168.1.211:8000/schedule/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        'username': name,
        'email': startDate,
        'password': endDate,
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
<TouchableOpacity onPress={handleFormSubmit(authTokens)}>
            <Text>Submit</Text>
</TouchableOpacity>
</View>
);
}

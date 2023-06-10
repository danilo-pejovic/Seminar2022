import React, { useState, useEffect,useContext } from "react";
import { Text, View, TouchableOpacity, TextInput } from "react-native";
import {Picker} from '@react-native-picker/picker';
import AuthContext from "../context/AuthContext";
import API_IP from "../utils/config";

const timeOptions = () => {
  let options = [];
  for (let i = 0; i < 24; i++) {
    let hour = i < 10 ? `0${i}` : `${i}`;
    options.push(
      <Picker.Item key={i} label={`${hour}:00`} value={`${hour}:00:00`} />
    );
  }
  return options;
};

export default function RegisterCalendar() {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openingTimeWeekday, setOpeningTimeWeekday] = useState("");
  const [closingTimeWeekday, setClosingTimeWeekday] = useState("");
  const [openingTimeWeekend, setOpeningTimeWeekend] = useState("");
  const [closingTimeWeekend, setClosingTimeWeekend] = useState("");
  let {authTokens} = useContext(AuthContext)

  let handleFormSubmit = async (authTokens) => {
    console.log(authTokens)
    console.log(JSON.stringify({
        'name': name,
        'start_date': startDate,
        'end_date': endDate,
        'opening_time_weekday': openingTimeWeekday,
        'closing_time_weekday': closingTimeWeekday,
      
        'opening_time_weekend': openingTimeWeekend,
        'closing_time_weekend': closingTimeWeekend,
        
      }))
    
    // 192.168.43.187
    let response = await fetch(`${API_IP}/schedule/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authTokens.access}`,
      },
      body: JSON.stringify({
        'name': name,
        'start_date': startDate,
        'end_date': endDate,
        'opening_time_weekday': openingTimeWeekday,
        'closing_time_weekday': closingTimeWeekday,
      
        'opening_time_weekend': openingTimeWeekend,
        'closing_time_weekend': closingTimeWeekend,
        
      }),
    });
    let data = await response.json();
    if (response.status === 201) {
      console.log("Success");
    } else {
      console.log("Something went wrong! Check your entries");
    }
  };

  return (
    <View>
      <Text>Court schedule creation</Text>
      <View>
        <TextInput
          placeholder="Court Name"
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          placeholder="Start Date"
          onChangeText={(text) => setStartDate(text)}
        />
        <TextInput
          placeholder="End Date"
          onChangeText={(text) => setEndDate(text)}
        />
        <Picker
          selectedValue={openingTimeWeekday}
          onValueChange={(itemValue) => setOpeningTimeWeekday(itemValue)}
        >
          {timeOptions()}
        </Picker>
        <Picker
          selectedValue={closingTimeWeekday}
          onValueChange={(itemValue) => setClosingTimeWeekday(itemValue)}
        >
          {timeOptions()}
        </Picker>
        <Picker
            selectedValue={openingTimeWeekend}
            onValueChange={(itemValue) => setOpeningTimeWeekend(itemValue)}
            >
            {timeOptions()}
        </Picker>
        <Picker
            selectedValue={closingTimeWeekend}
            onValueChange={(itemValue) => setClosingTimeWeekend(itemValue)}>   
                {timeOptions()}
        </Picker>
    </View>
<TouchableOpacity onPress={() => handleFormSubmit(authTokens)}>
            <Text>Submit</Text>
</TouchableOpacity>
</View>
);
}

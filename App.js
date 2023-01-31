import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';

const PlaceholderImage = require('./assets/images/CG_Football_4G_pitch_1-scaled.jpg');
import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import { useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthContext from './context/AuthContext';
import {AuthProvider} from "./context/AuthContext"
import Login from './accounts/Login';
import CourtsAvailable from './components/CourtsAvailable';
import CourtDetail from './components/CourtDetail';
import RegisterCalendar from './components/RegisterCourt';
import Register from './accounts/Register';

import * as ImagePicker from 'expo-image-picker';

let {user, logoutUser} = useContext(AuthContext)
function HomeScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result);
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer
          placeholderImageSource={PlaceholderImage}
          selectedImage={selectedImage}
        />
      </View>
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Register a calendar" onPress={() => navigation.navigate('CourtsAvailable')} />
        <Button theme ="primary" title="See Available Courts"
          onPress={() => navigation.navigate('RegisterCalendar')}
          label="Register a new court" />

{User ? (
            <Button theme ="primary" title="Logout"
            onPress={logoutUser}
            label="Log out" />
  
          ) : (
            <Button theme ="primary" title="Go to Login"
          onPress={() => navigation.navigate('Login')}
          label="Login/Register" />

          )}
        <Button theme ="primary" title="Go to Login"
          onPress={() => navigation.navigate('Login')}
          label="Login/Register" />

      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
  
}




const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider> 
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Overview' }} />
        <Stack.Screen name="RegisterCalendar" component={RegisterCalendar} options={{ title: 'Register Calendar' }} />
        <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
        <Stack.Screen name="CourtsAvailable" component={CourtsAvailable} options={{ title: 'Courts Available' }} />
        <Stack.Screen name="CourtDetail" component={CourtDetail} options={{ title: 'Court Detail' }}/>
        <Stack.Screen name="Register" component={Register} options={{ title: 'Register User' }}/>
      </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  footerContainer: {
    flex: 1 / 2,
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    paddingTop: 58,
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});


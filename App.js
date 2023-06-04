import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import 'react-native-gesture-handler';
const PlaceholderImage = require('./assets/images/CG_Football_4G_pitch_1-scaled.jpg');
import ImageViewer from './components/ImageViewer';
import Button from './components/Button';
import { useState, useContext } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthContext from './context/AuthContext';
import { AuthProvider } from "./context/AuthContext"
import Login from './accounts/Login';
import Header from './components/Header';
import CourtsAvailable from './components/CourtsAvailable';
import CourtDetail from './components/CourtDetail';
import RegisterCalendar from './components/RegisterCourt';
import Register from './accounts/Register';
import Profile from './components/Profile';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import UpcomingTimeslots from './components/FutureReservations';
import PastTimeslots from './components/PastReservations';


import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  useDrawerProgress,
} from '@react-navigation/drawer';
import Animated from 'react-native-reanimated';

function HomeScreen({ navigation }) {
  const selectedImage = null;
  let { user, logoutUser } = useContext(AuthContext);
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <View style={styles.imageContainer}>
        <ImageViewer
          placeholderImageSource={PlaceholderImage}
          selectedImage={selectedImage}
        />
      </View>
      
      <View style={styles.footerContainer}>
      {user ? (
        <Button
          theme="primary"
          label="See what courts are available"
          onPress={() => navigation.navigate('CourtsAvailable')}
        /> ) : (<Button
          theme="primary"
          title="Register"
          onPress={() => navigation.navigate('Register')}
          label={user ? `Welcome ${user.username}` : 'Register'}
        />)}
        
        {user && user.is_provider &&
          <Button
          theme="primary"
          title="RegisterCalendar"
          onPress={() => navigation.navigate('RegisterCalendar')}
          label="Register a new court"
        /> }
         
         {user && !user.is_provider &&
          <Button
          theme="primary"
          title="UpcomingTimeslots"
          onPress={() => navigation.navigate('Future Reservations')}
          label="Your reservations"
        /> }
        
         { !user && <Button
            theme="primary"
            title="Login"
            onPress={() => navigation.navigate('Login')}
            label={user ? `Welcome ${user.username}` : 'Login'}
          />}
        
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

function CustomDrawerContent(props) {
  let { user, logoutUser } = useContext(AuthContext);
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      { user && <DrawerItem label="Log out " onPress={() => logoutUser()} /> }
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DrawerNavigator() {
  const navigation = useNavigation();
  let { user, logoutUser } = useContext(AuthContext);
  const CustomHeaderRight = () => {
    const handleOpenDrawer = () => {
      navigation.goBack();
    };

    return (
      <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                width: 100,
                height: 50,
                padding: 10,
                paddingLeft: 20,
              }}>
      <Text style={{color: 'white', fontSize: 20}}>Back</Text>        
</TouchableOpacity>
    );
  };
  return (
    <Drawer.Navigator initialRouteName="Stack" backBehavior="history" drawerContent={props => <CustomDrawerContent {...props} />}>
      
      <Drawer.Screen name="Home" component={HomeScreen}  options={{
          title: 'Home',
          // headerRight: CustomHeaderRight,
          headerStyle: { backgroundColor: '#1D1D1D' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
        }}/>
      { user && <Drawer.Screen name="CourtsAvailable" component={CourtsAvailable} options={{
          title: 'Courts Available',
          headerRight: CustomHeaderRight,
          headerStyle: { backgroundColor: '#1D1D1D' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
        }}/>}
      { user && user.is_provider && <Drawer.Screen name="RegisterCalendar" component={RegisterCalendar} options={{ title: 'Register Calendar', headerRight: CustomHeaderRight,
          headerStyle: { backgroundColor: '#1D1D1D' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }, }} />}
      { !user && <Drawer.Screen name="Login" component={Login} options={{ title: 'Login', headerRight: CustomHeaderRight,
          headerStyle: { backgroundColor: '#1D1D1D' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }, }} />}
      <Drawer.Screen name="CourtDetail" component={CourtDetail} options={{ title: 'Court Detail',headerRight: CustomHeaderRight,
          headerStyle: { backgroundColor: '#1D1D1D' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }, 
          drawerItemStyle: { display: 'none' }}}/>
      { !user &&<Drawer.Screen name="Register" component={Register} options={{ title: 'Register User',headerRight: CustomHeaderRight,
          headerStyle: { backgroundColor: '#1D1D1D' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }, }}/>}
      { user && <Drawer.Screen name="Profile" component={Profile} options={{ title: 'User Profile',headerRight: CustomHeaderRight,
          headerStyle: { backgroundColor: '#1D1D1D' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }, }}/>}
      { user &&<Drawer.Screen name="Future Reservations" component={UpcomingTimeslots} options={{ title: 'Upcoming reservations',headerRight: CustomHeaderRight,
          headerStyle: { backgroundColor: '#1D1D1D' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }, }}/>}
      { user &&<Drawer.Screen name="Past Reservations" component={PastTimeslots} options={{ title: 'Past reservations',headerRight: CustomHeaderRight,
          headerStyle: { backgroundColor: '#1D1D1D' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }, }}/>}
    </Drawer.Navigator>
  );
}



// Failed attempt at nested navigators below:

// function StackNavigator() {
//   const navigation = useNavigation();

//   const CustomHeaderRight = () => {
//     const handleOpenDrawer = () => {
//       navigation.openDrawer();
//     };

//     return (
//       <TouchableOpacity
//               onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
//               style={{
//                 width: 60,
//                 height: 40,
//                 padding: 10,
//                 paddingLeft: 20,
//               }}>
              
// </TouchableOpacity>
//     );
//   };

//   return (
//     <Stack.Navigator initialRouteName="Home">
//       <Stack.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           title: 'Home',
//           headerRight: CustomHeaderRight,
//           headerStyle: { backgroundColor: '#1D1D1D' },
//           headerTintColor: 'white',
//           headerTitleStyle: { fontWeight: 'bold' },
//         }}
//       />
//       <Stack.Screen name="Drawer" component={DrawerNavigator} />
//       <Stack.Screen name="CourtsAvailable" component={CourtsAvailable} options={{ title: 'Courts Available',headerRight: CustomHeaderRight,
//           headerStyle: { backgroundColor: '#1D1D1D' },
//           headerTintColor: 'white',
//           headerTitleStyle: { fontWeight: 'bold' }, }} />
//       <Stack.Screen name="CourtDetail" component={CourtDetail} options={{ title: 'Court Detail' }}/>
//       <Stack.Screen name="Register" component={Register} options={{ title: 'Register User' }}/>
//       <Stack.Screen name="Profile" component={Profile} options={{ title: 'User Profile' }}/>
//       <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
//     </Stack.Navigator>
//   );
// }

function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <DrawerNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;

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

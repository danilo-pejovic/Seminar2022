import React, {createContext, useState, useEffect, useContext} from "react"
import jwt_decode from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {
    let [authTokens,setAuthTokens] = useState('')
    const navigation = useNavigation();

    const clearStorage = async () => {
        
        try {
          await AsyncStorage.clear();
        } catch (e) {
          //alert('Failed to clear the async storage.');
        }
      };
    

    const storeJWT = async (value) => {
        try {
            console.log("saving token:")
            console.log(value)
            const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem('authTokens', jsonValue)
        } catch (e) {
          // saving error
        }
      }


    async function setAuthTokensAsync() {
        try {
            let authTokens = await AsyncStorage.getItem('authTokens')
            console.log("Unutar funkcije:")
            console.log(authTokens)
            return authTokens != null ? JSON.parse(authTokens) : null;
          } catch(e) {
            // error reading value
          }
          console.log('Done.')
        }
    

      let user = null
      async function setUser() {
          
        let user = null
          try {
            const data = await AsyncStorage.getItem('authTokens');
            if (data) {
                user = jwt_decode(data);
            } else {
                user = null;
            }
          } catch (error) {
            console.error(error);
          }
        
          return user;
        }
        setUser()
    let [loading, setLoading] = useState(true)
    //let navigate = useNavigate()

    let loginUser = async (username,password ) => {
        
        let response = await fetch('http://192.168.43.187:8000/user/token/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'username':username, 'password':password})
        })
        let data = await response.json()
        console.log(response.status)
        if(response.status===200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            storeJWT(data)
            navigation.navigate('CourtsAvailable')
        }else{
            alert("Something went wrong! Check your password and username")
        }
    
    }

    let logoutUser = async () => {

        setAuthTokens(null)
        setUser(null)
        await clearStorage()
        
    }

    let updateToken = async ()=> {
        console.log("Update:")

        console.log(authTokens)

        let response = await fetch('http://192.168.43.187:8000/user/token/refresh/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'refresh':authTokens?.refresh})
        })

        console.log('Updated tokens!')

        let data = await response.json()
        
        if (response.status === 200){
            console.log('Good tokens!')
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            await AsyncStorage.setItem('authTokens', JSON.stringify(data))
        }else{

            console.log(data)
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }



    useEffect(()=> {
        
        async function updateTokenAndSetAuthTokens() {
            authTokens = await setAuthTokensAsync();
            console.log("AuthTokens:", authTokens);
            updateToken()
        }

        if (loading)  {
            updateTokenAndSetAuthTokens()
        }
      


        let updateTime = 1000 * 60 * 9//9 minutes

        let interval =  setInterval( async ()=> {
            if(authTokens){
                authTokens=null

                authTokens = await setAuthTokensAsync()


                updateToken()
            }
        }, updateTime)
        return ()=> clearInterval(interval)

    }, [authTokens, loading])


    let contextData ={
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser
    }
    return(
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}
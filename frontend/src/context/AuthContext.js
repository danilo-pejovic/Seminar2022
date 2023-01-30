import {createContext, useState, useEffect} from "react"
import jwt_decode from "jwt-decode";
import {useNavigate } from 'react-router-dom'
const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)
    let navigate = useNavigate()

    let loginUser = async (e ) => {
        e.preventDefault()
        let response = await fetch('http://localhost:8000/user/token/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
        })
        let data = await response.json()
        if(response.status===200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            navigate("/courts")
        }else{
            alert("Something went wrong! Check your password and username")
        }
    
    }

    let logoutUser = () => {

        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        
    }

    let updateToken = async ()=> {

        let response = await fetch('http://localhost:8000/user/token/refresh/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'refresh':authTokens?.refresh})
        })

        console.log('Updated tokens!')

        let data = await response.json()
        
        if (response.status === 200){
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        }else{
            logoutUser()
        }

        if(loading){
            setLoading(false)
        }
    }



    useEffect(()=> {

        if(loading){
            updateToken()
        }

        let updateTime = 1000 * 60 * 9 //9 minutes

        let interval =  setInterval(()=> {
            if(authTokens){
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
import { useState, useContext, useEffect } from "react";
import { PencilIcon } from "@heroicons/react/solid";
import AuthContext from "../../context/AuthContext";

const ManageReservationsButton = (props) => {
  const [showModalCancel, setShowModalCancel] = useState(false);
  const {id, is_available, timeslot_date, start_time, calendar_id, updateTimeslots} = props;
  const [calendarData, setCalendarData] = useState();
  const [calendarOwnerData, setCalendarOwnerData] = useState();

  const handleCancelReservation = (id) => {
    const token = JSON.parse(localStorage.getItem("authTokens"));
    

    fetch(`http://localhost:8000/schedule/timeslots/delete/${id}/`, {
        method: 'PUT',
        body: JSON.stringify({is_available: true}),
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token.access}`
        }
    })
    .then(res => res.json())
    .then(data => {
        // handle response
        setShowModalCancel(false);
        updateTimeslots();
        
        
        //window.location.reload(false);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

 

  const handleCancel = async () => {
        // Fetch calendar data
      const calendarResponse = await fetch(`http://localhost:8000/schedule/${calendar_id}/`);
      const calendarJson = await calendarResponse.json();
      console.log(calendarJson);
      setCalendarData(calendarJson);
        // Fetch owner data
      setShowModalCancel(true);
  };

  const handleRefresh = async () => {
    // Fetch calendar data
  const calendarResponse = await fetch(`http://localhost:8000/schedule/${calendar_id}/`);
  const calendarJson = await calendarResponse.json();
  console.log(calendarJson);
  setCalendarData(calendarJson);
    // Fetch owner data
  setShowModalCancel(true);
};

  

  return (
    <>
  {<button style={{fontSize: '20px', padding: '10px 20px', margin: '2px 4px',
  display: 'flex', flexDirection: 'column',
  backgroundColor: 'teal'}} onClick={handleCancel}>
  {props.children}
</button>}
{showModalCancel && (
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, background: 'rgba(0, 0, 0, 0.5)' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', background: 'black' }}>
              <p>Do you want to cancel your reservation at {calendarData.owner} at {timeslot_date}/{start_time}?</p>
              <button style={{ marginBottom: '10px' }} onClick={() => handleCancelReservation(id)}>Confirm</button>
              <button style={{marginBottom: '10px'}} onClick={() => setShowModalCancel(false)}>Deny</button>
            </div>
          </div>
        )}
</>);}


export default function Profile() {
  let {user, logoutUser} = useContext(AuthContext)
  
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);

  const [picture, setPicture] = useState(null);

  const [opassword, setOpassword] = useState(null);
  const [npassword, setNpassword] = useState(null);
  const [npassword2, setNpassword2] = useState(null);

  const [timeslots, setTimeslots] = useState([]);
  const [pastTimeslots, setPastTimeslots] = useState([]);
  const [upcomingTimeslots, setUpcomingTimeslots] = useState([]);

  // const handleAvatarChange = (e) => {
  //   e.preventDefault();

  //   const formData = new FormData();

  //   formData.append("avatar", picture, picture.name);

  //   dispatch(changeAvatar(formData));
  // };

  const fetchTimeslots = () => {
    
    fetch(`http://localhost:8000/schedule/timeslots/player/?owner=${user.user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        setTimeslots(data.results);

        const today = new Date().setHours(0, 0, 0, 0);
        const past = [];
        const upcoming = [];

        data.results.forEach(timeslot => {
          const timeslotDate = new Date(timeslot.timeslote_date).setHours(0, 0, 0, 0);
          if (timeslotDate < today) {
            past.push(timeslot);
          } else {
            upcoming.push(timeslot);
          }
        });

        setPastTimeslots(past);
        setUpcomingTimeslots(upcoming);
      })
      .catch(error => {
        console.error('Error fetching timeslots:', error);
      });
  };

  useEffect(() => {
    fetchTimeslots();
  }, []);
  if (typeof timeslots === 'undefined') {
    return null; // or any other placeholder/component to display while loading or when timeslots is undefined
  }

  const updateTimeslots = () => {
    fetchTimeslots();
  };

  let handleChangePassword = async (opassword, npassword, npassword2 ) => {
    
    const token = JSON.parse(localStorage.getItem("authTokens"));
    console.log(user)
    let response = await fetch(`http://localhost:8000/user/change_password/${user.user_id}/`, {
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'Authorization' : `Bearer ${token.access}`
            },
            body: JSON.stringify({'old_password':opassword,'password': npassword, 'password2': npassword2})
        })
 
        console.log(response)
        let data = await response.json()
        if(response.status===200){
            
            
        }else{
            alert("Something went wrong! Check your password and username")
        }
  };

  return (
    <>
    <div className="mt-8 flex">
    <div className="max-w-4xl mx-auto mr-4 px-4 sm:px-6 lg:px-8 flex-grow ml-20">
      <div className="mt-8 mr-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Update Profile
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6">
            <div className="mt-4  md:mt-0">
              <div className="flex items-center">
                <label htmlFor="picture" className="relative cursor-pointer">
                  <img
                    className="h-16 w-16 rounded-full block"
                    src={"https://res.cloudinary.com/dmtc1wlgq/image/upload/v1641911896/media/avatar/default_zrdbiq.png"
                    }
                    alt=""
                  />
                  <input
                    id="picture"
                    name="picture"
                    type="file"
                    className="sr-only"
                    onChange={(e) => {
                      setPicture(e.target.files[0]);
                    }}
                  />
                </label>
                <div>
                  <button
                    type="button"
                    className="ml-2 bg-white py-2 px-2 border border-gray-300 rounded-md text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                   // onClick={handleAvatarChange}
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  defaultValue={user.username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  defaultValue={user.email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex justify-center mt-2 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            //onClick={() => dispatch(editUser(username, email))}
          >
            <PencilIcon
              className="-ml-1 mr-2 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <span>Update</span>
          </button>
        </div>
      
      </div>

      <div className="mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Change Password
          </h2>
          <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="mt-4 md:mt-0">
              <div>
                <label htmlFor="opassword" className="sr-only">
                  Old Password
                </label>
                <input
                  id="opassword"
                  name="opassword"
                  type="password"
                  autoComplete="old-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="Old Password"
                  onChange={(e) => setOpassword(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <label htmlFor="password" className="sr-only">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="New Password"
                  onChange={(e) => setNpassword(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <label htmlFor="password" className="sr-only">
                  Repeat New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="Repeat New Password"
                  onChange={(e) => setNpassword2(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="inline-flex justify-center mt-2 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                onClick={() => handleChangePassword(opassword, npassword, npassword2)}
              >
                <PencilIcon
                  className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span>Update</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
      <div className="mt-8 flex flex-grow justify-center">
<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Timeslots
          </h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="overflow-y-auto max-h-80">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Past Timeslots
              </h3>
              <ul>
              {pastTimeslots.map(timeslot => (
        <li key={timeslot.id}>
          {timeslot.timeslote_date} - {timeslot.end}
        </li>
      ))}
              </ul>
            </div>
            <div className="overflow-y-auto max-h-80">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Upcoming Timeslots
              </h3>
              <ul>
              {upcomingTimeslots.map(timeslot => (
        <li key={timeslot.id}>
          <ManageReservationsButton key={timeslot.id} start_time={timeslot.start_time} timeslot_date={timeslot.timeslote_date} id={timeslot.id} calendar_id={timeslot.calendar} updateTimeslots={updateTimeslots} >
              {timeslot.timeslote_date} at {timeslot.start_time} 
              </ManageReservationsButton>
        </li>
      ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

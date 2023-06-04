import React, { useContext, useEffect, useState }  from 'react';
import "./sidebar.css"
import AuthContext from '../../context/AuthContext'
import API_IP from '../../utils/config';


const QuickCancelButton = (props) => {
  const [showModalCancel, setShowModalCancel] = useState(false);
  const {id, is_available, calendar_owner, timeslot_date, start_time, calendar_id, updateTimeslots} = props;
  // const [calendarData, setCalendarData] = useState();
  const [calendarOwnerData, setCalendarOwnerData] = useState();

  const handleCancelReservation = (id) => {
    const token = JSON.parse(localStorage.getItem("authTokens"));
    

    fetch(`${API_IP}/schedule/timeslots/delete/${id}/`, {
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
     // const calendarResponse = await fetch(`http://localhost:8000/schedule/${calendar_id}/`);
     // const calendarJson = await calendarResponse.json();
      //console.log(calendarJson);
      //setCalendarData(calendarJson);
      setShowModalCancel(true);
  };

//   const handleRefresh = async () => {
//     // Fetch calendar data
//   const calendarResponse = await fetch(`http://localhost:8000/schedule/${calendar_id}/`);
//   const calendarJson = await calendarResponse.json();
//   console.log(calendarJson);
//   setCalendarData(calendarJson);
//     // Fetch owner data
//   setShowModalCancel(true);
// };

  

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
              <p>Do you want to cancel your reservation at {calendar_owner}/{calendar_id} at {timeslot_date}/{start_time}?</p>
              <button style={{ marginBottom: '10px' }} onClick={() => handleCancelReservation(id)}>Confirm</button>
              <button style={{marginBottom: '10px'}} onClick={() => setShowModalCancel(false)}>Deny</button>
            </div>
          </div>
        )}
</>);}


// MOVED TO PROFILE PAGE - THINK ABOUT READING LATER

// const MoreReservationsButton = (props) => {
//   const [showModalCancel, setShowModalCancel] = useState(false);
//   const {id, is_available, timeslot_date, start_time, calendar_id, updateTimeslots} = props;
//   const [calendarData, setCalendarData] = useState();
//   const [calendarOwnerData, setCalendarOwnerData] = useState();

//   const handleCancelReservation = (id) => {
//     const token = JSON.parse(localStorage.getItem("authTokens"));
    

//     fetch(`http://localhost:8000/schedule/timeslots/delete/${id}/`, {
//         method: 'PUT',
//         body: JSON.stringify({is_available: true}),
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization' : `Bearer ${token.access}`
//         }
//     })
//     .then(res => res.json())
//     .then(data => {
//         // handle response
//         setShowModalCancel(false);
//         updateTimeslots();
        
        
//         //window.location.reload(false);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }

 

//   const handleCancel = async () => {
//         // Fetch calendar data
//       const calendarResponse = await fetch(`http://localhost:8000/schedule/${calendar_id}/`);
//       const calendarJson = await calendarResponse.json();
//       console.log(calendarJson);
//       setCalendarData(calendarJson);
//         // Fetch owner data
//       setShowModalCancel(true);
//   };



  

//   return (
//     <>
//   {<button style={{fontSize: '20px', padding: '10px 20px', margin: '2px 4px',
//   display: 'flex', flexDirection: 'column',
//   backgroundColor: 'teal'}} onClick={handleCancel}>
//   {props.children}
// </button>}
// {showModalCancel && (
//           <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, background: 'rgba(0, 0, 0, 0.5)' }}>
//             <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', background: 'black' }}>
//               <p>Do you want to cancel your reservation at {calendarData.owner} at {timeslot_date}/{start_time}?</p>
//               <button style={{ marginBottom: '10px' }} onClick={() => handleCancelReservation(id)}>Confirm</button>
//               <button style={{marginBottom: '10px'}} onClick={() => setShowModalCancel(false)}>Deny</button>
//             </div>
//           </div>
//         )}
// </>);}

function Sidebar() {
  
  let {user, logoutUser} = useContext(AuthContext)
  const [timeslots, setTimeslots] = useState();
  

  const fetchTimeslots = () => {
    fetch(`${API_IP}/schedule/timeslots/player/?owner=${user.user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        setTimeslots(data.results);

        const today = new Date().setHours(0, 0, 0, 0);
        const upcoming = [];

        data.results.forEach(timeslot => {
          const timeslotDate = new Date(timeslot.timeslote_date).setHours(0, 0, 0, 0);
          if (timeslotDate >= today) {
            upcoming.push(timeslot);
          } 
        });

        setTimeslots(upcoming.slice(0, 5));
      })
      .catch(error => {
        console.error('Error fetching timeslots:', error);
      });
  };

  useEffect(() => {
    fetchTimeslots();
  }, []);

  const updateTimeslots = () => {
    fetchTimeslots();
  };

  if (typeof timeslots === 'undefined') {
    return null; // or any other placeholder/component to display while loading or when timeslots is undefined
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr' }}>
    <div className="start d-flex flex-column flex-shrink-0 p-3 text-white bg-teal-800" style={{ width: '280px', display: 'flex' }}>
      <hr />
      <ul className="start nav nav-pills flex-column mb-auto">
      <li className="nav-item">
          <a href="#" className="nav-link active" aria-current="page">
            <svg className="bi me-2" width="16" height="16"><use xlinkHref="#home"/></svg>
            Hi, {user.username}
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link active" aria-current="page">
            <svg className="bi me-2" width="16" height="16"><use xlinkHref="#home"/></svg>
            Upcoming reservations:
          </a>
        </li>
        {timeslots.map(timeslot => (
            <li key={timeslot.id} className="nav-item">
              <QuickCancelButton key={timeslot.id} start_time={timeslot.start_time} timeslot_date={timeslot.timeslote_date} id={timeslot.id} calendar_id={timeslot.calendar} calendar_owner={timeslot.calendar_owner} updateTimeslots={updateTimeslots} >
              {timeslot.timeslote_date} at {timeslot.start_time} 
              </QuickCancelButton> 
            </li> ))}
        
        <li>
          <a href="#" className="nav-link text-white">
            <svg className="bi me-2" width="16" height="16"><use xlinkHref="#people-circle"/></svg>
            More reservations
          </a>
        </li>
        <li>
          <a href="#" className="nav-link text-white">
            <svg className="bi me-2" width="16" height="16"><use xlinkHref="#people-circle"/></svg>
            Logout
          </a>
        </li>
        
      
     
      </ul>
      <hr />
    </div>
    </div>
  );
}

export default Sidebar;

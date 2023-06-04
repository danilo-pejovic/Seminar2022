import { LockClosedIcon } from "@heroicons/react/solid";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from '../layouts/Sidebar';
import "../layouts/sidebar.css";
import AuthContext from "../../context/AuthContext";
import API_IP from '../../utils/config';


const timeOptions = () => {
    let options = []
    for (let i = 0; i < 24; i++) {
      //for (let j = 0; j < 2; j++) {
        let hour = i < 10 ? `0${i}` : `${i}`;
       // let minutes = j === 0 ? "00" : "30";
        options.push(<option value={`${hour}:00:00`}>{`${hour}:00`}</option>)
      //}
    }
    return options;
  }


const DeleteCalendarButton = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [showModalCancel, setShowModalCancel] = useState(false);
  const {id, calendars} = props;
  const [calendars_list, setCalendars] = useState(calendars);

  const handleConfirm = (id) => {
    const token = JSON.parse(localStorage.getItem("authTokens"));

    fetch(`${API_IP}/schedule/delete/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token.access}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to delete object with ID: ${id}`);
        }
        setShowModal(false);
        window.location.reload(false);
        return response.json();
      })
      .then(() => {
        // Update the state after successful deletion
        window.location.reload(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleClick = () => {
    setShowModal(true);
  };
  <button
  type="submit" onClick={handleClick}
  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
>
  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
    <LockClosedIcon
      className="h-5 w-5 text-teal-500 group-hover:text-teal-400"
      aria-hidden="true"
    />
  </span>
  {props.children}
</button>
  

  return (

    <>
     
     {showModal && (
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, background: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', background: 'white' }}>
          <p>Are you sure you want to remove this schedule?</p>
          <button style={{ marginBottom: '10px' }} onClick={() => handleConfirm(id)}>Confirm</button>
          <button style={{marginBottom: '10px'}} onClick={() => setShowModal(false)}>Deny</button>
        </div>
      </div>
    )}
      { <button
  onClick={handleClick}
  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
>
  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
    <LockClosedIcon
      className="h-5 w-5 text-teal-500 group-hover:text-teal-400"
      aria-hidden="true"
    />
  </span>
  {props.children}
</button>}
     
    </>
  );
}



export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [opening_time_weekday, setOpeningTimeWeekdays] = useState("");
  const [closing_time_weekday, setClosingTimeWeekdays] = useState("");
  const [opening_time_weekend, setOpeningTimeWeekends] = useState("");
  const [closing_time_weekend, setClosingTimeWeekends] = useState("");
  const [calendars, setData] = useState([]);
  const { user } = useContext(AuthContext);
  const [refresh_page, setRefresh] = useState(false);

  

  const fetchCalendars = () => {
    fetch(`${API_IP}/schedule/?owner=${user.user_id}`, {
      method:'GET',
      headers:{
          'Content-Type':'application/json'
      },

  })
    .then(response => response.json())
    .then(calendars => setData(calendars.results))
    .catch(error => console.log(error));}

  useEffect(() => {
    fetchCalendars();
  }, [refresh_page]);


  let handleFormSubmit = async (e ) => {
    e.preventDefault()
    const token = JSON.parse(localStorage.getItem("authTokens"));
    
  

    
    let response = await fetch(`${API_IP}/schedule/`, {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization' : `Bearer ${token.access}`
            },
            body:JSON.stringify({'name':e.target.name.value, 'start_date':e.target.start_date.value, 
            'end_date': e.target.end_date.value,
             'closing_time_weekday':e.target.closing_time_weekday.value, 
             'opening_time_weekday':e.target.opening_time_weekday.value,'closing_time_weekend':e.target.closing_time_weekend.value,
             'opening_time_weekend':e.target.opening_time_weekend.value,  })
        })
        console.log(JSON.stringify({'name':e.target.name.value, 'start_date':e.target.start_date.value, 
        'end_date': e.target.end_date.value,
         'closing_time_weekday':e.target.closing_time_weekday.value, 
         'opening_time_weekday':e.target.opening_time_weekday.value,'closing_time_weekend':e.target.closing_time_weekend.value,
         'opening_time_weekend':e.target.opening_time_weekend.value,  }))
        let data = await response.json()
        if(response.status===201){
            
            navigate(`/courts/`)
        }else{
            alert("Something went wrong! Check your entries")
        }
  };
  
  



  return (
    <>
    <div className="page-container">
    <Sidebar />
    <div className="flex h-screen" >
      <div className="w-1/3 white">
      <div className="max-w-md w-full space-y-8">

        <div className="text-center">
            <h2 className="mt-6 text-3xl font-light text-teal-900">Court management</h2>
          </div>
       <div className="bg-teal-500">
      {calendars && // Add a check to ensure calendars is not undefined
        calendars.map((calendar, index) => (
          <DeleteCalendarButton
            key={calendar.id}
            id={calendar.id}
            calendars={calendars}
            onDelete={() => {
              setRefresh(prevRefresh => !prevRefresh);
            }}
          >
             {calendar.name}
          </DeleteCalendarButton>
        ))}
        </div>
      </div>
    </div>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ flex: 1 }} >
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-light text-teal-900">Court schdeule creation</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="name" className="sr-only">
                  Court Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="Court Name (generally just a number)"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="start_date" className="sr-only">
                  Start Date
                </label>
                <input
                  id="start_date"
                  name="start_date"
                  type="text"
                  autoComplete="start_date"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="Starting date when that court is operational (YYYY-MM-DD)"
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="end_date" className="sr-only">
                  End Date
                </label>
                <input
                  id="end_date"
                  name="end_date"
                  type="text"
                  autoComplete="end_date"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                  placeholder="Ending date when that court is operational (YYYY-MM-DD)"
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div>
                    <label htmlFor="opening_time_weekday"></label>
                    <select 
                        id="opening_time_weekday"
                        name="opening_time_weekday"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                        onChange={(e) => setOpeningTimeWeekdays(e.target.value)}
                    >
                    <option value="">Select opening time weekdays</option>
                    {timeOptions()}
                    </select>
            </div>
            <div>
                    <label htmlFor="closing_time_weekday"></label>
                    <select 
                        id="closing_time_weekday"
                        name="closing_time_weekday"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                        onChange={(e) => setClosingTimeWeekdays(e.target.value)}
                    >
                    <option value="">Select closing time weekdayss</option>
                    {timeOptions()}
                    </select>
            </div>
              <div>
                    <label htmlFor="opening_time_weekend"></label>
                    <select 
                        id="opening_time_weekend"
                        name="opening_time_weekend"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                        onChange={(e) => setOpeningTimeWeekends(e.target.value)}
                    >
                    <option value="">Select opening time weekend</option>
                    {timeOptions()}
                    </select>
            </div>

            <div>
                    <label htmlFor="closing_time_weekend"></label>
                    <select 
                        id="closing_time_weekend"
                        name="closing_time_weekend"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm"
                        onChange={(e) => setClosingTimeWeekends(e.target.value)}
                    >
                    <option value="">Select closing time weekend</option>
                    {timeOptions()}
                    </select>
            </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-teal-500 group-hover:text-teal-400"
                    aria-hidden="true"
                  />
                </span>
                Register a new court
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
      </div>
    </>
  );
}

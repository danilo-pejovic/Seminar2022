import { LockClosedIcon } from "@heroicons/react/solid";
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthContext from "../../context/AuthContext";


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
export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [opening_time_weekday, setOpeningTimeWeekdays] = useState("");
  const [closing_time_weekday, setClosingTimeWeekdays] = useState("");
  const [opening_time_weekend, setOpeningTimeWeekends] = useState("");
  const [closing_time_weekend, setClosingTimeWeekends] = useState("");


  let handleFormSubmit = async (e ) => {
    e.preventDefault()
    const token = JSON.parse(localStorage.getItem("authTokens"));


    
    let response = await fetch('http://localhost:8000/schedule/', {
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
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                Register a new court for everyone to use
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

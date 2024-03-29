import React, {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import { Calendar } from 'react-calendar';
import styled from 'styled-components';
import Sidebar from '../layouts/Sidebar';
import "../layouts/sidebar.css";
import API_IP from '../../utils/config';


const LargeButton = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [showModalCancel, setShowModalCancel] = useState(false);
    const {id, is_available, calendar_owner} = props;
    const [isAvailable, setIsAvailable] = useState(is_available);
    let {user} = useContext(AuthContext)
    const [owner, setOwner] = useState(props.owner)

    const handleConfirm = (id) => {
        const token = JSON.parse(localStorage.getItem("authTokens"));
        console.log(owner)
        

        fetch(`${API_IP}/schedule/timeslots/update/${id}/`, {
            method: 'PUT',
            body: JSON.stringify({is_available: false}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token.access}`
            }
        })
        .then(res => res.json())
        .then(data => {
            // handle response
            setShowModal(false);
            setIsAvailable(false);
            setOwner(user.user_id)
            //window.location.reload(false);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
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
          setIsAvailable(true);
          
          //window.location.reload(false);
      })
      .catch(error => {
          console.error('Error:', error);
      });
  }
  
    const handleClick = () => {
      setShowModal(true);
    };

    const handleCancel = () => {
      setShowModalCancel(true);
    };

    
  
    return (
      <>
        {isAvailable ?
          <button style={{fontSize: '20px', padding: '10px 20px', margin: '2px 4px',
            display: 'flex', flexDirection: 'column',
            backgroundColor: 'green'}} onClick={handleClick}>
            {props.children}
          </button>
          :
          <button style={{fontSize: '20px', padding: '10px 20px', margin: '2px 4px',
            display: 'flex', flexDirection: 'column',
            backgroundColor: 'red'}} onClick={handleCancel}>
            {props.children}
          </button>
        }
        {showModal &&  (
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, background: 'rgba(0, 0, 0, 0.5)' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', background: 'white' }}>
              <p>Confirm or deny booking?</p>
              <button style={{ marginBottom: '10px' }} onClick={() => handleConfirm(id)}>Confirm</button>
              <button style={{marginBottom: '10px'}} onClick={() => setShowModal(false)}>Deny</button>
            </div>
          </div>
        )}
        {showModalCancel && (user.user_id==owner || calendar_owner==user.user_id) &&(
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, background: 'rgba(0, 0, 0, 0.5)' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', background: 'white' }}>
              <p>Do you want to cancel your reservation?</p>
              <button style={{ marginBottom: '10px' }} onClick={() => handleCancelReservation(id)}>Confirm</button>
              <button style={{marginBottom: '10px'}} onClick={() => setShowModalCancel(false)}>Deny</button>
            </div>
          </div>
        )}
      </>
    );
  }

const CalendarDetail = (props) => {
    const [date, setDate] = useState(new Date());
    const [collapsed, setCollapsed] = useState(false);
    
    const divStyles = {
        display: 'flex',
        flexDirection: 'column',
        background: 'white'
      }
      const buttonStyles = {
        marginBottom: '10px',
        background: 'white',
        float: 'left'
      }
  let {user} = useContext(AuthContext)
  const [data, setData] = useState([]);
  let { id } = useParams();
  

  const handleChange = (date) => {
    setDate(date);
    fetchData(date);
  }

  const fetchObject = (id,date) => {
    return fetch(`${API_IP}/schedule/timeslots/?calendar=${id}&timeslote_date=${date.toISOString().substring(0, 10)}`, {
        method:'GET',
        headers:{
            'Content-Type':'application/json'
        },

    })
                .then(response => {
                    // Check if the response is ok
                    if (!response.ok) {
                        throw new Error(`Failed to get object with ID: ${id}`);
                    }
                    return response.json();
                })
}


const fetchData = (date) => {
    // Make the first fetch request to get the list of court IDs associated with 1 owenr
    fetch(`${API_IP}/schedule/?owner=${id}`, {
        method:'GET',
        headers:{
            'Content-Type':'application/json'
        },

    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to get the list of IDs');
            }
            return response.json();
        })
        .then(data => {
            const ids = data.results;

            // Create an array of promises for the second fetch requests
            const promises = ids.map(id => fetchObject(id.id, date).then(timeslots => ({ name: id.name, timeslots })));
            return Promise.all(promises);
        })
        .then(objects => {

            setData(objects);
        })
        .catch(error => {
            console.error(error);
        });
}
  


      useEffect(() => {
        fetchData(date)
    }, [])

    const CalendarContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;
    width: 25%;
    margin: 0 auto;
  `;
const ContentContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const CustomCalendar = styled(Calendar)`
  .react-calendar {
    width: 300px;
    font-family: Arial, sans-serif;
  }

  .react-calendar__tile--active {
    background-color: teal;
    color: white;
  }

  .react-calendar__navigation {
    button {
      font-size: 20px;
      padding: 10px;
    }
  }
`;

const toggleCollapse = () => {
  setCollapsed(!collapsed);
};



    return (
      <div className="page-container">
    <Sidebar />
        <div className='mt-8 justify-center'>
          <CalendarContainer>
                <CustomCalendar onChange={handleChange} value={date} />
                
          </CalendarContainer>
          <ContentContainer>
                {data.map((court, index1) => ( 
                <div key={index1} style={{fontSize: '20px', padding: '10px 20px', margin: '2px 4px',
                display: 'flex', flexDirection: 'column',
                }}  >
                    <button onClick={toggleCollapse}><p> {court.name}</p></button>
                    {!collapsed && (
                    <div>
                    {court.timeslots.results.map((timeslot, index) => 
                    <LargeButton key={timeslot.id} is_available={timeslot.is_available} owner={timeslot.owner} id={timeslot.id} calendar_owner={timeslot.calendar_owner}>
                    {timeslot.start_time}
                    </LargeButton> )}
                    </div>)}
                </div>
                ))}
            
            </ContentContainer>
          
        </div>
        </div>
      );}

export default CalendarDetail;
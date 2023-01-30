import React, {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import { Calendar } from 'react-calendar';
import styled from 'styled-components';


const LargeButton = (props) => {
    const [showModal, setShowModal] = useState(false);
    const {id, is_available} = props;
    const [isAvailable, setIsAvailable] = useState(is_available);

    const handleConfirm = (id) => {
        const token = JSON.parse(localStorage.getItem("authTokens"));
        

        fetch(`http://localhost:8000/schedule/timeslots/update/${id}/`, {
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
            
            //window.location.reload(false);
        }).then(res => res.json())
        .catch(error => {
            console.error('Error:', error);
        });
    }
  
    const handleClick = () => {
      setShowModal(true);
    };
  
    return (
      <>
        <button style={{fontSize: '20px', padding: '10px 20px', 
        display: 'flex', flexDirection: 'column',
        backgroundColor: isAvailable ? 'green' : 'red'}} onClick={handleClick}>
          {props.children}
        </button>
        {showModal && (
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, background: 'rgba(0, 0, 0, 0.5)' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', background: 'white' }}>
              <p>Confirm or deny booking?</p>
              <button style={{ marginBottom: '10px' }} onClick={() => handleConfirm(id)}>Confirm</button>
              <button style={{marginBottom: '10px'}} onClick={() => setShowModal(false)}>Deny</button>
            </div>
          </div>
        )}
      </>
    );
  }

const CalendarDetail = (props) => {
    const [date, setDate] = useState(new Date());
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
  }

  const fetchObject = (id,date) => {
    return fetch(`http://localhost:8000/schedule/timeslots/?calendar=${id}&timeslote_date=${date.toISOString().substring(0, 10)}`, {
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
    // Make the first fetch request to get the list of IDs
    fetch(`http://localhost:8000/schedule/?owner=${id}`, {
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
            // Extract the list of IDs from the response
            const ids = data.results;

            // Create an array of promises for the second fetch requests
            const promises = ids.map(id => fetchObject(id.id, date));
            
            // Use Promise.all to wait for all requests to complete
            return Promise.all(promises)
        })
        .then(objects => {

            // Update the state with the objects
            setData(objects);
        })
        .catch(error => {
            console.error(error);
        });
}
  


      useEffect(() => {
        console.log(date)
        fetchData(date)
    }, [])

    const CalendarContainer = styled.div`
  position: relative;
  justify-content: center;
  z-index: 1;
  width: 25%;
`;
const ContentContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

    return (
        <div>
          <CalendarContainer>
                <Calendar onChange={handleChange} value={date} />
                <p>Selected Date: {date.toISOString().slice(0, 10)}</p>
          </CalendarContainer>
          <ContentContainer>
                {data.map((court, index1) => ( 
                <div key={index1} >
                    <p> Court {index1}</p>
        
                    {court.results.map((timeslot, index) => 
                    <LargeButton key={timeslot.id} is_available={timeslot.is_available} id={timeslot.id} >
                    {timeslot.start_time}
                    </LargeButton> )}
                </div>
                ))}
            
            </ContentContainer>
          
        </div>
      );}

export default CalendarDetail;
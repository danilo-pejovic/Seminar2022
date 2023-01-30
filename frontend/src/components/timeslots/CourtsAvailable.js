import React, {useState, useEffect, useContext} from 'react';
import AuthContext from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';



const CourtsAvailable = () => {
  let {user} = useContext(AuthContext)
  const [data, setData] = useState([]);
  const navigate = useNavigate();

    // Move to utils later, for now ok since it is only called here
    useEffect(() => {
        fetch('http://localhost:8000/user/user/?is_provider=true', {
        method:'GET',
        headers:{
            'Content-Type':'application/json'
        },
        
    })
          .then(response => response.json())
          .then(data => setData(data.results))
          .catch(error => console.log(error));
      }, []);



      return (
        <div>
          {data.map((owner, index) => (
            <button key={owner.id} style={{fontSize: '20px', padding: '10px 20px'}} onClick={() => navigate(`/courts/${owner.id}`)}>
            {owner.username}
          </button>
          ))}
        </div>
      );
}

export default CourtsAvailable;

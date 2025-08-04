import React, { useEffect, useState } from 'react';
import TinderCard from 'react-tinder-card';
import axios from 'axios';

const SwipePage = () => {
  const [babyNames, setBabyNames] = useState([]);
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    //get list of baby names from the API
    axios.get('http://localhost:5233/api/babyname') // Adjust the endpoint
      .then(response => {
        console.log('Fetched baby names:', response.data);
        setBabyNames(response.data);
      })
      .catch(error => {
        console.error('Error fetching baby names:', error);
      });

      //get user info from the API
      axios.get("http://localhost:5233/api/users/me", { withCredentials: true })
      .then(res => {
        console.log('Fetched user info:', res.data);
        setUser(res.data);
      })
      .catch(err => setUser(null));
  }, []);

  //handle swipe action
  const handleSwipe = async (direction, bn) => {
  const payload = {
    userId: user.id,      // Replace this with your actual user ID
    babyNameId: bn.id,          // bn is the baby name object from map()
    direction                   // 'left' or 'right' from TinderCard
  };

  console.log(`Swiped ${direction} on ${bn.name}`);
  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post('http://localhost:5233/api/swipe', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data.matched) {
      console.log('🎉 It’s a match!');
      // Trigger match popup/modal here if you want
    } else {
      console.log('Swipe recorded. No match yet.');
    }

  } catch (error) {
    console.error('Swipe failed:', error.response?.data || error.message);
  }
};
  //return(<div className="swipe-container">SwipePage</div>);
  return (
    <div className="swipe-container">
      
      {babyNames.map(bn => (
        <TinderCard
          key={bn.id}
          onSwipe={(dir) => handleSwipe(dir, bn)}
          className="swipe">
          <div className="card">
            <h3>{bn.name}</h3>
            <p><strong>Gender:</strong> {bn.gender}</p>
            <p><strong>Origin:</strong> {bn.origin}</p>
            <p><strong>Meaning:</strong> {bn.meaning}</p>
            <p><em>{bn.description}</em></p>
          </div>
        </TinderCard>
        
      )) } 
    </div>
  );
};

export default SwipePage;

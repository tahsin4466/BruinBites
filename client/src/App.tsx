import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Home from './pages/Home';

interface ApiResponse {
  message: string;
}

function App() {
  const [data, setData] = useState<ApiResponse | null>(null); // Specify ApiResponse as the type

  useEffect(() => {
    // Fetch data from Flask API when the component mounts
    axios.get('/api/data')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSubmit = () => {
    // Example of submitting data to Flask API
    const formData = { key: 'value' }; // Your form data
    axios.post('/api/submit', formData)
      .then(response => {
        console.log('Data submitted successfully:', response.data);
      })
      .catch(error => {
        console.error('Error submitting data:', error);
      });
  };

  return (
    <div>
      {data ? (
        <p>{data.message}</p>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={handleSubmit}>Submit Data</button>
    </div>
  );
}

export default App;

/*
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data from Flask API when the component mounts
    axios.get('/api/data')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSubmit = () => {
    // Example of submitting data to Flask API
    const formData = { key: 'value' }; // Your form data
    axios.post('/api/submit', formData)
      .then(response => {
        console.log('Data submitted successfully:', response.data);
      })
      .catch(error => {
        console.error('Error submitting data:', error);
      });
  };

  return (
    <div>
      {data ? (
        <p>{data.message}</p>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={handleSubmit}>Submit Data</button>
    </div>
  );
}

export default App;

 */
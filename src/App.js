import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';         // Main CSS
import './RainAnimation.css'; // Import the rain animation CSS
import './CloudAnimation.css'; // Import the cloud animation CSS

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });

  const API_KEY = '895284fb2d2c50a520ea537456963d9c';

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (coordinates.lat && coordinates.lon) {
      const fetchWeatherByCoords = async () => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${API_KEY}`;
        try {
          const response = await axios.get(url);
          setData(response.data);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      };
      fetchWeatherByCoords();
    }
  }, [coordinates]);

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=${API_KEY}`;
      axios.get(url)
        .then((response) => {
          setData(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
      setLocation('');
    }
  };

  // Function to create raindrops
  const createRaindrops = () => {
    const drops = [];
    for (let i = 0; i < 100; i++) {
      drops.push(
        <div
          key={i}
          className="drop"
          style={{
            '--left': `${Math.random() * 100}vw`,
            '--delay': `${Math.random()}s`,
          }}
        />
      );
    }
    return drops;
  };

  // Function to create clouds
  const createClouds = () => {
    const clouds = [];
    for (let i = 0; i < 4; i++) {
      clouds.push(
        <div
          key={i}
          className="cloud"
          style={{
            '--delay': `${Math.random() * 10}s`,
            top: `${Math.random() * 100}px`, // Randomize initial vertical position
            left: `${Math.random() * 100 - 100}%`, // Randomize horizontal start outside view
          }}
        >
          <div className="cloud-part1"></div>
          <div className="cloud-part2"></div>
          <div className="cloud-part3"></div>
        </div>
      );
    }
    return clouds;
  };

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyDown={searchLocation}  // Changed to onKeyDown
          placeholder='Enter Location'
          type="text"
        />
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{((data.main.temp - 32) * 5 / 9).toFixed(1)}°C</h1> : null}
          </div>
          <div className="description">
            {data.weather ? <p>{data.weather[0].description}</p> : null}
          </div>
        </div>

        {data.name && (
          <div className="bottom">
            <div className="feels">
              {data.main ? <p className='bold'>{((data.main.feels_like - 32) * 5 / 9).toFixed(1)}°C</p> : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p className='bold'>{data.wind.speed.toFixed()} MPH</p> : null}
              <p>Wind Speed</p>
            </div>
          </div>
        )}
      </div>

      {/* Rain animation container */}
      <div className="rain-container">
        <div className="rain">
          {createRaindrops()}
        </div>
      </div>

      {/* Cloud animation container */}
      <div className="clouds">
        {createClouds()}
      </div>
    </div>
  );
}

export default App;

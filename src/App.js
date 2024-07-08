import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Typography, Paper, Grid, Box, Button, Dialog, DialogTitle, DialogContent } from '@mui/material'; // MUI components
import './RainAnimation.css'; // Custom CSS for rain
import './CloudAnimation.css'; // Custom CSS for clouds
import './App.css'; // Main CSS file

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [show, setShow] = useState(false); // Modal state
  const [forecast, setForecast] = useState([]); // Forecast data state

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
        setIsLoading(true);
        setError('');
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${API_KEY}`;
        try {
          const response = await axios.get(url);
          setData(response.data);
        } catch (error) {
          setError('Error fetching weather data. Please try again.');
        }
        setIsLoading(false);
      };
      fetchWeatherByCoords();
      fetchForecast(coordinates.lat, coordinates.lon); // Fetch forecast for the initial coordinates
    }
  }, [coordinates]);

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      setIsLoading(true);
      setError('');
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;
      axios.get(url)
        .then((response) => {
          setData(response.data);
          setCoordinates({ lat: response.data.coord.lat, lon: response.data.coord.lon }); // Update coordinates
          fetchForecast(response.data.coord.lat, response.data.coord.lon); // Fetch forecast for the searched location
        })
        .catch((error) => {
          setError('Error fetching weather data. Please try again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
      setLocation('');
    }
  };

  const fetchForecast = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    try {
      const response = await axios.get(url);
      console.log(response)
      setForecast(response.data.list);
    } catch (error) {
      setError('Error fetching forecast data. Please try again.');
    }
  };

  const createRaindrops = () => {
    const drops = [];
    for (let i = 0; i < 100; i++) {
      drops.push(
        <Box
          key={i}
          className="drop"
          sx={{
            '--left': `${Math.random() * 100}vw`,
            '--delay': `${Math.random()}s`,
          }}
        />
      );
    }
    return drops;
  };
  const sunnyAnimation = () => (
    <Box className="sun" />
  );
  const createClouds = () => {
    const clouds = [];
    for (let i = 0; i < 4; i++) {
      clouds.push(
        <Box
          key={i}
          className="cloud"
          sx={{
            top: `${Math.random() * 80 + 10}vh`, // Adjust to keep clouds in view
            left: `${Math.random() * 100 - 100}%`,
          }}
        >
          <Box className="cloud-part1"></Box>
          <Box className="cloud-part2"></Box>
          <Box className="cloud-part3"></Box>
        </Box>
      );
    }
    return clouds;
  };

  const handleOpen = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  return (
    <div className='mainContainer'

    >
      <Box
        sx={{
          width: '100%',
          textAlign: 'center',
          mb: 2,
        }}
      >
        <TextField
          variant="outlined"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyDown={searchLocation}
          placeholder='Enter Location'
          sx={{
            input: { color: '#fff' },
            '.MuiOutlinedInput-root': {
              borderRadius: '25px',
              background: 'rgba(255,255,255,0.1)',
              borderColor: 'rgba(255,255,255,0.8)',
              '& fieldset': {
                borderColor: 'rgba(255,255,255,0.8)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255,255,255,1)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgba(255,255,255,1)',
              },
            },
          }}
          InputLabelProps={{
            style: { color: '#fff' }
          }}
        />
      </Box>

      <Paper
        elevation={3}
        sx={{
          width: '90%',
          maxWidth: '600px',
          p: 2,
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: '#fff',
          textAlign: 'center',
          backdropFilter: 'blur(5px)',
          paddingLeft: "30px"
        }}
      >
        {isLoading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        <Box
          sx={{
            '.location': {
              fontSize: '2rem',
              fontWeight: 500,
              mb: 1,
            },
            '.temp': {
              fontSize: '4rem',
              fontWeight: 700,
              mb: 1,
            },
            '.description': {
              fontSize: '1.5rem',
              fontWeight: 300,
              textTransform: 'capitalize',
            }
          }}
        >
          <Typography className="location">{data.name}</Typography>
          <Typography className="temp">
            {data.main ? `${data.main.temp.toFixed(1)}°C` : null}
          </Typography>
          <Typography className="description">
            {data.weather ? data.weather[0].description : null}
          </Typography>
        </Box>

        {data.name && (
          <Grid
            container
            spacing={2}
            sx={{
              '.feels, .humidity, .wind': {
                flex: 1,
                textAlign: 'center',
                '.bold': {
                  fontWeight: 700,
                },
                p: 1,
              },
              backgroundColor: 'rgba(255,255,255, 0.2)',
              borderRadius: '12px',
              mt: 2,
              p: 2,
            }}
          >
            <Grid item xs={4} className="feels">
              <Typography className='bold'>
                {data.main ? `${data.main.feels_like.toFixed(1)}°C` : null}
              </Typography>
              <Typography>Feels Like</Typography>
            </Grid>
            <Grid item xs={4} className="humidity">
              <Typography className='bold'>
                {data.main ? `${data.main.humidity}%` : null}
              </Typography>
              <Typography>Humidity</Typography>
            </Grid>
            <Grid item xs={4} className="wind">
              <Typography className='bold'>
                {data.wind ? `${data.wind.speed.toFixed()} MPH` : null}
              </Typography>
              <Typography>Wind Speed</Typography>
            </Grid>
          </Grid>
        )}
      </Paper>
     


      {/* Show Forecast Button */}
      <Button 
        variant="contained" 
        onClick={handleOpen} 
        sx={{ mt: 2, backgroundColor: 'rgba(0,0,0,0.5)', color: '#000' }}
      >
        Show Weather Forecast
      </Button>

      {/* Forecast Modal */}
      <Dialog open={show} onClose={handleClose}>
  <DialogTitle>Weather Forecast</DialogTitle>
  <DialogContent>
    {forecast.length > 0 ? (
      [0, 7, 15, 23, 38].map((index) => (
        forecast[index] && (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography>{new Date(forecast[index].dt_txt).toLocaleDateString()}</Typography>
            <Typography>Temp: {forecast[index].main.temp}°C</Typography>
            <Typography>Weather: {forecast[index].weather[0].description}</Typography>
          </Box>
        )
      ))
    ) : (
      <Typography>No forecast data available.</Typography>
    )}
  </DialogContent>
</Dialog>


      {/* Rain animation container */}
      {data.weather && data.weather[0].description.includes('rain') && (
        <Box className="rain-container">
          <Box className="rain">
            {createRaindrops()}
          </Box>
        </Box>
      )}

      {/* Cloud animation container */}
      {data.weather && !data.weather[0].description.includes('clear') && (
        <Box className="clouds">
          {createClouds()}
        </Box>
      )}
      {data.weather && data.weather[0].description.includes('clear sky') && (
        <Box className="sunny-container">
          {sunnyAnimation()}
        </Box>
      )}
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weatherClass, setWeatherClass] = useState("default");

  const API_KEY = "badbf8e3f5ef6a2942afc4c7e1b23a65";

  const getWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = res.data;
      setWeather(data);

      // Determine weather class
      const condition = data.weather[0].main.toLowerCase();
      const description = data.weather[0].description.toLowerCase();

      if (condition.includes("rain")) {
        setWeatherClass("rainy");
      } else if (condition.includes("snow") || condition.includes("cold")) {
        setWeatherClass("cold");
      } else if (description.includes("fog") || condition.includes("mist") || condition.includes("fog")) {
        setWeatherClass("foggy");
      } else if (condition.includes("cloud")) {
        setWeatherClass("cloudy");
      } else if (condition.includes("clear") || description.includes("sunny")) {
        setWeatherClass("sunny");
      } else {
        setWeatherClass("default");
      }

    } catch (err) {
      setError("City not found or API error");
      setWeather(null);
      setWeatherClass("default");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="root" className={weatherClass}>
      <h1>🌤 Weather Dashboard</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getWeather}>Search</button>

      {loading && <p className="loading">Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div className={`weather-card ${weather ? "show" : ""}`}>
          <h2>{weather.name}</h2>
          <p>🌡 Temp: {weather.main.temp}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>🌬 Wind: {weather.wind.speed} km/h</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather-icon"
          />
          <p>{weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default App;

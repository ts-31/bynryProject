import React, { useEffect, useState } from "react";
import "./Search.css";
import MapComponent from "../components/MapComponent";

export default function Search() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [mapPosition, setMapPosition] = useState([19.7515, 75.7139]);

  useEffect(() => {
    const storedUsers = localStorage.getItem("user");
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      setUsers(parsedUsers);
      setFilteredUsers(parsedUsers);
    }
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const results = users.filter((user) =>
      user.name.toLowerCase().includes(term)
    );
    setFilteredUsers(results);
  };

  async function geocodeAddress(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { latitude: lat, longitude: lon };
      } else {
        throw new Error("No results found");
      }
    } catch (error) {
      console.error("Error during geocoding:", error);
      return null;
    }
  }

  const handleMapButtonClick = async (address) => {
    setSelectedAddress(address);

    if (address) {
      const location = await geocodeAddress(address);
      if (location) {
        setMapPosition([
          parseFloat(location.latitude),
          parseFloat(location.longitude),
        ]);
      } else {
        console.error("Geocoding failed.");
      }
    }
  };

  return (
    <div className="mainContainer">
      <div className="leftContainer">
        <div className="input-box">
          <input
            type="search"
            className="search-input"
            placeholder="Search user..."
            name="search-form"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="result">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((profile, index) => (
              <div className="profileContainer" key={index}>
                <img src={profile.photo} alt={profile.name} />
                <div className="colContainer">
                  <div className="name">{profile.name}</div>
                  <div className="description">{profile.description}</div>
                  <div className="address">{profile.address}</div>
                  <button onClick={() => handleMapButtonClick(profile.address)}>
                    Show on Map
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No users found</p>
          )}
        </div>
      </div>
      <div className="rightContainer">
        <MapComponent address={selectedAddress} position={mapPosition} />
      </div>
    </div>
  );
}

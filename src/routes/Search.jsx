import React, { useEffect, useState } from "react";
import "./Search.css";
import MapComponent from "../components/MapComponent";
import Popup from "../components/Popup";
import Loader from "../components/Loader";

export default function Search() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [mapPosition, setMapPosition] = useState([19.7515, 75.7139]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loader, setLoader] = useState(false);

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
    setLoader(true);
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
    setLoader(false);
  };

  const handleProfileClick = (user) => {
    setSelectedUser(user);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedUser(null);
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
                <img
                  src={profile.photo}
                  alt={profile.name}
                  onClick={() => handleProfileClick(profile)}
                />
                <div className="colContainer">
                  <div className="name">{profile.name}</div>
                  <div className="address">{profile.address}</div>
                </div>
                <button onClick={() => handleMapButtonClick(profile.address)}>
                  Summary
                </button>
              </div>
            ))
          ) : (
            <p>No users found</p>
          )}
        </div>
      </div>
      <div className="rightContainer">
        {loader ? <Loader /> : null}
        <MapComponent address={selectedAddress} position={mapPosition} />
      </div>
      <Popup isOpen={isPopupOpen} onClose={closePopup}>
        {selectedUser && (
          <div className="popup-content">
            <h2>{selectedUser.name}</h2>
            <img src={selectedUser.photo} alt={selectedUser.name} />
            <p>{selectedUser.description}</p>
            <p>{selectedUser.address}</p>
          </div>
        )}
      </Popup>
    </div>
  );
}

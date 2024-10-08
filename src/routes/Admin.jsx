import React, { useEffect, useState } from "react";
import "./Admin.css";

export default function Admin() {
  const [userData, setUserData] = useState({
    photo: "",
    name: "",
    description: "",
    address: "",
  });
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const storedUsers = localStorage.getItem("user");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  const addUser = (event) => {
    event.preventDefault();
    if (
      userData.name == "" ||
      userData.photo == "" ||
      userData.description == "" ||
      userData.address == ""
    ) {
      alert("Please fill all the details.");
      return;
    }

    let updatedUsers;
    if (editIndex !== null) {
      updatedUsers = users.map((user, index) =>
        index === editIndex ? userData : user
      );
      setEditIndex(null);
    } else {
      updatedUsers = [...users, userData];
    }
    localStorage.setItem("user", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setUserData({ photo: "", name: "", description: "", address: "" });
    alert(
      editIndex !== null
        ? "User updated successfully"
        : "User added successfully"
    );
  };

  const editUser = (index) => {
    setUserData(users[index]);
    setEditIndex(index);
  };

  const deleteUser = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    localStorage.setItem("user", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  return (
    <div className="container">
      <form className="inputUserInfo" onSubmit={addUser}>
        <input
          type="text"
          name="photo"
          value={userData.photo}
          onChange={handleChange}
          placeholder="Enter Profile URL"
        />
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
          placeholder="Enter Name"
        />
        <input
          type="text"
          name="description"
          value={userData.description}
          onChange={handleChange}
          placeholder="Enter Description"
        />
        <input
          type="text"
          name="address"
          value={userData.address}
          onChange={handleChange}
          placeholder="Enter Address"
        />
        <button type="submit">
          {editIndex !== null ? "Update User" : "Add User"}
        </button>
      </form>
      {/* <div className="users">
        {users.length > 0 ? (
          users.map((user, index) => (
            <div className="profileContainer" key={index}>
              <img src={user.photo} alt={user.name} />
              <div className="colContainer">
                <div className="name">{user.name}</div>
                <div className="address">{user.address}</div>
              </div>
              <button onClick={() => editUser(index)}>Edit</button>
              <button onClick={() => deleteUser(index)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No users added yet.</p>
        )}
      </div> */}
      <div className="users">
  {users.length > 0 ? (
    users.map((user, index) => (
      <div className="profileContainer" key={index}>
        <img src={user.photo} alt={user.name} />
        <div className="colContainer">
          <div className="name">{user.name}</div>
          <div className="address">{user.address}</div>
        </div>
        <div className="buttonsContainer">
          <button onClick={() => editUser(index)}>Edit</button>
          <button onClick={() => deleteUser(index)}>Delete</button>
        </div>
      </div>
    ))
  ) : (
    <p>No users added yet.</p>
  )}
</div>

    </div>
  );
}

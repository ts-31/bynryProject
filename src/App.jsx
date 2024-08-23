import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Search from "./routes/Search";
import Admin from "./routes/Admin";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="navBar">
        <ul className="navBarList">
          <li className="navBarItem">
            <Link to="/">Search</Link>
          </li>
          <li className="navBarItem">
            <Link to="/admin">Admin</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/Admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

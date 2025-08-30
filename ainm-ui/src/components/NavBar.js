import React from "react";
import AppTitle from "./AppTitle";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <AppTitle className="navbar-title" />
      {/* Add nav links/buttons here if you want */}
    </nav>
  );
}
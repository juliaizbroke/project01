import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

const NavigationTabs = () => {
  return (
    <Nav variant="tabs" className="mb-4">
      <Nav.Item>
        <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Dashboard
        </NavLink>
      </Nav.Item>
      <Nav.Item>
        <NavLink to="/highlightedcars" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Highlighted Cars
        </NavLink>
      </Nav.Item>
    </Nav>
  );
};

export default NavigationTabs;

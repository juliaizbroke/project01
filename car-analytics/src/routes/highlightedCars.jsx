import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import NavigationTabs from './navigation.jsx';
import carData from '../data/taladrod-cars.json'; 
import '../styles/highlightedCars.css';

const HighlightedCars = () => {
  const [highlightedCars, setHighlightedCars] = useState([]);

  useEffect(() => {
    // Load highlighted cars from localStorage on component mount
    const savedCars = JSON.parse(localStorage.getItem('highlightedCars')) || [];
    setHighlightedCars(savedCars);
  }, []);

  const highlightCar = (car) => {
    const updatedCars = [...highlightedCars, car];
    setHighlightedCars(updatedCars);
    localStorage.setItem('highlightedCars', JSON.stringify(updatedCars));
  };

  const removeHighlight = (carId) => {
    const updatedCars = highlightedCars.filter((car) => car.Cid !== carId);
    setHighlightedCars(updatedCars);
    localStorage.setItem('highlightedCars', JSON.stringify(updatedCars));
  };

  const nonHighlightedCars = carData.Cars.filter((car) => !highlightedCars.some((highlightedCar) => highlightedCar.Cid === car.Cid));

  return (
    <Container>
      <NavigationTabs />
      <h1>Highlighted Cars</h1>
      <div className="car-list">
        {highlightedCars.map((car) => (
          <div key={car.Cid} className="car">
            <img src={car.Img300} alt={car.Model} />
            <div className="car-details">
              <p>{car.NameMMT}<br/>{car.Yr}-{car.Province}<br/>{car.Prc} {car.Currency}</p>
              <Button variant="secondary" onClick={() => removeHighlight(car.Cid)}>Remove</Button>
            </div>
          </div>
        ))}
      </div>
      <hr/>
      <h1>All Cars</h1>
      <div className="car-list">
        {nonHighlightedCars.map((car) => (
          <div key={car.Cid} className="car">
            <img src={car.Img300} alt={car.Model} />
            <div className="car-details">
              <p>{car.NameMMT}<br/>{car.Yr}-{car.Province}<br/>{car.Prc} {car.Currency}</p>
              <Button onClick={() => highlightCar(car)}>Highlight</Button>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default HighlightedCars;

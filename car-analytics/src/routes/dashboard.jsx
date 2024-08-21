// src/pages/dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Table, Container, Modal, Button } from 'react-bootstrap';
import carData from '../data/taladrod-cars.min.json'; // Adjust the path as necessary
import '../styles/dashboard.css';

const Dashboard = () => {
  const [carStats, setCarStats] = useState({});
  const [selectedModel, setSelectedModel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modelDetails, setModelDetails] = useState([]);

  useEffect(() => {
    const aggregatedData = carData.Cars.reduce((acc, car) => {
      const brand = car.NameMMT.split(' ')[0]; // Extract the brand from the Model field
      const model = car.Model;

      // Convert price to number
      const price = parseInt(car.Prc.replace(/,/g, ''));

      if (!acc[brand]) {
        acc[brand] = {
          totalCount: 0,
          totalValue: 0,
          models: {}
        };
      }

      if (!acc[brand].models[model]) {
        acc[brand].models[model] = {
          count: 0,
          value: 0
        };
      }

      // Update counts and values
      acc[brand].totalCount += 1;
      acc[brand].totalValue += price;
      acc[brand].models[model].count += 1;
      acc[brand].models[model].value += price;

      return acc;
    }, {});

    setCarStats(aggregatedData);
  }, []);

  const handleModelClick = (model) => {
    const details = carData.Cars.filter(car => car.Model === model);
    setModelDetails(details);
    setSelectedModel(model);
    setShowModal(true);
  };
  
  const renderTableRows = () => {
    return Object.keys(carStats).map((brand) => (
      <React.Fragment key={brand}>
        <tr>
          <td >{brand}</td>
          <td></td>
          <td>{carStats[brand].totalCount}</td>
          <td>{carStats[brand].totalValue.toLocaleString()}</td>
        </tr>
        {Object.keys(carStats[brand].models).map((model) => (
          <tr key={model} onClick={() => handleModelClick(model)}  // Added handleModelClick for each model row
          style={{ cursor: 'pointer' }} >
            <td></td>
            <td className="pl-3">- {model}</td>
            <td>{carStats[brand].models[model].count}</td>
            <td>{carStats[brand].models[model].value.toLocaleString()}</td>
          </tr>
        ))}
      </React.Fragment>
    ));
  };
  const renderModelDetails = () => {
    return modelDetails.map((car, index) => (
      <tr key={index}>
        <td><img src={car.Img300} alt={car.Model} style={{ width: '100px', height: 'auto' }} /></td>
        <td>{car.Yr}</td>
        <td>{car.Province}</td>
        <td>{car.Status}</td>
        <td>{car.Prc}</td>
      </tr>
    ));
  };

  return (
    <Container>
      <h1 className="my-4">Car Inventory Dashboard</h1>
      <h6>Click on each of the car model for more details!</h6>
      <div className="custom-table-container">
        <Table striped bordered hover className="custom-table">
            <thead>
            <tr>
                <th>Brand</th>
                <th>Model</th>
                <th>Number of Cars</th>
                <th>Value (Baht)</th>
            </tr>
            </thead>
            <tbody>
                {renderTableRows()}
            </tbody>
        </Table>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Details for {selectedModel}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Year</th>
                <th>Province</th>
                <th>Status</th>
                <th>Price (Baht)</th>
              </tr>
            </thead>
            <tbody>
              {renderModelDetails()}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;

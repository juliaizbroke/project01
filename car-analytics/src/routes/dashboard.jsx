import React, { useState, useEffect } from 'react';
import { Table, Container, Modal, Button } from 'react-bootstrap';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import NavigationTabs from './navigation.jsx';
import carData from '../data/taladrod-cars.json';
import '../styles/dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [carStats, setCarStats] = useState({});
  const [selectedModel, setSelectedModel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modelDetails, setModelDetails] = useState([]);
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });
  const [barData, setBarData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const aggregatedData = carData.Cars.reduce((acc, car) => {
      const brand = car.NameMMT.split(' ')[0]; // Extract the brand from the NameMMT field
      const model = car.Model;

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

      acc[brand].totalCount += 1;
      acc[brand].totalValue += price;
      acc[brand].models[model].count += 1;
      acc[brand].models[model].value += price;

      return acc;
    }, {});

    setCarStats(aggregatedData);

    // Prepare Pie Chart data
    const brands = Object.keys(aggregatedData);
    const carCounts = brands.map(brand => aggregatedData[brand].totalCount);

    setPieData({
      labels: brands,
      datasets: [{
        data: carCounts,
        backgroundColor: [
          '#FF5733', '#3498DB', '#2ECC71', '#F1C40F', '#8E44AD',
          '#E67E22', '#1ABC9C', '#C70039', '#9B59B6', '#FF6384',
          '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
          '#D35400', '#7F8C8D', '#27AE60', '#2980B9', '#FFC300'
        ],
      }]
    });

    // Prepare Stacked Bar Chart data
    const barLabels = [];
    const barDatasets = [];

    brands.forEach(brand => {
      barLabels.push(brand);
      Object.keys(aggregatedData[brand].models).forEach(model => {
        const modelData = aggregatedData[brand].models[model].count;

        const existingDataset = barDatasets.find(ds => ds.label === model);
        if (existingDataset) {
          existingDataset.data.push(modelData);
        } else {
          barDatasets.push({
            label: model,
            data: brands.map(b => (aggregatedData[b]?.models[model]?.count || 0)),
            backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`
          });
        }
      });
    });

    setBarData({
      labels: barLabels,
      datasets: barDatasets
    });
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
          <td>{brand}</td>
          <td></td>
          <td>{carStats[brand].totalCount}</td>
          <td>{carStats[brand].totalValue.toLocaleString()}</td>
        </tr>
        {Object.keys(carStats[brand].models).map((model) => (
          <tr key={model} onClick={() => handleModelClick(model)} style={{ cursor: 'pointer' }}>
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
      <NavigationTabs />
      <h1 className="my-4">Car Inventory Dashboard</h1>
      <h6>Click on each of the car model for more details!</h6>

      <div className="d-flex">
        {/* Table Section */}
        <div className="custom-table-container flex-grow-1 me-3">
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

        {/* Charts Section */}
        <div className="charts-container" style={{ width: '50%' }}>
          {pieData.labels.length > 0 && (
            <>
              <h5>Cars by Brand</h5>
              <Pie data={pieData} />
            </>
          )}
        </div>
      </div>
        <div>
          {barData.labels.length > 0 && (
            <>
              <h5 className="mt-4">Car Models Distribution</h5>
              <Bar data={barData} options={{ scales: { x: { stacked: true }, y: { stacked: true } } }} />
            </>
          )}
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

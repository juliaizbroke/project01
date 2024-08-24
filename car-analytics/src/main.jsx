import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Dashboard from "./routes/dashboard";
import HighlightedCars from "./routes/highlightedCars";
import 'bootstrap/dist/css/bootstrap.min.css'; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/highlightedcars",
    element: <HighlightedCars />,
  }
],
{
  basename : "/project01/car-analytics/",
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = {router}/>
  </React.StrictMode>,
)

"use client";
import "./App.css";
import Form from "./components/Form.jsx";
import PoiMarkers from "./components/PoiMarkers.jsx";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { useState } from "react";
import {BrowserRouter as Router, Routes, Route, Link, Outlet} from "react-router-dom";
// import { Link } from "react-router-dom"; // Import Link for navigation

function App() {
  const locations = useQuery(api.tasks.get);
  console.log(locations);
  const position = { lat: 49.282756, lng: -123.120774 };
  const [open, setOpen] = useState(false);

  // Access environment variables using import.meta.env
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const googleMapsId = import.meta.env.VITE_GOOGLE_MAPS_ID;

  const addReport = useMutation(api.mutate.createTask);

  const [viewState, setViewState] = useState({
    longitude: -123,
    latitude: 49,
    zoom: 13.5
  });

  return (

    <div className="App">
      {/* <Form></Form> */}
      <header>
        <h1>DeSharp</h1>
        <h3>
          Report any needles you've spotted in Vancouver and we'll send our folks to clean them
          up!
        </h3>
      </header>

      <section className="form-link">
        <h2>
          Find another needle not on this map?{" "}
        </h2>
      </section>

      <section className="map-container">
        <APIProvider apiKey={googleMapsApiKey}>
          <div style={{ height: "90vh", width: "60%" }}>
            <Map
              defaultCenter={position}
              defaultZoom={13}
              mapId={googleMapsId}
              {...viewState}
              onMove={evt => setViewState(evt.viewState)}
              onZoomChanged={evt => setViewState(evt.viewState)}
            >
              <PoiMarkers pois={locations} />

              {open && (
                <InfoWindow position={position} onCloseClick={() => setOpen(false)}>
                  <p>Test</p>
                </InfoWindow>
              )}
            </Map>
              <div className="form">
                <Router>
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route path="/form" element={<Form />} />
                    </Route>
                  </Routes>
                </Router>
                <h2>Help us DeSharp the city!</h2>

                <Form></Form>
              </div>
          </div>
        </APIProvider>
      </section>
    </div>

    
  );
};

function Layout() {
  return (
    <div>
      {}
      <nav>
        <ul>
          <li>
            <Link to="/form">Add a Pin</Link>
          </li>
        </ul>
      </nav>
      <hr />
      {}
      <Outlet />
    </div>
  );
}
export default App;

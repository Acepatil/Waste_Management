/* eslint-disable react/prop-types */

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useTask } from "../context/TaskContext"; // Adjust the import path as needed
import useGeolocation from "../hooks/useGeolocation";
import "leaflet/dist/leaflet.css";
import "../styles/Map.css";
import L from "leaflet";
import { useEffect } from "react";

// Define custom icons
const pendingIcon = new L.Icon({
  iconUrl: "delete.png", // Replace with the path to your pending icon image
  iconSize: [25, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const completedIcon = new L.Icon({
  iconUrl: "checkmark.png", // Replace with the path to your completed icon image
  iconSize: [25, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const InMap = () => {
  const { allcomplaints, mapCenter,completed,pending, dispatch } = useTask();

  const {
    isLoading: isLoadingPostion,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();

  function SetViewOnClick({ coords }) {
    const map = useMap();
    map.setView(coords, 13);
    return null;
  }

  function handleMarker(lat, lng) {
    if (lat == null || lng == null) return;
    console.log(lat, lng);
    dispatch({ type: "map/setCenter", payload: [lat, lng] });
    dispatch({ type: "map/yourCenter", payload: [lat, lng] });

  }

  useEffect(
    () => handleMarker(geoLocationPosition?.lat, geoLocationPosition?.lng),
    [geoLocationPosition]
  );

  return (
    <div className="map-container">
      {!geoLocationPosition && (
        <button className="map-button" onClick={() => getPosition()}>
          {isLoadingPostion ? "Loading.." : "Use Your Position"}
        </button>
      )}
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {allcomplaints.map((location) => (
          <Marker
            key={location.task_id}
            position={[location.lat, location.lng]}
            icon={location.status === "completed" ? completedIcon : pendingIcon}
            eventHandlers={{
              click: () => handleMarker(location.lat, location.lng),
            }}
          >
            <Popup closeOnClick={true}>{location.description}</Popup>
          </Marker>
        ))}
        {pending.map((location) => (
          <Marker
            key={location.task_id}
            position={[location.lat, location.lng]}
            icon={location.status === "completed" ? completedIcon : pendingIcon}
            eventHandlers={{
              click: () => handleMarker(location.lat, location.lng),
            }}
          >
            <Popup closeOnClick={true}>{location.description}</Popup>
          </Marker>
        ))}
        {completed.map((location) => (
          <Marker
            key={location.task_id}
            position={[location.lat, location.lng]}
            icon={location.status === "completed" ? completedIcon : pendingIcon}
            eventHandlers={{
              click: () => handleMarker(location.lat, location.lng),
            }}
          >
            <Popup closeOnClick={true}>{location.description}</Popup>
          </Marker>
        ))}
        <SetViewOnClick coords={mapCenter} />
      </MapContainer>
    </div>
  );
};

export default InMap;

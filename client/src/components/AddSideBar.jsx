/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useTask } from "../context/TaskContext"; // Adjust the import path as needed
import "../styles/SideBar.css";
import { useNavigate } from "react-router";
import { backURL } from "../config";
import Loader from "../utils/Loader";

const AddSideBar = ({username}) => {
  const { yourCenter, dispatch } = useTask();
  const [loading,setLoading]=useState(false)
  const [newLocation, setNewLocation] = useState({
    id: null,
    lat: yourCenter[0],
    lng: yourCenter[1],
    description: "",
    photo: null,
    status: "",
    username:username
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setNewLocation((prevLocation) => ({
      ...prevLocation,
      lat: yourCenter[0],
      lng: yourCenter[1],
    }));
  }, [yourCenter]);

  const handleFileChange = (e) => {
    const files = e.target.files[0];
    if (files) {
      const fileType = files.type;
      if (fileType === "image/jpeg" || fileType === "image/png") {
        setError("");
        setNewLocation({ ...newLocation, photo: files, status: "pending" });
      } else {
        //
        setError("Invalid file type. Please select a JPG or PNG file.");
      }
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    
    // Check if latitude and longitude are provided
    if (newLocation.lat === null || newLocation.lng === null) {
      setError("No location provided");
      return;
    }
  
    // Check if description is provided
    if (!newLocation.description.trim()) {
      setError("Description is required");
      return;
    }
  
    // Check if photo is provided
    if (!newLocation.photo) {
      setError("Photo is required");
      return;
    }
    setLoading(true)
    const formData = new FormData();
    formData.append("lat", newLocation.lat);
    formData.append("lng", newLocation.lng);
    formData.append("description", newLocation.description);
    formData.append("file", newLocation.photo);
    formData.append("status", newLocation.status);
    formData.append("username", "Ace");
    
    try {
      const res = await fetch(`${backURL}/add_complaint`, {
        method: "POST",
        body: formData
      });
  
      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Failed to Fetch: ${errorMessage}`);
      }
  
      dispatch({ type: "waste/add", payload: newLocation });
      setNewLocation({
        lat: yourCenter[0],
        lng: yourCenter[1],
        description: "",
        photo: null,
        status: "", // Add this line to reset status if needed
      });
      navigate("/home");
    } catch (error) {
      setError(error.message || "Error adding location");
    }
    finally{
      setLoading(false)
    }
  };
  

  if(loading) return <Loader/>
  return (
    <div className="sidebar">
      <div className="locations-list">
        <ul>
            <input
              className="text-input"
              type="text"
              name="description"
              placeholder="Description"
              value={newLocation.description}
              onChange={(e) =>
                setNewLocation({ ...newLocation, description: e.target.value })
              }
            />
            <input type="file" name="photo" onChange={handleFileChange} />
            {error && (
              <div className="error">
                {error}
              </div>
            )}
            <div className="button-container">
              <button className="button" onClick={handleAddLocation}>
                Add Complaint
              </button>
            </div>
        </ul>
      </div>
    </div>
  );
};

export default AddSideBar;

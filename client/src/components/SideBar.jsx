/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';  // Adjust the import path as needed
import '../styles/SideBar.css';
import { useNavigate } from 'react-router';
import axios from 'axios';

const SideBar = ({ isPending, isCompleted, isAdd, isActive }) => {
    const { pending, completed,allcomplaints ,yourCenter, dispatch } = useTask();
    const [newLocation, setNewLocation] = useState({ id:null,lat: yourCenter[0], lng: yourCenter[1], description: '', photo: null,status:"" });
    const [error,setError]=useState("")
    const navigate=useNavigate();
    const [complaints, setComplaints] = useState([]);
    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await fetch('http://localhost:8080/get_all_images');
                const data=await response.json()
                console.log(data)
                dispatch({"type":"waste/listadd","payload":data})
            } catch (error) {
                setError(error.response ? error.response.data : 'Error fetching complaints');
            }
        };
        fetchComplaints();
    }, [dispatch]);


    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await fetch('http://localhost:8080/get_all_images/pend');
                const data=await response.json()
                console.log(data)
                dispatch({"type":"waste/listpend","payload":data})
            } catch (error) {
                setError(error.response ? error.response.data : 'Error fetching complaints');
            }
        };
        fetchComplaints();
    }, [dispatch]);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await fetch('http://localhost:8080/get_all_images/comp');
                const data=await response.json()
                console.log(data)
                dispatch({"type":"waste/listcomp","payload":data})
            } catch (error) {
                setError(error.response ? error.response.data : 'Error fetching complaints');
            }
        };
        fetchComplaints();
    }, [dispatch]);

    useEffect(() => {
        setNewLocation(prevLocation => ({
            ...prevLocation,
            lat: yourCenter[0],
            lng: yourCenter[1]
        }));
    }, [yourCenter]);

    const handleLocationClick = (lat, lng) => {
        dispatch({ type: 'map/setCenter', payload: [lat, lng] });
    };

    const handleFileChange = (e) => {
        const files=e.target.files[0]
        if (files) {
            const fileType = files.type;
            if (fileType === 'image/jpeg' || fileType === 'image/png') {
                setError("");
            setNewLocation({ ...newLocation, photo: files ,status:"pending"});
            } else {
                // 
                setError('Invalid file type. Please select a JPG or PNG file.')
            }
        }
        
    };

    const handleAddLocation = async (e) => {
        e.preventDefault()
        if (newLocation.lat === null || newLocation.lng === null) {
            console.log("No location provided")
            return;
        }

        const formData=new FormData()
        formData.append('lat', newLocation.lat);
        formData.append('lng', newLocation.lng);
        formData.append('description', newLocation.description);
        formData.append('file', newLocation.photo);
        formData.append('status', newLocation.status);
        formData.append('username','Ace');

        try {
            const res = await axios.post('http://127.0.0.1:8080/add_complaint', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Response:', res.data);
            setNewLocation({ id: null, lat: yourCenter[0], lng: yourCenter[1], description: '', photo: null, status: "" });
            navigate("/home");
        } catch (error) {
            console.error('Error adding location:', error);
        }
        dispatch({ type: 'waste/add', payload: newLocation });
        console.log('New location added:', newLocation);
    
        setNewLocation({ lat: yourCenter[0], lng: yourCenter[1], description: '', photo: null });
        navigate("/home")
    };

    const truncateDescription = (description, wordLimit) => {
        const words = description.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return description;
    };

    return (
        <div className="sidebar">
            {isActive && (
                <div className="info-box">
                    <h2>Waste Segregation Issues</h2>
                    <p>
                        Waste segregation is a significant issue in society. Proper segregation of waste helps in effective recycling and reduces the burden on landfills.
                        However, lack of awareness and improper disposal methods continue to pose challenges. It is crucial to educate communities about the importance of 
                        separating waste into categories such as organic, recyclable, and hazardous.
                    </p>
                </div>
            )}
            <div className="locations-list">
                <h3>Reported Waste Locations</h3>
                <ul>
                    {isAdd && (
                        <>
                            <input
                                className="text-input"
                                type="text"
                                name="description"
                                placeholder="Description"
                                value={newLocation.description}
                                onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
                            />
                            <input
                                type="file"
                                name="photo"
                                onChange={handleFileChange}
                            />
                            {error &&<div className="error">
                    <>{error}</>
                </div>}
                            <div className="button-container">
                                <button className="button" onClick={handleAddLocation}>Add Complaint</button>
                            </div>
                        </>
                    )}
                    {isActive && allcomplaints.map((location) => (
                        <li key={location.task_id} onClick={() => handleLocationClick(location.lat, location.lng)}>
                            <img src={location.photo_url} alt="Location" />
                            <p>{truncateDescription(location.description, 10)}</p>
                            {location.status==="pending"?<img src="delete.png" alt='Pending'/>:<img src="checkmark.png" alt="Done" />}
                        </li>
                    ))}
                    {isPending && pending.map((location) => (
                        <li key={location.id} onClick={() => handleLocationClick(location.lat, location.lng)}>
                            <img src={location.photo_url || 'default-image.png'} alt="Location" />
                            <p>{truncateDescription(location.description, 10)}</p>
                            <img src="delete.png" alt="Pending" />
                        </li>
                    ))}
                    {isCompleted && completed.map((location) => (
                        <li key={location.id} onClick={() => handleLocationClick(location.lat, location.lng)}>
                            <img src={location.photo_url || 'default-image.png'} alt="Location" />
                            <p>{truncateDescription(location.description, 10)}</p>
                            <img src="checkmark.png" alt="Done" />
                        </li>
                    ))}
                
                </ul>
            </div>
        </div>
    );
};

export default SideBar;

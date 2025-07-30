/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';  // Adjust the import path as needed
import '../styles/SideBar.css';
import Loader from '../utils/Loader';
import Error from '../utils/Error';
import { backURL } from '../config';

const ActiveSideBar = () => {
    const { allcomplaints , dispatch,handleLocationClick } = useTask();
    const [error,setError]=useState("")
    const [isLoading,setLoading]=useState(false)
    useEffect(() => {
        setLoading(true)
        const fetchComplaints = async () => {
            try {
                const response = await fetch(`${backURL}/get_all_images`);
                const data = await response.json();
                if(response.status==203){
                    setError(data.message||"Error fetching complaints")
                    return
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                dispatch({ "type": "waste/listadd", "payload": data });
            } catch (error) {
                // Handle network errors and HTTP errors
                setError(error.message || 'Error fetching complaints');
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, [dispatch]);

    const truncateDescription = (description, wordLimit) => {
        const words = description.split(' ');
        if (words.length > wordLimit) {
            return words.slice(0, wordLimit).join(' ') + '...';
        }
        return description;
    };

    if(isLoading) return(
        <Loader/>
    )
    if(error) return(
        <Error>{error} </Error>
    )
    return (
        <div className="sidebar">
                <div className="info-box">
                    <h2>Waste Segregation Issues</h2>
                    <p>
                        Waste segregation is a significant issue in society. Proper segregation of waste helps in effective recycling and reduces the burden on landfills.
                        However, lack of awareness and improper disposal methods continue to pose challenges. It is crucial to educate communities about the importance of 
                        separating waste into categories such as organic, recyclable, and hazardous.
                    </p>
                </div>
            <div className="locations-list">
                <h3>Reported Waste Locations</h3>
                <ul>
                    {allcomplaints.map((location) => (
                        <li key={location.task_id} onClick={() => handleLocationClick(location.lat, location.lng)}>
                            <img src={location.photo_url} alt="Location" />
                            <p>{truncateDescription(location.description, 10)}</p>
                            {location.status==="pending"?<img src="delete.png" alt='Pending'/>:<img src="checkmark.png" alt="Done" />}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ActiveSideBar;

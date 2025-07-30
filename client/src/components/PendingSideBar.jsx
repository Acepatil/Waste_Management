/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';  // Adjust the import path as needed
import '../styles/SideBar.css';
import Error from '../utils/Error';
import Loader from '../utils/Loader';
import { useUser } from '../context/UserContext';
import { backURL } from '../config';

const PendingSideBar = () => {
    const { pending,handleLocationClick, dispatch } = useTask();
    const {isLogged,isUser}=useUser();
    const [error,setError]=useState("")
    const [loading,setLoading]=useState(false)


    useEffect(() => {
        const fetchComplaints = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${backURL}/get_all_images/pend`);
                const data = await response.json();
                if(response.status==203){
                    setError(data.message||"Error fetching complaints")
                    return
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                dispatch({ "type": "waste/listpend", "payload": data });
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

    const handleClick=(id)=>{
        console.log(id)
        const fetchComplaints = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${backURL}/updatecomp`,{
                    method:"POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body:JSON.stringify({id})
                });
                const data = await response.json();
                if(response.status==203){
                    setError(data.message||"Error fetching complaints")
                    return
                }
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                dispatch({ "type": "waste/update/pend", "payload":id });
            } catch (error) {
                setError(error.message || 'Error fetching complaints');
            } finally {
                setLoading(false);
            }
        }
        fetchComplaints();
    }

    if(error) return <Error>{error}</Error>

    if(loading) return <Loader/>

    return (
        <div className="sidebar">
            <div className="locations-list">
                <h3>Reported Waste Locations</h3>
                <ul>
                    { pending.map((location) => (
                        <li key={location.task_id} onClick={() => handleLocationClick(location.lat, location.lng)}>
                            <img src={location.photo_url || 'default-image.png'} alt="Location" />
                            <p>{truncateDescription(location.description, 10)}</p>
                            {(isLogged && !isUser) ?
                            (<button onClick={()=>handleClick(location.task_id)}className='buttonu'>
                                Shift</button>):<img src="/delete.png" alt="Pending" />}
                        </li>
                    ))}
                
                </ul>
            </div>
        </div>
    );
};

export default PendingSideBar;

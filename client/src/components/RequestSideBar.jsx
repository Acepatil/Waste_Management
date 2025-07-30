/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';  // Adjust the import path as needed
import '../styles/SideBar.css';
import Error from '../utils/Error';
import Loader from '../utils/Loader';
import { backURL } from '../config';

const RequestSideBar = () => {
    const { dispatch } = useTask();
    const [error, setError] = useState("");
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(false);
    

    useEffect(() => {
        const fetchComplaints = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${backURL}/get_requests`);
                const data = await response.json();
                if(response.status==203){
                    setError(data.message||"Error fetching complaints")
                    return
                }
                if (!response.ok) {
                    setError(data.message || `HTTP error! Status: ${response.status}`);
                    return;
                }
                setPending(data);
            } catch (error) {
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

    const handleClick = async (username) => {
        setLoading(true)
        try {
            const response = await fetch(`${backURL}/validate/admin`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });
            const data = await response.json();
            if(response.status==203){
                setError(data.message||"Error fetching complaints")
                return
            }
            if (!response.ok) {
                throw new Error(data.message || 'Error validating admin');
            }
            setPending(prevPending => prevPending.filter(item => item.username !== username));
        } catch (error) {
            setError(error.message || 'Error validating admin');
        }
        finally{
            setLoading(false)
        }
    };

    if (error) return <Error>{error}</Error>;
    if (loading) return <Loader />;


    return (
        <div className="sidebar">
            <div className="request-list">
                <h3>Requests For Admin </h3>
                <ul>
                    {pending.map((location) => (
                        <li key={location.username} >
                            <div>
                            <span><b>{location.username}</b></span>
                            <p>{truncateDescription(location.reason, 150)}</p>
                            </div>
                            <img onClick={() => handleClick(location.username)} src="/checkmark.png" alt="Done" />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RequestSideBar;

/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setAccessToken(token);

        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    return accessToken ? children : null; // Return children if access_token is present
}

export default ProtectedRoute;

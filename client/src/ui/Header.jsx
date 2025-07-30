import { useNavigate } from "react-router";
import "../styles/header.css"; // Import your CSS file
import { useUser } from "../context/UserContext";

function Header() {
    const navigate = useNavigate();
    const {isLogged,isUser,dispatch}=useUser()

    function handleClick(route) {
        navigate(route);
    }


    function handleLogOut(){
        localStorage.removeItem("token"); // Delete the token from local storage
        dispatch({type:"logout"})
        navigate("/login"); // Redirect to login page
    }

    return (
        <header className="header">
            <div className="head" style={{cursor:"pointer"}}onClick={()=>handleClick("/home")}>
                Waste Reporter 
            </div>

            <div className="head buttons">
            {isLogged && !isUser && 
                <button className="buttonu" onClick={()=>handleClick("/pending/admin")}>Pending Admin Request</button>} 
                <button className="buttonu" onClick={() => handleClick("/add")}>Add Complaint</button>
                <button className="buttonu" onClick={() => handleClick("/completed")}>Resloved Complaints</button>
                <button className="buttonu"onClick={() => handleClick("/pending")}>Pending Complaints</button>
                <button className="buttonu"onClick={()=>handleLogOut()}>{isLogged?"Logout":"Login"}</button>
            </div>
        </header>
    );
}

export default Header;

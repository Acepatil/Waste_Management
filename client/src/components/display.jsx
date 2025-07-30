import { useNavigate } from "react-router";
import "../styles/display.scss";
import Button from "./button";

function Display() {

  const navigate=useNavigate()
  function handleClick(){
    navigate("/")
  }
  return (
    <>
    <h1 className="nav">404 Not found</h1>
    <div className="display">
      <div className="display__img">
        <img src="/Scarecrow.png" alt="404-Scarecrow" />
      </div>
      <div className="display__content">
        <h2 className="display__content--info">I have bad news for you</h2>
        <p className="display__content--text">
          The page you are looking for might be removed or is temporarily
          unavailable
        </p>
        <Button className="btn" onClick={handleClick}>Back to homepage</Button>
      </div>
    </div>
    </>
  );
}

export default Display;

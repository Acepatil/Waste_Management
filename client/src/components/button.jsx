/* eslint-disable react/prop-types */
import "../styles/button.scss";

function Button({onClick,children}) {
  return <button className="btn" onClick={onClick}>{children}</button>;
}

export default Button;

/* eslint-disable react/prop-types */
import "../styles/SideBar.css"
function Error({children}) {
    return (
        <div className="sidebar-loader">
            <div className="error-class">
            {children}

            </div>
        </div>
    )
}

export default Error

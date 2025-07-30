import "../styles/SideBar.css"
import {ColorRing}from "react-loader-spinner"
function Loader() {
    return (
        <div className="sidebar-loader">
            <div className="loader-center">

        <ColorRing
        visible={true}
        height="100"
        width="250"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={['#454545']}
        />
        </div>
        </div>
    )
}

export default Loader

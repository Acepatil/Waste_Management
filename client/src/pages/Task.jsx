import { Outlet, useNavigate } from "react-router"

function Task() {
    const navigate=useNavigate()
    function handleClick(){
        navigate("add")
    }

    return (
        <div>
            <button onClick={handleClick}></button>
            <Outlet/>
        </div>
    )
}

export default Task

import {Navigate, Outlet} from "react-router-dom";


const PrivateRoutes = () => {
    const isAuthenticated = localStorage.getItem("accessToken") !== null;
    console.log(localStorage.getItem("accessToken"))
    console.log(isAuthenticated);
    return (
        isAuthenticated ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoutes
import {useNavigate} from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="custom-navbar">
            <button className="nav-link" onClick={() => navigate("/")}>Home</button>
            <button className="nav-link" onClick={() => navigate("../chat")}>Chat</button>
            <button className="nav-link" onClick={() => navigate("../notes")}>Notes</button>
        </nav>


    );
};

export default Navbar;

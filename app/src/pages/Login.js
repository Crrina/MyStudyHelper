import Navbar from "../components/Navbar";
import "../style/login.css"
import DetailsBox from "../components/DetailsBox";


export default function Login({apiUrl}) {
    let display = true;
    return (<div>
        <Navbar></Navbar>
        <DetailsBox display={display} func={"Login"} apiUrl={apiUrl}></DetailsBox>
    </div>);

}
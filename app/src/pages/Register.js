import Navbar from "../components/Navbar";
import DetailsBox from "../components/DetailsBox";

export default function Register({apiUrl}) {
    let display = false;
    return (<div>
        <Navbar></Navbar>
        <DetailsBox display={display} func={"Register"} apiUrl={apiUrl}></DetailsBox>
    </div>);

}
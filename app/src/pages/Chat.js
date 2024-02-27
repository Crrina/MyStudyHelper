import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";
import '../style/chatbox.css'; // Link to your new CSS file

export default function Chat({apiUrl}) {
    return <div>
        <Navbar></Navbar>
        <ChatBox apiUrl={apiUrl}></ChatBox>
    </div>

}
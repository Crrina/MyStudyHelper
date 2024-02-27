import Navbar from "../components/Navbar";
import NoteBox from "../components/NoteBox";
import "../style/note.css"

export default function Notes({apiUrl}) {
    return (<div>
        <Navbar></Navbar>
        <NoteBox apiUrl={apiUrl}></NoteBox>
    </div>);


}
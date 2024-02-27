import "bootstrap/dist/css/bootstrap.css"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Notes from "./pages/Notes";
import NoPage from "./pages/NoPage";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoutes";


function App() {
    const API_URL = "http://localhost:8080"
    return (
      <BrowserRouter>
          <Routes>
              <Route index element={<Home/>}></Route>
              <Route path="/home" element={<Home/>}></Route>
              <Route path="/login" element={<Login apiUrl={API_URL}/>}></Route>
              <Route element={<PrivateRoutes/>}>
                  <Route path="/notes" element={<Notes apiUrl={API_URL}/>}/>
              </Route>
              <Route path="/chat" element={<Chat apiUrl={API_URL}/>}></Route>
              <Route path="/login/register" element={<Register apiUrl={API_URL}/>}></Route>
              {/*Catch all route for Not Found */}
              <Route path="*" element={<NoPage/>}></Route>
          </Routes>
      </BrowserRouter>
  );
}

export default App;














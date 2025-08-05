import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import { Route , Routes , Navigate } from 'react-router-dom';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to = "/login"/>}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/home" element={<Home />}></Route>
      </Routes>
    </>
  );
}

export default App;

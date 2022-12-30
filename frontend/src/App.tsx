import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FullAppBar from "./components/FullAppBar";

import Home from "./components/Home";
import User_UI from "./components/user/User_UI"

export default function App() {
  // const [token, setToken] = React.useState<String>("");

  // React.useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     setToken(token);
  //   }
  // }, []);

  // if (!token) {
  //   return <SignIn />;
  // }

  return (
  <Router>
    <div>
      <FullAppBar />
      <Routes>
        <Route path="/" element={<Home/>} /> {/** home */}
        {/** <Route path="/" element={<Home/>} /> {/** home */}
        <Route path="/user_store_setting" element={<User_UI/>} /> {/** user & store setting */}
      </Routes>
    </div>
  </Router>
  );
}
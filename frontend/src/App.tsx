import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FullAppBar from "./components/FullAppBar";

import Home from "./components/Home";

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
      </Routes>
    </div>
  </Router>
  );
}
import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Basket_List from "./components/basket/Basket_UI_List";
import FullAppBar from "./components/FullAppBar";

import Home from "./components/Home";
import User_UI from "./components/user/User_UI"
import Game_UI from "./components/game/Game_UI"

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
        <Route path="/user_store_setting" element={<User_UI/>} /> {/** user & store setting */}
        <Route path="/sell_game" element={<Game_UI/>} /> {/** aadadadad */}
        <Route path="/basket_list" element={<Basket_List/>} />
      </Routes>
    </div>
  </Router>
  );
}
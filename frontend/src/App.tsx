import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Basket_List from "./components/basket/Basket_UI_List";
import FullAppBar from "./components/FullAppBar";

import Home_Admin from "./components/Home_Admin";
import Home_User from "./components/Home_User";

// User import
import User_UI from "./components/user/User_UI"
import User_Profile_UI from "./components/user/User_Profile_UI";
import Store_Profile_UI from "./components/user/Store_Profile_UI";
import Game_UI from "./components/game/Game_UI"
import Game_List from "./components/game/Game_List"
import Basket_Add from "./components/basket/Basket_UI_Add_demo";
import SignIn_User from "./components/SignIn_User_UI";
import Individual_game_UI from "./components/Individual_game_UI";
import Dashboard from "./components/Dashboard";

// Admin import
import Banner_UI from "./components/banner/Banner_UI";

export default function App() {
  const [token, setToken] = React.useState<String>("");

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  if (!token) {
    return <SignIn_User />;
  }

  function routeList() {
    if(localStorage.getItem("position") == "Admin"){
      return( // Admin Routes
        <Routes>
          <Route path="/" element={<Home_Admin/>} /> {/** home */}
          <Route path="/banner" element={<Banner_UI/>} /> {/** banner */}
        </Routes>
      );
    }else{ // User Routes
      return(
        <Routes>
          <Route path="/" element={<Home_User/>} /> {/** home */}
          <Route path="/dashboard" element={<Dashboard/>} /> {/** Dashboard */}
          <Route path="/user_store_setting" element={<User_UI/>} /> {/** user & store setting */}
          <Route path="/user_profile/:email" element={<User_Profile_UI/>} /> {/** user profile */}
          <Route path="/store_profile/:email" element={<Store_Profile_UI/>} /> {/** store profile */}
          <Route path="/sell_game" element={<Game_UI/>} /> {/**sell game */}
          <Route path="/game_list" element={<Game_List/>} /> {/** list game */}
          <Route path="/individual_game/:id" element={<Individual_game_UI/>} /> {/** individual game */}
          <Route path="/basket_list" element={<Basket_List/>} />
        </Routes>
      );
    }
  }

  return (
  <Router>
    <div>
      <FullAppBar />
      {routeList()}
    </div>
  </Router>
  );
}
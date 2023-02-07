import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FullAppBar from "./components/FullAppBar";

import Home_Admin from "./components/Home_Admin";
import Home_User from "./components/Home_User";

// User import
import User_UI from "./components/user/User_UI"
import Admin_UI from "./components/admin/Admin_UI"
import User_Profile_UI from "./components/user/User_Profile_UI";
import Store_Profile_UI from "./components/user/Store_Profile_UI";
import Game_UI from "./components/game/Game_UI"
import Game_List from "./components/game/Game_List"
import SignIn_User from "./components/SignIn_User_UI";
import Individual_game_UI from "./components/Individual_game_UI";
import Basket_List from "./components/basket/Basket_UI_List";
import Friend_UI from "./components/friend/Friend_UI";
import Hided_Friend_UI from "./components/friend/Hided_Friend_UI";
import Dashboard from "./components/Dashboard";
import Collection_UI from "./components/storage/Collection_UI";
import Storage_UI from "./components/storage/Storage_UI";
import Order_UI from "./components/order/Order_UI";
import Wishlist_UI from "./components/wishlist/Wishlist_UI";
import Review_UI from "./components/review/Review_UI";


// Admin import
import Banner_UI from "./components/banner/Banner_UI";
import Admin from "./components/admin/Admin_UI";
import Topgame_UI from "./components/topgame/Topgame_UI";
import Admin_list from "./components/admin/Admin_list";
import PaymentVer_UI from "./components/payment_verification/PaymentVer_UI";
import PaymentVerTable_UI from "./components/payment_verification/PaymentVerTable_UI";

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
          <Route path="/payment_ver" element={<PaymentVer_UI/>} /> {/** payment verification */}
          <Route path="/payment_ver_table" element={<PaymentVerTable_UI/>} /> {/** payment verification */}
          <Route path="/topgames" element={<Topgame_UI/>} /> {/** Topgame*/}
          <Route path="/admin_list" element = {<Admin_list/>}/> {/*Admin*/}
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
          <Route path="/game_list" element={<Game_List/>} /> {/** list game */}
          <Route path="/individual_game/:id" element={<Individual_game_UI/>} /> {/** individual game */}
          <Route path="/my_basket" element={<Basket_List/>} /> {/** basket */}
          <Route path="/my_order" element={<Order_UI/>} /> {/** order */}
          <Route path="/my_friend" element={<Friend_UI/>} /> {/** friend */}
          <Route path="/my_hided_friend" element={<Hided_Friend_UI/>} /> {/** hide friend */}
          <Route path="/my_order" element={<Order_UI/>} /> {/** order */}
          <Route path="/collection" element={<Collection_UI/>} /> {/** collection*/}
          <Route path="/storage" element={<Storage_UI/>} /> {/** storage*/}
          <Route path="/wishlist" element={<Wishlist_UI/>} /> {/** Wishlist*/}
          <Route path="/review" element={<Review_UI/>} /> {/** review*/}

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
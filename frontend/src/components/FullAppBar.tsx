import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import { makeStyles } from "@material-ui/core/styles";

// User Icon
import SellIcon from '@mui/icons-material/Sell';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import GamesIcon from '@mui/icons-material/Games';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import PaidIcon from '@mui/icons-material/Paid';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

// Admin Icon
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';

import { Link as RouterLink } from "react-router-dom";
import { UsersInterface } from '../models/user/IUser';

const useStyles = makeStyles({
  drawer: {
    width: 150
  },
  Icon: { // Set all icon to black
    backgroundColor: "black"
  },
});

function FullAppBar() {
  const [user, setUser] = React.useState<Partial<UsersInterface>>({});
  
  const signout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  function drawerList() {
    function gameMarketList(){
      if(user.Is_Seller){
        return(
          <ListItem button component={RouterLink} to="/game_list">
            <SellIcon/>         
            <ListItemText primary="Game Market" sx={{paddingLeft:1}}/>
          </ListItem>
        );
      }
    }
    if(localStorage.getItem("position") == "Admin"){
      return( // Admin Drawer
        <List className={classes.drawer} sx={{width:"100%"}}>
          <ListItem button component={RouterLink} to="/">
            <HomeIcon/>
            <ListItemText primary="FirstPage" sx={{paddingLeft:1}}/>
          </ListItem>

          <ListItem button component={RouterLink} to="/banner">
            <ViewCarouselIcon/>
            <ListItemText primary="Banner" sx={{paddingLeft:1}}/>
          </ListItem>

          <ListItem button component={RouterLink} to="/admin_list">
            <PriceCheckIcon/>
            <ListItemText primary="Admin Modify" sx={{paddingLeft:1}}/>
          </ListItem>
        </List>
      );
    }else{ // User Drawer
      return(
        <List className={classes.drawer} sx={{width:"100%"}}>

          <ListItem button component={RouterLink} to="/">
            <HomeIcon/>
            <ListItemText primary="FirstPage" sx={{paddingLeft:1}}/>
          </ListItem>

          <ListItem button component={RouterLink} to="/dashboard">
            <DashboardIcon/>
            <ListItemText primary="Dashboard" sx={{paddingLeft:1}}/>
          </ListItem>

          {gameMarketList()} {/** หากเป็น seller จะshow */}

          <ListItem button component={RouterLink} to="/my_basket">
            <ShoppingBasketIcon/>
            <ListItemText primary="My Basket" sx={{paddingLeft:1}}/>
          </ListItem>

          <ListItem button component={RouterLink} to="/my_order">
            <PaidIcon/>
            <ListItemText primary="My Order" sx={{paddingLeft:1}}/>
          </ListItem>

          <ListItem button component={RouterLink} to="/my_friend">
            <PeopleIcon/>
            <ListItemText primary="My Friend" sx={{paddingLeft:1}}/>
          </ListItem>

          <ListItem button component={RouterLink} to="/storage">
            <FeaturedPlayListIcon/>
            <ListItemText primary="Storage" sx={{paddingLeft:1}}/>
          </ListItem>

          <ListItem button component={RouterLink} to="/wishlist">
            <BookmarkIcon/>
            <ListItemText primary="Wishlist" sx={{paddingLeft:1}}/>
          </ListItem>

          <ListItem button component={RouterLink} to="/user_store_setting">
            <SettingsIcon/>
            <ListItemText primary="User & Store Setting" sx={{paddingLeft:1}}/>
          </ListItem>

        </List>
      );
    }
  }

  function myStoreMenuItem() {
    if(user.Is_Seller){
      return(
        <MenuItem onClick={handleClose} component={RouterLink} to={"/store_profile/"+localStorage.getItem("email")} >My Store</MenuItem>
      );
    }
  }

  const [auth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const classes = useStyles();

  const getUser = async () => {
    const apiUrl = "http://localhost:8080/user/"+localStorage.getItem("email");
    const requestOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
    };
   
    await fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                setUser(res.data);
            }
        });
  };

  React.useEffect(() => {
    const fetchData = async () => {
        await getUser();
    }
    fetchData();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>

      <AppBar position="static" sx ={{ background : "#212121"}}>    
        <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => setIsDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>

          <GamesIcon sx={{ fontSize: 150, margin: 1, padding: 2 }} />
          {/** List of Drawer Divided by position */}
          {drawerList()}

        </Drawer>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Game Store
          </Typography>

          {auth && (                                                                               /* รูป Icon Profild */
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
              <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose} component={RouterLink} to={"/user_profile/"+localStorage.getItem("email")} >My Profile</MenuItem>
                {myStoreMenuItem()}
                <MenuItem onClick={signout} component={RouterLink} to="/" >Logout</MenuItem>
              </Menu>
            </div>
          )}

        </Toolbar>
      </AppBar>

    </Box>
  
  );
}

export default FullAppBar;
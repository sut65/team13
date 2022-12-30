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

import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import GamesIcon from '@mui/icons-material/Games';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles({
  drawer: {
    width: 150
  }
});

function FullAppBar() {
  const signout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

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

  return (
    <Box sx={{ flexGrow: 1 }}>

      <AppBar position="static">
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

          <GamesIcon color="primary" sx={{ fontSize: 150, margin: 1, padding: 2 }} />

          <List className={classes.drawer} sx={{margin: 1,padding: 2}}>

            <ListItem button component={RouterLink} to="/">
              <HomeIcon color="primary" />
              <ListItemText primary="FirstPage" sx={{padding: 2}}/>
            </ListItem>

            <ListItem button component={RouterLink} to="/dashboard">
              <DashboardIcon color="primary" />
              <ListItemText primary="Dashboard" sx={{padding: 2}}/>
            </ListItem>

            <ListItem button component={RouterLink} to="/user_store_setting">
              <DashboardIcon color="primary" />
              <ListItemText primary="User & Store Setting" sx={{padding: 2}}/>
            </ListItem>

            <ListItem button component={RouterLink} to="/basket_list">
              <ShoppingBasketIcon color="primary" />
              <ListItemText primary="My Basket" sx={{padding: 2}}/>
            </ListItem>

          </List>
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
                <MenuItem onClick={handleClose}>{localStorage.getItem("personal_id")}</MenuItem>
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

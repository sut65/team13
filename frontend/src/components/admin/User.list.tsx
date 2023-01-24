import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Table from '@mui/material/Table';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import BuildIcon from '@mui/icons-material/Build';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { GamesInterface } from "../../models/game/IGame";
import { UsersInterface } from "../../models/user/IUser";
import { RatingsInterface } from "../../models/game/IRating";
import { Type_GamesInterface } from "../../models/game/IType_Game";
import { Game_StatusInterface } from "../../models/game/IGame_Status";
import {Container,Box,Snackbar,TextField,Paper,Card,CardActionArea,CardContent,CardMedia,Fab, TableContainer, Stack} from "@mui/material";
import {Dialog,DialogTitle,DialogContent,DialogActions} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import Moment from 'moment';
import AddIcon from '@mui/icons-material/Add';
import { AdminsInterface } from "../../models/admin/IAdmin";
import { CreateAdmin ,GetDepartment,GetGender,GetProvince,GetAdmin} from "./Admin_Service";
import { GetGame} from "../game/GameService";
const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));
function User_list() {
    const [user, setUser] = useState<UsersInterface[]>([]);
    const [game, setGame] = useState<GamesInterface[]>([]);

    const [openForAdd, setOpenForAdd] = React.useState(false);
    const [openForEdit, setOpenForEdit] = React.useState(false);
    const [openForDelete, setOpenForDelete] = React.useState(false);

    const [searchQuery, setSearchQuery] = React.useState("");
 

    const classes = useStyles();

    const getUser = async () => {
        const apiUrl = "http://localhost:8080/users/";
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
                     //setImageString(res.data.Profile_Picture);
                    // setNew_password(res.data.Password);
                    // setConfirm_password(res.data.Password);
                }
            });
    };

      const getGame = async () => {
        let res = await GetGame();
        if (res) {
          // setImageString(rese)// เพื่อให้ มันมีภาพ ตอนแรกไม่มีภาพ defaultvaule
          setGame(res);
    
          console.log(res)
        }
      };

      const handleClickOpenForAdd = () => {
        setOpenForAdd(true);
    };

    const handleCloseForAdd = () => {
        setOpenForAdd(false);
    };

    const handleClickOpenForEdit = (item: UsersInterface) => {
        setOpenForEdit(true);
       // setToEditFriend(item);
    };

    const handleCloseForEdit = () => {
        setOpenForEdit(false);
    };

    const handleClickOpenForDelete = (item: UsersInterface) => {
        setOpenForDelete(true);
      //  setDeleteFriend(item);
    };

    const handleCloseForDelete = () => {
        setOpenForDelete(false);
    };
    useEffect(() => {
        getUser();
        getGame();
       
    }, []);
   return ( 
    <Grid container >
    <Grid item xs={1}>
    <TextField
        id="search-bar"
        fullWidth
        onChange={(event) => (
            setSearchQuery(event.target.value)
        )}
        label="Name"
        variant="outlined"
        //placeholder="Search..."
        size="small"
    />
</Grid>
   <TableContainer component={Paper}>
    <Table className={classes.table}>
        <TableHead>
            <TableRow>
                <TableCell><h4>Name</h4></TableCell>
                <TableCell align="center"><h4>Profile</h4></TableCell>
                <TableCell align="center"><h4>Email</h4></TableCell>
                <TableCell align="center"><h4>Department</h4></TableCell>
                <TableCell align="center"><h4>Gender</h4></TableCell>
                <TableCell align="center"><h4></h4></TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {/* //.filter(item => item.Seller_ID == Number(localStorage.getItem("uid")) */}
        {user.filter(item => item.Profile_Name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                                <TableRow key={item.ID}>
                                     <TableCell align="center">{item.Profile_Name}</TableCell> 
                                    <TableCell align="center"><img src={`${item.Profile_Picture}`} width="100" height="100"/> {/** src={`${games.Picture}`} เอาไว้ตอนนัททำใส่รูปให้แล้ว*/}</TableCell>
                                    {/* <TableCell align="center">{item.Email}</TableCell>        */}
                                    {/* <TableCell align="center">{item.}</TableCell>    
                                    <TableCell align="center">{item.Gender.Gender}</TableCell>                */}
                                    <TableCell align="center">
                                        <Stack direction="column" spacing={2}>
                                            {/* <Button variant="outlined" color="primary" component={RouterLink} to={"/user_profile/"+String(item.Email)}>
                                                Profile
                                            </Button>
                                            <Button variant="outlined" color="inherit" onClick={() => handleClickOpenForEdit(item)}>
                                                Edit
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => handleClickOpenForDelete(item)}>
                                                Delete
                                            </Button>                                         */}
                                        </Stack>
                                    </TableCell>
                                    {/* <Dialog maxWidth="xl" open={openForEdit} onClose={handleCloseForEdit} >
                                        <DialogTitle>{toEditFriend?.User_Friend.Profile_Name}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                {toEditFriend?.User_Friend.Profile_Description}
                                            </DialogContentText>
                                            <Grid marginTop={2}>
                                                <Grid>
                                                    Nickname
                                                </Grid>
                                                <Grid>
                                                    <TextField
                                                        id="outlined-basic"
                                                        placeholder="NicknameEdit"
                                                        variant="outlined"
                                                        size="medium"
                                                        multiline={true}
                                                        minRows={9}
                                                        maxRows={2}
                                                        fullWidth={true}
                                                        defaultValue={toEditFriend?.Nickname}
                                                        onChange={(event) => setNicknameEdit(event.target.value)}
                                                    />
                                                    </Grid>
                                            </Grid>

                                            <Grid marginTop={2}>
                                                <Grid>
                                                    Intimate
                                                </Grid>
                                                <Grid>
                                                    <Autocomplete
                                                        id="intimate-edit-autocomplete"
                                                        options={intimate}
                                                        size="small"
                                                        defaultValue={toEditFriend?.Intimate}
                                                        onChange={(event: any, value) => {
                                                        setIntimateEdit(event.target.value);
                                                        }}
                                                        getOptionLabel={(option: any) =>
                                                        `${option.Intimate_Name}`
                                                        } //filter value
                                                        renderInput={(params) => {
                                                        return (
                                                            <TextField
                                                            {...params}
                                                            variant="outlined"
                                                            placeholder="Search..."
                                                            />
                                                        );
                                                        }}
                                                        renderOption={(props: any, option: any) => {
                                                        return (
                                                            <li
                                                            {...props}
                                                            value={`${option.ID}`}
                                                            key={`${option.ID}`}
                                                            >{`${option.Intimate_Name}`}</li>
                                                        ); //display value
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            
                                            <Grid marginTop={2}>
                                                <Grid>
                                                    Play together
                                                </Grid>
                                                <Grid>
                                                    <Autocomplete
                                                        id="game-autocomplete"
                                                        options={game}
                                                        size="small"
                                                        defaultValue={toEditFriend?.Game}
                                                        onChange={(event: any, value) => {
                                                        setGameEdit(event.target.value);
                                                        }}
                                                        getOptionLabel={(option: any) =>
                                                        `${option.Game_Name}`
                                                        } //filter value
                                                        renderInput={(params) => {
                                                        return (
                                                            <TextField
                                                            {...params}
                                                            variant="outlined"
                                                            placeholder="Search..."
                                                            />
                                                        );
                                                        }}
                                                        renderOption={(props: any, option: any) => {
                                                        return (
                                                            <li
                                                            {...props}
                                                            value={`${option.ID}`}
                                                            key={`${option.ID}`}
                                                            >{`${option.Game_Name}`}</li>
                                                        ); //display value
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleCloseForEdit}>Cancel</Button>
                                            <Button onClick={() => updateFriend(toEditFriend?.ID||0)}>Save</Button>
                                        </DialogActions>
                                    </Dialog>
                                    <Dialog fullWidth maxWidth="xl" open={openForDelete} onClose={handleCloseForDelete} >
                                        <DialogTitle>DELETE</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                Are you SURE to DELETE Friend "{item.User_Friend.Profile_Name}" ?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleCloseForDelete}>Cancel</Button>
                                            <Button color="error" onClick={() => deleteUserFriend(deleteFriend?.ID||0)}>Delete</Button>
                                        </DialogActions>
                                    </Dialog> */}
                                </TableRow>
                            ))}

        </TableBody>
          
    </Table>
</TableContainer>
</Grid>

);

}

export default User_list;
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Autocomplete, Box, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import { Container, Dialog, Paper, TableContainer } from '@mui/material';
import { FriendsInterface } from '../../models/friend/IFriend';
import { Link as RouterLink } from "react-router-dom";
import { IntimatesInterface } from '../../models/friend/IIntimate';
import { GamesInterface } from '../../models/game/IGame';
import { UsersInterface } from '../../models/user/IUser';
import Moment from 'moment';


const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));

function Hided_Friend_UI() {
    const classes = useStyles();
    Moment.locale('th');

    const [friend, setFriend] = useState<FriendsInterface[]>([]);
    const [toEditFriend, setToEditFriend] = useState<FriendsInterface>();
    const [deleteFriend, setDeleteFriend] = useState<FriendsInterface>();
    const [intimate, setIntimate] = useState<IntimatesInterface[]>([]);
    const [game, setGame] = useState<GamesInterface[]>([]);

    const [nicknameEdit, setNicknameEdit] = React.useState<string>("");
    const [intimateEdit, setIntimateEdit] = React.useState<Number>();
    const [gameEdit, setGameEdit] = React.useState<Number>();
    

    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

    const [openForEdit, setOpenForEdit] = React.useState(false);
    const [openForDelete, setOpenForDelete] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const handleClose = (                                                                        
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
        return;
        }
        setSuccess(false);
        setError(false);
    };

    const handleClickOpenForEdit = (item: FriendsInterface) => {
        setOpenForEdit(true);
        setToEditFriend(item);
    };

    const handleCloseForEdit = () => {
        setOpenForEdit(false);
    };

    const handleClickOpenForDelete = (item: FriendsInterface) => {
        setOpenForDelete(true);
        setDeleteFriend(item);
    };

    const handleCloseForDelete = () => {
        setOpenForDelete(false);
    };

    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }

    const getUserFriend = async () => {                                 
        const apiUrl = "http://localhost:8080/hideuserfriend/"+String(localStorage.getItem("uid"));
        const requestOptions = {
            method: "GET",      
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },     
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    setFriend(res.data);
                }
            });
    };

    const getIntimate = async () => {                                 
        const apiUrl = "http://localhost:8080/intimates";
        const requestOptions = {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
        };
  
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    setIntimate(res.data);
                }
            });
    };

    const getGame = async () => {                                 
        const apiUrl = "http://localhost:8080/Game";
        const requestOptions = {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
        };
  
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    setGame(res.data);
                }
            });
    };

    const updateFriend = (id: number) => {
        let data = {       //ประกาศก้อนข้อมูล
            ID: id,                                                     
            Nickname: nicknameEdit,  
            Intimate_ID: intimateEdit,
            Game_ID: gameEdit,    
        };
        const apiUrl = "http://localhost:8080/friends";                      //ส่งขอการลบ  
        const requestOptions = {     
            method: "PATCH",      
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },     
            body: JSON.stringify(data),
        };
      
        fetch(apiUrl, requestOptions)                                            //ขอการส่งกลับมาเช็คว่าบันทึกสำเร็จมั้ย
        .then((response) => response.json())      
        .then(async (res) => {      
            if (res.data) {
                setSuccess(true);
                getUserFriend();
                setOpenForEdit(false);
            } else {
                setError(true);  
                setErrorMsg(" - " + res.error);   
            }
        });        
    }

    const updateHide = (id: number) => {
        let data = {       //ประกาศก้อนข้อมูล
            ID:             id,   
            Is_Hide:        false,                                                  
        };
        console.log(data)
        const apiUrl = "http://localhost:8080/friends";                      //ส่งขอการลบ  
        const requestOptions = {     
            method: "PATCH",      
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },     
            body: JSON.stringify(data),
        };
      
        fetch(apiUrl, requestOptions)                                            //ขอการส่งกลับมาเช็คว่าบันทึกสำเร็จมั้ย
        .then((response) => response.json())      
        .then(async (res) => {      
            if (res.data) {
                setSuccess(true);
                getUserFriend();
            } else {
                setError(true);     
                setErrorMsg(" - " + res.error);
            }
        });        
    }

    const deleteUserFriend = (id: number) => {
        let data = {                                                            //ประกาศก้อนข้อมูล
            ID: id,      
        };
        const apiUrl = "http://localhost:8080/friend/:id";                      //ส่งขอการลบ  
        const requestOptions = {     
            method: "DELETE",      
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },     
            body: JSON.stringify(data),
        };
      
        fetch(apiUrl, requestOptions)                                            //ขอการส่งกลับมาเช็คว่าบันทึกสำเร็จมั้ย
        .then((response) => response.json())      
        .then(async (res) => {      
            if (res.data) {
                setSuccess(true);
                getUserFriend();
                setOpenForDelete(false);   
            } else {
                setError(true);     
                setErrorMsg(" - " + res.error);
            }
        });
    }

    useEffect(() => {
        getUserFriend(); 
        getIntimate();
        getGame(); 
    }, []);

    return (
        <Box>
            <Snackbar                                                                                 //ป้ายบันทึกสำเร็จ
                open={success}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleClose} severity="success">              
                    บันทึกข้อมูลสำเร็จ
                </Alert>
            </Snackbar>

            <Snackbar                                                                                 //ป้ายบันทึกไม่สำเร็จ
                open={error} 
                autoHideDuration={6000} 
                onClose={handleClose} 
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleClose} severity="error">
                    บันทึกข้อมูลไม่สำเร็จ
                </Alert>
            </Snackbar>

            <Grid container sx={{ padding:1 }}>
                <h1>Hided Friend</h1>
            </Grid>
            
            <Grid container sx={{ padding: 2 }}>
                <Grid container item xs={4}>
                    <Button variant="contained" color="primary" component={RouterLink} to="/my_friend">My friend</Button>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        id="search-bar"
                        fullWidth
                        onChange={(event) => (
                            setSearchQuery(event.target.value)
                        )}
                        label="Search a friend by profile name"
                        variant="outlined"
                        //placeholder="Search..."
                        size="small"
                    />
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="Basket">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell><h4>Friend</h4></TableCell>
                            <TableCell align="center"><h4>Nickname</h4></TableCell>
                            <TableCell align="center"><h4>Intimate</h4></TableCell>
                            <TableCell align="center"><h4>Play together</h4></TableCell>
                            <TableCell align="center"><h4>Since</h4></TableCell>
                            <TableCell align="center"><h4>Action</h4></TableCell>
                        </TableRow>
                    </TableHead>
                        <TableBody>
                            {friend.filter(item => item.User_Friend.Profile_Name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                                <TableRow key={item.ID}>
                                    <TableCell align="center"><img src={`${item.User_Friend.Profile_Picture}`} width="250" height="250"/> {/** src={`${games.Picture}`} เอาไว้ตอนนัททำใส่รูปให้แล้ว*/}</TableCell>
                                    <TableCell component="th" scope="row">{item.User_Friend.Profile_Name}</TableCell>
                                    <TableCell align="center">{item.Nickname}</TableCell>       
                                    <TableCell align="center">{item.Intimate.Intimate_Name}</TableCell>    
                                    <TableCell align="center">{item.Game.Game_Name}</TableCell>
                                    <TableCell align="center">{`${Moment(item.Date).format('DD MMMM YYYY')}`}</TableCell>                  
                                    <TableCell align="center">
                                        <Stack direction="column" spacing={2}>
                                            <Button variant="outlined" color="primary" component={RouterLink} to={"/user_profile/"+String(item.User_Friend.Email)}>
                                                Profile
                                            </Button>
                                            <Button variant="outlined" color="inherit" onClick={() => handleClickOpenForEdit(item)}>
                                                Edit
                                            </Button>
                                            <Button variant="outlined" color="inherit" onClick={() => updateHide(item.ID)}>
                                                Unhide
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => handleClickOpenForDelete(item)}>
                                                Delete
                                            </Button> 
                                        </Stack>
                                    </TableCell>
                                    <Dialog maxWidth="sm" fullWidth open={openForEdit} onClose={handleCloseForEdit} >
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
                                    <Dialog maxWidth="sm" fullWidth open={openForDelete} onClose={handleCloseForDelete} >
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
                                    </Dialog>
                                </TableRow>
                            ))}
                        </TableBody>
                </Table>
            </TableContainer>
        </Box>
  );
}
export default Hided_Friend_UI

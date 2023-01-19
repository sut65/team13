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
import { UsersInterface } from '../../models/user/IUser';
import { GamesInterface } from '../../models/game/IGame';
import { IntimatesInterface } from '../../models/friend/IIntimate';
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));

function Friend_UI() {
    const classes = useStyles();

    const [friend, setFriend] = useState<FriendsInterface[]>([]);
    // const [editBasket, setEditBasket] = useState<BasketInterface>();
    // const [deleteBasket, setDeleteBasket] = useState<BasketInterface>();
    const [friendAdd,setFriendAdd] =React.useState<Partial<FriendsInterface>>({});
    const [user, setUser] = useState<UsersInterface[]>([]);
    const [intimate, setIntimate] = useState<IntimatesInterface[]>([]);
    const [game, setGame] = useState<GamesInterface[]>([]);
    const [date, setDate] = React.useState<Dayjs | null>(dayjs());

    const intimateForAdd = 1;
    const [nickname, setNickname] = React.useState<string>("");

    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [openForAdd, setOpenForAdd] = React.useState(false);
    // const [openForEdit, setOpenForEdit] = React.useState(false);
    // const [openForDelete, setOpenForDelete] = React.useState(false);

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

    const handleClickOpenForAdd = () => {
        setOpenForAdd(true);
    };

    const handleCloseForAdd = () => {
        setOpenForAdd(false);
    };

    // const handleClickOpenForEdit = (item: BasketInterface) => {
    //     setOpenForEdit(true);
    //     setEditBasket(item);
    // };

    // const handleClickOpenForDelete = (item: BasketInterface) => {
    //     setOpenForDelete(true);
    //     setDeleteBasket(item);
    // };

    // const handleCloseForEdit = () => {
    //     setOpenForEdit(false);
    // };

    // const handleCloseForDelete = () => {
    //     setOpenForDelete(false);
    // };

    const getUserFriend = async () => {                                 
        const apiUrl = "http://localhost:8080/userfriend/"+String(localStorage.getItem("uid"));
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

    const getUser = async () => {                                 
        const apiUrl = "http://localhost:8080/userforaddfriend/"+String(localStorage.getItem("uid"));
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
                    setUser(res.data);
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

    const AddFriend = () => {
    let data = {
        User_ID:        Number(localStorage.getItem("uid")), 
        User_Friend_ID: friendAdd.User_Friend_ID,
        Intimate_ID:       friendAdd.Intimate_ID||intimateForAdd,
        Nickname:       nickname,
        Game_ID:        friendAdd.Game_ID,
        Is_Hide:        false,
        Date:           date,
    };
    const apiUrl = "http://localhost:8080/friends";           //ส่งขอบันทึก
    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }; 
    
    fetch(apiUrl, requestOptions)
    .then((response) => response.json())      
    .then((res) => {      
        if (res.data) {
            setSuccess(true);
            window.location.reload();     
        } else {
            setError(true);     
        }
    });        
    }

    // const updateItem = (id: number,note: string) => {
    //     let data = {       //ประกาศก้อนข้อมูล
    //         ID: id,                                                     
    //         Note: note,      
    //     };
    //     const apiUrl = "http://localhost:8080/baskets";                      //ส่งขอการลบ  
    //     const requestOptions = {     
    //         method: "PATCH",      
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem("token")}`,
    //             "Content-Type": "application/json",
    //         },     
    //         body: JSON.stringify(data),
    //     };
      
    //     fetch(apiUrl, requestOptions)                                            //ขอการส่งกลับมาเช็คว่าบันทึกสำเร็จมั้ย
    //     .then((response) => response.json())      
    //     .then((res) => {      
    //         if (res.data) {
    //             setSuccess(true);
    //             window.location.reload();     
    //         } else {
    //             setError(true);     
    //         }
    //     });        
    // }

    // const deleteItem = (id: number) => {
    //     let data = {                                                            //ประกาศก้อนข้อมูล
    //         ID: id,      
    //     };
    //     const apiUrl = "http://localhost:8080/basket/:id";                      //ส่งขอการลบ  
    //     const requestOptions = {     
    //         method: "DELETE",      
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem("token")}`,
    //             "Content-Type": "application/json",
    //         },     
    //         body: JSON.stringify(data),
    //     };
      
    //     fetch(apiUrl, requestOptions)                                            //ขอการส่งกลับมาเช็คว่าบันทึกสำเร็จมั้ย
    //     .then((response) => response.json())      
    //     .then((res) => {      
    //         if (res.data) {
    //             setSuccess(true);
    //             window.location.reload();     
    //         } else {
    //             setError(true);     
    //         }
    //     });
    // }


    useEffect(() => {
        getUserFriend();  
        getUser();
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
                    คุณมีเพื่อนคนนี้แล้ว
                </Alert>
            </Snackbar>

            <Grid container sx={{ padding:1 }}>
                <h1>My Friend</h1>
            </Grid>

            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="Basket">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell><h4>Friend</h4></TableCell>
                            <TableCell align="center"><h4>Nickname</h4></TableCell>
                            <TableCell align="center"><h4>Intimate</h4></TableCell>
                            <TableCell align="center"><h4>From</h4></TableCell>
                        </TableRow>
                    </TableHead>
                        <TableBody>
                            {friend.map((item) => (
                                <TableRow key={item.ID}>
                                    <TableCell align="center"><img src={`${item.User_Friend.Profile_Picture}`} width="250" height="250"/> {/** src={`${games.Picture}`} เอาไว้ตอนนัททำใส่รูปให้แล้ว*/}</TableCell>
                                    <TableCell component="th" scope="row">{item.User_Friend.Profile_Name}</TableCell>
                                    <TableCell align="center">{item.Nickname}</TableCell>       
                                    <TableCell align="center">{item.Intimate.Intimate_Name}</TableCell>    
                                    <TableCell align="center">{item.Game.Game_Name}</TableCell>               
                                    {/* <TableCell align="center">
                                        <Stack direction="column" spacing={2}>
                                            <Button variant="outlined" color="inherit" onClick={() => handleClickOpenForEdit(item)}>
                                                Edit
                                            </Button>
                                            <Button variant="contained" color="secondary" onClick={() => handleClickOpenForDelete(item)}>
                                                Delete
                                            </Button>                                        
                                        </Stack>
                                    </TableCell> */}
                                        {/* <Dialog fullWidth maxWidth="xl" open={openForEdit} onClose={handleCloseForEdit} >
                                            <DialogTitle>{editBasket?.Game.Game_Name}</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>
                                                    {editBasket?.Game.Game_description}
                                                </DialogContentText>
                                                <TextField
                                                    id="outlined-basic"
                                                    placeholder="Insert details"
                                                    variant="outlined"
                                                    size="medium"
                                                    multiline={true}
                                                    minRows={9}
                                                    maxRows={2}
                                                    fullWidth={true}
                                                    defaultValue={editBasket?.Note}
                                                    onChange={(event) => setNote(event.target.value)}
                                                />
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleCloseForEdit}>Cancel</Button>
                                                <Button onClick={() => updateItem(editBasket?.ID||0,note)}>Save</Button>
                                            </DialogActions>
                                        </Dialog>
                                        <Dialog fullWidth maxWidth="xl" open={openForDelete} onClose={handleCloseForDelete} >
                                            <DialogTitle>DELETE</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>
                                                    Are you SURE to DELETE "{item.Game.Game_Name}" from BASKET?
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleCloseForDelete}>Cancel</Button>
                                                <Button color="secondary" onClick={() => deleteItem(deleteBasket?.ID||0)}>Delete</Button>
                                            </DialogActions>
                                        </Dialog> */}
                                </TableRow>
                            ))}
                        </TableBody>
                </Table>
            </TableContainer>
            <Grid container sx={{ padding: 2 }}>
                <Grid item xs={4}>
                    <Button variant="contained" color="primary" onClick={() => handleClickOpenForAdd()}>ADD</Button>
                </Grid>
                <Grid item xs={4}>
                    <Button variant="contained" color="inherit" component={RouterLink} to="/my_hided_friend">Hided</Button>
                </Grid>
            </Grid>
            <Dialog open={openForAdd} onClose={handleCloseForAdd} >
                <DialogTitle>Friend</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Add new Friend
                    </DialogContentText>
                    <Grid marginTop={2}>
                        <Grid>
                            User name
                        </Grid>
                        <Grid>
                            <Autocomplete
                                id="user-autocomplete"
                                options={user}
                                size="small"
                                onChange={(event: any, value) => {
                                setFriendAdd({ ...friendAdd, User_Friend_ID: value?.ID }); //Just Set ID to interface
                                }}
                                getOptionLabel={(option: any) =>
                                `${option.Profile_Name}`
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
                                    >{`${option.Profile_Name}`}</li>
                                ); //display value
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Grid marginTop={2}>
                        <Grid>
                            Intimate
                        </Grid>
                        <Grid>
                            <Autocomplete
                                id="intimate-autocomplete"
                                options={intimate}
                                size="small"
                                defaultValue={intimate[0]}
                                onChange={(event: any, value) => {
                                setFriendAdd({ ...friendAdd, Intimate_ID: value?.ID }); //Just Set ID to interface
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
                            Nickname
                        </Grid>
                        <Grid>
                            <TextField
                                id="outlined-basic"
                                placeholder="Insert nickname"
                                variant="outlined"
                                size="medium"
                                multiline={true}
                                minRows={9}
                                maxRows={2}
                                fullWidth={true}
                                onChange={(event) => setNickname(event.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid marginTop={2}>
                        <Grid>
                            From game
                        </Grid>
                        <Grid>
                            <Autocomplete
                                id="game-autocomplete"
                                options={game}
                                size="small"
                                onChange={(event: any, value) => {
                                setFriendAdd({ ...friendAdd, Game_ID: value?.ID }); //Just Set ID to interface
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
                    <Grid marginTop={2}>
                        <Grid>
                            Date
                        </Grid>
                        <Grid>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker   
                                    label="disabled"
                                    disabled
                                    value={date}
                                    onChange={(newValue) => {
                                        setDate(newValue);
                                    }}
                                    renderInput={(params) => <TextField sx={{ marginY: 2 }} {...params} />}
                            />
                            </LocalizationProvider>
                        </Grid>
                    
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" onClick={handleCloseForAdd}>Cancel</Button>
                    <Button color="success" onClick={() => AddFriend()}>Add</Button>
                </DialogActions>
            </Dialog>
        </Box>
  );
}
export default Friend_UI

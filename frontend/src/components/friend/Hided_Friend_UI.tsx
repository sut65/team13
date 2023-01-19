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
import { Box, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import { Container, Dialog, Paper, TableContainer } from '@mui/material';
import { FriendInterface } from '../../models/friend/IFriend';
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));

function Hided_Friend_UI() {
    const classes = useStyles();

    const [friend, setFriend] = useState<FriendInterface[]>([]);
    // const [editBasket, setEditBasket] = useState<BasketInterface>();
    // const [deleteBasket, setDeleteBasket] = useState<BasketInterface>();

    const [note, setNote] = React.useState<string>("");

    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [openForEdit, setOpenForEdit] = React.useState(false);
    const [openForDelete, setOpenForDelete] = React.useState(false);

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
        console.log(friend)
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
                                console.log(item),
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
            <Grid container sx={{ padding: 2, width: 150 }}>
                <Button variant="contained" color="primary" component={RouterLink} to="/my_friend">My friend</Button>
            </Grid>
        </Box>
  );
}
export default Hided_Friend_UI

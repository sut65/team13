import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import { BasketInterface } from '../../models/basket/IBasket';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Box, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';
import Stack from '@mui/material/Stack';
import { Container, Dialog, Grid, Paper, TableContainer } from '@mui/material';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));

function Basket_List() {
    const classes = useStyles();

    const [basket, setBasket] = useState<BasketInterface[]>([]);
    const [editBasket, setEditBasket] = useState<BasketInterface>();
    const [deleteBasket, setDeleteBasket] = useState<BasketInterface>();

    const [note, setNote] = React.useState<string>("");

    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [openForEdit, setOpenForEdit] = React.useState(false);
    const [openForDelete, setOpenForDelete] = React.useState(false);

    const sum = basket.filter(item => item.Payment_Status.ID == 1).reduce((acc, item) => acc + item.Game.Game_Price, 0);

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

    const handleClickOpenForEdit = (item: BasketInterface) => {
        setOpenForEdit(true);
        setEditBasket(item);
    };

    const handleClickOpenForDelete = (item: BasketInterface) => {
        setOpenForDelete(true);
        setDeleteBasket(item);
    };

    const handleCloseForEdit = () => {
        setOpenForEdit(false);
    };

    const handleCloseForDelete = () => {
        setOpenForDelete(false);
    };

    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }

    function DeleteButton(item: BasketInterface){
        if(item.Payment_Status_ID == 1){
            return(
                <Button variant="contained" color="secondary" onClick={() => handleClickOpenForDelete(item)}>
                    Delete
                </Button> 
            )
        }
    }

    const getUserBasket = async () => {                                 
        const apiUrl = "http://localhost:8080/userbasket/"+String(localStorage.getItem("uid"));
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
                    setBasket(res.data);
                }
            });
    };

    const updateItem = (id: number,note: string) => {
        let data = {       //ประกาศก้อนข้อมูล
            ID: id,                                                     
            Note: note,      
        };
        const apiUrl = "http://localhost:8080/baskets";                      //ส่งขอการลบ  
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
                await timeout(1000); //for 1 sec delay
                window.location.reload();     
            } else {
                setError(true);     
            }
        });        
    }

    const deleteItem = (id: number) => {
        let data = {                                                            //ประกาศก้อนข้อมูล
            ID: id,      
        };
        const apiUrl = "http://localhost:8080/basket/:id";                      //ส่งขอการลบ  
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
                await timeout(1000); //for 1 sec delay
                window.location.reload();     
            } else {
                setError(true);     
            }
        });
    }


    useEffect(() => {
        const fetchData = async () => {
            await getUserBasket(); 
        }
        fetchData();     
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
                <h1>My Basket</h1>
            </Grid>
            
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="Basket">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell><h4>Game</h4></TableCell>
                            <TableCell align="center"><h4>Price</h4></TableCell>
                            <TableCell align="center"><h4>Note</h4></TableCell>
                            <TableCell align="center"><h4>Status</h4></TableCell>
                            <TableCell align="center"><h4>Order</h4></TableCell>
                            <TableCell align="center"><h4>Action</h4></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {basket.map((item) => (
                            <TableRow key={item.ID}>
                                <TableCell align="center"><img src={`${item.Game.Game_Picture}`} width="300" height="150"/></TableCell>
                                <TableCell component="th" scope="row">{item.Game.Game_Name}</TableCell>
                                <TableCell align="center">{item.Game.Game_Price}</TableCell>                         
                                <TableCell align="center">{item.Note}</TableCell>
                                <TableCell align="center">{item.Payment_Status.Status}</TableCell>
                                <TableCell align="center">{item.Order_ID}</TableCell>
                                <TableCell align="center">
                                    <Stack direction="column" spacing={2}>
                                        <Button variant="outlined" color="inherit" onClick={() => handleClickOpenForEdit(item)}>
                                            Edit
                                        </Button>   
                                        {DeleteButton(item)}                           
                                    </Stack>
                                </TableCell>
                                    <Dialog fullWidth maxWidth="xl" open={openForEdit} onClose={handleCloseForEdit} >
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
                                    </Dialog>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="Total">
                    <TableBody>
                        <TableRow>
                            <TableCell align="center"><h4>Total unpaid</h4></TableCell>
                            <TableCell align="center">{sum}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
  );
}
export default Basket_List

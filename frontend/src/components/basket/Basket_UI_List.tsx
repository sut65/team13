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
import { Dialog } from '@mui/material';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));

function Basket_List() {
    const classes = useStyles();

    const [basket, setBasket] = useState<BasketInterface[]>([]);

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

    const handleClickOpenForEdit = () => {
        setOpenForEdit(true);
    };

    const handleClickOpenForDelete = () => {
        setOpenForDelete(true);
    };

    const handleCloseForEdit = () => {
        setOpenForEdit(false);
    };

    const handleCloseForDelete = () => {
        setOpenForDelete(false);
    };

    const getBasket = async () => {                                 
        const apiUrl = "http://localhost:8080/baskets";
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
        if(note == ""){
            {basket.map((item) => (setNote(item.Note)))}
        }
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
        .then((res) => {      
            if (res.data) {
                setSuccess(true);     
            } else {
                setError(true);     
            }
        });

        window.location.reload();
        
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
        .then((res) => {      
            if (res.data) {
                setSuccess(true);     
            } else {
                setError(true);     
            }
        });

        window.location.reload();
        
    }


    useEffect(() => {
        getBasket(); 
        console.log(basket)  
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
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert onClose={handleClose} severity="error">
                    บันทึกข้อมูลไม่สำเร็จ
                </Alert>
            </Snackbar>
            
            <Table className={classes.table} aria-label="Basket">
                <TableHead>
                    <TableRow>
                        <TableCell>Game</TableCell>
                            <TableCell align="center">Price</TableCell>
                            <TableCell align="center">Note</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {basket.filter(item => item.User_ID == 1).map((item) => (
                            <TableRow key={item.ID}>
                                <TableCell component="th" scope="row">{item.Game.Game_Name}</TableCell>
                                <TableCell align="center">{item.Game.Game_Price}</TableCell>                         
                                <TableCell align="center">{item.Note}</TableCell>
                                <TableCell align="center">
                                    <Stack direction="column" spacing={2}>
                                        <Button variant="outlined" color="inherit" onClick={handleClickOpenForEdit}>
                                            Edit
                                        </Button>
                                        <Button variant="contained" color="secondary" onClick={handleClickOpenForDelete}>
                                            Delete
                                        </Button>                                        
                                    </Stack>
                                </TableCell>
                                    <Dialog fullWidth maxWidth="xl" open={openForEdit} onClose={handleCloseForEdit} >
                                        <DialogTitle>{item.Game.Game_Name}</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                {item.Game.Game_description}
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
                                                defaultValue={item.Note}
                                                onChange={(event) => setNote(event.target.value)}
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleCloseForEdit}>Cancel</Button>
                                            <Button onClick={() => updateItem(item.ID,note)}>Save</Button>
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
                                            <Button color="secondary" onClick={() => deleteItem(item.ID)}>Delete</Button>
                                        </DialogActions>
                                    </Dialog>
                            </TableRow>
                        ))}
                    </TableBody>
            </Table>
        </Box>
  );
}
export default Basket_List;

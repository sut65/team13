import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Box, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid} from '@material-ui/core';
import { Dialog } from '@mui/material';
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import TextField from "@mui/material/TextField";


function Basket_Add() {

    const [note, setNote] = React.useState<string>("");
    const [date, setDate] = React.useState<Dayjs | null>(dayjs());

    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [openForAdd, setOpenForAdd] = React.useState(false);

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

    const AddToBasket = () => { 
        let data = {                                   //ประกาศก้อนข้อมูล
            User_ID: Number(localStorage.getItem("uid")),
            Game_ID: 3,
            Payment_Status_ID: 1,
            Note: note,
            Date: date,
        };
      
        const apiUrl = "http://localhost:8080/baskets";           //ส่งขอบันทึก
        const requestOptions = {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }; 
      
        fetch(apiUrl, requestOptions)                                       //ขอการส่งกลับมาเช็คว่าบันทึกสำเร็จมั้ย
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
            <Button onClick={handleClickOpenForAdd}>Add to Basket</Button>
            <Dialog fullWidth maxWidth="xl" open={openForAdd} onClose={handleCloseForAdd} >
                <DialogTitle>Add to Basket</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        game name
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
                        onChange={(event) => setNote(event.target.value)}
                    />
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseForAdd}>Cancel</Button>
                    <Button color="secondary" onClick={AddToBasket}>Add</Button>
                </DialogActions>
            </Dialog>

        </Box>
  );
}
export default Basket_Add;

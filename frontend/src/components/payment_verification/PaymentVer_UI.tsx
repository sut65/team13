import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { Box,Dialog, Grid, Paper, TableContainer, Autocomplete, Container, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@mui/material';
import TextField from '@mui/material/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Link as RouterLink } from "react-router-dom";

import { PaymentVerificationInterface } from '../../models/payment_verification/IPaymentVerification';
import { AdminsInterface } from '../../models/admin/IAdmin';
import { OrderInterface } from '../../models/order/IOrder';
import { VerificationStatusInterface } from '../../models/payment_verification/IVerificationStatus';
import PaymentVerTable_UI from './PaymentVerTable_UI';
import { Stack } from '@mui/system';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));

function PaymentVer_UI() {
    const classes = useStyles();

    const [submitSuccess, setSubmitSuccess] = React.useState(false);
    const [submitError, setSubmitError] = React.useState(false);
    const [openForNew, setOpenForNew] = React.useState(false);

    const [payment_ver, setPaymentVer] = React.useState<Partial<PaymentVerificationInterface>>({});
    const [paymentver, setPaymentVer_ID] = React.useState<PaymentVerificationInterface[]>([]);
    const [order, setOrder] = React.useState<OrderInterface[]>([]);
    const [ver_status, setVerStatus] = React.useState<VerificationStatusInterface[]>([]);
    const [admin, setAdmin] = React.useState<AdminsInterface[]>([]);
    
    const [note, setNote] = React.useState<string>("");
    const [date, setDate] = React.useState<Dayjs | null>(dayjs());

    const handleClose = ( // AlertBar
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setSubmitSuccess(false);
        setSubmitError(false);
    };

    const handleClickOpenForNew = (item: number) => {
        setOpenForNew(true);
        setPaymentVer({ ...payment_ver, Order_ID: item })
    }
    const handleCloseForNew = () => {
        setOpenForNew(false);
        
    }


    const getOrder = async () => {
        const apiUrl = "http://localhost:8080/order";
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
                    setOrder(res.data);
                }
            });
    };

    const getVerStatus = async () => {
        const apiUrl = "http://localhost:8080/Verification_Status";
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
                    setVerStatus(res.data);
                }
            });
        console.log(ver_status)
    };

    const getPaymentVer = async () => {
        const apiUrl = "http://localhost:8080/payment_ver";
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
                    setPaymentVer(res.data);
                    setPaymentVer_ID(res.data);
                    console.log(res.data);
                }
            });
    };

    const createPaymentVer = () => {
        let data = {
            Admin_ID: Number(localStorage.getItem('aid')),
            Order_ID: payment_ver.Order_ID,
            Verification_Status_ID: payment_ver.Verification_Status_ID,
            Note: note,
            Date: date,
        };
        console.log(data)

        const apiUrl = "http://localhost:8080/payment_ver";           //ส่งขอบันทึก
  
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
                    setSubmitSuccess(true);
                    window.location.reload();
                } else {
                    setSubmitError(true);
                }
            });
    }

    React.useEffect(() => {
        const fetchData = async () => {
            await getOrder();
            await getVerStatus()
            await getPaymentVer();
        }
        fetchData();
    }, []);

    return (
        <Container maxWidth="xl">
            <Snackbar // บันทึกสำเร็จ
                open={submitSuccess}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert onClose={handleClose} severity="success">              
                    การตรวจสอบสำเร็จ
                </Alert>
            </Snackbar>

            <Snackbar // บันทึกไม่สำเร็จ
                open={submitError} 
                autoHideDuration={3000} 
                onClose={handleClose} 
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert onClose={handleClose} severity="error">
                    การตรวจสอบไม่สำเร็จ
                </Alert>
            </Snackbar>

            <Grid container sx={{ padding: 2}} direction='row-reverse'>
                <Grid container item xs={4} direction='row-reverse'>
                    <Stack direction="row" spacing={2}>
                        <Button component={RouterLink} to="/payment_ver_table" variant="contained" color="inherit">
                            Edit Verification
                        </Button>
                    </Stack>
                </Grid>
            </Grid>

            <Container maxWidth="md">
                <Paper>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="Order">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center"><h4>Order ID</h4></TableCell>
                                    {/* <TableCell align="center"><h4>Status</h4></TableCell> */}
                                    <TableCell align="center"><h4>Slip</h4></TableCell>
                                </TableRow>
                            </TableHead>
                                <TableBody>
                                    {order.map((item) => (
                                        <TableRow key={item.ID}>
                                            <TableCell align="center">{item.ID}</TableCell> 
                                            {/* <TableCell align="center">{item.Verification_Status.Status_type}</TableCell>       */}
                                            <TableCell align="center"><img src={`${item.Slip}`} width="250" height="250"/></TableCell>                 
                                                <Stack direction="column" spacing={3}>
                                                <Button variant="contained" color="primary" onClick={() => handleClickOpenForNew(item.ID)}>
                                                        Verify
                                                    </Button>
                                                </Stack> 
                                        </TableRow>
                                    ))}
                                </TableBody>
                        </Table>
                    </TableContainer>

                    <Dialog fullWidth maxWidth="xl" open={openForNew} onClose={handleCloseForNew} >
                <DialogTitle>Payment Verification</DialogTitle>
                <DialogContent>

                        <Grid container spacing={2}>
                            <Grid container justifyContent={"center"} sx={{paddingY: 2,}}>
                                <Grid item xs={2}><p>Status:</p></Grid>
                                <Grid item xs={6}>
                                    <Autocomplete
                                        id="verstatus-autocomplete"
                                        options={ver_status}
                                        fullWidth
                                        size="medium"
                                        onChange={(event: any, value) => {
                                            setPaymentVer({ ...payment_ver, Verification_Status_ID: value?.ID }); // บันทึกค่าลง interface
                                        }}
                                        getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                                            `${option.ID} - ${option.Status_type}`
                                        } 
                                        renderInput={(params) => <TextField {...params} label="Status" />}
                                        renderOption={(props: any, option: any) => {
                                        return (
                                            <li
                                            {...props}
                                            value={`${option.ID}`}
                                            key={`${option.ID}`}
                                            >{`${option.ID} - ${option.Status_type}`}</li>
                                        );
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid container justifyContent={"center"} sx={{paddingY: 2,}}>
                                <Grid item xs={2}><p>Note:</p></Grid>
                                <Grid item xs={6}>
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
                                </Grid>
                            </Grid>
                        </Grid>

                    {/* Date */}
                    <Grid container justifyContent={"center"} sx={{ paddingY: 2,}}>
                        <Grid item xs={1}>
                            <h4>Date:</h4>
                        </Grid>
                        <Grid margin={1} item xs={6} md={4}>
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
                    <Button color="secondary" onClick={handleCloseForNew}>Cancel</Button>
                    <Button color="primary" onClick={createPaymentVer}>Save</Button>
                </DialogActions>
            </Dialog>
                </Paper>
            </Container>

        </Container>
    )     
}
export default PaymentVer_UI

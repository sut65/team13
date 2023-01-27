import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { Box,Dialog, Grid, Paper, TableContainer, Autocomplete, Container} from '@mui/material';
import TextField from '@mui/material/TextField';

import { PaymentVerificationInterface } from '../../models/payment_verification/IPaymentVerification';
import { AdminsInterface } from '../../models/admin/IAdmin';
import { OrderInterface } from '../../models/order/IOrder';
import { VerificationStatusInterface } from '../../models/payment_verification/IVerificationStatus';
import PaymentVerTable_UI from './PaymentVerTable_UI';

function PaymentVer_UI() {

    const [submitSuccess, setSubmitSuccess] = React.useState(false);
    const [submitError, setSubmitError] = React.useState(false);

    const [payment_ver, setPaymentVer] = React.useState<Partial<PaymentVerificationInterface>>({});
    const [paymentver_ID, setPaymentVer_ID] = React.useState<PaymentVerificationInterface[]>([]);
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

    // const getAdmin = async () => {
    //     const apiUrl = "http://localhost:8080/admin";
    //     const requestOptions = {
    //         method: "GET",
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem("token")}`,
    //             "Content-Type": "application/json",
    //         },
    //     };
       
    //     await fetch(apiUrl, requestOptions)
    //         .then((response) => response.json())
    //         .then((res) => {
    //             if (res.data) {
    //                 setAdmin(res.data);
    //             }
    //         });
    // };

    const getVerStatus = async () => {
        const apiUrl = "http://localhost:8080/Verification_status";
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
            VS_ID: payment_ver.VS_ID,
            Note: note,
            Date: date,
        };
        console.log(data)

        const apiUrl = "http://localhost:8080/payment_ver";           //ส่งขอบันทึก
  
        const requestOptions = {
  
          method: "POST",
  
          headers: { "Content-Type": "application/json" },
  
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

    const updatePaymentVer = () => {
        let updateData = {
            ID: payment_ver.ID,
            Admin_ID: Number(localStorage.getItem('aid')),
            Order_ID: payment_ver.Order_ID,
            VS_ID: payment_ver.VS_ID,
            Note: note,
            Date: date,
        };

        console.log(updateData)

        const apiUrl = "http://localhost:8080/payment_ver";
        const requestOptions = {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        };

        fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                setSubmitSuccess(true);
                console.log(res.data);
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

            <Container maxWidth="md">
                <Paper>
                    <Box display={"flex"} justifyContent={"center"} sx={{marginTop: 6, paddingX: 2, paddingY: 2,}}><h2>Payment Verification</h2></Box>
                        <Grid container spacing={2}>
                            <Grid container justifyContent={"center"} sx={{paddingY: 2,}}>
                                <Grid item xs={2}><p>Order:</p></Grid>
                                <Grid item xs={6}>
                                    <Autocomplete
                                        id="order-autocomplete"
                                        options={order}
                                        fullWidth
                                        size="medium"
                                        onChange={(event: any, value) => {
                                            setPaymentVer({ ...payment_ver, Order_ID: value?.ID }); // บันทึกค่าลง interface
                                        }}
                                        getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                                            `${option.ID} - ${option.Order_ID}`
                                        } 
                                        renderInput={(params) => <TextField {...params} label="Order ID" />}
                                        renderOption={(props: any, option: any) => {
                                        return (
                                            <li
                                            {...props}
                                            value={`${option.ID}`}
                                            key={`${option.ID}`}
                                            >{`${option.ID} - ${option.Order_ID}`}</li>
                                        );
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* <Grid container spacing={2}>
                            <Grid container justifyContent={"center"} sx={{paddingY: 2,}}>
                                <Grid item xs={2}><p>Slip:</p></Grid>
                                <Grid item xs={6}></Grid>
                            </Grid>
                        </Grid> */}


                        <Grid container spacing={2}>
                            <Grid container justifyContent={"center"} sx={{paddingY: 2,}}>
                                <Grid item xs={2}><p>Status:</p></Grid>
                                <Grid item xs={6}>
                                    <Autocomplete
                                        id="verstatus-autocomplete"
                                        options={order}
                                        fullWidth
                                        size="medium"
                                        onChange={(event: any, value) => {
                                            setPaymentVer({ ...payment_ver, VS_ID: value?.ID }); // บันทึกค่าลง interface
                                        }}
                                        getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                                            `${option.ID} - ${option.VS_ID}`
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

                        <Grid container spacing={2}>
                            <Grid container justifyContent={"center"} sx={{paddingY: 2,}}>
                                <Grid item xs={2}><p>Date:</p></Grid>
                                <Grid item xs={6}>
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
                        </Grid>

                        <Grid container justifyContent={"center"} sx={{ paddingY: 2,}}>
                            <Button variant="contained" color="primary" onClick={createPaymentVer}>
                                Verify
                            </Button>
                        </Grid>
                </Paper>
            </Container>

            <Box>
                <PaymentVerTable_UI/>
            </Box>

        </Container>
    )     
}
export default PaymentVer_UI

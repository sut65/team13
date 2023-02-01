import * as React from 'react';
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import Button from '@material-ui/core/Button';
import Stack from '@mui/material/Stack';
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

import { PaymentVerificationInterface } from '../../models/payment_verification/IPaymentVerification';
import { AdminsInterface } from '../../models/admin/IAdmin';
import { OrderInterface } from '../../models/order/IOrder';
import { VerificationStatusInterface } from '../../models/payment_verification/IVerificationStatus';

function PaymentVerTable_UI() {
    const [payment_ver, setPaymentVer] = React.useState<PaymentVerificationInterface[]>([]);
    const [editPaymentVer, setEditPaymentVer] = React.useState<PaymentVerificationInterface>();
    const [payment_verUpdate, setPaymentVerUpdate] = React.useState<Partial<PaymentVerificationInterface>>({});
    const [paymentver, setPaymentVer_ID] = React.useState<PaymentVerificationInterface[]>([]);
    const [order, setOrder] = React.useState<OrderInterface[]>([]);
    const [ver_status, setVerStatus] = React.useState<VerificationStatusInterface[]>([]);
    const [admin, setAdmin] = React.useState<AdminsInterface[]>([]);
    
    const [note, setNote] = React.useState<string>("");
    const [date, setDate] = React.useState<Dayjs | null>(dayjs());

    const [click, setClick] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [errorForEdit, setErrorForEdit] = useState(false);
    const [openForEdit, setOpenForEdit] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

    const handleRowClick: GridEventListener<'rowClick'> = (params) => {
        setEditPaymentVer(params.row);
        setClick(false);
    };

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
      ) => {
        if (reason === "clickaway") {
          return;
        }
        setSuccess(false);
        setError(false);
        setErrorForEdit(false);
        setErrorMsg("");
      };
    
    const handleClickOpenForEdit = () => {
        setOpenForEdit(true);
        // setEditPaymentVer(item);
    }
    const handleCloseForEdit = () => {
        setOpenForEdit(false);        
    }

    function timeout(delay: number) {
        return new Promise(res => setTimeout(res, delay));
    }

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

      const updatePaymentVer = () => {
        let updateData = {
            ID:editPaymentVer?.ID,
            Admin_ID: Number(localStorage.getItem('aid')),
            Order_ID: payment_verUpdate.Order_ID,
            Verification_Status_ID: payment_verUpdate.Verification_Status_ID,
            Note: note,
            Date: date,
        };
        console.log(updateData)
        const apiUrl = "http://localhost:8080/payments_ver";
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
                setSuccess(true);
                console.log(res.data);
            } else {
                setError(true);
                setErrorMsg(" - "+res.error)
            }
        });

    }

      useEffect(() => {
        getPaymentVer();
        getVerStatus();
      }, []);

      const paymentver_columns: GridColDef[] = [
        { field: "ID", headerName: "ID", width: 50 },
        {
            field: "Order",
            headerName: "Order",
            width: 200,
            valueGetter:(params) => params.value.ID,
        },
        {
            field: "Verification_Status",
            headerName: "Status",
            width: 200,
            valueGetter:(params) => params.value.Status_type,
        },
        {
            field: "Note",
            headerName: "Note",
            width: 400,
            valueGetter:(params) => params.value,
        },
        {
            field: "Admin",
            headerName: "Admin",
            width: 200,
            valueGetter: (params) => params.value.Name,
          },
        {
            field: "Date",
            headerName: "Date",
            width: 300,
            valueGetter:(params) => params.value,
        },
      ];

      return (
        <Container maxWidth="lg">
            <Snackbar
                open={success}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
             <Alert onClose={handleClose} severity="success">
                 บันทึกข้อมูลสำเร็จ
             </Alert>
            </Snackbar>
            <Snackbar
                open={error}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
             <Alert onClose={handleClose} severity="error">
                 อัพเดทข้อมูลไม่สำเร็จ{errorMsg}
             </Alert>
            </Snackbar>

            <Grid container sx={{ padding: 2}} direction='row-reverse'>
                <Grid container item xs={4} direction='row-reverse'>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="primary" disabled = {click} onClick={() => handleClickOpenForEdit()}>
                            Edit
                        </Button>
                    </Stack>
                </Grid>
            </Grid>

            <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
                <DataGrid
                   rows={payment_ver}
                   getRowId={(row) => row.ID}
                   columns={paymentver_columns}
                   pageSize={10}
                   rowsPerPageOptions={[10]}
                   onRowClick={handleRowClick}
                />
            </div>

            <Dialog fullWidth maxWidth="xl" open={openForEdit} onClose={handleCloseForEdit} >
                <DialogTitle>Edit Payment Verification</DialogTitle>
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
                                            setPaymentVerUpdate({ ...payment_verUpdate, Verification_Status_ID: value?.ID }); // บันทึกค่าลง interface
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
                    <Button color="secondary" onClick={handleCloseForEdit}>Cancel</Button>
                    <Button color="primary" onClick={updatePaymentVer}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
      );
    
}
export default PaymentVerTable_UI;
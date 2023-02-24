import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@mui/material/Button';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Box, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import Stack from '@mui/material/Stack';
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { Dialog, Grid, Paper, TableContainer, Autocomplete, Container} from '@mui/material';
import TextField from '@mui/material/TextField';

import { OrderInterface } from '../../models/order/IOrder';
import { UsersInterface } from '../../models/user/IUser';
import { BasketInterface } from '../../models/basket/IBasket';
import { FriendsInterface } from '../../models/friend/IFriend';
import { VerificationStatusInterface } from '../../models/payment_verification/IVerificationStatus';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';


const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));

function Order_UI() {
    const classes = useStyles();

    const [order, setOrder] = React.useState<Partial<OrderInterface>>({});
    const [user, setUser] = React.useState<UsersInterface[]>([]);
    const [userOrder, setUserOrder] = React.useState<OrderInterface[]>([]);
    const [basket, setBasket] = React.useState<BasketInterface[]>([]);

    const [ver_status, setVerStatus] = React.useState<VerificationStatusInterface[]>([]);
    const [userfriend, setUserFriend] = React.useState<FriendsInterface[]>([]);
    const [editOrder, setEditOrder] = useState<OrderInterface>();
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

    const [date, setDate] = React.useState<Dayjs | null>(dayjs());
    const [imageString, setImageString] = React.useState<string | ArrayBuffer | null>(null);

    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [openForNew, setOpenForNew] = React.useState(false);
    const [openForEdit, setOpenForEdit] = React.useState(false);

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
        setErrorMsg("");
    };

    const handleClickOpenForNew = () => {
        setOpenForNew(true);
    };

    const handleCloseForNew = () => {
        setOpenForNew(false);
    };

    const handleClickOpenForEdit = (item: OrderInterface) => {
        setOpenForEdit(true);
        setEditOrder(item);
    };

    const handleCloseForEdit = () => {
        setOpenForEdit(false);
    };

    const handleSendGift = () => {
        setOrder({ ...order, Send_gift: true });
    }

    const handleImageChange = (event: any) => {
        const image = event.target.files[0];
    
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => {
            const base64Data = reader.result;
            setImageString(base64Data)
        }
      }
    

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
                    setUserFriend(res.data);
                }
            });
    };

    const getOrder = async () => {
        const apiUrl = "http://localhost:8080/order"
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
                    setImageString(res.data.Slip);
                }
            });
    };

    const getUserBasketForOrder = async () => {                                 
        const apiUrl = "http://localhost:8080/userbasketfororder/"+String(localStorage.getItem("uid"));
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

    const getUserOrder = async () => {                                 
        const apiUrl = "http://localhost:8080/userorder/"+localStorage.getItem("uid");
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
                    setUserOrder(res.data);
                    console.log("============1");
                    console.log(res.data);
                    console.log("============2");
                }
            });
    };

    const Neworder = () => {
        let data = {
            User_ID: Number(localStorage.getItem("uid")),
            Verification_Status_ID: 1,
            Slip: imageString,
            Date: date,
            Send_gift: order.Send_gift,
            Friend_ID: order.Friend_ID,
        };
        console.log(data)

        const apiUrl = "http://localhost:8080/order/"+localStorage.getItem("uid");
  
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
                    setErrorMsg(" - "+res.error);
                }
            });
      
    }

    const updateOrder = () => {
        let data = {
            ID: editOrder?.ID,
            Verification_Status_ID: 1,
            Slip: imageString,   
        };
        const apiUrl = "http://localhost:8080/order";  
        const requestOptions = {     
            method: "PATCH",      
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },     
            body: JSON.stringify(data),
        };
      
        fetch(apiUrl, requestOptions)
        .then((response) => response.json())      
        .then(async (res) => {      
            if (res.data) {
                setSuccess(true);
                window.location.reload();     
            } else {
                setError(true);
                setErrorMsg(" - "+res.error);     
            }
        });        
    }

    useEffect(() => {
        getOrder();
        getUserOrder(); 
        getVerStatus();
        getUserFriend();
        getUserBasketForOrder();
        console.log(order)  
    }, []);

    function SendtoFriend(Send_gift: Boolean | undefined) {
        if(!Send_gift) {
            return (
                <Grid marginTop={1} container justifyContent="center">
                    <Button variant="contained" color="primary" onClick={handleSendGift} endIcon={<CardGiftcardIcon />}>
                        Send To
                    </Button>
                </Grid>
            )
        }else{
            return(
                <Grid container justifyContent={"center"}>
                    <Grid container justifyContent={"center"}>
                        <h3>Send to friend</h3>
                    </Grid>

                    <Grid container justifyContent={"center"}
                        sx={{
                        paddingY: 2,
                        }}
                    >
                    <Grid item xs={1}>
                        <h4>Friend:</h4>
                    </Grid>
                    <Grid margin={1} item xs={4}>
                    <Autocomplete
                        id="friend-autocomplete"
                        options={userfriend}
                        fullWidth
                        size="small"
                        onChange={(event: any, value) => {
                        console.log(value?.ID); 
                            setOrder({ ...order, Friend_ID: value?.ID });
                        }}
                        getOptionLabel={(option: any) =>
                        `${option.Nickname}`
                        }
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
                            >{`${option.Nickname}`}</li>
                        );
                        }}
                        />
                    </Grid>    
                    </Grid>
                </Grid>
            )
        }
    }

    return (
        <Box>
            <Snackbar                                                                                 //ป้ายบันทึกสำเร็จ
                open={success}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleClose} severity="success">              
                    สั่งซื้อสำเร็จ
                </Alert>
            </Snackbar>

            <Snackbar                                                                                 //ป้ายบันทึกไม่สำเร็จ
                open={error} 
                autoHideDuration={6000} 
                onClose={handleClose} 
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleClose} severity="error">
                    สั่งซื้อไม่สำเร็จ{errorMsg}
                </Alert>
            </Snackbar>

            <Grid container justifyContent="center">
                <h1>My Order</h1>
            </Grid>
            
            <Grid container direction='row-reverse'>
                <Button id="new-order" color="primary" endIcon={<AddShoppingCartIcon/>} onClick={handleClickOpenForNew}>
                    New Order
                </Button>
            </Grid>

            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="Order">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center"><h4>Order ID</h4></TableCell>
                            <TableCell align="center"><h4>Status</h4></TableCell>
                            <TableCell align="center"><h4>Slip</h4></TableCell>
                        </TableRow>
                    </TableHead>
                        <TableBody>
                            {userOrder.map((item) => (
                                <TableRow key={item.ID}>
                                    <TableCell align="center">{item.ID}</TableCell> 
                                    <TableCell align="center">{item.Verification_Status.Status_type}</TableCell>      
                                    <TableCell align="center"><img src={`${item.Slip}`} width="250" height="250"/></TableCell>                    
                                        <Stack direction="column" spacing={3}>
                                            <Button variant="outlined" color="inherit" onClick={() => handleClickOpenForEdit(item)}>
                                                Edit
                                            </Button>
                                        </Stack>
                                </TableRow>
                            ))}
                        </TableBody>
                </Table>
            </TableContainer>
            
            <Dialog fullWidth maxWidth="xl" open={openForNew} onClose={handleCloseForNew}>
                <DialogTitle id="alert-dialog-title">Order</DialogTitle>
                <DialogContent>
                    <DialogContentText>Make a new order</DialogContentText>
                        
                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="Basket">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center"><h4>Game</h4></TableCell>
                                    <TableCell align="center"><h4>Price</h4></TableCell>
                                    <TableCell align="center"><h4>Note</h4></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {basket.map((item) => (
                                    <TableRow key={item.ID}>
                                        <TableCell align="center" component="th" scope="row">{item.Game.Game_Name}</TableCell>
                                        <TableCell align="center">{item.Game.Game_Price}</TableCell>     
                                        <TableCell align="center">{item.Note}</TableCell>                     
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

                    {/* Verification Status */}
                    <Grid container justifyContent={"center"} marginTop={2} sx={{ paddingY: 2,}}>
                        <Grid item xs={1}>
                            <h4>Status:</h4>
                        </Grid>
                        <Grid margin={1} item xs={4}>
                            <TextField
                                disabled
                                id="ver_status-id"
                                label="รอตรวจสอบ"
                                variant="outlined"                                
                            />
                        </Grid>
                    </Grid>

                    {/* Slip */}
                    <Grid container justifyContent={"center"} sx={{ paddingY: 2,}}>
                        <Grid item xs={1}>
                            <h4>Slip:</h4>
                        </Grid>
                        <Grid margin={1} item xs={6} md={4}>
                            <img src={`${imageString}`} width="300" height="400"/>
                            <Grid>
                                <input type="file" onChange={handleImageChange} />
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

                        {SendtoFriend(order.Send_gift)}

                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCloseForNew} color="error">Cancel</Button>
                    <Button variant="contained" color="success" onClick={Neworder} autoFocus>Buy</Button>
                </DialogActions>
            </Dialog>

            <Dialog fullWidth maxWidth="xl" open={openForEdit} onClose={handleCloseForEdit} >
                <DialogTitle>Edit Slip</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>
                        {editOrder?.Slip}
                    </DialogContentText> */}
                    <Grid container justifyContent={"center"} sx={{ paddingY: 2,}}>
                        <Grid item xs={1}>
                            <h4>Slip:</h4>
                        </Grid>
                        <Grid margin={1} item xs={6} md={4}>
                            <img src={`${imageString}`} width="300" height="400"/>
                            <Grid>
                                <input type="file" onChange={handleImageChange} />
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
                    <Button onClick={handleCloseForEdit} color="error">Cancel</Button>
                    <Button onClick={updateOrder} color="success">Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
  );
}
export default Order_UI

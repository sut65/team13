import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
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
import { OptionsInterface } from '../../models/order/IOption';
import { FriendsInterface } from '../../models/friend/IFriend';

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
    const [option, setOption] = React.useState<OptionsInterface[]>([]);
    const [userfriend, setUserFriend] = React.useState<FriendsInterface[]>([]);
    // const [sendgift, setSendgift] = React.useState<OrderInterface[]>([]);

    const [date, setDate] = React.useState<Dayjs | null>(dayjs());
    const [imageString, setImageString] = React.useState<string | ArrayBuffer | null>(null);

    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [openForNew, setOpenForNew] = React.useState(false);
    const [CloseForNew, setCloseForNew] = React.useState(false);

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

    const handleClickOpenForNew = () => {
        setOpenForNew(true);
    };

    const handleCloseForNew = () => {
        setOpenForNew(false);
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

    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }

    // const getUserOrder = async () => {                                 
    //     const apiUrl = "http://localhost:8080/userorder/"+String(localStorage.getItem("uid"));
    //     const requestOptions = {
    //         method: "GET",      
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem("token")}`,
    //             "Content-Type": "application/json",
    //         },     
    //     };
    //     fetch(apiUrl, requestOptions)
    //         .then((response) => response.json())
    //         .then((res) => {
    //             if (res.data) {
    //                 setOrder(res.data);
    //             }
    //         });
    // };

    const getUser = async () => {                                                                                        
        const apiUrl = "http://localhost:8080/user/"+localStorage.getItem("email");
        const requestOptions = {
            method: "GET",
            eaders: {
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

    const getBasket = async () => {                                                                                        
        const apiUrl = "http://localhost:8080/baskets";
        const requestOptions = {
            method: "GET",
            eaders: {
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
    
    const getOption = async () => {                                
        const apiUrl = "http://localhost:8080/options";
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
      
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    setOption(res.data);
                }
            });
    };

    const getUserFriend = async () => {                                                                                    
        const apiUrl = "http://localhost:8080/userfriend"+String(localStorage.getItem("uid"));
        const requestOptions = {
            method: "GET",
            eaders: {
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

    const getUserOrder = async () => {                                 
        const apiUrl = "http://localhost:8080/userorder/"+localStorage.getItem("email");
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


    // const updateItem = () => {
    //     let data = {
    //         Basket_ID: Number(localStorage.getItem("bid")),
    //         Option_ID: Number(localStorage.getItem("option_id")),   
    //     };
    //     const apiUrl = "http://localhost:8080/order";  
    //     const requestOptions = {     
    //         method: "PATCH",      
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem("token")}`,
    //             "Content-Type": "application/json",
    //         },     
    //         body: JSON.stringify(data),
    //     };
      
    //     fetch(apiUrl, requestOptions)
    //     .then((response) => response.json())      
    //     .then(async (res) => {      
    //         if (res.data) {
    //             setSuccess(true);
    //             await timeout(1000); //for 1 sec delay
    //             window.location.reload();     
    //         } else {
    //             setError(true);     
    //         }
    //     });        
    // }

    const Neworder = () => {
        let data = {
            User_ID: Number(localStorage.getItem("uid")),
            Basket_ID: order.Basket_ID,
            Option_ID: order.Option_ID,
            Slip: imageString,
            Date: date,
            Send_gift: order.Send_gift,
            Frind_ID: order.Friend_ID,
        };
        console.log(data)

        const apiUrl = "http://localhost:8080/order";
  
        const requestOptions = {
  
          method: "POST",
  
          headers: { "Content-Type": "application/json" },
  
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

    useEffect(() => {
        getOrder();
        getUserOrder(); 
        getUser();
        getBasket();
        getOption();
        getUserFriend();
        console.log(order)  
    }, []);

    function SendtoFriend(Send_gift: Boolean | undefined) {
        if(!Send_gift) {
            return (
                <Grid marginTop={1} container justifyContent="center">
                    <Button variant="contained" color="default" onClick={handleSendGift} endIcon={<CardGiftcardIcon />}>
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
                        `${option.Freind_ID}`
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
                            >{`${option.Friend_ID}`}</li>
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

            <Grid container justifyContent="center">
                <h1>My Order</h1>
            </Grid>
            
            <Grid container sx={{ padding: 2}} direction='row-reverse'>
                <Grid container item xs={4} direction='row-reverse'>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" color="primary" endIcon={<AddShoppingCartIcon />} onClick={handleClickOpenForNew}>
                            New Order
                        </Button>
                    </Stack>
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="Order">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center"><h4>Order ID</h4></TableCell>
                            <TableCell align="center"><h4>Basket ID</h4></TableCell>
                            <TableCell align="center"><h4>Option</h4></TableCell>
                        </TableRow>
                    </TableHead>
                        <TableBody>
                            {userOrder.map((item) => (
                                <TableRow key={item.ID}>
                                    <TableCell align="center">{item.ID}</TableCell> 
                                    <TableCell align="center">{item.Basket_ID}</TableCell> 
                                    <TableCell component="th" scope="row">{item.Option.Option_name}</TableCell>                         
                                </TableRow>
                            ))}
                        </TableBody>
                </Table>
            </TableContainer>
            
            <Dialog maxWidth="xl" fullWidth open={openForNew} onClose={handleCloseForNew}>
                <DialogTitle id="alert-dialog-title">{"Order"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>Make a new order</DialogContentText>
                    
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
                            สั่งซื้อไม่สำเร็จ
                        </Alert>
                    </Snackbar>

                    {/* Basket ID */}
                    <Grid container justifyContent={"center"} marginTop={2} sx={{ paddingY: 2,}}>
                        <Grid item xs={1}>
                            <h4>Basket ID:</h4>
                        </Grid>
                        <Grid margin={1} item xs={4}>
                            <Autocomplete
                                id="basket-autocomplete"
                                options={basket}
                                fullWidth
                                size="small"
                                onChange={(event: any, value) => {
                                console.log(value?.ID); 
                                    setOrder({ ...order, Basket_ID: value?.ID });
                                }}
                                getOptionLabel={(option: any) =>
                                `${option.Basket_ID}`
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
                                        >{`${option.Basket_ID}`}</li>
                                    );
                                }}
                            />
                        </Grid>
                    </Grid>

                    {/* Option ID */}
                    <Grid container justifyContent={"center"} marginTop={2} sx={{ paddingY: 2,}}>
                        <Grid item xs={1}>
                            <h4>Option ID:</h4>
                        </Grid>
                        <Grid margin={1} item xs={4}>
                            <Autocomplete
                                id="option-autocomplete"
                                options={option}
                                fullWidth
                                size="small"
                                onChange={(event: any, value) => {
                                    setOrder({ ...order, Option_ID: value?.ID });
                                }}
                                getOptionLabel={(option: any) =>
                                `${option.Option_ID}`
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
                                        >{`${option.Option_name}`}</li>
                                    );
                                }}
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
                    <Button onClick={handleCloseForNew} color="secondary">Cancel</Button>
                    <Button variant="contained" color="primary" onClick={Neworder} autoFocus>Buy</Button>
                </DialogActions>
            </Dialog>
        </Box>
  );
}
export default Order_UI

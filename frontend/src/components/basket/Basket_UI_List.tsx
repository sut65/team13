// import { useEffect, useState } from "react";
// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
// import Dialog from '@material-ui/core/Dialog';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import IconButton from '@material-ui/core/IconButton';
// import Typography from '@material-ui/core/Typography';
// import CloseIcon from '@mui/icons-material/Close';
// import Slide from '@material-ui/core/Slide';
// import { BasketInterface } from '../../models/basket/IBasket';
// import { DataGrid, GridColDef } from "@mui/x-data-grid";
// import { Container } from "@mui/material";
// import DeleteIcon from '@mui/icons-material/Delete';

// const useStyles = makeStyles((theme) => ({
//   appBar: {
//     position: 'relative',
//   },
//   title: {
//     marginLeft: theme.spacing(2),
//     flex: 1,
//   },
// }));

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

// function Basket_List() {
//   const classes = useStyles();
//   const [open, setOpen] = React.useState(false);

//   const [basket, setBasket] = useState<BasketInterface[]>([]);

//   const getBasket = async () => {                                                              //7.ดึงข้อมูลผู้ป๋วย                                   
//     const apiUrl = "http://localhost:8080/baskets";
//     const requestOptions = {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//     };

//     fetch(apiUrl, requestOptions)
//         .then((response) => response.json())
//         .then((res) => {
//             if (res.data) {
//                 setBasket(res.data);
//             }
//         });
//   };

//   const columns: GridColDef[] = [
//     {
//       field: "Game",
//       headerName: "Game",
//       width: 500,
//       valueGetter: (params) => params.value.Game_Name,
//     },
//     {
//       field: "Note",
//       headerName: "โน๊ต",
//       width: 250,
//     },
//   ];

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   useEffect(() => {
//     getBasket();
//   }, []);

//   return (
//     <div>
//       <Button variant="outlined" color="primary" onClick={handleClickOpen}>
//         My Basket
//       </Button>
//       <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Slide}>
//         <AppBar className={classes.appBar}>
//           <Toolbar>
//             <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
//               <CloseIcon />
//             </IconButton>
//             <Typography variant="h6" className={classes.title}>
//               Basket
//             </Typography>
//             <Button autoFocus color="inherit" onClick={handleClose}>
//               Save
//             </Button>
//           </Toolbar>
//         </AppBar>
//         <div>
//             <Container maxWidth="xl">
//                 <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
//                 <DataGrid
//                     rows={basket}
//                     getRowId={(row) => row.ID}
//                     columns={columns}
//                     pageSize={5}
//                     rowsPerPageOptions={[5]}
//                 />
//         </div>
//       </Container>
//     </div>
//       </Dialog>
//     </div>
//   );
// }
// export default Basket_List;

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
import { Box } from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function Basket_List() {
    const classes = useStyles();

    const [basket, setBasket] = useState<BasketInterface[]>([]);

    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);

    const handleClose = (                                                                         //ป้ายบันทึกเปิดปิด
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
        return;
        }
        setSuccess(false);
        setError(false);
    };

    const getBasket = async () => {                                  
        const apiUrl = "http://localhost:8080/baskets";
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
    
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    setBasket(res.data);
                }
            });
    };

    const deleteItem = (id: number) => {                                                          //8.บันทึกการนัด
        let data = {                                   //ประกาศก้อนข้อมูล
            ID: id,      
        };
        const apiUrl = "http://localhost:8080/basket/:id";           //ส่งขอบันทึก  
        const requestOptions = {     
            method: "DELETE",      
            headers: { "Content-Type": "application/json" },      
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
        getBasket();
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
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Note</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {basket.map((item) => (
                            <TableRow key={item.ID}>
                                <TableCell component="th" scope="row">
                                    {item.Game.Game_Name}
                                </TableCell>
                                <TableCell align="right">{item.Game.Game_Price}</TableCell>                         
                                <TableCell align="right">{item.Note}</TableCell>
                                <TableCell align="right">
                                    <Button variant="contained" color="secondary" onClick={() => deleteItem(item.ID)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
            </Table>
        </Box>
  );
}
export default Basket_List;

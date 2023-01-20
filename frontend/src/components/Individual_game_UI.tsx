import * as React from 'react';
import Button from "@mui/material/Button";
import { Container, Grid, Paper } from '@mui/material';
import Box from "@mui/material/Box";
import Moment from 'moment';
import dayjs, { Dayjs } from "dayjs";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import { Dialog } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import TextField from "@mui/material/TextField";

import { useParams } from 'react-router-dom';
import { GamesInterface } from '../models/game/IGame';

function Individual_game(){
    Moment.locale('th');
    const { id } = useParams(); // ดึง parameter จาก url-parameter
    const [isDataLoaded, setIsDataloaded] = React.useState<boolean | null>(false);
    const [games, setgames] = React.useState<Partial<GamesInterface>>({});

    const [note, setNote] = React.useState<string>("");
    const [date, setDate] = React.useState<Dayjs | null>(dayjs());

    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [openForAdd, setOpenForAdd] = React.useState(false);

    const getGame = async () => {
        const apiUrl = "http://localhost:8080/Game/"+id;
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
                    setgames(res.data);
                    console.log(res.data);
                }
            });
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
            Game_ID: Number(id),
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
    }

    React.useEffect(() => {
        const fetchData = async () => {
            await getGame();
            setIsDataloaded(true);
        }
        fetchData();
    }, []);

    if(isDataLoaded) return (
        <Container>
            <Box>
                <Paper elevation={2} sx={{padding:2,margin:2}}>
                    <Grid container>
                        <h2>{games.Game_Name}</h2>
                    </Grid>

                    <Grid container> {/** Game Description */}
                        <Grid>
                            <img src={`${games.Game_Picture}`} width="700" height="400"/>
                        </Grid>
                        <Grid marginLeft={4}>
                            <Box
                                component="div"
                                sx={{
                                width : 300,
                                textOverflow: 'ellipsis',overflow: 'hidden',
                                whiteSpace: 'break-spaces',
                                my: 2,
                                p: 1,
                                bgcolor: (theme) =>
                                    theme.palette.mode === 'dark' ? '#101010' : 'grey.100',
                                color: (theme) =>
                                    theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                                border: '1px solid',
                                borderColor: (theme) =>
                                    theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                                borderRadius: 2,
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                }}
                                >{/** กำหนดให้เว้นบรรทัด auto จาก white space */}
                                {games.Game_description}
                            </Box>
                            <Grid>
                                Publish Date : {`${Moment(games.Publish_Date).format('DD MMMM YYYY')}`}
                            </Grid>
                            <Grid>
                                Publisher : {`${games.Seller?.Profile_Name}`}
                            </Grid>
                            <Grid>
                                Rating : {`${games.Rating?.Rating_Name}`}
                            </Grid>
                            <Grid>
                                Tag : {`${games.Type_Game?.Type_Game_Name}`}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Box sx={{ mt: 1}}
                            m={1}
                            display="flex"
                            justifyContent="flex-end"
                            alignItems="flex-end"
                        >
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="success"
                                sx={{ mt: 1, mb: 2 }}
                                onClick={handleClickOpenForAdd}
                            >
                                Add to Busket
                            </Button>
                        </Box>
                    </Grid>
                </Paper>
            </Box>
            <Box> {/** Popup ต่างๆ */}
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
                        บันทึกข้อมูลไม่สำเร็จ หรือคุณมีเกมอยู่ในตะกร้าอยู่แล้ว
                    </Alert>
                </Snackbar>
                <Dialog fullWidth maxWidth="xl" open={openForAdd} onClose={handleCloseForAdd} >
                    <DialogTitle>Add to Basket</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {games.Game_Name}
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
                        <Button color="success" onClick={AddToBasket}>Add</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
    return null;
}

export default Individual_game

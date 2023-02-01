import * as React from 'react';
import Button from "@mui/material/Button";
import { Container, Grid, Paper } from '@mui/material';
import Box from "@mui/material/Box";
import Moment from 'moment';
import dayjs, { Dayjs } from "dayjs";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Dialog } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import TextField from "@mui/material/TextField";
import Autocomplete from '@mui/material/Autocomplete';

import { useParams } from 'react-router-dom';
import { GamesInterface } from '../models/game/IGame';
import { Wish_levelInterface } from '../models/wishlist/IWish_Level';
import { WishlistsInterface } from '../models/wishlist/IWishlist';

function Individual_game() {
    Moment.locale('th');
    const { id } = useParams(); // ดึง parameter จาก url-parameter
    const [isDataLoaded, setIsDataloaded] = React.useState<boolean | null>(false);
    const [isGameOnStore, setIsGameOnStore] = React.useState<boolean | null>(false);
    const [games, setgames] = React.useState<GamesInterface[]>([]);

    const [wish_levels, setWish_Levels] = React.useState<Wish_levelInterface[]>([]);
    const [toEditWishlist, setToEditWishlist] = React.useState<WishlistsInterface>();
    const [wish_levelEdit, setWish_LevelEdit] = React.useState<String>();

    const [note, setNote] = React.useState<string>("");
    const [date, setDate] = React.useState<Dayjs | null>(dayjs());

    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
    const [openForAdd, setOpenForAdd] = React.useState(false);

    const [errorwishlist, setErrorWishlist] = React.useState(false);
    const [openAddWishlist, setOpenAddWishlist] = React.useState(false);
    const [noteWishlist, setNoteWishlist] = React.useState<string>("");
    const [wishMessage, setAlertWihsMessage] = React.useState("");


    const getGame = async () => {
        const apiUrl = "http://localhost:8080/Individual_Game/" + id;
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
                    // เป็นการทำให้ state ของ games ถูกเปลี่ยนทันที เพราะหากไม่ทำแบบนี้ games จะไม่ถูก set โดยทันทีแล้วค่าจะไม่ออก
                    // แต่จริงๆแล้วมันน่าจะเป็นการเติม array เข้าไปมากกว่า แต่ด้วยเหตุผลทางเทคนิคมันทำให้ใช้ได้
                    setgames(prevgames => ([...prevgames, ...res.data]));
                    if(res.data[0].DeletedAt == null){
                        setIsGameOnStore(true);
                    }
                }
            });
    };

    const getWish_Level = async () => {
        const apiUrl = "http://localhost:8080/wish_levels";
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
                    setWish_Levels(res.data);
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
        setErrorWishlist(false);
        setErrorMsg("");
    };

    const handleClickOpenForAdd = () => {
        setOpenForAdd(true);
    };

    const handleCloseForAdd = () => {
        setOpenForAdd(false);
    };

    const handleClickOpenForAddWishlist = () => {
        setOpenAddWishlist(true);
    };

    const handleCloseForAddWishlist = () => {
        setOpenAddWishlist(false);
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
                    setOpenForAdd(false);
                } else {
                    setError(true);
                    setErrorMsg(" - " + res.error);
                }
            });
    };

    const AddToWishlist = () => {
        let data = {                                   //ประกาศก้อนข้อมูล
            User_ID: Number(localStorage.getItem("uid")),
            Game_ID: Number(id),
            Wish_Level_ID: wish_levelEdit,
            Note: noteWishlist,
            Date: date,
        };

        const apiUrl = "http://localhost:8080/wishlists";           //ส่งขอบันทึก
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
                    setOpenAddWishlist(false);
                    
                } else {
                    setErrorWishlist(true);
                    setAlertWihsMessage(res.error);
                }
            });
    };

    React.useEffect(() => {

        const fetchData = async () => {
            await getWish_Level();
            await getGame();
            setIsDataloaded(true);
        }
        fetchData();

    }, []);

    if (isDataLoaded && isGameOnStore) return (
        <Container>
            <Box>
                <Paper elevation={2} sx={{ padding: 2, margin: 2 }}>
                    <Grid container>
                        <h2>{games[0].Game_Name}</h2>
                    </Grid>

                    <Grid container> {/** Game Description */}
                        <Grid>
                            <img src={`${games[0].Game_Picture}`} width="700" height="400" />
                        </Grid>
                        <Grid marginLeft={4}>
                            <Box
                                component="div"
                                sx={{
                                    width: 300,
                                    textOverflow: 'ellipsis', overflow: 'hidden',
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
                                {games[0].Game_description}
                            </Box>
                            <Grid>
                                Publish Date : {`${Moment(games[0].Publish_Date).format('DD MMMM YYYY')}`}
                            </Grid>
                            <Grid>
                                Publisher : {`${games[0].Seller?.Profile_Name}`}
                            </Grid>
                            <Grid>
                                Rating : {`${games[0].Rating?.Rating_Name}`}
                            </Grid>
                            <Grid>
                                Tag : {`${games[0].Type_Game?.Type_Game_Name}`}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container> {/** Wish list */}
                        <Box sx={{ mt: 1 }}
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
                                Add to Basket
                            </Button>
                        </Box>
                        <Box sx={{ mt: 1 }}
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
                                onClick={handleClickOpenForAddWishlist}
                            >
                                Add to Wishlist
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
                        บันทึกข้อมูลไม่สำเร็จ {errorMsg}
                    </Alert>
                </Snackbar>
                <Dialog fullWidth maxWidth="xl" open={openForAdd} onClose={handleCloseForAdd} >
                    <DialogTitle>Add to Basket</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {games[0].Game_Name}
                        </DialogContentText>
                        <Grid>
                            Note
                        </Grid>
                        <Grid>
                            <TextField
                                id="outlined-basic"
                                placeholder="Ex. Nice to have"
                                variant="outlined"
                                size="medium"
                                multiline={true}
                                minRows={9}
                                maxRows={2}
                                fullWidth={true}
                                onChange={(event) => setNote(event.target.value)}
                            />
                        </Grid>
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
                        <Button color="inherit" onClick={handleCloseForAdd}>Cancel</Button>
                        <Button color="success" onClick={AddToBasket}>Add</Button>
                    </DialogActions>
                </Dialog>
            </Box>


            <Box> {/** Popup ต่างๆ ระบบ Wishlist */}
                <Snackbar                                                                                 //ป้ายบันทึกไม่สำเร็จ
                    open={errorwishlist}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert onClose={handleClose} severity="error">
                        บันทึกข้อมูลไม่สำเร็จ {wishMessage}
                    </Alert>
                </Snackbar>
                <Dialog fullWidth maxWidth="md" open={openAddWishlist} onClose={handleCloseForAddWishlist} >
                    <DialogTitle>Add to Wishlist</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {games[0].Game_Name}
                        </DialogContentText>

                        <Grid marginTop={2}>
                            <Grid>
                                Wish Level
                            </Grid>
                            <Grid>
                                <Autocomplete
                                    id="intimate-edit-autocomplete"
                                    options={wish_levels}
                                    size="small"
                                    defaultValue={toEditWishlist?.Wish_Level}
                                    onChange={(event: any, value) => {
                                        setWish_LevelEdit(event.target.value);
                                    }}
                                    getOptionLabel={(option: any) =>
                                        `${option.Level}`
                                    } //filter value
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
                                            >{`${option.Level}`}</li>
                                        ); //display value
                                    }}
                                />
                                </Grid>
                                <Grid marginTop={2}>
                                <TextField
                                    id="outlined-basic"
                                    placeholder="Insert details"
                                    variant="outlined"
                                    size="medium"
                                    multiline={true}
                                    minRows={9}
                                    maxRows={2}
                                    fullWidth={true}
                                    onChange={(event) => setNoteWishlist(event.target.value)}
                                />
                                </Grid>
                                <Grid>
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
                        <Button onClick={handleCloseForAddWishlist}>Cancel</Button>
                        <Button color="success" onClick={AddToWishlist}>Add</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
    else if(!isGameOnStore) return (
        <Container>
            <Box>
                <Grid container justifyContent={"center"} marginTop={50}>
                    <h1>ไม่มีเกมนี้อยู่หรือถูกถอดออกจากหน้าร้านค้าไปแล้ว</h1>
                </Grid>
            </Box>
        </Container>
    );
    else return(
        <Container>
            <Box>
                <Grid container justifyContent={"center"} marginTop={50}>
                    <h1>Loading</h1>
                </Grid>
            </Box>
        </Container>
    );
}

export default Individual_game

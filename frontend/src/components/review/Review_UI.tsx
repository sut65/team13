import * as React from 'react';
import { Container, Snackbar, makeStyles } from "@material-ui/core";
import { Alert, Autocomplete, Box, Button, FormHelperText, Grid, Paper, TextField ,Rating } from '@mui/material';
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Stack } from '@mui/material';
import { Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions } from "@material-ui/core";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs ,{ Dayjs } from "dayjs";
import Moment from 'moment';

import { GamesInterface } from '../../models/game/IGame';
import { ReviewInterface } from '../../models/review/IReview';
import { UsersInterface } from '../../models/user/IUser';
import { StarInterface } from '../../models/review/IStar';
import { useParams } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import SaveIcon from "@mui/icons-material/Save";
import AutoModeIcon from '@mui/icons-material/AutoMode';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

function Review_UI(){
    Moment.locale('th');

    const { id } = useParams();
    const [submitSuccess, setSubmitSuccess] = React.useState(false);
    const [submitError, setSubmitError] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

    const [searchQuery, setSearchQuery] = React.useState("");
    const [openDialogForCreate, setOpenDialogForCreate] = React.useState(false);
    const [openDialogForUpdate, setOpenDialogForUpdate] = React.useState(false);
    const [openDialogForDelete, setOpenDialogForDelete] = React.useState(false);

    const [date, setDate] = React.useState<Dayjs | null>(dayjs());

    const [games, setGames] = React.useState<GamesInterface[]>([]);
    const [users, setUsers] = React.useState<UsersInterface[]>([]);
    const [stars, setStars] = React.useState<StarInterface[]>([]);
    const [reviews, setReviews] = React.useState<Partial<ReviewInterface>>({});
    const [reviewsTable, setReviewsTable] = React.useState<ReviewInterface[]>([]);
    const [reviewsForUpdateDefault, setReviewsForUpdateDefault] = React.useState<ReviewInterface[]>([]);


    const handleClose = ( // AlertBar
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setSubmitSuccess(false);
        setSubmitError(false);
        setErrorMsg("");
    };

    const handleDialogClickOpenForCreate = () => {
        setOpenDialogForCreate(true);
    };

    const handleDialogClickOpenForUpdate = (item : any) => {
        setReviews(item);
        setOpenDialogForUpdate(true);
    };

    const handleDialogClickOpenForDelete = (item : any) => {
        setReviews(item);
        setOpenDialogForDelete(true);
    };

    const handleDialogClose = () => {
        setOpenDialogForCreate(false);
        setOpenDialogForUpdate(false);
        setOpenDialogForDelete(false);
    };
      
    const getStar = async () => {
        const apiUrl = "http://localhost:8080/stars";
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
                    setStars(res.data);
                }
            });
    };
    
    const getGame = async () => {
        const apiUrl = "http://localhost:8080/Game";
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
                    setGames(res.data);
                }
            });
    };

    const getUser = async () => {
        const apiUrl = "http://localhost:8080/sellers";
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
                    setUsers(res.data);
                }
            });
    };

    const getReview = async () => {
        const apiUrl = "http://localhost:8080/review";
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
                    setReviewsTable(res.data);
                    console.log(res.data);
                }
            });
    };

   

    const createReview = () => {
        let createData = {
            Comment: reviews.Comment,
            Date: date,
            Star_ID: reviews.Star_ID,
            Game_ID: Number(id),
            User_ID: Number(localStorage.getItem('uid')),
        };

        console.log(createData)

        const apiUrl = "http://localhost:8080/reviews";
        const requestOptions = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(createData),
        };

        fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                setOpenDialogForCreate(false);
                setSubmitSuccess(true);
            } else {
                setSubmitError(true);
                setErrorMsg(" - "+res.error);
            }
        });

    }

    const updateReview = () => {
        let updateData = {
            ID: reviews.ID, 
            Comment: reviews.Comment,
            Date: date,
            Star_ID: reviews.Star_ID,
            Game_ID: Number(id),
            User_ID: Number(localStorage.getItem('uid')),
        };

        console.log(updateData)

        const apiUrl = "http://localhost:8080/reviews";
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
                setOpenDialogForUpdate(false);
                setSubmitSuccess(true);
                console.log(res.data);
            } else {
                setSubmitError(true);
                setErrorMsg(" - "+res.error);
            }
        });

    }

    const deleteReview = () => {
        const apiUrl = "http://localhost:8080/review/"+reviews.ID;
        const requestOptions = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };
    
        fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                setOpenDialogForDelete(false);
                setSubmitSuccess(true);
            } else {
                setSubmitError(true);
                setErrorMsg(" - "+res.error);
            }
        });
    }

    React.useEffect(() => {
        const fetchData = async () => {
            await getStar();
            await getGame();
            await getUser();
            await getReview();
        }
        fetchData();
    }, [submitSuccess]); // เมื่อ submit success จะทำการ reload เพื่อแสดงค่าทันทีในตาราง

    return (
        <Container maxWidth="xl">
            <Snackbar // บันทึกสำเร็จ
                id="success"
                open={submitSuccess}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert onClose={handleClose} severity="success">              
                    บันทึกข้อมูลสำเร็จ
                </Alert>
            </Snackbar>

            <Snackbar // บันทึกไม่สำเร็จ
                id="error"
                open={submitError} 
                autoHideDuration={3000} 
                onClose={handleClose} 
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert onClose={handleClose} severity="error">
                    บันทึกข้อมูลไม่สำเร็จ{errorMsg}
                </Alert>
            </Snackbar>

            {/** Create Button */}
            <Grid container justifyContent={"center"} marginTop={2}>
                <Button variant="contained" color="success" endIcon={<SaveIcon />} onClick={() => handleDialogClickOpenForCreate()}>Create New Review</Button>
            </Grid>

            {/** Table */}
            <Grid container justifyContent={"center"}>
                <TableContainer component={Paper} sx={{ width: "65%" }}>
                    <Table aria-label="Review">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><h4>ระดับความพึงพอใจ</h4></TableCell>
                                <TableCell align="center"><h4>Comment</h4></TableCell>
                                {/* <TableCell align="center"><h4>Game</h4></TableCell> */}
                                <TableCell align="center"><h4>User</h4></TableCell>
                                <TableCell align="center"><h4>Date</h4></TableCell>
                                <TableCell align="center"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {reviewsTable.filter(item => item.Game_ID == Number(id)).map((item) => (
                                <TableRow key={item.ID}>
                                    <TableCell align="center">{item.Star.Detail}</TableCell>
                                    <TableCell align="center">{item.Comment}</TableCell>                                    
                                    {/* <TableCell align="center">{item.Game.Game_Name}</TableCell> */}
                                    <TableCell align="center">{item.User.Profile_Name}</TableCell>
                                    <TableCell align="center">{`${Moment(item.Date).format('DD MMMM YYYY')}`}</TableCell>
                                    <TableCell align="center">
                                        {item.User_ID === Number(localStorage.getItem('uid')) && (
                                            <Stack direction="column" spacing={2}>
                                            <Button variant="outlined" color="inherit" endIcon={<AutoModeIcon/>} onClick={() => handleDialogClickOpenForUpdate(item)}>
                                                Edit
                                            </Button>
                                            <Button variant="contained" color="error" endIcon={<DeleteForeverOutlinedIcon/>} onClick={() => handleDialogClickOpenForDelete(item)}>
                                                Delete
                                            </Button>                                        
                                            </Stack>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            
            {/** Create Review Dialog*/}
            <Dialog
                open={openDialogForCreate}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">
                    {"Create New Review"}
                </DialogTitle>

                <DialogContent>
                    <Box> {/** Content Section */}
                        <Paper elevation={2} sx={{padding:2,margin:2}}>
                             <Grid container>
                                {/*<Grid container marginBottom={2}>
                                    <Autocomplete
                                        id="game-autocomplete"
                                        options={games}
                                        fullWidth
                                        size="medium"
                                        onChange={(event: any, value) => {
                                            setReviews({ ...reviews, Game_ID: value?.ID }); // บันทึกค่าลง interface
                                        }}
                                        getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                                            `${option.ID} - ${option.Game_Name}`
                                        } //filter value // เว้นวรรคระว่าง } กับ $ มีผลกับการแสดงผล
                                        renderInput={(params) => <TextField {...params} label="Game ID" />}
                                        renderOption={(props: any, option: any) => {
                                        return (
                                            <li
                                            {...props}
                                            value={`${option.ID}`}
                                            key={`${option.ID}`}
                                            >{`${option.ID} - ${option.Game_Name}`}</li>
                                        ); //การแสดงผล อันนี้เราเลือกแสดงผลเฉพาะ personal id แต่คืนค่าค่าเป็น id 
                                        }}
                                    />
                                </Grid> */}

                                <Grid container marginBottom={2}> {/** Star */}
                                    <Autocomplete
                                        id="star-autocomplete"
                                        options={stars}
                                        fullWidth
                                        size="medium"
                                        onChange={(event: any, value) => {
                                            setReviews({ ...reviews, Star_ID: value?.ID }); // บันทึกค่าลง interface
                                        }}
                                        getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                                            `${option.ID} - ${option.Detail}`
                                        } //filter value // เว้นวรรคระว่าง } กับ $ มีผลกับการแสดงผล
                                        renderInput={(params) => <TextField {...params} label="Star ID" />}
                                        renderOption={(props: any, option: any) => {
                                        return (
                                            <li
                                            {...props}
                                            value={`${option.ID}`}
                                            key={`${option.ID}`}
                                            >{`${option.ID} - ${option.Detail}`}</li>
                                        ); //การแสดงผล อันนี้เราเลือกแสดงผลเฉพาะ personal id แต่คืนค่าค่าเป็น id 
                                        }}
                                    />
                                </Grid>
                                
                                <Grid container marginBottom={2}> {/** Comment */}
                                    <TextField
                                        fullWidth
                                        id="review-Comment"
                                        label="Review Comment"
                                        variant="outlined"
                                        onChange={(event) => setReviews({ ...reviews, Comment: event.target.value })}
                                        />
                                </Grid>

                                <Grid container marginBottom={2}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            disabled
                                            label="DateTimePicker"
                                            value={date}
                                            onChange={(newValue) => {
                                                setDate(newValue);
                                            }}
                                            renderInput={(props) => <TextField {...props} />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleDialogClose}>Exit</Button>
                    <Button onClick={createReview} color="error" autoFocus>Create</Button>
                </DialogActions>
            </Dialog>

            {/** Update Topgame Dialog*/}
            <Dialog
                open={openDialogForUpdate}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">
                    {"Update New Review"}
                </DialogTitle>

                <DialogContent>
                    <Box> {/** Content Section */}
                        <Paper elevation={2} sx={{padding:2,margin:2}}>
                            <Grid container>
                                {/* <Grid container marginBottom={2}> 
                                    <Autocomplete
                                        id="game-autocomplete"
                                        options={games}
                                        fullWidth
                                        size="medium"
                                        defaultValue={reviews.Game}
                                        onChange={(event: any, value) => {
                                            setReviews({ ...reviews, Game_ID: value?.ID }); // บันทึกค่าลง interface
                                        }}
                                        getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                                            `${option.ID} - ${option.Game_Name}`
                                        } //filter value // เว้นวรรคระว่าง } กับ $ มีผลกับการแสดงผล
                                        renderInput={(params) => <TextField {...params} label="Game ID" />}
                                        renderOption={(props: any, option: any) => {
                                        return (
                                            <li
                                            {...props}
                                            value={`${option.ID}`}
                                            key={`${option.ID}`}
                                            >{`${option.ID} - ${option.Game_Name}`}</li>
                                        ); //การแสดงผล อันนี้เราเลือกแสดงผลเฉพาะ personal id แต่คืนค่าค่าเป็น id 
                                        }}
                                    />
                                </Grid> */}

                                <Grid container marginBottom={2}> {/** Star */}
                                    <Autocomplete
                                        id="Star-autocomplete"
                                        options={stars}
                                        fullWidth
                                        size="medium"
                                        defaultValue={reviews.Star}
                                        //defaultValue={banners[Number(user.Favorite_Game_ID)-1]} // ใช้ไม่ได้จะมีปัญหาเวลา ID = 3 แต่มีเกมในคลังแค่เกมเดียวงี้
                                        onChange={(event: any, value) => {
                                            setReviews({ ...reviews, Star_ID: value?.ID }); // บันทึกค่าลง interface
                                        }}
                                        getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                                            `${option.ID} - ${option.Detail}`
                                        } //filter value // เว้นวรรคระว่าง } กับ $ มีผลกับการแสดงผล
                                        renderInput={(params) => <TextField {...params} label="Star ID" />}
                                        renderOption={(props: any, option: any) => {
                                        return (
                                            <li
                                            {...props}
                                            value={`${option.ID}`}
                                            key={`${option.ID}`}
                                            >{`${option.ID} - ${option.Detail}`}</li>
                                        ); //การแสดงผล อันนี้เราเลือกแสดงผลเฉพาะ Detail แต่คืนค่าค่าเป็น id 
                                        }}
                                    />
                                </Grid>
                                
                                <Grid container marginBottom={2}> {/** Comment */}
                                    <TextField
                                        fullWidth
                                        id="review-Comment"
                                        label="Review Comment"
                                        variant="outlined"
                                        defaultValue={reviews.Comment}
                                        onChange={(event) => setReviews({ ...reviews, Comment: event.target.value })}
                                        />
                                </Grid>

                                <Grid container marginBottom={2}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            disabled
                                            label="DateTimePicker"
                                            value={date}
                                            onChange={(newValue) => {
                                                setDate(newValue);
                                            }}
                                            renderInput={(props) => <TextField {...props} />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleDialogClose}>Exit</Button>
                    <Button onClick={updateReview} color="error" autoFocus>Update</Button>
                </DialogActions>
            </Dialog>

            {/** Delete review Dialog*/}
            <Dialog
                open={openDialogForDelete}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure to delete Review?"}
                </DialogTitle>

                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        การกดที่ปุ่ม YES จะทำให้Reviewหายไปตลอดกาล
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleDialogClose}>NO</Button>
                    <Button onClick={deleteReview} color="error" autoFocus>YES</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Review_UI

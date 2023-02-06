import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Button from "@mui/material/Button";
import Autocomplete from '@mui/material/Autocomplete';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useParams } from 'react-router-dom';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";

import { UsersInterface } from '../../models/user/IUser';
import { GamesInterface } from '../../models/game/IGame';
import { ReviewInterface } from '../../models/review/IReview';
import { StarInterface } from '../../models/review/IStar';

import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import Moment from 'moment';
import { Container } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));

function Review_UI() {
    const classes = useStyles();
    Moment.locale('th');
    const { id } = useParams(); // ดึง parameter จาก url-parameter
    const [review, setReview] = useState<ReviewInterface[]>([]);
    const [toEditReview, setToEditReview] = useState<ReviewInterface>();
    const [deleteReview, setDeleteReview] = useState<ReviewInterface>();
    const [reviewAdd, setReviewAdd] = React.useState<Partial<ReviewInterface>>({});
    const [userForAdd, setUserForAdd] = useState<UsersInterface[]>([]);
    const [star, setStar] = useState<StarInterface[]>([]);
    const [game, setGame] = useState<GamesInterface[]>([]);
    const [date, setDate] = React.useState<Dayjs | null>(dayjs());
    const [toEditStar, setToEditStar] = React.useState<StarInterface>();

    const starForAdd = 1;
    const [comment, setComment] = React.useState<string>("");
    const [commentEdit, setCommentEdit] = React.useState<string>("");
    const [starEdit, setStarEdit] = React.useState<Number>();
    const [gameEdit, setGameEdit] = React.useState<Number>();

    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

    const [openForAdd, setOpenForAdd] = React.useState(false);
    const [openForEdit, setOpenForEdit] = React.useState(false);
    const [openForDelete, setOpenForDelete] = React.useState(false);
    const [errorreview, setErrorReview] = React.useState(false);
    const [noteReview, setNoteReview] = React.useState<string>("");
    const [ReviewMessage, setAlertReviewMessage] = React.useState("");
    const [searchQuery, setSearchQuery] = React.useState("");

    const [Numberstar, SetNumberstar] = React.useState<Number|null|undefined>();
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

    const handleClickOpenForEdit = (item: ReviewInterface) => {
        setOpenForEdit(true);
        setToEditReview(item);
    };

    const handleCloseForEdit = () => {
        setOpenForEdit(false);
    };

    const handleClickOpenForDelete = (item: ReviewInterface) => {
        setOpenForDelete(true);
        setDeleteReview(item);
    };

    const handleCloseForDelete = () => {
        setOpenForDelete(false);
    };

    function timeout(delay: number) {
        return new Promise(res => setTimeout(res, delay));
    }
    const AddToStar = () => {
        let data = {                                   //ประกาศก้อนข้อมูล
            User_ID: Number(localStorage.getItem("uid")),
            Game_ID: Number(id),
            Star_Level_ID: starEdit,
            Note: noteReview,
            Date: date,
        };

        const apiUrl = "http://localhost:8080/revies";           //ส่งขอบันทึก
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
                    // setOpenAddWishlist(false);
                    setAlertReviewMessage("บันทึกข้อมูลสำเร็จ");

                } else {
                    setErrorReview(true);
                    setAlertReviewMessage(res.error);
                }
            });
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

        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    setStar(res.data);
                    console.log(res.data)
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

        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    setGame(res.data);
                }
            });
    };

    const AddReview = () => {
        let data = {
            User_ID: Number(localStorage.getItem("uid")),
            Star_ID: reviewAdd.Star_ID || starForAdd,
            Comment: comment,
            Game_ID: reviewAdd.Game_ID,
            Date: date,
        };
        const apiUrl = "http://localhost:8080/reviews";           //ส่งขอบันทึก
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
            .then(async (res) => {
                if (res.data) {
                    setSuccess(true);
                    await timeout(1000); //for 1 sec delay
                    window.location.reload();
                } else {
                    setError(true);
                    setErrorMsg(" - " + res.error);
                }
            });
    }

    const updateReview = (id: number) => {
        let data = {       //ประกาศก้อนข้อมูล
            ID: id,
            Comment: commentEdit,
            Star_ID: starEdit,
            Game_ID: gameEdit,
        };
        const apiUrl = "http://localhost:8080/reviews";                      //ส่งขอการลบ  
        const requestOptions = {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        fetch(apiUrl, requestOptions)                                            //ขอการส่งกลับมาเช็คว่าบันทึกสำเร็จมั้ย
            .then((response) => response.json())
            .then(async (res) => {
                if (res.data) {
                    setSuccess(true);
                    await timeout(1000); //for 1 sec delay
                    window.location.reload();
                } else {
                    setError(true);
                    setErrorMsg(" - " + res.error);
                }
            });
    }


    const deleteUserFriend = (id: number) => {
        let data = {                                                            //ประกาศก้อนข้อมูล
            ID: id,
        };
        const apiUrl = "http://localhost:8080/friend/:id";                      //ส่งขอการลบ  
        const requestOptions = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        fetch(apiUrl, requestOptions)                                            //ขอการส่งกลับมาเช็คว่าบันทึกสำเร็จมั้ย
            .then((response) => response.json())
            .then(async (res) => {
                if (res.data) {
                    setSuccess(true);
                    await timeout(1000); //for 1 sec delay
                    window.location.reload();
                } else {
                    setError(true);
                    setErrorMsg(" - " + res.error);
                }
            });
    }


    React.useEffect(() => {

        const fetchData = async () => {
            await getStar();
            await getGame();
        }
        fetchData();

    }, []);


    return (
        <Container>
            <Box> {/** Popup ต่างๆ ระบบ review */}
                <Snackbar
                    id="error"                                                                                  //ป้ายบันทึกไม่สำเร็จ
                    open={success}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert onClose={handleClose} severity="error">
                        {errorMsg}
                    </Alert>
                </Snackbar>
                <Grid marginTop={2}>
                    <Grid>
                        Review
                    </Grid>
                    <Grid>
                        {/* <Autocomplete
                            id="Star"
                            options={star}
                            size="small"
                            defaultValue={toEditStar?.ID}
                            onChange={(event: any, value) => {
                                setStarEdit(event.target.value);
                            }}
                            getOptionLabel={(option: any) =>
                                `${option.Star_Level}`
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
                        /> */}
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
                            onChange={(event) => setNoteReview(event.target.value)}
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

                <Button color="success" onClick={AddToStar}>Add</Button>

            </Box>
        </Container>
    )
}
export default Review_UI;
import * as React from 'react';
import { Container, Snackbar, makeStyles } from "@material-ui/core";
import { Alert, Autocomplete, Box, Button, FormHelperText, Grid, Paper, TextField } from '@mui/material';
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Stack } from '@mui/material';
import { Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions } from "@material-ui/core";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs ,{ Dayjs } from "dayjs";
import Moment from 'moment';

import { GamesInterface } from '../../models/game/IGame';
import { TopgameInterface } from '../../models/topgame/ITopgame';
import { UsersInterface } from '../../models/user/IUser';

import SaveIcon from "@mui/icons-material/Save";
import AutoModeIcon from '@mui/icons-material/AutoMode';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

function Topgame_UI(){
    Moment.locale('th');

    const [submitSuccess, setSubmitSuccess] = React.useState(false);
    const [submitError, setSubmitError] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

    const [searchQuery, setSearchQuery] = React.useState("");
    const [openDialogForCreate, setOpenDialogForCreate] = React.useState(false);
    const [openDialogForUpdate, setOpenDialogForUpdate] = React.useState(false);
    const [openDialogForDelete, setOpenDialogForDelete] = React.useState(false);

    const [date, setDate] = React.useState<Dayjs | null>(dayjs());

    const [games, setGames] = React.useState<GamesInterface[]>([]);
    const [rankings, setRankings] = React.useState<UsersInterface[]>([]);
    const [topgames, setTopgames] = React.useState<Partial<TopgameInterface>>({});
    const [topgamesTable, setTopgamesTable] = React.useState<TopgameInterface[]>([]);
    const [topgamesForUpdateDefault, setTopgamesForUpdateDefault] = React.useState<TopgameInterface[]>([]);

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
        setTopgames(item);
        setOpenDialogForUpdate(true);
    };

    const handleDialogClickOpenForDelete = (item : any) => {
        setTopgames(item);
        setOpenDialogForDelete(true);
    };

    const handleDialogClose = () => {
        setOpenDialogForCreate(false);
        setOpenDialogForUpdate(false);
        setOpenDialogForDelete(false);
    };

    const getRanking = async () => {
        const apiUrl = "http://localhost:8080/rankings";
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
                    setRankings(res.data);
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

    const getTopgame = async () => {
        const apiUrl = "http://localhost:8080/topgames";
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
                    setTopgamesTable(res.data);
                    console.log(res.data);
                }
            });
    };

   

    const createTopgame = () => {
        let createData = {
            Comment: topgames.Comment,
            Date: date,
            Ranking_ID: topgames.Ranking_ID,
            Game_ID: topgames.Game_ID,
            Admin_ID: Number(localStorage.getItem('aid')),
        };

        console.log(createData)

        const apiUrl = "http://localhost:8080/topgames";
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

    const updateTopgame = () => {
        let updateData = {
            ID: topgames.ID,
            Comment: topgames.Comment,
            Date: date,
            Ranking_ID: topgames.Ranking_ID,
            Game_ID: topgames.Game_ID,
            Admin_ID: Number(localStorage.getItem('aid')),
        };

        console.log(updateData)

        const apiUrl = "http://localhost:8080/topgames";
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

    const deleteTopgame = () => {
        const apiUrl = "http://localhost:8080/topgame/"+topgames.ID;
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
            await getRanking();
            await getGame();
            await getTopgame();
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
                <Button variant="contained" color="success" endIcon={<SaveIcon />} onClick={() => handleDialogClickOpenForCreate()}>Create New Banner</Button>
            </Grid>

            {/** Search Bar */}
            <Grid container sx={{ padding: 2 }}>
                <Grid item xs={4}/>
                <Grid item xs={4}>
                    <TextField
                        id="search-bar"
                        fullWidth
                        onChange={(event) => (
                            setSearchQuery(event.target.value)
                        )}
                        label="Search a Banner by Game Name"
                        variant="outlined"
                        size="small"
                    />
                </Grid>
            </Grid>

            {/** Table */}
            <Grid container justifyContent={"center"}>
                <TableContainer component={Paper} sx={{ width: "65%" }}>
                    <Table aria-label="Topgame">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center"><h4>Comment</h4></TableCell>
                                <TableCell align="center"><h4>Ranking</h4></TableCell>
                                <TableCell align="center"><h4>Game</h4></TableCell>
                                <TableCell align="center"><h4>Admin</h4></TableCell>
                                <TableCell align="center"><h4>Date</h4></TableCell>
                                <TableCell align="center"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {topgamesTable.filter(item => item.Game.Game_Name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                                <TableRow key={item.ID}>
                                    <TableCell align="center">{item.Comment}</TableCell>
                                    <TableCell align="center">{item.Ranking.Detail}</TableCell>
                                    <TableCell align="center">{item.Game.Game_Name}</TableCell>
                                    <TableCell align="center">{item.Admin.Name}</TableCell>
                                    <TableCell align="center">{`${Moment(item.Date).format('DD MMMM YYYY')}`}</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="column" spacing={2}>
                                            <Button variant="outlined" color="inherit" endIcon={<AutoModeIcon/>} onClick={() => handleDialogClickOpenForUpdate(item)}>
                                                Edit
                                            </Button>
                                            <Button variant="contained" color="error" endIcon={<DeleteForeverOutlinedIcon/>} onClick={() => handleDialogClickOpenForDelete(item)}>
                                                Delete
                                            </Button>                                        
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            
            {/** Create Topgame Dialog*/}
            <Dialog
                open={openDialogForCreate}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">
                    {"Create New Topgame"}
                </DialogTitle>

                <DialogContent>
                    <Box> {/** Content Section */}
                        <Paper elevation={2} sx={{padding:2,margin:2}}>
                            <Grid container>
                                <Grid container marginBottom={2}> {/** Game */}
                                    <Autocomplete
                                        id="game-autocomplete"
                                        options={games}
                                        fullWidth
                                        size="medium"
                                        //defaultValue={banners[Number(user.Favorite_Game_ID)-1]} // ใช้ไม่ได้จะมีปัญหาเวลา ID = 3 แต่มีเกมในคลังแค่เกมเดียวงี้
                                        onChange={(event: any, value) => {
                                            setTopgames({ ...topgames, Game_ID: value?.ID }); // บันทึกค่าลง interface
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
                                </Grid>

                                <Grid container marginBottom={2}> {/** Ranking */}
                                    <Autocomplete
                                        id="Ranking-autocomplete"
                                        options={rankings}
                                        fullWidth
                                        size="medium"
                                        //defaultValue={banners[Number(user.Favorite_Game_ID)-1]} // ใช้ไม่ได้จะมีปัญหาเวลา ID = 3 แต่มีเกมในคลังแค่เกมเดียวงี้
                                        onChange={(event: any, value) => {
                                            setTopgames({ ...topgames, Ranking_ID: value?.ID }); // บันทึกค่าลง interface
                                        }}
                                        getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                                            `${option.ID} - ${option.Detail}`
                                        } //filter value // เว้นวรรคระว่าง } กับ $ มีผลกับการแสดงผล
                                        renderInput={(params) => <TextField {...params} label="Ranking ID" />}
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

                                <Grid container marginBottom={2}> {/** Editor */}
                                    <TextField
                                        disabled
                                        id="editor-autocomplete"
                                        fullWidth
                                        size="medium"
                                        label="Editor"
                                        defaultValue={localStorage.getItem('name')}
                                    />
                                </Grid>
                                
                                <Grid container marginBottom={2}> {/** Comment */}
                                    <TextField
                                        fullWidth
                                        id="topgame-Comment"
                                        label="Topgame Comment"
                                        variant="outlined"
                                        onChange={(event) => setTopgames({ ...topgames, Comment: event.target.value })}
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
                    <Button onClick={createTopgame} color="error" autoFocus>Create</Button>
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
                    {"Create New Topgame"}
                </DialogTitle>

                <DialogContent>
                    <Box> {/** Content Section */}
                        <Paper elevation={2} sx={{padding:2,margin:2}}>
                            <Grid container>
                                <Grid container marginBottom={2}> {/** Game */}
                                    <Autocomplete
                                        id="game-autocomplete"
                                        options={games}
                                        fullWidth
                                        size="medium"
                                        defaultValue={topgames.Game}
                                        onChange={(event: any, value) => {
                                            setTopgames({ ...topgames, Game_ID: value?.ID }); // บันทึกค่าลง interface
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
                                </Grid>

                                <Grid container marginBottom={2}> {/** Ranking */}
                                    <Autocomplete
                                        id="Ranking-autocomplete"
                                        options={rankings}
                                        fullWidth
                                        size="medium"
                                        //defaultValue={banners[Number(user.Favorite_Game_ID)-1]} // ใช้ไม่ได้จะมีปัญหาเวลา ID = 3 แต่มีเกมในคลังแค่เกมเดียวงี้
                                        onChange={(event: any, value) => {
                                            setTopgames({ ...topgames, Ranking_ID: value?.ID }); // บันทึกค่าลง interface
                                        }}
                                        getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                                            `${option.ID} - ${option.Detail}`
                                        } //filter value // เว้นวรรคระว่าง } กับ $ มีผลกับการแสดงผล
                                        renderInput={(params) => <TextField {...params} label="Ranking ID" />}
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

                                <Grid container marginBottom={2}> {/** Editor */}
                                    <TextField
                                        disabled
                                        id="editor-autocomplete"
                                        fullWidth
                                        size="medium"
                                        label="Editor"
                                        defaultValue={localStorage.getItem('name')}
                                    />
                                </Grid>
                                
                                <Grid container marginBottom={2}> {/** Comment */}
                                    <TextField
                                        fullWidth
                                        id="topgame-Comment"
                                        label="Topgame Comment"
                                        variant="outlined"
                                        defaultValue={topgames.Comment}
                                        onChange={(event) => setTopgames({ ...topgames, Comment: event.target.value })}
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
                    <Button onClick={updateTopgame} color="error" autoFocus>Update</Button>
                </DialogActions>
            </Dialog>

            {/** Delete Topgame Dialog*/}
            <Dialog
                open={openDialogForDelete}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">
                    {"Are you sure to delete Banner?"}
                </DialogTitle>

                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        การกดที่ปุ่ม YES จะทำให้เกมที่จัดอันดับหายไปตลอดกาล
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleDialogClose}>NO</Button>
                    <Button onClick={deleteTopgame} color="error" autoFocus>YES</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Topgame_UI

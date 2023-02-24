import * as React from 'react';
import { Container, Snackbar, makeStyles } from "@material-ui/core";
import { Alert, Autocomplete, Box, Button, Grid, Paper, TextField } from '@mui/material';
import { TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Stack } from '@mui/material';
import { Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions } from "@material-ui/core";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs ,{ Dayjs } from "dayjs";
import Moment from 'moment';

import { GamesInterface } from '../../models/game/IGame';
import { TopgameInterface } from '../../models/topgame/ITopgame';
import { RankingInterface } from '../../models/topgame/IRanking';

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
    const [img, setImg] = React.useState<string | ArrayBuffer | null>("data:image/png;base64,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");
    const [commentEdit,setCommentEdit] = React.useState(String)
    const [games, setGames] = React.useState<GamesInterface[]>([]);
    const [rankings, setRankings] = React.useState<RankingInterface[]>([]);
    const [topgames, setTopgames] = React.useState<Partial<TopgameInterface> | null>({});
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
        setOpenDialogForUpdate(true);
        setTopgames(item);
    };

    const handleDialogClickOpenForDelete = (item : any) => {
        setTopgames(item);
        setOpenDialogForDelete(true);
    };

    const handleDialogClose = () => {
        setOpenDialogForCreate(false);
        setOpenDialogForUpdate(false);
        setOpenDialogForDelete(false);
        setImg("data:image/png;base64,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");
        setTopgames(null);
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
        const apiUrl = "http://localhost:8080/topgame";
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
            Comment: topgames?.Comment,
            Date: date,
            Ranking_ID: topgames?.Ranking_ID,
            Game_ID: topgames?.Game_ID,
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
                handleDialogClose();
                setSubmitSuccess(true);
            } else {
                setSubmitError(true);
                setErrorMsg(" - "+res.error);
            }
        });

    }

    const updateTopgame = () => {
        let updateData = {
            ID: topgames?.ID,
            Comment: topgames?.Comment,
            Date: date,
            Ranking_ID: topgames?.Ranking_ID,
            Game_ID: topgames?.Game_ID,
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
                handleDialogClose();
                setSubmitSuccess(true);
                console.log(res.data);
            } else {
                setSubmitError(true);
                setErrorMsg(" - "+res.error);
            }
        });

    }

    const deleteTopgame = () => {
        const apiUrl = "http://localhost:8080/topgame/"+topgames?.ID;
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
                handleDialogClose();
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
                <Button variant="contained" color="success" endIcon={<SaveIcon />} onClick={() => handleDialogClickOpenForCreate()}>Create New Topgame</Button>
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
                        label="Search a Topgame"
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
                                <TableCell align="center"><h4>Ranking</h4></TableCell>
                                <TableCell align="center"><h4>Picture</h4></TableCell>
                                <TableCell align="center"><h4>Game</h4></TableCell>
                                <TableCell align="center"><h4>Comment</h4></TableCell>
                                <TableCell align="center"><h4>Date</h4></TableCell>                                
                                <TableCell align="center"><h4>Admin</h4></TableCell>
                                <TableCell align="center"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {topgamesTable.filter(item => item.Game.Game_Name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                                <TableRow key={item.ID}>
                                    <TableCell align="center">{item.Ranking.Detail}</TableCell>
                                    <TableCell align="center"><img src={`${item.Game.Game_Picture}`} width="250" height="150"/></TableCell>
                                    <TableCell align="center">{item.Game.Game_Name}</TableCell>
                                    <TableCell align="center">{item.Comment}</TableCell>
                                    <TableCell align="center">{`${Moment(item.Date).format('DD MMMM YYYY')}`}</TableCell>
                                    <TableCell align="center">{item.Admin.Name}</TableCell>
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
                                        defaultValue={topgames?.Game}
                                        onChange={(event: any, value) => {
                                            setTopgames({ ...topgames, Game_ID: value?.ID }); // บันทึกค่าลง interface
                                        }}
                                        getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                                            `${option.ID} - ${option.Game_Name}`
                                        } //filter value // เว้นวรรคระว่าง } กับ $ มีผลกับการแสดงผล
                                        renderInput={(params) => <TextField {...params} label="Game" />}
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
                                        defaultValue={topgames?.Ranking}
                                        onChange={(event: any, value) => {
                                            setTopgames({ ...topgames, Ranking_ID: value?.ID }); // บันทึกค่าลง interface
                                        }}
                                        getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                                            `${option.ID} - ${option.Detail}`
                                        } //filter value // เว้นวรรคระว่าง } กับ $ มีผลกับการแสดงผล
                                        renderInput={(params) => <TextField {...params} label="Ranking" />}
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
                                        defaultValue={topgames?.Comment}
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
                    {"Update Topgame"}
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
                                        defaultValue={topgames?.Game}
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
                                        defaultValue={topgames?.Ranking}
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
                                        defaultValue={topgames?.Comment}
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
                    {"Are you sure to delete Topgame?"}
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

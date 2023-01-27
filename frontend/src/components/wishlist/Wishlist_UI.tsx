import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles'
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Stack from '@mui/material/Stack';
import { Autocomplete, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField } from '@mui/material';
import { Dialog, Paper, TableContainer } from '@mui/material';
import Games from "@mui/icons-material/Games";
import Alert from "@mui/material/Alert";
import { Wish_levelInterface } from "../../models/wishlist/IWish_Level";
import { WishlistsInterface } from "../../models/wishlist/IWishlist";
import { GamesInterface } from "../../models/game/IGame";
import { StoragesInterface } from '../../models/storage/IStorage';
import { CollectionsInterface } from '../../models/storage/ICollection';

const apiUrl = "http://localhost:8080";
const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));

function Wishlist_UI() {
    const classes = useStyles();
    const [wishlists, setWishlists] = useState<WishlistsInterface[]>([]);
    const [wish_levels, setWish_Levels] = useState<Wish_levelInterface[]>([]);
    
    const [toEditWishlist, setToEditWishlist] = useState<WishlistsInterface>();
    const [deleteWishlist, setDeleteWishlist] = useState<WishlistsInterface>();
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);

    const [openForEdit, setOpenForEdit] = React.useState(false);
    const [openForDelete, setOpenForDelete] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const [wish_levelEdit, setWish_LevelEdit] = React.useState<String>();
    const [noteEdit, setNoteEdit] = React.useState<String>();


    const handleClickOpenForEdit = (item: WishlistsInterface) => {
        setOpenForEdit(true);
        setToEditWishlist(item);
    };

    const handleCloseForEdit = () => {
        setOpenForEdit(false);
    };

    const handleClickOpenForDelete = (item: WishlistsInterface) => {
        setOpenForDelete(true);
        setDeleteWishlist(item);
    };

    const handleCloseForDelete = () => {
        setOpenForDelete(false);
    };

    function timeout(delay: number) {
        return new Promise(res => setTimeout(res, delay));
    }
    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setSuccess(false);
        setError(false);
        // setErrorForAdd(false);
    };

    async function GetWishlist() {
        let uid = localStorage.getItem("uid");
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };

        let res = await fetch(`${apiUrl}/wishlists/${uid}`, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    return res.data;
                    console.log(res)
                } else {
                    return false;
                }
            });

        return res;
    }

    async function GetWish_Level() {
        let uid = localStorage.getItem("uid");
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };

        let res = await fetch(`${apiUrl}/wish_levels`, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    return res.data;
                } else {
                    return false;
                }
            });

        return res;
    }


    useEffect(() => {
        getWishlist();
        getWish_Level();
    }, []);

    const getWish_Level = async () => {
        let res = await GetWish_Level();
        if (res) {
            setWish_Levels(res);

        }
    };
    const getWishlist = async () => {
        let res = await GetWishlist();
        if (res) {
            setWishlists(res);
            
            console.log(res)
        }
    };
    const EditWishlist = (id: number) => {
        let data = {       //ประกาศก้อนข้อมูล
            ID: id,
            Level_ID: wish_levelEdit,
            Note: noteEdit
        };
        const apiUrl = "http://localhost:8080/wishlists";
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
                }
            });
    }

    const deleteWish = (id: number) => {
        let data = {       //ประกาศก้อนข้อมูล
            ID: id,
        };
        const apiUrl = "http://localhost:8080/wishlists/:id";                      //ส่งขอการลบ  
        const requestOptions = {
            method: "Delete",
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
                }
            });
    }

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
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleClose} severity="error">
                    บันทึกข้อมูลไม่สำเร็จ
                </Alert>
            </Snackbar>
            <Box
                display="flex"
                sx={{
                    marginTop: 2,
                }}
            >
                <Box flexGrow={1}>
                    <Typography
                        component="h2"
                        variant="h6"
                        color="primary"
                        gutterBottom
                    >
                       Wishlist
                    </Typography>
                </Box>

            </Box>

            <Grid container sx={{ padding: 2 }}>
                <Grid item xs={4}>
                </Grid>
                <Grid item xs={4}>
                    <TextField
                        id="search-bar"
                        fullWidth
                        onChange={(event) => (
                            setSearchQuery(event.target.value)
                        )}
                        label="Search a Game By Name"
                        variant="outlined"
                        //placeholder="Search..."
                        size="small"
                    />
                </Grid>
            </Grid>

            <Box sx={{
                marginTop: 2,
            }}>
                <TableContainer component={Paper} >
                    <Table className={classes.table} aria-label="Basket">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell><h4>Name</h4></TableCell>
                                <TableCell align="center"><h4>ระดับความอยากได้</h4></TableCell>
                                <TableCell align="center"><h4>Note</h4></TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            
                            {wishlists.filter(item => item.Game.Game_Name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                                <TableRow key={item.ID}>
                                    <TableCell align="center"><img src={`${item.Game.Game_Picture}`} width="180" height="140" /> {/** src={`${games.Picture}`} เอาไว้ตอนนัททำใส่รูปให้แล้ว*/}</TableCell>
                                    <TableCell component="th" scope="row">{item.Game.Game_Name}</TableCell>
                                    <TableCell align="center">{item.Wish_Level.Level}</TableCell>
                                    <TableCell align="center">{item.Note}</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="column" spacing={2}>
                                            {/* <Button variant="outlined" color="primary" component={RouterLink} to={"/user_profile/" + String(item.User_Friend.Email)}>
                        Profile
                      </Button> */}
                                            <Button variant="outlined" color="inherit" onClick={() => handleClickOpenForEdit(item)}>
                                                Edit Wishlist
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => handleClickOpenForDelete(item)}>
                                                Delete
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                    <Dialog maxWidth="lg" open={openForEdit} onClose={handleCloseForEdit} >
                                        <DialogTitle>Add Game to Collection</DialogTitle>
                                        <DialogTitle>{toEditWishlist?.Game.Game_Name}</DialogTitle>
                                        <DialogContent>
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
                                            </Grid>
                                            <Grid marginTop={2}>
                                                <Grid>
                                                    Note
                                                </Grid>
                                                <Grid>
                                                    <TextField
                                                        id="outlined-basic"
                                                        placeholder="Note"
                                                        variant="outlined"
                                                        size="medium"
                                                        multiline={true}
                                                        minRows={9}
                                                        maxRows={2}
                                                        fullWidth={true}
                                                        defaultValue={toEditWishlist?.Note}
                                                        onChange={(event) => setNoteEdit(event.target.value)}
                                                    />
                                                    </Grid>
                                            </Grid>


                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleCloseForEdit}>Cancel</Button>
                                            <Button onClick={() => EditWishlist(toEditWishlist?.ID || 0)}>Save</Button>
                                        </DialogActions>
                                    </Dialog>
                                    <Dialog fullWidth maxWidth="xl" open={openForDelete} onClose={handleCloseForDelete} >
                                        <DialogTitle>DELETE</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                Are you SURE to DELETE Wishlist "{item.Game.Game_Name}" ?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleCloseForDelete}>Cancel</Button>
                                            <Button color="error" onClick={() => deleteWish(deleteWishlist?.ID || 0)}>Delete</Button>
                                        </DialogActions>
                                    </Dialog>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>


    );

}
export default Wishlist_UI 
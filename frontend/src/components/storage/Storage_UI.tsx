import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles'
import Snackbar from "@mui/material/Snackbar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { Link as RouterLink } from "react-router-dom";
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

import { GamesInterface } from "../../models/game/IGame";
import { StoragesInterface } from '../../models/storage/IStorage';
import { CollectionsInterface } from '../../models/storage/ICollection';

const apiUrl = "http://localhost:8080";
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
}));

function Storage_UI() {
  const classes = useStyles();
  const [storages, setStorages] = useState<StoragesInterface[]>([]);
  const [Games, setGames] = useState<GamesInterface[]>([]);
  const [collections, setCollections] = useState<CollectionsInterface[]>([]);
  const [toEditGame, setToEditGame] = useState<StoragesInterface>();
  const [deleteFriend, setDeleteFriend] = useState<StoragesInterface>();
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);

  const [openForEdit, setOpenForEdit] = React.useState(false);
  const [openForDelete, setOpenForDelete] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [collectionEdit, setCollectionEdit] = React.useState<Number>();


  const handleClickOpenForEdit = (item: StoragesInterface) => {
    setOpenForEdit(true);
    setToEditGame(item);
  };

  const handleCloseForEdit = () => {
    setOpenForEdit(false);
  };

  const handleClickOpenForDelete = (item: StoragesInterface) => {
    setOpenForDelete(true);
    setDeleteFriend(item);
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

  async function GetStorage() {
    let uid = localStorage.getItem("uid");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    let res = await fetch(`${apiUrl}/storages/${uid}`, requestOptions)
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

  async function GetCollection() {
    let uid = localStorage.getItem("uid");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    let res = await fetch(`${apiUrl}/collections/${uid}`, requestOptions)
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
    getStorage();
    getCollection();
  }, []);

  const getCollection = async () => {
    let res = await GetCollection();
    if (res) {
      setCollections(res);
      
    }
  };
  const getStorage = async () => {
    let res = await GetStorage();
    if (res) {
      setStorages(res);
      console.log(res)
    }
  };
  const AddGameToCollection = (id: number) => {
    let data = {       //ประกาศก้อนข้อมูล
      ID: id,
      Collection_ID: collectionEdit,
    };
    const apiUrl = "http://localhost:8080/storages";                      //ส่งขอการลบ  
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

  const deleteUserGame = (id: number) => {
    let data = {       //ประกาศก้อนข้อมูล
      ID: id,
    };
    const apiUrl = "http://localhost:8080/storages/:id";                      //ส่งขอการลบ  
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

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 50 },
    {
      field: "Game",
      headerName: "Game",
      width: 250,
      valueFormatter: (params) => params.value.Game_Name,
    },
    {
      field: "User",
      headerName: "User",
      width: 150,
      valueFormatter: (params) => params.value.Profile_Name,
    },
    {
      field: "Collection",
      headerName: "Collection",
      width: 150,
      valueFormatter: (params) => params.value.Name,
    },
  ];

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
            Storage
          </Typography>
        </Box>
        <Box>
          <Button
            component={RouterLink}
            to="/collection"
            variant="contained"
            color="primary"
          >
            Edit Collection
          </Button>
        </Box>

      </Box>

      {/* <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
          <DataGrid
            rows={storages}
            getRowId={(row) => row.ID}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div> */}
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
                <TableCell align="center"><h4>Collection</h4></TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {storages.filter(item => item.Game.Game_Name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                <TableRow key={item.ID}>
                  <TableCell align="center"><img src={`${item.Game.Game_Picture}`} width="180" height="140" /> {/** src={`${games.Picture}`} เอาไว้ตอนนัททำใส่รูปให้แล้ว*/}</TableCell>
                  <TableCell component="th" scope="row">{item.Game.Game_Name}</TableCell>
                  <TableCell align="center">{item.Collection.Name}</TableCell>
                  <TableCell align="center">
                    <Stack direction="column" spacing={2}>
                      {/* <Button variant="outlined" color="primary" component={RouterLink} to={"/user_profile/" + String(item.User_Friend.Email)}>
                        Profile
                      </Button> */}
                      <Button variant="outlined" color="inherit" onClick={() => handleClickOpenForEdit(item)}>
                        Add to Collection
                      </Button>
                      <Button variant="contained" color="error" onClick={() => handleClickOpenForDelete(item)}>
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                  <Dialog maxWidth="lg" open={openForEdit} onClose={handleCloseForEdit} >
                    <DialogTitle>Add Game to Collection</DialogTitle>
                    <DialogTitle>{toEditGame?.Game.Game_Name}</DialogTitle>
                    <DialogContent>
                      <Grid marginTop={2}>
                        <Grid>
                          Collection
                        </Grid>
                        <Grid>
                          <Autocomplete
                            id="intimate-edit-autocomplete"
                            options={collections}
                            size="small"
                            defaultValue={toEditGame?.Collection}
                            onChange={(event: any, value) => {
                              setCollectionEdit(event.target.value);
                            }}
                            getOptionLabel={(option: any) =>
                              `${option.Name}`
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
                                >{`${option.Name}`}</li>
                              ); //display value
                            }}
                          />
                        </Grid>
                      </Grid>


                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseForEdit}>Cancel</Button>
                      <Button onClick={() => AddGameToCollection(toEditGame?.ID || 0)}>Save</Button>
                    </DialogActions>
                  </Dialog>
                  <Dialog fullWidth maxWidth="xl" open={openForDelete} onClose={handleCloseForDelete} >
                    <DialogTitle>DELETE</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        Are you SURE to DELETE Friend "{item.Game.Game_Name}" ?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseForDelete}>Cancel</Button>
                      <Button color="error" onClick={() => deleteUserGame(deleteFriend?.ID || 0)}>Delete</Button>
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
export default Storage_UI
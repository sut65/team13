import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Button from "@mui/material/Button";
import BuildIcon from '@mui/icons-material/Build';
import DeleteIcon from '@mui/icons-material/Delete';
import { GamesInterface } from "../../models/game/IGame";
import { RatingsInterface } from "../../models/game/IRating";
import { Type_GamesInterface } from "../../models/game/IType_Game";
import { Game_StatusInterface } from "../../models/game/IGame_Status";
//import { Upload } from '@progress/kendo-react-upload';
import "../../App.css"
import {
  GetGame_Type,
  GetGame_Status,
  CreateGame,
  GetGame_Rating,
  GetGame,
} from "../../components/game/GameService";
import { Container, Box, Snackbar, TextField, Paper, Card, CardActionArea, CardContent, CardMedia, Fab, Backdrop, CircularProgress } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import Moment from 'moment';
import AddIcon from '@mui/icons-material/Add';
import Game_UI from "./Game_UI";
//import id from "date-fns/esm/locale/id/index.js";
import "../../App.css"

function Game() {
  Moment.locale('th');
  const [searchQuery, setSearchQuery] = React.useState("");
  const [game, setGame] = useState<GamesInterface[]>([]);
  const [gameEdit, setGameEdit] = useState<GamesInterface>();
  const [game_id, setGame_ID] = React.useState<Number | null>(null);
  const [openForEdit, setOpenForEdit] = useState(false);
  const [openForCreate, setOpenForCreate] = useState(false);
  const [openForDelete, setOpenForDelete] = useState(false);
  // const [user, setUser] = React.useState<Partial<UsersInterface>>({});
  const [game_rating, setGame_rating] = useState<RatingsInterface[]>([]);
  const [game_type, setGame_type] = useState<Type_GamesInterface[]>([]);
  const [game_status, setGame_status] = useState<Game_StatusInterface[]>([]);
  const [game1, setGame1] = React.useState<Partial<GamesInterface>>({});
  const [UpdateSuccess, setUpdateSuccess] = useState(false);
  const [UpdateError, setUpdateError] = useState(false);
  const [DeleteSuccess, setDeleteSuccess] = useState(false);
  const [DeleteError, setDeleteError] = useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [isDataLoaded, setIsDataloaded] = React.useState<boolean | null>(false);
  const [gamefileString, setGamefileString] = React.useState<string | ArrayBuffer | null>(null);
  const [imageString, setImageString] = React.useState<string | ArrayBuffer | null>(null);
  const [updating, setUpdating] = useState(false);
  function timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
  }
  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };
  const UpdateGame = () => {
    setUpdating(true)
    let UpdateData = {
      ID: game1.ID,
      Game_Name: game1.Game_Name,
      Game_Price: convertType(game1.Game_Price),
      Game_description: game1.Game_description,
      Publish_Date: game1.Publish_Date,
      Game_Status_ID: convertType(game1.Game_Status_ID),
      Type_Game_ID: convertType(game1.Type_Game_ID),
      Rating_ID: convertType(game1.Rating_ID),
      Game_file: gamefileString,
      Game_Picture: imageString

    };
    const apiUrl = "http://localhost:8080/Game";
    const requestOptions = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(UpdateData),
    };
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then(async (res) => {
        if (res.data) {
          setUpdateSuccess(true);
          await timeout(500);
          window.location.reload();
        } else {
          setUpdateError(true);
          setErrorMsg(" - " + res.error);
        }
        setUpdating(false)})
      

    

  }

  const DeleteGame = () => {
    const apiUrl = "http://localhost:8080/Game/" + gameEdit?.ID;
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },

    };

    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then(async (res) => {
        if (res.data) {
          setDeleteSuccess(true);
          await timeout(500);
          window.location.reload();
        } else {
          setDeleteError(true);
          setErrorMsg(" - " + res.error);
        }
      });
  }
  //image
  const handleImageChange = (event: any) => {
    const image = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      const base64Data = reader.result;
      setImageString(base64Data)
    }
  }
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setUpdateSuccess(false);
    setUpdateError(false);
    setDeleteSuccess(false);
    setDeleteError(false);
  };
  //game_file
  const handleGamefileChange = (event: any) => {
    const game_file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(game_file);
    reader.onload = () => {
      const base64Data = reader.result;
      setGamefileString(base64Data)
    }
  }
  // TextField
  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof Game;
    const { value } = event.target;
    setGame1({ ...game1, [id]: value });
  };

  useEffect(() => {
    const fetchData = async () => {
      await Game();
      await getGame_type();
      await getGame_status();
      await getGame_rating();
      setIsDataloaded(true);
    }
    fetchData();

  }, []);
  const handleClickOpenForEdit = (item: GamesInterface) => {
    setOpenForEdit(true);
    setGameEdit(item);
    setGame1(item) //เสร็จ Default อีกที
    setImageString(item.Game_Picture) // ชนิดข้อมูลไม่สอดคร้องกัน
    setGamefileString(item.Game_file)
  };
  const handleCloseForEdit = () => {
    setOpenForEdit(false);
  };
  const handleClickOpenForCreate = () => {
    setOpenForCreate(true);

  };
  const handleCloseForCreate = () => {
    setOpenForCreate(false);
  };
  const handleClickOpenForDelete = () => {
    setOpenForDelete(true);
    
  };
  const handleCloseForDelete = () => {
    setOpenForDelete(false);
  };
  const Game = async () => {
    let res = await GetGame();
    if (res) {
      // setImageString(rese)// เพื่อให้ มันมีภาพ ตอนแรกไม่มีภาพ defaultvaule
      setGame(res);
      console.log(res)
    }
  };
  const getGame_type = async () => {
    let res = await GetGame_Type();
    if (res) {
      setGame_type(res);
    }
  };
  const getGame_status = async () => {
    let res = await GetGame_Status();
    if (res) {
      setGame_status(res);
    }
  };
  const getGame_rating = async () => {
    let res = await GetGame_Rating();
    if (res) {
      setGame_rating(res);
    }
  };


  if (isDataLoaded ) return (
    <div style={{
      opacity: 1,
      //backgroundColor: 'black',
      //  backgroundImage: `url("https://images6.alphacoders.com/655/655993.jpg")`
      //https://images6.alphacoders.com/112/1126233.jpg
    }}>

      <Container maxWidth="xl" sx={{ p: 20 }}  >
        <Grid container sx={{ mb: 4 }} > {/** Search direction={"column-reverse"} */}
          <Grid container>
            <Grid item xs={11}>
              <TextField
                id="search-bar"
                onChange={(event) => (
                  setSearchQuery(event.target.value)
                )}
                label="Search a game by name"
                variant="outlined"
                placeholder="Searching..."
                size="medium"
              />
            </Grid>
            <Grid item xs={1} display="flex"
              justifyContent="flex-end"
              alignItems="flex-end">
              <Fab color="secondary" aria-label="add" onClick={() => handleClickOpenForCreate()}>
                <AddIcon />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
        <Paper elevation={5}>
          <Grid container spacing={3} sx={{ padding: 2 }} columns={{ xs: 12 }}>

            {game.filter(item => item.Game_Name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
              <Grid item xs={3} key={item.ID} >
                <Card sx={{ display: 'flex', maxWidth: 345, mt: 2 }}>
                  <CardActionArea onClick={() => handleClickOpenForEdit(item)}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.Game_Picture}
                      alt="" />
                    <CardContent>
                      {item.Game_Name}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}

          </Grid>
        </Paper>

        <Dialog fullWidth maxWidth="xl" open={openForEdit} onClose={handleCloseForEdit} sx={{
          // bgcolor: "#e3f2fd",
          //ml: 10,
          // mt: 5,
          // mb: 5,
          // mr: 10,
          // backgroundImage: `url("https://images3.alphacoders.com/112/1126231.png")`
          // , width: "1500px"
          // , height: "1200px"
          // , opacity: 1
        }}>
          <DialogTitle sx={{
            bgcolor: "#E3E3E3"
          }}>{gameEdit?.Game_Name}</DialogTitle >
          <DialogContent sx={{
            // bgcolor: "#e3f2fd",
            //ml: 10,
            // mt: 5,
            // mb: 5,
            // mr: 10,
            bgcolor: "#E3E3E3"
            // , width: "1500px"
            // , height: "1200px"
            // , opacity: 1
          }}>
            {/* <DialogContentText>
              {gameArray[Number(gametest) - 1]}
            </DialogContentText> */}
            <div style={{
              //backgroundColor: 'black',
              //  backgroundImage: `url("https://images6.alphacoders.com/655/655993.jpg")`
              //https://images6.alphacoders.com/112/1126233.jpg
            }}>
              <Container maxWidth="xl" sx={{
                //backgroundColor: '#E3E3E3',
                // boxShadow: 15,
                //mt: 5,
                dp: 2,
                // border: 2,
                //  p: 15
              }} >

                <Backdrop
                  sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={updating}>
                  <CircularProgress color="inherit" />
                </Backdrop>
                {/*snackbar update*/}
                <Snackbar
                  open={UpdateSuccess}
                  autoHideDuration={1500}
                  onClose={handleCloseSnackbar}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                  <Alert onClose={handleCloseSnackbar} severity="success">
                    Update complete
                  </Alert>
                </Snackbar>
                <Snackbar
                  open={UpdateError}
                  autoHideDuration={1500}
                  onClose={handleCloseSnackbar}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                  <Alert onClose={handleCloseSnackbar} severity="error">
                    Failed to Update {errorMsg}
                  </Alert>
                </Snackbar>

                {/*snackbar delete*/}
                <Snackbar
                  open={DeleteSuccess}
                  autoHideDuration={1500}
                  onClose={handleCloseSnackbar}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                  <Alert onClose={handleCloseSnackbar} severity="success">
                    Delete complete
                  </Alert>
                </Snackbar>
                <Snackbar
                  open={DeleteError}
                  autoHideDuration={1500}
                  onClose={handleCloseSnackbar}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                  <Alert onClose={handleCloseSnackbar} severity="error">
                    Failed to Delete {errorMsg}
                  </Alert>
                </Snackbar>


                <Box >
                  <Paper elevation={10} sx={{

                    mt: 5,
                  }}>
                    <Grid container spacing={3} sx={{ padding: 2 }} columns={{ xs: 16 }}>
                      <Grid item xs={3}>
                        <h2 style={{
                          color: "black"
                        }}>Game Title</h2>
                        <FormControl fullWidth variant="outlined"  >
                          <TextField 
                            id="Game_Name"
                            variant="outlined"
                            type="string"
                            size="medium"
                            defaultValue={gameEdit?.Game_Name}
                            onChange={handleInputChange}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={3} >
                        <h2>Game Price</h2>
                        <FormControl fullWidth variant="outlined" >
                          <TextField
                            id="Game_Price"
                            variant="outlined"
                            size="medium"
                            placeholder="------------------------------------"
                            // onWheel={event => { event.preventDefault();  }}
                            defaultValue={gameEdit?.Game_Price}
                            onChange={handleInputChange}
                            inputProps={{ type: "number" }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={3} >
                        <h2>Email</h2>
                        <FormControl fullWidth variant="outlined" >
                          <TextField 
                            id="Seller"
                            variant="outlined"
                            type="string"
                            size="medium"
                            placeholder="------------------------------------"
                            defaultValue={localStorage.getItem("email")}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={7} >
                      </Grid >
                    </Grid>
                    <Grid container spacing={3} sx={{ padding: 2 }} columns={{ xs: 16 }}>
                      <Grid item xs={4} >
                        <Autocomplete sx={{ mt: 5 }}
                          id="Type_Game-autocomplete"
                          options={game_type}
                          fullWidth
                          size="medium"
                          defaultValue={gameEdit?.Type_Game} // ใช้ไม่ได้จะมีปัญหาเวลา ID = 3 แต่มีเกมในคลังแค่เกมเดียวงี้
                          onChange={(event: any, value) => {
                            setGame1({ ...game1, Type_Game_ID: value?.ID }); // บันทึกค่าลง interface
                          }}
                          getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                            `${option.Type_Game_Name} ${option.ID}`
                          } //filter value // เว้นวรรคระว่าง } กับ $ มีผลกับการแสดงผล
                          renderInput={(params) => <TextField {...params} label="Game type" />}
                          renderOption={(props: any, option: any) => {
                            return (
                              <li
                                {...props}
                                value={`${option.ID}`}
                                key={`${option.ID}`}
                              >{`${option.Type_Game_Name}`}</li>//แสดงผลใน box
                            ); //การแสดงผล อันนี้เราเลือกแสดงผลเฉพาะ personal id แต่คืนค่าค่าเป็น id 
                          }}
                        />
                        <Autocomplete sx={{ mt: 5 }}
                          id="Game_Status-autocomplete"
                          options={game_status} //ตัวที่เราจะเลือกมีอะไรบ้าง
                          fullWidth
                          size="medium"
                          defaultValue={gameEdit?.Game_Status} // ใช้ไม่ได้จะมีปัญหาเวลา ID = 3 แต่มีเกมในคลังแค่เกมเดียวงี้ //ค่า default ที่ดึงมาแสดง
                          onChange={(event: any, value) => {
                            setGame1({ ...game1, Game_Status_ID: value?.ID }); // บันทึกค่าลง interface
                          }}
                          getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                            `${option.Status_Type}`
                          } //filter value // เว้นวรรคระว่าง } กับ $ มีผลกับการแสดงผล
                          renderInput={(params) => <TextField {...params} label="Game Status" />}
                          renderOption={(props: any, option: any) => {
                            return (
                              <li
                                {...props}
                                value={`${option.ID}`}
                                key={`${option.ID}`}
                              >{`${option.Status_Type}`}</li>
                            ); //การแสดงผล อันนี้เราเลือกแสดงผลเฉพาะ personal id แต่คืนค่าค่าเป็น id 
                          }}
                        />
                        <Autocomplete sx={{ mt: 5 }}
                          id="Rating-autocomplete"
                          options={game_rating} //ตัวที่เราจะเลือกมีอะไรบ้าง
                          fullWidth
                          size="medium"
                          defaultValue={gameEdit?.Rating} // ใช้ไม่ได้จะมีปัญหาเวลา ID = 3 แต่มีเกมในคลังแค่เกมเดียวงี้ //ค่า default ที่ดึงมาแสดง
                          onChange={(event: any, value) => {
                            setGame1({ ...game1, Rating_ID: value?.ID }); // บันทึกค่าลง interface
                          }}
                          getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                            `${option.Rating_Name}`
                          } //filter value // เว้นวรรคระว่าง } กับ $ มีผลกับการแสดงผล
                          renderInput={(params) => <TextField {...params} label="Game Rating" />}
                          renderOption={(props: any, option: any) => {
                            return (
                              <li
                                {...props}
                                value={`${option.ID}`}
                                key={`${option.ID}`}
                              >{`${option.Rating_Name}`}</li>
                            ); //การแสดงผล อันนี้เราเลือกแสดงผลเฉพาะ personal id แต่คืนค่าค่าเป็น id 
                          }}
                        />
                        <Button
                          size="large"
                          sx={{ mt: 2 }}
                          component={RouterLink}
                          to="/game_list"
                          variant="contained"
                          color="secondary"
                          startIcon={< BuildIcon />}
                          onClick={UpdateGame}
                        >
                          Update
                        </Button>
                        <Button
                          size="large"
                          sx={{ mt: 2 }}
                          style={{ float: "right" }}
                          variant="contained"
                          color="error"
                          startIcon={< DeleteIcon />}
                          onClick={() => handleClickOpenForDelete()}
                        >
                          Delete
                        </Button>
                      </Grid>
                      <Grid item xs={4}  >
                        <h2>Game Description </h2>
                        <FormControl fullWidth variant="outlined">
                          <TextField
                            id="Game_description"
                            variant="outlined"
                            type="string"
                            size="medium"
                            placeholder="------"
                            multiline={true}
                            rows={16}
                            onChange={handleInputChange}
                            defaultValue={gameEdit?.Game_description}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={4}  >
                        <h2>Update file </h2>
                        <FormControl fullWidth variant="outlined">
                          <TextField

                            id="Game_file"
                            variant="outlined"
                            type="file"
                            size="medium"
                            // placeholder={gameEdit?.Game_file}
                            onChange={handleGamefileChange}
                          //defaultValue={gameEdit?.Game_file.at.length}

                          />

                        </FormControl>
                        <FormControl fullWidth variant="outlined"  >
                          <h2>Publish Date</h2>
                          <TextField 
                            id="Publish_Date"
                            variant="outlined"
                            type="string"
                            size="medium"
                            placeholder="------"
                            defaultValue={`${Moment(gameEdit?.Publish_Date).format('DD MMMM YYYY')}`} //`${Moment(gameEdit?.Publish_Date).format('DD MMMM YYYY')}`
                            onChange={handleInputChange}
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </FormControl>
                        <Grid item xs={8}>
                          <h2> Game Picture</h2>
                          <Grid>
                            <img src={`${imageString}`} width="500" height="250" /> {/** show base64 picture from string variable (that contain base64 picture data) */}
                          </Grid>
                          <input type="file" onChange={handleImageChange} />


                          {/* <FormHelperText>recommend size is 250*250 pixels</FormHelperText> */}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              </Container>
            </div>
          </DialogContent>
          {/* <DialogActions>
          </DialogActions> */}
        </Dialog>
        <Dialog fullWidth maxWidth="xl" open={openForCreate} onClose={handleCloseForCreate}>
          <DialogTitle>Create Game</DialogTitle>
          <DialogContent>
            <Game_UI />
          </DialogContent>
        </Dialog>
        <Dialog fullWidth maxWidth="sm" open={openForDelete} onClose={handleCloseForDelete} >
          <DialogTitle>Are you sure to DELETE  this {gameEdit?.Game_Name} game</DialogTitle>
          <DialogContent>
          </DialogContent>
          <DialogActions>
            <Button color="error" onClick={DeleteGame}> Yes </Button>
          </DialogActions>
        </Dialog>
        {/* <Box>
          <Paper elevation={10} sx={{
            //backgroundImage: `url("https://img5.goodfon.com/wallpaper/nbig/b/3c/reze-chainsaw-man-devushka-tsvety-nebo.jpg")`,
            bgcolor : "Black",
            op: 1
            
          }}>
            asd
             <Box>
              <Button
                component={RouterLink}
                to="/sell_game"
                variant="contained"
                color="inherit"
              >
                Back to Upload game
              </Button>
            </Box> 
          </Paper>
            // <dialog><Game_UI/></dialog>  
        </Box>  */}
      </Container>
    </div>
  );
  else return (null);
}
export default Game;
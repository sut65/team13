import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import BuildIcon from '@mui/icons-material/Build';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GamesInterface } from "../../models/game/IGame";
import { UsersInterface } from "../../models/user/IUser";
import { RatingsInterface } from "../../models/game/IRating";
import { Type_GamesInterface } from "../../models/game/IType_Game";
import { Game_StatusInterface } from "../../models/game/IGame_Status";
import {
  GetGame_Type,
  GetGame_Status,
  CreateGame,
  GetGame_Rating,
  GetGame,
} from "../../components/game/GameService";
import Paper from "@mui/material/Paper";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import FormControl from "@mui/material/FormControl";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Select, { SelectChangeEvent } from "@mui/material/Select";


function Game() {
  const [game, setGame] = useState<GamesInterface[]>([]);
  const [gametest, setGametest] = React.useState<Number | null>(null);
  const [openForEdit, setOpenForEdit] = useState(false);
  const [user, setUser] = React.useState<Partial<UsersInterface>>({});
  const [game_rating, setGame_rating] = useState<RatingsInterface[]>([]);
  const [game_type, setGame_type] = useState<Type_GamesInterface[]>([]);
  const [game_status, setGame_status] = useState<Game_StatusInterface[]>([]);
  const [game1, setGame1] = React.useState<Partial<GamesInterface>>({ Publish_Date: new Date(), });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };
  async function submit() {
    let data = {
      Game_Name: game1.Game_Name,
      Game_Price: convertType(game1.Game_Price),
      Publish_Date: game1.Publish_Date,
      Game_description: game1.Game_description,
      Seller_ID: localStorage.getItem("uid"),
      Game_Status_ID: convertType(game1.Game_Status_ID),
      Type_Game_ID: convertType(game1.Type_Game_ID),
      Rating_ID: convertType(game1.Rating_ID),


    };


    console.log(data);
    let res = await CreateGame(data);

    console.log(res)
    if (res) {
      setSuccess(true);
    } else {
      setError(true);
    }

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
  };
  // TextField
  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof Game;
    const { value } = event.target;
    setGame1({ ...game1, [id]: value });
  };
  //Select
  const handleChange = (event: SelectChangeEvent) => {
    const name = event.target.name as keyof typeof Game;
    setGame1({
      ...game1,
      [name]: event.target.value,
    });


  };
  useEffect(() => {
    Game();
    getGame_type();
    getGame_status();
    getGame_rating();

  }, []);
  const handleClickOpenForEdit = (ID: Number) => {
    setOpenForEdit(true);
    console.log(gameArray);
    console.log(gametest);
    setGametest(ID);
  };


  const handleCloseForEdit = () => {
    setOpenForEdit(false);
  };


  const Game = async () => {
    let res = await GetGame();
    if (res) {
      setGame(res);
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

  const columns: GridColDef[] = [
    { field: "ID", headerName: "Number", width: 100 },
    {
      field: "Game_Name",
      headerName: "Name",
      width: 250,
      valueFormatter: (params) => params.value.any,
    },
    {
      field: "Game_Price",
      headerName: "Price",
      width: 150,
      valueFormatter: (params) => params.value.any,
      editable: true,
      type: "number",
    },
    {
      field: "Publish_Date",
      headerName: "Publish",
      width: 160,
      valueFormatter: (params) => params.value.any,
    },
    {
      field: "Game_description",
      headerName: "Description",
      width: 160,
      valueFormatter: (params) => params.value.any,
      editable: true,
    },
    {
      field: "Seller",
      headerName: "Seller",
      width: 160,
      valueFormatter: (params) => params.value.Email,
    },
    {
      field: "Game_Status",
      headerName: "Status",
      width: 160,
      valueFormatter: (params) => params.value.Status_Type,
      editable: true,
      type: "singleSelect",
      valueOptions: [

        { value: "Confirmed", label: "Confirmed" },
        { value: "Didn't answer", label: "Didn't answer" },
        { value: "Received", label: "Received" },
        { value: "Duplicated", label: "Duplicated" },
        { value: "Complaint", label: "Complaint" },
      ],
    },
    {
      field: "Rating",
      headerName: "Rating",
      width: 160,
      valueFormatter: (params) => params.value.Rating_Name,
      editable: true,
      type: "singleSelect",
      valueOptions: [

        { value: "Confirmed", label: "Confirmed" },
        { value: "Didn't answer", label: "Didn't answer" },
        { value: "Received", label: "Received" },
        { value: "Duplicated", label: "Duplicated" },
        { value: "Complaint", label: "Complaint" },
      ],


    },
    {
      field: "Type_Game",
      headerName: "Type",
      width: 160,
      valueFormatter: (params) => params.value.Type_Game_Name,
      editable: true,
      type: "singleSelect",
      valueOptions: [

        { value: "Confirmed", label: "Confirmed" },
        { value: "Didn't answer", label: "Didn't answer" },
        { value: "Received", label: "Received" },
        { value: "Duplicated", label: "Duplicated" },
        { value: "Complaint", label: "Complaint" },
      ],
    },
  ];
  var gameArray = game.map((item: GamesInterface) => (item.Game_Name));
  return (
    <div style={{
      opacity: 1,
      //backgroundColor: 'black',
      backgroundImage: `url("https://images6.alphacoders.com/655/655993.jpg")`
      //https://images6.alphacoders.com/112/1126233.jpg
    }}>

      <Container maxWidth="xl" sx={{ p: 80 }}  >
      <Grid container spacing={3} sx={{ padding: 2 }} columns={{ xs: 12 }}>
      
        {game.filter(item => item.Seller_ID == Number(localStorage.getItem("uid"))).map((item) => (
          
          <Grid item xs={3} key={item.ID} >
          <Card sx={{ display: 'flex', maxWidth: 345, mt: 2 }}>
          
            <CardActionArea onClick={() => handleClickOpenForEdit(item.ID)}>

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

          }}>{gameArray[Number(Number(gametest) - 1)]}</DialogTitle >
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
                <Snackbar
                  open={success}
                  autoHideDuration={3000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                  <Alert onClose={handleClose} severity="success">
                    Upload complete
                  </Alert>
                </Snackbar>
                <Snackbar
                  open={error}
                  autoHideDuration={6000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                  <Alert onClose={handleClose} severity="error">
                    Failed to Upload
                  </Alert>
                </Snackbar>


                <Box >
                  <Paper elevation={10} sx={{
                    // bgcolor: "#e3f2fd",
                    //ml: 10,
                    mt: 5,
                    // mb: 5,
                    // mr: 10,
                   // backgroundImage: `url("https://images3.alphacoders.com/112/1126231.png")`
                    // , width: "1500px"
                    // , height: "1200px"
                    // , opacity: 1

                  }}>

                    {/* <Box

                      display="flex"
                      sx={{
                        //backgroundColor: '#e0f7fa',

                        ml: 15,
                        mt: 10,

                        width: 555,
                        height: 110,
                        // border: 1,
                        p: 1
                      }}
                    >
                      <Box flexGrow={1} >
                        <Typography
                          component="h2"
                          variant="h1"
                          color="white"
                          gutterBottom

                        >
                          UpDate
                        </Typography>
                      </Box>



                    </Box> */}

                    <Grid container spacing={3} sx={{ padding: 2 }} columns={{ xs: 16 }}>
                      <Grid item xs={3}>
                        <h2 style={{
                          color: "black"

                        }}>Game Title</h2>

                        <FormControl fullWidth variant="outlined"  >
                          <TextField disabled
                            id="Game_Name"
                            variant="outlined"
                            type="string"
                            size="medium"
                           
                            
                           
                            defaultValue={game1.Game_Name}
                                    
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
                            value={game1.Game_Price || ""}
                            // onWheel={event => { event.preventDefault();  }}
                            onChange={handleInputChange}
                            defaultValue={game1.Seller_ID}


                            inputProps={{ type: "number" }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={3} >
                        <h2>Email</h2>
                        <FormControl fullWidth variant="outlined" >
                          <TextField disabled
                            id="Seller"
                            variant="outlined"
                            type="string"
                            size="medium"
                            placeholder="------------------------------------"
                            defaultValue={localStorage.getItem("email")}

                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={7} >
                        {/* <Box sx={{ ml:17  , width : 150 ,
        height: 150}}>
            <img
        alt="Remy Sharp" 
        src="https://scontent.fnak3-1.fna.fbcdn.net/v/t39.30808-6/321507630_515092743769915_1490900509627856709_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeErI6nyuUVInAdy8CX0rel2lkpdCP3E5CSWSl0I_cTkJJRJJEo4JVAu4Lzi9lQypTeX7uKFSAj9ZehHAOC9Qrlv&_nc_ohc=DuGk2bwlZ4AAX9uxLcx&_nc_ht=scontent.fnak3-1.fna&oh=00_AfDVf0dX0n4fMAiFUavko5jVc94XRLDZ9mjGcai1f0J2RA&oe=63B624B6"
        style={{ float: "none"  }}   
        width = "250"
        height= '200'
       
        />
        </Box> */}
                      </Grid >


                    </Grid>
                    <Grid container spacing={3} sx={{ padding: 2 }} columns={{ xs: 16 }}>

                      <Grid item xs={4} >
                        <FormControl fullWidth variant="outlined"  >
                          <h2>Game Type</h2>
                          <Select
                            native
                            value={game1.Type_Game_ID + ""}
                            onChange={handleChange}
                            inputProps={{
                              name: "Type_Game_ID",


                            }}
                          >
                            <option aria-label="None" value="">
                              Section Game-Type
                            </option>
                            {game_type.map((item: Type_GamesInterface) => (
                              <option value={item.ID} key={item.ID}>
                                {item.Type_Game_Name}
                              </option>
                            ))}
                          </Select>

                        </FormControl>
                        <FormControl fullWidth variant="outlined" sx={{ mt: 5 }}>
                          <h2>Game Status</h2>
                          <Select
                            native
                            value={game1.Game_Status_ID + ""}
                            onChange={handleChange}
                            inputProps={{
                              name: "Game_Status_ID",


                            }}
                          >
                            <option aria-label="None" value="">
                              Section Game-Status
                            </option>
                            {game_status.map((item: Game_StatusInterface) => (
                              <option value={item.ID} key={item.ID}>
                                {item.Status_Type}
                              </option>
                            ))}
                          </Select>

                        </FormControl>
                        <FormControl fullWidth variant="outlined" sx={{ mt: 5 }} >
                          <h2>Game Rating</h2>
                          <Select
                            native
                            value={game1.Rating_ID + ""}
                            onChange={handleChange}
                            inputProps={{
                              name: "Rating_ID",

                            }}
                          >
                            <option aria-label="None" value="">
                              Section Game-Rating
                            </option>
                            {game_rating.map((item: RatingsInterface) => (
                              <option value={item.ID} key={item.ID}>
                                {item.Rating_Name}
                              </option>
                            ))}
                          </Select>

                        </FormControl>
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

                            value={game1.Game_description || ""}
                            onChange={handleInputChange}
                          />
                        </FormControl>

                      </Grid>
                      <Grid item xs={4}  >

                        <h2>Upload file </h2>
                        <FormControl fullWidth variant="outlined">

                          <TextField
                            id="Name"
                            variant="outlined"
                            type="string"
                            size="medium"
                            placeholder="------"


                            //value={ game. || ""}
                            onChange={handleInputChange}
                          />

                        </FormControl>
                        <FormControl fullWidth variant="outlined"  >
                          <h2>Date Time</h2>
                          <LocalizationProvider dateAdapter={AdapterDayjs}  >
                            <DatePicker disabled
                              value={game1.Publish_Date}
                              onChange={(newValue) => {
                                setGame1({
                                  ...game,
                                  Publish_Date: newValue,
                                });
                              }}
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </Grid>


                    </Grid>

                   

                  </Paper>
                  <Button
                      size="large"
                      sx = {{ mt : 2}}
                      component={RouterLink}
                      to="/game_list"
                      variant="contained"
                      color="secondary"
                      startIcon={< BuildIcon />}


                    >
                      Update 
                    </Button>
                    <Button
                      size="large"
                      sx = {{ mt : 2}}
                      style={{ float: "right" }}
                      onClick={submit}
                      variant="contained"
                      color="error"
                      startIcon={< CloudUploadIcon />}

                    >
                      Delete
                    </Button>
                </Box>



              </Container>
            </div>
          </DialogContent>
          {/* <DialogActions>

          </DialogActions> */}
        </Dialog>


        <Box>

          <Paper elevation={10} sx={{
            backgroundImage: `url("https://img5.goodfon.com/wallpaper/nbig/b/3c/reze-chainsaw-man-devushka-tsvety-nebo.jpg")`,
            op: 1
          }}>
            {/* <Box
          display="flex"
          sx={{
            marginTop: 2,
          }}
        >
          <Box flexGrow={1}   style={{
        position: 'absolute', 
        left: '50%', 
        top: '50%',
        transform: 'translate(-50%, -50%)'
    }}>
            <Typography
              component="h2"
              variant="h4"
              color="black"
              gutterBottom
              
            >
              Game_List
            </Typography>
          </Box>
       
       </Box> */}
            <div style={{ opacity: 1, height: 400, width: "100%", marginTop: "20px" }}>
              <DataGrid
                rows={game}
                getRowId={(row) => row.ID}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}

              />
            </div>
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
          
        </Box>
      </Container>
    </div>
  );
}

export default Game;
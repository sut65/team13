import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

import BuildIcon from '@mui/icons-material/Build';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { UsersInterface } from "../../models/user/IUser";
import { GamesInterface } from "../../models/game/IGame";
import { RatingsInterface } from "../../models/game/IRating";
import { Type_GamesInterface } from "../../models/game/IType_Game";
import { Game_StatusInterface } from "../../models/game/IGame_Status";
import {
  GetGame_Type,
  GetGame_Status,
  CreateGame,
  GetGame_Rating,
  GetEmail
  } from "../../components/game/GameService";
 

  
  function Game() {
  // const [user, setEmail] = useState<UsersInterface[]>([]);//
  // const [game_rating, setGame_rating] = useState<RatingsInterface[]>([]);
  // const [game_type, setGame_type] = useState<Type_GamesInterface[]>([]);
  // const [game_status, setGame_status] = useState<Game_StatusInterface[]>([]);
  // const [game, setGame] = useState<GamesInterface>({});
 

  // const [success, setSuccess] = useState(false);
  // const [error, setError] = useState(false);
    
  // const handleClose = (
  //   event?: React.SyntheticEvent | Event,
  //   reason?: string
  // ) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }
  //   setSuccess(false);
  //   setError(false);
  // };
  // textfield
  // const handleInputChange = (
  //   event: React.ChangeEvent<{ id?: string; value: any }>
  // ) => {
  //   const id = event.target.id as keyof typeof game;
  //   const { value } = event.target;
  //   setGame({ ...game, [id]: value });
  // };
  //selectbox
  // const handleChange = (event: SelectChangeEvent) => {
  //   const name = event.target.name as keyof typeof Game;
  //   setGame({
  //     ...game,
  //     [name]: event.target.value,
  //   });

    
  //};


  

  // const getGame_type = async () => {
  //   let res = await GetGame_Type();
  //   if (res) {
  //     setGame_type(res);
  //   }
  // };

  // const getGame_status = async () => {
  //   let res = await GetGame_Status();
  //   if (res) {
  //     setGame_status(res);
  //   }
  // };

  // const getGame_rating = async () => {
  //   let res = await GetGame_Rating();
  //   if (res) {
  //     setGame_rating(res);
  //   }
  // };
  // const getEmail = async () => {
  //   let res = await GetEmail();
  //   if (res) {
  //     setEmail(res);
  //   } 
  // };
  //


  //



  // useEffect(() => {
  //   getGame_type();
  //   getGame_status();
  //   getGame_rating();
  //   getEmail();
    
   
  // }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  async function submit() {
    let data = {
     // Room_type_id: convertType(room.Room_type_id),
    //  Room_price_id: convertType(room.Room_price_id),
     // Set_of_furniture_id: convertType(room.Set_of_furniture_id),


    };

    //
    // console.log(data);
    // let res = await CreateGame(data);
   
    // console.log(res)
    // if (res) { 
    //   setSuccess(true);
    // } else {
    //   setError(true);
    // }

  }
  return (
    <Container maxWidth="xl" sx={{
      backgroundColor: '#E3E3E3', boxShadow: 15,
      mt: 5,
      dp: 2,



      border: 2,
      p: 1
    }} >
      <Box >
        <Paper elevation={10} sx={{
          bgcolor: "#e3f2fd",
          ml: 10,
          mt: 5,
          mb: 5,
          mr: 10,



        }}>
          <Box

            display="flex"
            sx={{
              backgroundColor: '#e0f7fa',

              ml: 15,
              mt: 10,

              width: 555,
              height: 110,
              border: 1,
              p: 1
            }}
          >
            <Box flexGrow={1} >
              <Typography
                component="h2"
                variant="h1"
                color="Black"
                gutterBottom

              >
                UploadGame
              </Typography>
            </Box>



          </Box>

          <Grid container spacing={3} sx={{ padding: 2 }} columns={{ xs: 12 }}>
            <Grid item xs={3}>
              <h2>Game Title</h2>
              <FormControl fullWidth variant="outlined">
                <TextField
                  id="Name"
                  variant="outlined"
                  type="string"
                  size="medium"
                  placeholder="------------------------------------"
                //value={ || ""}
                //onChange={handleInputChange}
                />
              </FormControl>
            </Grid>

            <Grid item xs={3} >
              <h2>Game Price</h2>
              <FormControl fullWidth variant="outlined" >
                <TextField
                  id="Name"
                  variant="outlined"
                  type="int"
                  size="medium"
                  placeholder="------------------------------------"
                //value={ || ""}
                //onChange={handleInputChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3} >
              <h2>Email</h2>
              <FormControl fullWidth variant="outlined" >
                <TextField disabled
                  id="Name"
                  variant="outlined"
                  type="int"
                  size="medium"
                  placeholder="------------------------------------"
                //value={ || ""}
                //onChange={handleInputChange}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3} sx={{ padding: 2 }} columns={{ xs: 16 }}>

            <Grid item xs={4} >
              <FormControl fullWidth variant="outlined"  >
                <h2>Game Type</h2>
                <Select
                  native
                  //value={room.Room_type_id + ""}
                  //onChange={handleChange}
                  inputProps={{
                    name: "Room_type_id",


                  }}
                >
                  <option aria-label="None" value="">
                    Game
                  </option>

                </Select>

              </FormControl>
              <FormControl fullWidth variant="outlined" sx={{ mt: 5 }}>
                <h2>Game Status</h2>
                <Select
                  native
                  //value={room.Room_type_id + ""}
                  //onChange={handleChange}
                  inputProps={{
                    name: "Room_type_id",


                  }}
                >
                  <option aria-label="None" value="">
                    GameAA
                  </option>

                </Select>

              </FormControl>
              <FormControl fullWidth variant="outlined" sx={{ mt: 5 }} >
                <h2>Game Rating</h2>
                <Select
                  native
                  //value={room.Room_type_id + ""}
                  //onChange={handleChange}
                  inputProps={{
                    name: "Room_type_id",


                  }}
                >
                  <option aria-label="None" value="">
                    Game
                  </option>

                </Select>

              </FormControl>
            </Grid>

            <Grid item xs={4}  >

              <h2>Game Description </h2>
              <FormControl fullWidth variant="outlined">

                <TextField
                  id="Name"
                  variant="outlined"
                  type="string"
                  size="medium"
                  placeholder="------"
                  multiline={true}
                  rows={16}

                //value={ || ""}
                //onChange={handleInputChange}
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


                //value={ || ""}
                //onChange={handleInputChange}
                />

              </FormControl>
              <FormControl fullWidth variant="outlined"  >
                <h2>Date Time</h2>
                <TextField
                  disabled
                  id="Name"
                  variant="outlined"
                  type="string"
                  size="medium"
                  placeholder="------"


                //value={ || ""}
                //onChange={handleInputChange}
                />

              </FormControl>
            </Grid>


          </Grid>

          <Button
              component={RouterLink}
              to="/Rooms"
              variant="contained"
              color="inherit"
              startIcon={< BuildIcon />}


            >
              Update & Delete
            </Button>
            <Button  
              style={{ float: "right" }}
              //onClick={submit}
              variant="contained"
              color="inherit"
              startIcon={< CloudUploadIcon />}
              
            >
                   Upload Game 
            </Button>
    
        </Paper>
      </Box>
    </Container>
  );
}

export default Game;
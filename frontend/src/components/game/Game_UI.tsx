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

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
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
} from "../../components/game/GameService";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@mui/material/Alert";
import Autocomplete from "@mui/material/Autocomplete";
import { color } from "@mui/system";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
function timeout(delay: number) {
  return new Promise(res => setTimeout(res, delay));
}

function Game_UI() {
  const [user, setUser] = React.useState<Partial<UsersInterface>>({});
  const [game_rating, setGame_rating] = useState<RatingsInterface[]>([]);
  const [game_type, setGame_type] = useState<Type_GamesInterface[]>([]);
  const [game_status, setGame_status] = useState<Game_StatusInterface[]>([]);
  const [game, setGame] = React.useState<Partial<GamesInterface>>({ Publish_Date: new Date(), });
  const [imageString, setImageString] = React.useState<string | ArrayBuffer | null>(null); // สร้างตัวแปรแยกเนื่องจาก render.result มันต้องการ ArrayBuffer ด้วย
  const [gamefileString, setGamefileString] = React.useState<string | ArrayBuffer | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [uploading, setUploading] = useState(false);

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
    const id = event.target.id as keyof typeof Game_UI;
    const { value } = event.target;
    setGame({ ...game, [id]: value });
  };
  //Select
  const handleChange = (event: SelectChangeEvent) => {
    const name = event.target.name as keyof typeof Game_UI;
    setGame({
      ...game,
      [name]: event.target.value,
    });


  };
  const GetUser = async () => {
    const apiUrl = "http://localhost:8080/user/" + localStorage.getItem("email"); // ตรง email รอเปลี่ยนเป็น localStorage.getItem
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
          setUser(res.data);

        }
      });
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
  useEffect(() => {
    getGame_type();
    getGame_status();
    getGame_rating();
    GetUser();


  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  async function submit() {
    setUploading(true)
    let data = {
      Game_Name: game.Game_Name,
      Game_Price: convertType(game.Game_Price),
      Publish_Date: game.Publish_Date,
      Game_description: game.Game_description,
      Seller_ID: user.ID,
      Game_Status_ID: convertType(game.Game_Status_ID),
      Type_Game_ID: convertType(game.Type_Game_ID),
      Rating_ID: convertType(game.Rating_ID),
      Game_file: gamefileString,
      Game_Picture: imageString


    };
    console.log(data);
    const apiUrl = "http://localhost:8080/Game";
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
          await timeout(500);
          window.location.reload();
        } else {
          setError(true);
          setErrorMsg(" - " + res.error);
        }
        setUploading(false)
      });



  }
  if (user.Is_Seller)
    return (



      // <div style={{
      //   //backgroundColor: 'black',
      //  // backgroundImage: `url("https://images6.alphacoders.com/655/655993.jpg")`
      //   //https://images6.alphacoders.com/112/1126233.jpg
      // }}>

      <Container maxWidth="xl" sx={{
        //backgroundColor: '#E3E3E3',
        // boxShadow: 15,
        //mt: 5,
        dp: 2,
        // border: 2,
        // p: 15
      }} >
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={uploading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Snackbar
          open={success}
          autoHideDuration={1500}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity="success">
            Upload complete
          </Alert>
        </Snackbar>
        <Snackbar
          open={error}
          autoHideDuration={1500}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity="error">
            Failed to Upload {errorMsg}
          </Alert>
        </Snackbar>
        <Box >
          <Paper elevation={10} sx={{
            // bgcolor: "#e3f2fd",
            //ml: 10,
            mt: 5,
            //  mb: 5,
            //   mr: 10
            // backgroundImage: `url("https://images3.alphacoders.com/112/1126231.png")`
            // , width: "1500px"
            // , height: "1200px"
            // , opacity: 1

          }}>
            {/* <Box sx={{ ml:0  , width : 150 ,
          height: 150}}>
              <img
          alt="Remy Sharp" 
          src="https://scontent.fnak3-1.fna.fbcdn.net/v/t39.30808-6/321507630_515092743769915_1490900509627856709_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=730e14&_nc_eui2=AeErI6nyuUVInAdy8CX0rel2lkpdCP3E5CSWSl0I_cTkJJRJJEo4JVAu4Lzi9lQypTeX7uKFSAj9ZehHAOC9Qrlv&_nc_ohc=DuGk2bwlZ4AAX9uxLcx&_nc_ht=scontent.fnak3-1.fna&oh=00_AfDVf0dX0n4fMAiFUavko5jVc94XRLDZ9mjGcai1f0J2RA&oe=63B624B6"
          style={{ float: "none"  }}   
          width = "1328"
          height= '1082'
         
          />
          </Box> */}
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
                  UploadGame
                </Typography>
              </Box>
            </Box> */}
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
                    placeholder="------------------------------------"
                    value={game.Game_Name || ""}
                    onChange={handleInputChange}
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
                    label="Game_Price"
                    value={game.Game_Price || ""}
                    // onWheel={event => { event.preventDefault();  }}
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
                <Autocomplete sx={{ mt: 5 }}
                  id="Type_Game-autocomplete"
                  options={game_type}
                  fullWidth
                  size="medium"
                  //defaultValue={gameEdit?.Type_Game} // ใช้ไม่ได้จะมีปัญหาเวลา ID = 3 แต่มีเกมในคลังแค่เกมเดียวงี้
                  onChange={(event: any, value) => {
                    setGame({ ...game, Type_Game_ID: value?.ID }); // บันทึกค่าลง interface
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
                  //defaultValue={gameEdit?.Game_Status} // ใช้ไม่ได้จะมีปัญหาเวลา ID = 3 แต่มีเกมในคลังแค่เกมเดียวงี้ //ค่า default ที่ดึงมาแสดง
                  onChange={(event: any, value) => {
                    setGame({ ...game, Game_Status_ID: value?.ID }); // บันทึกค่าลง interface
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
                  //defaultValue={gameEdit?.Rating} // ใช้ไม่ได้จะมีปัญหาเวลา ID = 3 แต่มีเกมในคลังแค่เกมเดียวงี้ //ค่า default ที่ดึงมาแสดง
                  onChange={(event: any, value) => {
                    setGame({ ...game, Rating_ID: value?.ID }); // บันทึกค่าลง interface
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
                  fullWidth
                  sx={{ mt: 2 }}
                  onClick={submit}
                  style={{ float: "none" }}
                  variant="contained"
                  color="primary"
                  startIcon={< CloudUploadIcon />}


                >
                  Upload Game
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

                    value={game.Game_description || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>

              </Grid>
              <Grid item xs={4}  >

                <h2>Upload file </h2>
                <FormControl fullWidth variant="outlined">

                  <TextField
                    id="Game_file"
                    variant="outlined"
                    type="file"
                    size="medium"
                    placeholder="------"


                    //value={ game. || ""}
                    onChange={handleGamefileChange}
                  />

                </FormControl>
                <FormControl fullWidth variant="outlined"  >
                  <h2>Date Time</h2>
                  <LocalizationProvider dateAdapter={AdapterDayjs}  >
                    <DatePicker readOnly
                      value={game.Publish_Date}
                      onChange={(newValue) => {
                        setGame({
                          ...game,
                          Publish_Date: newValue,
                        });
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </FormControl>
                <Grid item xs={8}>
                  <h2> Game Picture</h2>
                  <Grid>
                    <img src={`${imageString}`} width="500" height="250" /> {/** show base64 picture from string variable (that contain base64 picture data) */}
                  </Grid>
                  <input type="file" onChange={handleImageChange} />
                  {/* <FormHelperText>recommend size is 500*250 pixels</FormHelperText> */}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
      // </div>
    );
  else return (<Box>You is not Seller
  </Box>)
}

export default Game_UI;
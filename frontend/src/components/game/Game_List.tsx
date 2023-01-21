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
import Autocomplete from "@mui/material/Autocomplete";
import Moment from 'moment';
//import id from "date-fns/esm/locale/id/index.js";


function Game() {
  Moment.locale('th');
  const [game, setGame] = useState<GamesInterface[]>([]);
  const [gameEdit, setGameEdit] = useState<GamesInterface>();
  const [game_id, setGame_ID] = React.useState<Number | null>(null);
  const [openForEdit, setOpenForEdit] = useState(false);
  // const [user, setUser] = React.useState<Partial<UsersInterface>>({});
  const [game_rating, setGame_rating] = useState<RatingsInterface[]>([]);
  const [game_type, setGame_type] = useState<Type_GamesInterface[]>([]);
  const [game_status, setGame_status] = useState<Game_StatusInterface[]>([]);
  const [game1, setGame1] = React.useState<Partial<GamesInterface>>({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [isDataLoaded, setIsDataloaded] = React.useState<boolean | null>(false);
  const [imageString, setImageString] = React.useState<string | ArrayBuffer | null>(null);
  function timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
  }
  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };
  const UpdateGame = () => {
    
        let UpdateData = {
        ID : game1.ID,
      Game_Price: convertType(game1.Game_Price),
     
      Game_description: game1.Game_description,
      
      Game_Status_ID: convertType(game1.Game_Status_ID),
      Type_Game_ID: convertType(game1.Type_Game_ID),
      Rating_ID: convertType(game1.Rating_ID),
      Game_file : game1.Game_file ,
      Game_Picture: imageString
           
        };

        console.log(UpdateData)

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
        .then((res) => {
            if (res.data) {
                setSuccess(true);
            } else {
                setError(true);
                
            }
        });
  
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
          setSuccess(true);
          await timeout(1500); //for 1 sec delay
          window.location.reload();

        } else {
          setError(true);
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
    const fetchData = async () => {
    await  Game();
    await getGame_type();
    await  getGame_status();
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

    console.log(game_id);
  };
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleCloseForEdit = () => {
    setOpenForEdit(false);
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
  if(isDataLoaded) return (
    <div style={{
      opacity: 1,
      //backgroundColor: 'black',
      backgroundImage: `url("https://images6.alphacoders.com/655/655993.jpg")`
      //https://images6.alphacoders.com/112/1126233.jpg
    }}>

      <Container maxWidth="xl" sx={{ p: 80 }}  >
        <Grid container> {/** Search */}
          <Grid container>
            <TextField
              id="search-bar"
              onChange={(event) => (
                setSearchQuery(event.target.value)
              )}
              label="Search a game by name"
              variant="outlined"
              //placeholder="Search..."
              size="small"  
            />
          </Grid>
    
        </Grid>
        <Grid container spacing={3} sx={{ padding: 2 }} columns={{ xs: 12 }}>

          {game.filter(item => item.Seller_ID == Number(localStorage.getItem("uid")) &&  item.Game_Name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (

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



                           defaultValue={gameEdit?.Game_Name}
                           

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
                            onChange={handleInputChange}
                            defaultValue={gameEdit?.Game_Price}


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
                        {/* <FormControl fullWidth variant="outlined"  >
                          <h2>Game Type</h2>
                          <Select
                            native
                            value={game1.Type_Game_ID + ""}
                            onChange={handleChange}
                            inputProps={{
                              name: "Type_Game_ID",


                            }}
                            defaultValue={gameEdit?.Type_Game}

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

                        </FormControl> */}
                                 <Autocomplete sx={{ mt: 5 }}
                                        id="storages-autocomplete"
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
                        {/* <FormControl fullWidth variant="outlined" sx={{ mt: 5 }}>
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

                        </FormControl> */}
                                <Autocomplete sx={{ mt: 5 }}
                                        id="storages-autocomplete"
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
                        {/* <FormControl fullWidth variant="outlined" sx={{ mt: 5 }} >
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

                        </FormControl> */}
                             <Autocomplete sx={{ mt: 5 }}
                                        id="storages-autocomplete"
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

                        <h2>Upload file </h2>
                        <FormControl fullWidth variant="outlined">

                          <TextField
                            id="Name"
                            variant="outlined"
                            type="string"
                            size="medium"
                            placeholder="------"

                           
                            defaultValue={gameEdit?.Game_file}
                            onChange={handleInputChange}
                          />

                        </FormControl>
                        <FormControl fullWidth variant="outlined"  >
                          <h2>Publish Date</h2>
                                     <TextField disabled
                            id="Name"
                            variant="outlined"
                            type="string"
                            size="medium"
                            placeholder="------"

                           
                            defaultValue={ `${Moment(gameEdit?.Publish_Date).format('DD MMMM YYYY')}`}
                            
                          />
                        </FormControl>
                        <Grid item xs={8}>
                <h2> Game Picture</h2>
                                <Grid>
                                    <img src={`${imageString}`} width="500" height="250"/> {/** show base64 picture from string variable (that contain base64 picture data) */}
                                </Grid>
                                <input type="file" onChange={handleImageChange} />
                                {/* <FormHelperText>recommend size is 250*250 pixels</FormHelperText> */}
                            </Grid>
                      </Grid>


                    </Grid>



                  </Paper>
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
                    startIcon={< CloudUploadIcon />}
                    onClick={DeleteGame}

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
            {/* <div style={{ opacity: 1, height: 400, width: "100%", marginTop: "20px" }}>
              <DataGrid
                rows={game}
                getRowId={(row) => row.ID}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}

              />
            </div> */}
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
        <Box sx={{ mt: 1}}
            m={1}
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <Button
              size="small"
              sx={{ mt: 50 }}
             // onClick={handleDialogAdminClickOpen}
            >
              Admin
            </Button>
          </Box>

      </Container>
    </div>
  );
  else return (null);
}

export default Game;
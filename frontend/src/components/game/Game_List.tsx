import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { GamesInterface } from "../../models/game/IGame";
import { Type_GamesInterface } from "../../models/game/IType_Game";
import {
  GetGame, GetGame_Type
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



function Game() {
  const [game, setGame] = useState<GamesInterface[]>([]);
  const [gametest, setGametest] = React.useState<Number | null>(null);
  const [game_type, setGame_type] = useState<Type_GamesInterface[]>([]);
  const [openForEdit, setOpenForEdit] = useState(false);
  useEffect(() => {
    Game();
  }, []);
  const handleClickOpenForEdit = (ID:Number) => {
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
      valueFormatter: (params) => params.value.Email ,
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
    <div  style={{ opacity: 1 ,
      //backgroundColor: 'black',
      backgroundImage: `url("https://images6.alphacoders.com/655/655993.jpg")`
      //https://images6.alphacoders.com/112/1126233.jpg
    }}>
      
      <Container maxWidth="xl" sx={{ p: 80  }}  >
      
      {game.filter(item => item  ).map((item) => (
           <Card sx={{ display: 'flex', maxWidth: 345, mt: 2 }}>
           
            <CardActionArea onClick={()=>handleClickOpenForEdit(item.ID ) }>
         
              <CardMedia
                component="img"
                height="140"
                image="https://static.bandainamcoent.eu/high/elden-ring/elden-ring/00-page-setup/elden-ring-new-header-mobile.jpg"
                alt="green iguana" />
   <CardContent>
            {item.Game_Name}
        </CardContent>
            </CardActionArea>
          </Card>
          
    
     ))}

<Dialog fullWidth maxWidth="xl" open={openForEdit} onClose={handleCloseForEdit }>
          <DialogTitle>{gameArray[Number(Number(gametest)-1)]}</DialogTitle>
          <DialogContent>
            <DialogContentText>
           { gameArray[Number(gametest)-1]}
            </DialogContentText>

          </DialogContent>
          <DialogActions>

          </DialogActions>
        </Dialog>
 
   
        <Box>

        <Paper elevation={10} sx ={{ backgroundImage: `url("https://img5.goodfon.com/wallpaper/nbig/b/3c/reze-chainsaw-man-devushka-tsvety-nebo.jpg")` ,
        op :1}}>
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
        <div style={{opacity: 1 , height: 400, width: "100%", marginTop: "20px" }}>
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
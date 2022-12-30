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
import Select from "@mui/material/Select";


function Game() {

  return (
    <div >
    
    <Paper  sx ={{ bgcolor :"#E3E3E3",  width: 2000,
      height: 1600,
      ml: 10,
      mt: 5,
      mb : 5,
      mr : 10 


      }}>
        <Box
          
          display="flex"
          sx={{ backgroundColor: 'pink'   ,
          
          ml: 50,
          mt: 10,
            width: 555,
            height: 110,
            border : 2,
            p :1
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
        
        <Grid container spacing={3} sx={{ padding: 2 }} columns={{ xs: 16 }}>
          <Grid item xs={3}>
            <p>Game Title</p>
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
            </Grid>
            <Grid item xs={3} > 
            <p>Game Price</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                id="Name"
                variant="outlined"
                type="int"
                size="medium"
                placeholder="------"
                //value={ || ""}
                //onChange={handleInputChange}
              />
            </FormControl>  
            </Grid>
          
            
            <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" >
              <p>Game</p>
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
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" >
              <p>Game</p>
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
          <Grid item xs= {4}  >
            
            <p>Game Description </p>
            <FormControl fullWidth variant="outlined">
            
              <TextField
                id="Name"
                variant="outlined"
                type="string"
                size="medium"
                placeholder="------" 
                multiline={true}
                rows={25}
               
                //value={ || ""}
                //onChange={handleInputChange}
              />
            </FormControl>  
            
            </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" >
              <p>Game</p>
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
          
        </Grid>
        </Paper>

        </div>
  );
}

export default Game;
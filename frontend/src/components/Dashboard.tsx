import * as React from 'react';
import { Container } from "@material-ui/core";
import { Box, Grid, Paper, TextField } from '@mui/material';

import {CardActionArea,CardContent,Card,CardMedia} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

import { GamesInterface } from '../models/game/IGame';

function Dashboard(){
    const [games, setGames] = React.useState<GamesInterface[]>([]);
    const [searchQuery, setSearchQuery] = React.useState("");

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

    React.useEffect(() => {
        getGame();
    }, []);

    return (
        <Container>
            <Box>
                <Paper elevation={2} sx={{padding:2,margin:2}}>
                    <Grid container justifyContent={"center"}> {/** Banner */}
                        <img src={``} width="700" height="300"/>
                    </Grid>
                    <Grid container marginTop={2}>
                        <TextField
                            id="search-bar"
                            fullWidth
                            onChange={(event) => (
                                setSearchQuery(event.target.value)
                            )}
                            label="Search a game by name"
                            variant="outlined"
                            //placeholder="Search..."
                            size="small"
                        />
                    </Grid>
                    <Grid container spacing={3} sx={{ padding: 2 }} columns={{ xs: 12 }}> {/** Card */}
                
                        {games.filter(item => item.Game_Name.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                        
                        <Grid item xs={3} key={item.ID} >
                        <Card sx={{ display: 'flex', maxWidth: 345, mt: 2 }}>
                        
                            <CardActionArea component={RouterLink} to={"/individual_game/"+item.ID} >
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
            </Box>
        </Container>
    );
}

export default Dashboard

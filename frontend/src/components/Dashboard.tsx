import * as React from 'react';
import { Container } from "@material-ui/core";
import { Box, Button, Grid, Paper, TextField } from '@mui/material';
import Carousel from 'react-material-ui-carousel';

import {CardActionArea,CardContent,Card,CardMedia} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

import { GamesInterface } from '../models/game/IGame';
import { BannersInterface } from '../models/banner/IBanner';

function Dashboard(){
    const [games, setGames] = React.useState<GamesInterface[]>([]);
    const [banners,setBanners] = React.useState<BannersInterface[]>([]);
    const [searchQuery, setSearchQuery] = React.useState("");

    function ImageCarousel()
    {
        return (
            <Carousel>
            {
                banners.map( (item, i) => <Item key={i} item={item} /> )
            }
            </Carousel>
        )
    }

    function Item(props: any)
    {
        return (
            <Paper component={RouterLink} to={"/individual_game/"+props.item.Game.ID}>
                <img src={`${props.item.Banner_Picture}`} width="100%" height="300"/>
            </Paper>
        )
    }

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

    const getBanner = async () => {
        const apiUrl = "http://localhost:8080/banners";
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
                    setBanners(res.data);
                }
            });
    };

    React.useEffect(() => {
        getGame();
        getBanner();
    }, []);

    return (
        <Container>
            <Box>
                <Paper elevation={2} sx={{padding:2,margin:2}}>
                    <Grid direction={'column'}>
                        {ImageCarousel()}
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

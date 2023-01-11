import * as React from 'react';
import { Container } from "@material-ui/core";
import { Box, Grid, Paper } from '@mui/material';
import Moment from 'moment';

import { useParams } from 'react-router-dom';
import { GamesInterface } from '../models/game/IGame';

function Individual_game(){
    Moment.locale('th');
    const { id } = useParams(); // ดึง parameter จาก url-parameter
    const [isDataLoaded, setIsDataloaded] = React.useState<boolean | null>(false);
    const [games, setgames] = React.useState<Partial<GamesInterface>>({});

    const getGame = async () => {
        const apiUrl = "http://localhost:8080/Game/"+id;
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
                    setgames(res.data);
                    console.log(res.data);
                }
            });
    };

    React.useEffect(() => {
        const fetchData = async () => {
            await getGame();
            setIsDataloaded(true);
        }
        fetchData();
    }, []);

    if(isDataLoaded) return (
        <Container>
            <Box>
                <Paper elevation={2} sx={{padding:2,margin:2}}>
                    <Grid container>
                        <h2>{games.Game_Name}</h2>
                    </Grid>

                    <Grid container> {/** Game Description */}
                        <Grid>
                            <img src="https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg?t=1672223247" width="700" height="400"/> {/** src={`${games.Picture}`} เอาไว้ตอนนัททำใส่รูปให้แล้ว*/}
                        </Grid>
                        <Grid marginLeft={4}>
                            <Box
                                component="div"
                                sx={{
                                width : 400,
                                textOverflow: 'ellipsis',overflow: 'hidden',
                                whiteSpace: 'break-spaces',
                                my: 2,
                                p: 1,
                                bgcolor: (theme) =>
                                    theme.palette.mode === 'dark' ? '#101010' : 'grey.100',
                                color: (theme) =>
                                    theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                                border: '1px solid',
                                borderColor: (theme) =>
                                    theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                                borderRadius: 2,
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                }}
                                >{/** กำหนดให้เว้นบรรทัด auto จาก white space */}
                                {games.Game_description}
                            </Box>
                            <Grid>
                                Publish Date : {`${Moment(games.Publish_Date).format('DD MMMM YYYY')}`}
                            </Grid>
                            <Grid>
                                Publisher : {`${games.Seller?.Profile_Name}`}
                            </Grid>
                            <Grid>
                                Rating : {`${games.Rating?.Rating_Name}`}
                            </Grid>
                            <Grid>
                                Tag : {`${games.Type_Game?.Type_Game_Name}`}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container> {/** Test */}
                        <h1>Test</h1>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
    return null;
}

export default Individual_game

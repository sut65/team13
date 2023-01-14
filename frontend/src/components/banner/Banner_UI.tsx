import * as React from 'react';
import { Container } from "@material-ui/core";
import { Box, Grid, Paper } from '@mui/material';

import { GamesInterface } from '../../models/game/IGame';

function Banner_UI(){
    const [games, setGames] = React.useState<GamesInterface[]>([]);
    const [isDataLoaded, setIsDataloaded] = React.useState<boolean | null>(false);

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
        const fetchData = async () => {
            setIsDataloaded(true);
        }
        fetchData();
    }, []);

    if(isDataLoaded) return (
        <Container>
            <Box>
                <Paper elevation={2} sx={{padding:2,margin:2}}>
                    <Grid container>
                        <Grid> {/** Create Banner */}
                            test
                        </Grid>

                        <Grid> {/** Update and Delete Banner */}
                            test
                        </Grid>

                        <Grid> {/** Show Banner list */}
                            test
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
    else return(
        <Box>
            Loading
        </Box>
    );
}

export default Banner_UI

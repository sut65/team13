import * as React from 'react';
import { Container } from "@material-ui/core";
import { Box, Grid, Paper } from '@mui/material';

import { GamesInterface } from '../models/game/IGame';

function Dashboard(){
    const [games, setGames] = React.useState<GamesInterface[]>([]);

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

    function show_game_list(ID: any) {
        if(ID == -1){ // ID เป็น -1 หมายถึงตอนอ่านค่ามา เป็น null (ไม่มี fav game) แล้วมันถูกแปลงให้เป็น = 0 auto ผ่าน Number() | แล้วพอถูก -1 จากการผ่าน argument เลยกลายเป็น -1
            return null;
        }else{
            return(
                <Grid>
                    {games[Number(ID)].Game_Name}
                </Grid>
            );
        }
    }

    React.useEffect(() => {

    }, []);

    return (
        <Container>
            <Box>
                <Paper elevation={2} sx={{padding:2,margin:2}}>
                    
                </Paper>
            </Box>
        </Container>
    );
}

export default Dashboard

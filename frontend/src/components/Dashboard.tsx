import * as React from 'react';
import { Container } from "@material-ui/core";
import { Box, Grid, Paper, TextField } from '@mui/material';

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

    const filterData = (query: any, data: any) => {
        if (!query) {
          return data;
        } else {
          return data.filter((d: any) => d.toLowerCase().includes(query.toLowerCase()));
        }
    };

    let game_name_array = games.map((item: GamesInterface) => (item.Game_Name));
    const dataFiltered = filterData(searchQuery, game_name_array);

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
                    <Grid> {/** Search */}
                    <div
                    style={{
                        display: "flex",
                        alignSelf: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        padding: 20
                    }}>

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

                        <div style={{ padding: 3 }}>
                            {dataFiltered.map((d: any) => (
                                <div
                                    className="text"
                                    style={{
                                    padding: 5,
                                    justifyContent: "normal",
                                    fontSize: 20,
                                    color: "blue",
                                    margin: 1,
                                    width: "250px",
                                    //BorderColor: "Greeb",
                                    borderWidth: "10px"
                                    }}
                                    key={d.id}
                                >
                                    {d}
                                </div>
                                ))}
                            </div>
                        </div>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
}

export default Dashboard

import * as React from 'react';
import { Container } from "@material-ui/core";
import { Box, Grid, Paper, Link } from '@mui/material';

import { useParams } from 'react-router-dom';

import { UsersInterface } from '../../models/user/IUser';
import { GamesInterface } from '../../models/game/IGame';

function Store_Profile(){
    const { email } = useParams(); // ดึง parameter จาก url-parameter
    const [isDataLoaded, setIsDataloaded] = React.useState<boolean | null>(false);
    const [games, setGames] = React.useState<GamesInterface[]>([]);
    const [user, setUser] = React.useState<Partial<UsersInterface>>({});

    const getALLGame = async () => {
        const apiUrl = "http://localhost:8080/ALLGame";
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

    const getUser = async () => {
        const apiUrl = "http://localhost:8080/user/"+email; // email คือ email ที่ผ่านเข้ามาทาง parameter
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

    function show_outStanding_game(ID: any) {
        if(ID == -1){ // ID เป็น -1 หมายถึงตอนอ่านค่ามา เป็น null (ไม่มี fav game) แล้วมันถูกแปลงให้เป็น = 0 auto ผ่าน Number() | แล้วพอถูก -1 จากการผ่าน argument เลยกลายเป็น -1
            return null;
        }else{
            return(
                <Grid>
                    <Link href={"/individual_game/"+String(games[Number(ID)].ID)} underline="none" sx={{width : "100%"}}>
                        {games[Number(ID)].Game_Name}
                    </Link>
                </Grid>
            );
        }
    }

    React.useEffect(() => {
        const fetchData = async () => {
            await getUser();
            await getALLGame();
            setIsDataloaded(true);
        }
        fetchData();
    }, []);

    if(isDataLoaded && user.Is_Seller) return (
        <Container>
            <Box>
                <Paper elevation={2} sx={{padding:2,margin:2}}>
                    <Grid container>
                        <Grid margin={2}>
                            <img src={`${user.Profile_Picture}`} width="250" height="250"/> {/** show base64 picture from string variable (that contain base64 picture data) */}
                        </Grid>
                        <Grid marginLeft={1} item xs={8}>
                            <Grid>
                                <h2>{user.Profile_Name}</h2>
                            </Grid>
                            <Grid item> {/** เอา Grid มาล็อคไม่ให้ component มันเด้งไปที่อื่น */}
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
                                    {user.Store_Description}
                                </Box>
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
                                    {user.Store_Contact}
                                </Box>
                                <Box>
                                    <h3>Oustanding Game</h3>
                                </Box>
                                <Box>
                                    {show_outStanding_game(Number(user.Out_Standing_Game_ID)-1)}
                                </Box>

                            </Grid>
                        </Grid>

                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
    else return (
        <Container>
            <Box>
                <Grid container justifyContent={"center"} marginTop={50}>
                    <h1>ผู้ใช้รายนี้ไม่ได้ลงทะเบียนร้านค้าขายเกมไว้</h1>
                </Grid>
            </Box>
        </Container>
    );
}

export default Store_Profile

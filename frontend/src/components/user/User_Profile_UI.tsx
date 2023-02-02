import * as React from 'react';
import { Container } from "@material-ui/core";
import { Box, Grid, Paper, Link } from '@mui/material';

import { UsersInterface } from '../../models/user/IUser';
import { useParams } from 'react-router-dom';
import { StoragesInterface } from '../../models/storage/IStorage';

function User_Profile(){
    const { email } = useParams(); // ดึง parameter จาก url-parameter
    const [isDataLoaded, setIsDataloaded] = React.useState<boolean | null>(false);
    const [storages, setStorages] = React.useState<StoragesInterface[]>([]);
    const [user, setUser] = React.useState<Partial<UsersInterface>>({});

    const getALLStorage = async () => {
        const apiUrl = "http://localhost:8080/ALLstorages";
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
                    setStorages(res.data);
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

    function show_fav_game(ID: any) {
        if(ID == -1){ // ID เป็น -1 หมายถึงตอนอ่านค่ามา เป็น null (ไม่มี fav game) แล้วมันถูกแปลงให้เป็น = 0 auto ผ่าน Number() | แล้วพอถูก -1 จากการผ่าน argument เลยกลายเป็น -1
            return null;
        }else{
            return(
                <Grid>
                    <Link href={"/individual_game/"+String(storages[Number(ID)].Game.ID)} underline="none" sx={{width : "100%"}}>
                        {storages[Number(ID)].Game.Game_Name} {/** จะมีปัญหาเวลาเกมถูกลบแล้ว ใน array มี 1 ตัวแต่ id เราคือ 2 */}
                    </Link>
                </Grid>
            );
        }
    }

    React.useEffect(() => {
        const fetchData = async () => {
            await getUser();
            await getALLStorage();
            setIsDataloaded(true);
        }
        fetchData();
    }, []);

    if(isDataLoaded) return (
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
                                    {user.Profile_Description}
                                </Box>
                                <Box>
                                    <h3>Favorite Game</h3>
                                </Box>
                                <Box>
                                    {show_fav_game(Number(user.Favorite_Game_ID)-1)}
                                </Box>

                            </Grid>
                        </Grid>

                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
    return null;
}

export default User_Profile

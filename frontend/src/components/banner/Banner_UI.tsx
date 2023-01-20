import * as React from 'react';
import { Container, Snackbar } from "@material-ui/core";
import { Alert, Autocomplete, Box, Button, FormHelperText, Grid, Paper, TextField } from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs ,{ Dayjs } from "dayjs";

import { GamesInterface } from '../../models/game/IGame';
import { BannersInterface } from '../../models/banner/IBanner';
import { UsersInterface } from '../../models/user/IUser';

import SaveIcon from "@mui/icons-material/Save";
import AutoModeIcon from '@mui/icons-material/AutoMode';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

import BannerTable_UI from './BannerTable_UI';

function Banner_UI(){
    const [submitSuccess, setSubmitSuccess] = React.useState(false);
    const [submitError, setSubmitError] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

    const [isDataLoaded, setIsDataloaded] = React.useState<boolean | null>(false);
    const [date, setDate] = React.useState<Dayjs | null>(dayjs());
    const [img1, setImg1] = React.useState<string | ArrayBuffer | null>(null);
    const [img2, setImg2] = React.useState<string | ArrayBuffer | null>(null);

    const [games, setGames] = React.useState<GamesInterface[]>([]);
    const [users, setUsers] = React.useState<UsersInterface[]>([]);
    const [banners, setBanners] = React.useState<Partial<BannersInterface>>({});
    const [banners_ID, setBanners_ID] = React.useState<BannersInterface[]>([]);

    const handleClose = ( // AlertBar
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setSubmitSuccess(false);
        setSubmitError(false);
        setErrorMsg("");
    };

    const handleImg1Change = (event: any) => {
        const image = event.target.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => {
            const base64Data = reader.result;
            setImg1(base64Data)
        }
    }

    const handleImg2Change = (event: any) => {
        const image = event.target.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => {
            const base64Data = reader.result;
            setImg2(base64Data)
        }
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
                    setBanners_ID(res.data);
                    console.log(res.data);
                }
            });
    };

    const getUser = async () => {
        const apiUrl = "http://localhost:8080/sellers";
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
                    setUsers(res.data);
                }
            });
    };

    const createBanner = () => {
        let createData = {
            Banner_Picture: img1,
            Description: banners.Description,
            Edit_at: date,
            User_ID: banners.User_ID,
            Game_ID: banners.Game_ID,
            Admin_ID: Number(localStorage.getItem('aid')),
        };

        console.log(createData)

        const apiUrl = "http://localhost:8080/banners";
        const requestOptions = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(createData),
        };

        fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                setSubmitSuccess(true);
            } else {
                setSubmitError(true);
                setErrorMsg(" - "+res.error);
            }
        });

    }

    const updateBanner = () => {
        let updateData = {
            ID: banners.ID,
            Banner_Picture: img2,
            Description: banners.Description,
            Edit_at: date,
            User_ID: banners.User_ID,
            Admin_ID: Number(localStorage.getItem('aid')),
            Game_ID: banners.Game_ID,
        };

        console.log(updateData)

        const apiUrl = "http://localhost:8080/banners";
        const requestOptions = {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        };

        fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                setSubmitSuccess(true);
                console.log(res.data);
            } else {
                setSubmitError(true);
                setErrorMsg(" - "+res.error);
            }
        });

    }

    const deleteBanner = () => {
        const apiUrl = "http://localhost:8080/banner/"+banners.ID;
        const requestOptions = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };
    
        fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                setSubmitSuccess(true);
            } else {
                setSubmitError(true);
                setErrorMsg(" - "+res.error);
            }
        });
    }

    React.useEffect(() => {
        const fetchData = async () => {
            await getGame();
            await getBanner();
            await getUser();
            setIsDataloaded(true);
        }
        fetchData();
    }, []);

    if(isDataLoaded) return (
        <Container maxWidth="xl">
            <Snackbar // บันทึกสำเร็จ
                open={submitSuccess}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert onClose={handleClose} severity="success">              
                    บันทึกข้อมูลสำเร็จ
                </Alert>
            </Snackbar>

            <Snackbar // บันทึกไม่สำเร็จ
                open={submitError} 
                autoHideDuration={3000} 
                onClose={handleClose} 
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert onClose={handleClose} severity="error">
                    บันทึกข้อมูลไม่สำเร็จ{errorMsg}
                </Alert>
            </Snackbar>
            
            <Box>
                <Paper elevation={2} sx={{padding:2,margin:2}}>
                    <Grid container>
                        <Grid marginRight={2}> {/** Create Banner */}
                            <Grid marginBottom={2}>
                                <Grid> {/** Banner Picture */}
                                    <img src={`${img1}`} width="350" height="150"/> {/** show base64 picture from string variable (that contain base64 picture data) */}
                                </Grid>
                                <input type="file" onChange={handleImg1Change} />
                                <FormHelperText>recommend size is 1200*300 pixels</FormHelperText>
                            </Grid>

                            <Grid marginBottom={2}> {/** Game */}
                                <Autocomplete
                                    id="game-autocomplete"
                                    options={games}
                                    fullWidth
                                    size="medium"
                                    //defaultValue={banners[Number(user.Favorite_Game_ID)-1]} // ใช้ไม่ได้จะมีปัญหาเวลา ID = 3 แต่มีเกมในคลังแค่เกมเดียวงี้
                                    onChange={(event: any, value) => {
                                        setBanners({ ...banners, Game_ID: value?.ID }); // บันทึกค่าลง interface
                                    }}
                                    getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                                        `${option.ID} - ${option.Game_Name}`
                                    } //filter value // เว้นวรรคระว่าง } กับ $ มีผลกับการแสดงผล
                                    renderInput={(params) => <TextField {...params} label="Game ID" />}
                                    renderOption={(props: any, option: any) => {
                                    return (
                                        <li
                                        {...props}
                                        value={`${option.ID}`}
                                        key={`${option.ID}`}
                                        >{`${option.ID} - ${option.Game_Name}`}</li>
                                    ); //การแสดงผล อันนี้เราเลือกแสดงผลเฉพาะ personal id แต่คืนค่าค่าเป็น id 
                                    }}
                                />
                            </Grid>

                            <Grid marginBottom={2}> {/** Owner */}
                                    <Autocomplete
                                        id="owner-autocomplete"
                                        options={users}
                                        fullWidth
                                        size="medium"
                                        //defaultValue={banners[Number(user.Favorite_Game_ID)-1]} // ใช้ไม่ได้จะมีปัญหาเวลา ID = 3 แต่มีเกมในคลังแค่เกมเดียวงี้
                                        onChange={(event: any, value) => {
                                            setBanners({ ...banners, User_ID: value?.ID }); // บันทึกค่าลง interface
                                        }}
                                        getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                                            `${option.ID} - ${option.Profile_Name}`
                                        } //filter value // เว้นวรรคระว่าง } กับ $ มีผลกับการแสดงผล
                                        renderInput={(params) => <TextField {...params} label="Owner ID" />}
                                        renderOption={(props: any, option: any) => {
                                        return (
                                            <li
                                            {...props}
                                            value={`${option.ID}`}
                                            key={`${option.ID}`}
                                            >{`${option.ID} - ${option.Profile_Name}`}</li>
                                        ); //การแสดงผล อันนี้เราเลือกแสดงผลเฉพาะ personal id แต่คืนค่าค่าเป็น id 
                                        }}
                                    />
                            </Grid>

                            <Grid marginBottom={2}> {/** Editor */}
                                <TextField
                                    disabled
                                    id="editor-autocomplete"
                                    fullWidth
                                    size="medium"
                                    label="Editor"
                                    defaultValue={localStorage.getItem('name')}
                                />
                            </Grid>
                            
                            <Grid marginBottom={2}> {/** Description */}
                                <TextField
                                    fullWidth
                                    id="banner-description"
                                    label="Banner Description"
                                    variant="outlined"
                                    onChange={(event) => setBanners({ ...banners, Description: event.target.value })}
                                    />
                            </Grid>

                        </Grid>

                        <Grid marginRight={2}> {/** Update and Delete Banner */}
                            <Grid marginBottom={2}>
                                <Grid marginBottom={2}> {/** Banner ID */}
                                    <Autocomplete
                                        id="banner-id-autocomplete"
                                        options={banners_ID}
                                        fullWidth
                                        size="medium"
                                        //defaultValue={banners[Number(user.Favorite_Game_ID)-1]} // ใช้ไม่ได้จะมีปัญหาเวลา ID = 3 แต่มีเกมในคลังแค่เกมเดียวงี้
                                        onChange={(event: any, value) => {
                                            setBanners({ ...banners, ID: value?.ID }); // บันทึกค่าลง interface
                                            setImg2(value?.Banner_Picture || ""); // value? หมายถึงว่าหาก value ไม่เป็น null ถึงจะเรียก .Banner_Picture
                                        }}
                                        getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                                            `${option.ID}`
                                        } //filter value // เว้นวรรคระว่าง } กับ $ มีผลกับการแสดงผล
                                        renderInput={(params) => <TextField {...params} label="Banner ID" />}
                                        renderOption={(props: any, option: any) => {
                                        return (
                                            <li
                                            {...props}
                                            value={`${option.ID}`}
                                            key={`${option.ID}`}
                                            >{`${option.ID}`}</li>
                                        ); //การแสดงผล อันนี้เราเลือกแสดงผลเฉพาะ personal id แต่คืนค่าค่าเป็น id 
                                        }}
                                    />
                                </Grid>
                                <Grid> {/** Banner Picture */}
                                    <img src={`${img2}`} width="350" height="150"/> {/** show base64 picture from string variable (that contain base64 picture data) */}
                                </Grid>
                                <input type="file" onChange={handleImg2Change} />
                                <FormHelperText>recommend size is 1200*300 pixels</FormHelperText>
                            </Grid>

                            <Grid marginBottom={2}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        disabled
                                        label="DateTimePicker"
                                        value={date}
                                        onChange={(newValue) => {
                                            setDate(newValue);
                                        }}
                                        renderInput={(props) => <TextField {...props} />}
                                    />
                                </LocalizationProvider>
                            </Grid>

                            {/** Button List */}
                            <Grid marginBottom={2}>
                                <Button variant="contained" color="success" onClick={createBanner} endIcon={<SaveIcon />}>
                                    Add new Banner
                                </Button>
                            </Grid>
                            
                            <Grid marginBottom={2}>
                                <Button variant="contained" color="success" onClick={updateBanner} endIcon={<AutoModeIcon />}>
                                    Update Banner
                                </Button>
                            </Grid>

                            <Grid marginBottom={2}>
                                <Button variant="contained" color="error" onClick={deleteBanner} endIcon={<DeleteForeverOutlinedIcon />}>
                                    Delete Banner
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid item xs={7}> {/** Show Banner list */}
                            <BannerTable_UI/>
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

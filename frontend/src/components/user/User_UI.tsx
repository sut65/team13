import * as React from "react";
import { Container } from "@material-ui/core";
import { Box,Paper,Grid,TextField,Button, Autocomplete } from "@mui/material";
import { FormControl,FormLabel,RadioGroup,Radio,FormControlLabel,FormHelperText } from "@mui/material";
import { useAsync } from 'react-async';

import SaveIcon from "@mui/icons-material/Save";
import StorefrontIcon from '@mui/icons-material/Storefront';

import { GendersInterface } from "../../models/user/IGender";
import { UsersInterface } from "../../models/user/IUser";
import { StoragesInterface } from "../../models/storage/IStorage";

function User(){
    const [submitSuccess, setSubmitSuccess] = React.useState(false);
    const [submitError, setSubmitError] = React.useState(false);
    const [noAccess, setNoAccess] = React.useState(false);

    const [isLoaded, setIsloaded] = React.useState<boolean | null>(false);

    const [new_password, setNew_password] = React.useState<string | null>(null);
    const [confirm_password, setConfirm_password] = React.useState<string | null>(null);
    const [imageString, setImageString] = React.useState<string | ArrayBuffer | null>(null);

    const [storages, setStorages] = React.useState<StoragesInterface[]>([]);
    const [games, setGames] = React.useState<StoragesInterface[]>([]);
    const [genders, setGenders] = React.useState<GendersInterface[]>([]);
    const [user, setUser] = React.useState<Partial<UsersInterface>>({});

    const handleImageChange = (event: any) => {
        const image = event.target.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => {
            const base64Data = reader.result;
            setImageString(base64Data)
        }
    }

    const handleApplySeller = () => {
        setUser({ ...user, Is_Seller: true });
    }

    const getGender = async () => {
        const apiUrl = "http://localhost:8080/genders";
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
                    setGenders(res.data);
                }
            });
    };

    const getStorage = async () => {
        const apiUrl = "http://localhost:8080/user_storage/natt@gmail.com"; // รอ local Storage
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

    const getGame = async () => {
        const apiUrl = "http://localhost:8080/user_game/natt@gmail.com"; // รอ local Storage
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
        const apiUrl = "http://localhost:8080/user/natt@gmail.com"; // ตรง email รอเปลี่ยนเป็น localStorage.getItem
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
                    setImageString(res.data.Profile_Picture);
                    setNew_password(res.data.Password);
                    setConfirm_password(res.data.Password);
                }
            });
    };

    const submit = () => {
        if(new_password == confirm_password){
            console.log("OK")
        }else{
            console.log("Error")
        }

        let UpdateData = {
            Email: "natt@gmail.com", // รอทำ localStorage.getitem
            Password: new_password,
            Profile_Name: user.Profile_Name,
            Profile_Description: user.Profile_Description,
            Profile_Picture: imageString,
            Gender_ID: user.Gender_ID,
            Favorite_Game_ID: user.Favorite_Game_ID,
            Is_Seller: user.Is_Seller,
            Store_Description: user.Store_Description,
            Out_Standing_Game_ID: user.Out_Standing_Game_ID, // ยังไม่ได้ทำ ดึงข้อมูลจากตารางเกมกรองด้วยคนขาย
            Store_Contact: user.Store_Contact,
        };

        console.log(UpdateData)

        const apiUrl = "http://localhost:8080/users";
        const requestOptions = {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(UpdateData),
        };

        fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                setSubmitSuccess(true);
            } else {
                setSubmitError(true);
            }
        });
    }

    function SellerApply(isSeller: Boolean | undefined) {
        if (!isSeller) {
            return (
                <Grid marginTop={1} container justifyContent="center">
                    <Button variant="contained" color="info" onClick={handleApplySeller} endIcon={<StorefrontIcon />}>
                        สมัครเป็นผู้ขายเกม
                    </Button>
                </Grid>
            )
        }else{
            return(
                <Grid container justifyContent={"center"}>
                    <Grid container justifyContent={"center"}>
                        <h1>Store</h1>
                    </Grid>

                    <Grid container>
                        <Grid item xs = {3}/>
                        <Grid item xs = {2} margin={2}> {/** Out Standing Game */}
                            <Autocomplete
                                id="games-autocomplete"
                                options={games}
                                fullWidth
                                size="medium"
                                defaultValue={games[Number(user.Out_Standing_Game_ID) - 1]}
                                onChange={(event: any, value) => {
                                    setUser({ ...user, Out_Standing_Game_ID: value?.ID }); // บันทึกค่าลง interface
                                }}
                                getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                                    `${option.Game_Name}`
                                } //filter value // เว้นวรรคระว่าง } กับ $ มีผลกับการแสดงผล
                                renderInput={(params) => <TextField {...params} label="Outstanding Game on Store" />}
                                renderOption={(props: any, option: any) => {
                                return (
                                    <li
                                    {...props}
                                    value={`${option.ID}`}
                                    key={`${option.ID}`}
                                    >{`${option.Game_Name}`}</li>
                                ); //การแสดงผล อันนี้เราเลือกแสดงผลเฉพาะ personal id แต่คืนค่าค่าเป็น id 
                                }}
                            />
                        </Grid>

                        <Grid item xs={4}> {/** Store Description and Contact*/}
                            <Grid marginTop={2}>
                                <TextField
                                    multiline
                                    rows={8}
                                    fullWidth
                                    id="store-description"
                                    label="Store Description"
                                    variant="outlined"
                                    defaultValue={user.Store_Description}
                                    onChange={(event) => setUser({ ...user, Store_Description: event.target.value })}/>
                            </Grid>
                            <Grid marginTop={1}>
                                <TextField
                                    multiline
                                    rows={8}
                                    fullWidth
                                    id="store-contact"
                                    label="Store Contact"
                                    variant="outlined"
                                    defaultValue={user.Store_Contact}
                                    onChange={(event) => setUser({ ...user, Store_Contact: event.target.value })}/>
                            </Grid>
                        </Grid>

                    </Grid>
                </Grid>
            );
        }
    }

    React.useEffect(() => {
        const fetchData = async () => {
            await getUser();
            await getGender();
            await getStorage();
            await getGame();
            setIsloaded(true);
        }
        fetchData();
    }, []); // ในช่อง [] ถ้าเกิดใส่อะไรเข้าไปเช่น [isLoaded] ถ้าหาก isLoaded มีการอัพเดท useEffect จะถูกเรียกใช้งานอีกครั้ง

    var nowGender = genders.map((item: GendersInterface) => (item.Gender));

    if (isLoaded) return(
        <Container>
            <Box>
                <Paper elevation={2} sx={{padding:2}}>
                    <Grid container>
                        <Grid container justifyContent="center"> {/** Profile */}
                            <h1> Profile </h1>
                        </Grid>

                        <Grid container> {/** password */}
                            <Grid item xs={3}/>
                            <Grid margin={1} item xs={2}>
                                <TextField
                                    fullWidth
                                    id="new-password"
                                    label="New Password"
                                    variant="outlined"
                                    onChange={(event) => setNew_password(String(event.target.value))}/>
                            </Grid>
                            <Grid margin={1} item xs={2}>
                                <TextField
                                    fullWidth
                                    id="confirm-password"
                                    label="Confirm Password"
                                    variant="outlined"
                                    onChange={(event) => setConfirm_password(String(event.target.value))}/>
                            </Grid>
                            <Grid container marginLeft={39}>
                                <FormHelperText>if you don't want to change password, Please do not touch password field</FormHelperText>
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid item xs={3}> {/* Profile Picture */}
                                <h4>Profile Picture</h4>
                                <Grid>
                                    <img src={`${imageString}`} width="250" height="250"/> {/** show base64 picture from string variable (that contain base64 picture data) */}
                                </Grid>
                                <input type="file" onChange={handleImageChange} />
                                <FormHelperText>recommend size is 250*250 pixels</FormHelperText>
                            </Grid>

                            <Grid margin={1} item xs={2}> {/** Profile Name */}
                                <TextField
                                    fullWidth
                                    id="profile-name"
                                    label="Profile Name"
                                    variant="outlined"
                                    defaultValue={`${user.Profile_Name}`}
                                    onChange={(event) => setUser({ ...user, Profile_Name: event.target.value })}/>
                                <Grid marginTop={1}> {/* gender radio button */}
                                    <FormControl>
                                        <FormLabel id="radio-buttons-group-gender">Gender</FormLabel>
                                            <RadioGroup
                                                aria-labelledby="radio-buttons-group-gender"
                                                name="radio-buttons-group-gender"
                                                defaultValue={user.Gender_ID}
                                                onChange={(event) => setUser({ ...user, Gender_ID: Number(event.target.value) })}
                                            >
                                                {genders.map((o) => (
                                                <FormControlLabel
                                                    value={o.ID} // <---- pass a primitive id value, don't pass the whole object here
                                                    control={<Radio size="small" />}
                                                    label={o.Gender}
                                                />
                                                ))}
                                        </RadioGroup>
                                        <FormHelperText>current gender is {nowGender[Number(user.Gender_ID) - 1]}</FormHelperText> {/*เรียกใช้โดยตรงเลยไม่ได้ ต้องให้มัน map ก่อน ไม่งั้น react มัน render component ก่อนถ้าตั้ง defaultvalue มันจะหาค่าไม่เจอเพระามันยังไม่ได้ get*/}
                                    </FormControl>
                                </Grid>

                                <Grid marginTop={1}> {/** Favorite Game on profile */}
                                    <Autocomplete
                                        id="storages-autocomplete"
                                        options={storages}
                                        fullWidth
                                        size="medium"
                                        defaultValue={storages[Number(user.Favorite_Game_ID)-1]}
                                        onChange={(event: any, value) => {
                                            setUser({ ...user, Favorite_Game_ID: value?.ID }); // บันทึกค่าลง interface
                                        }}
                                        getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                                            `${option.Game.Game_Name}`
                                        } //filter value // เว้นวรรคระว่าง } กับ $ มีผลกับการแสดงผล
                                        renderInput={(params) => <TextField {...params} label="Favorite Game on Profile" />}
                                        renderOption={(props: any, option: any) => {
                                        return (
                                            <li
                                            {...props}
                                            value={`${option.ID}`}
                                            key={`${option.ID}`}
                                            >{`${option.Game.Game_Name}`}</li>
                                        ); //การแสดงผล อันนี้เราเลือกแสดงผลเฉพาะ personal id แต่คืนค่าค่าเป็น id 
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid margin={1} item xs={4}> {/** Profile Description */}
                                <TextField
                                    multiline
                                    rows={8}
                                    fullWidth
                                    id="profile-description"
                                    label="Profile Description"
                                    variant="outlined"
                                    defaultValue={`${user.Profile_Description}`}
                                    onChange={(event) => setUser({ ...user, Profile_Description: event.target.value })}/>
                            </Grid>
                        </Grid>

                        {SellerApply(user.Is_Seller)}

                        {/* Insert Button */}
                        <Grid container justifyContent="center" margin={2}>
                            <Button variant="contained" color="success" onClick={submit} endIcon={<SaveIcon />}>
                                submit
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
    return null;
}

export default User
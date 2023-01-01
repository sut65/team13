import * as React from "react";
import { Container } from "@material-ui/core";
import { Box,Paper,Grid,TextField,Button } from "@mui/material";
import { FormControl,FormLabel,RadioGroup,Radio,FormControlLabel,FormHelperText } from "@mui/material";
import ButtonBase from '@mui/material/ButtonBase';
import SaveIcon from "@mui/icons-material/Save";

import { GendersInterface } from "../../models/user/IGender";
import { UsersInterface } from "../../models/user/IUser";

function User(){
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [noAccess, setNoAccess] = React.useState(false);

    const [new_password, setNew_password] = React.useState<string | null>(null);
    const [confirm_password, setConfirm_password] = React.useState<string | null>(null);
    const [profile_name, setProfile_name] = React.useState<string | null>(null);
    const [profile_description, setProfile_description] = React.useState<string | null>(null);
    const [genderID, setGenderID] = React.useState<number | null>(null);
    const [imageString, setImageString] = React.useState<string | ArrayBuffer | null>(null);

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
                    setImageString(res.data.Profile_Picture)
                }
            });
    };

    React.useEffect(() => {
        getGender();
        getUser();
    }, []);
    var nowGender = genders.map((item: GendersInterface) => (item.Gender));

    const submit = () => {
        if(new_password == confirm_password){
            console.log("OK")
        }else{
            console.log("Error")
        }

        let data = {
            Email: "natt@gmail.com", // รอทำ localStorage.getitem
            Password: new_password,
            Profile_Name: profile_name,
            Profile_Description: profile_description,
            Profile_Picture: imageString,
            Gender_ID: genderID ? genderID : user.Gender_ID, // ถ้า genderID เป็น null หมายถึงไม่มีการเลือกจากผู้ใช้ ให้ใช้ค่าเดิมของผู้ใช้คนนั้นๆ
            Favorite_Game_ID: "number", // ยังไม่ได้ทำ
            Is_Seller: "boolean", // ยังไม่ได้ทำ
            Store_Description: "string", // ยังไม่ได้ทำ
            Out_Standing_Game_ID: "number", // ยังไม่ได้ทำ
            Out_Standing_Game: "GamesInterface", // ยังไม่ได้ทำ
            Store_Contact: "string", // ยังไม่ได้ทำ
        };

        console.log(data)

        const apiUrl = "http://localhost:8080/users";
        const requestOptions = {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        };

        fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.data) {
                setSuccess(true);
            } else {
                setError(true);
            }
        });
    }

    return(
        <Container>
            <Box>
                <Paper elevation={2} sx={{padding:2}}>
                    <Grid container>
                        <Grid container justifyContent="center">
                            <h1> Profile </h1>
                        </Grid>

                        <Grid container>
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
                        </Grid>

                        <Grid container>
                            <Grid item xs={3}> {/* Profile Picture */}
                            <Grid>
                                <img src={`${imageString}`} width="250" height="250"/> {/** show base64 picture from string variable (that contain base64 picture data) */}
                            </Grid>
                                <input type="file" onChange={handleImageChange} />
                                <FormHelperText> recommend size is 250*250 pixels</FormHelperText>
                            </Grid>
                            <Grid margin={1} item xs={2}>
                                <TextField
                                    fullWidth
                                    id="profile-name"
                                    label="Profile Name"
                                    variant="outlined"
                                    onChange={(event) => setProfile_name(String(event.target.value))}/>
                                <Grid marginTop={1}> {/* gender radio button */}
                                    <FormControl>
                                        <FormLabel id="radio-buttons-group-gender">Gender</FormLabel>
                                            <RadioGroup
                                                aria-labelledby="radio-buttons-group-gender"
                                                name="radio-buttons-group-gender"
                                                onChange={(event) => setGenderID(Number(event.target.value))}
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
                            </Grid>
                            <Grid margin={1} item xs={4}>
                                <TextField
                                    multiline
                                    rows={8}
                                    fullWidth
                                    id="profile-description"
                                    label="Profile Description"
                                    variant="outlined"
                                    onChange={(event) => setProfile_description(String(event.target.value))}/>
                            </Grid>
                        </Grid>

                        {/* Insert Button */}
                        <Grid container justifyContent="center">
                            <Button variant="contained" color="success" onClick={submit} endIcon={<SaveIcon />}>
                                submit
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    )
}

export default User
import * as React from "react";
import { Container } from "@material-ui/core";
import { Box,Paper,Grid,TextField,Button, Autocomplete, Alert } from "@mui/material";
import { FormControl,FormLabel,RadioGroup,Radio,FormControlLabel,FormHelperText } from "@mui/material";
import { Dialog,Snackbar,DialogTitle,DialogContent,DialogContentText,DialogActions } from "@material-ui/core";

import SaveIcon from "@mui/icons-material/Save";
import StorefrontIcon from '@mui/icons-material/Storefront';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

import { GendersInterface } from "../../models/user/IGender";
import { UsersInterface } from "../../models/user/IUser";
import { StoragesInterface } from "../../models/storage/IStorage";
import { GamesInterface } from "../../models/game/IGame";

function User(){
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [submitSuccess, setSubmitSuccess] = React.useState(false);
    const [submitError, setSubmitError] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
    
    const [isDataLoaded, setIsDataloaded] = React.useState<boolean | null>(false);

    const [new_password, setNew_password] = React.useState<string | null>(null);
    const [confirm_password, setConfirm_password] = React.useState<string | null>(null);
    const [imageString, setImageString] = React.useState<string | ArrayBuffer | null>(null); // สร้างตัวแปรแยกเนื่องจาก render.result มันต้องการ ArrayBuffer ด้วย

    const [OWNstorages, setOWNstorages] = React.useState<StoragesInterface[]>([]);
    const [OWNgames, setOWNgames] = React.useState<GamesInterface[]>([]);
    const [ALLstorages, setALLstorages] = React.useState<StoragesInterface[]>([]);
    const [ALLgames, setALLgames] = React.useState<GamesInterface[]>([]);
    const [genders, setGenders] = React.useState<GendersInterface[]>([]);
    const [user, setUser] = React.useState<Partial<UsersInterface>>({});

    const convertType = (data: number | undefined) => {
        let val = typeof data === "number" ? data : 0;
        return val;
    };

    const handleImageChange = (event: any) => {
        const image = event.target.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => {
            const base64Data = reader.result;
            setImageString(base64Data)
        }
    }

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

    const handleDialogClickOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const getGender = async () => {
        const apiUrl = "http://localhost:8080/genders";
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
       
        await fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    setGenders(res.data);
                }
            });
    };

    const getOWNStorage = async () => {
        const apiUrl = "http://localhost:8080/user_storage/"+localStorage.getItem("email");
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
                    setOWNstorages(res.data);
                }
            });
    };

    const getOWNGame = async () => {
        const apiUrl = "http://localhost:8080/user_game/"+localStorage.getItem("email");
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
                    setOWNgames(res.data);
                }
            });
    };

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
                    setALLstorages(res.data);
                }
            });
    };

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
                    setALLgames(res.data);
                }
            });
    };

    const getUser = async () => {
        const apiUrl = "http://localhost:8080/user/"+localStorage.getItem("email");
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
        if(new_password == confirm_password){ // password ตรงกันก็จะ มีการ submit
            let UpdateData = {
                Email: localStorage.getItem("email"), // รอทำ localStorage.getitem
                Password: new_password, // ตัวแปรชื่อ new_password ก็จริงแต่อาจเป็น password เดิมก็ได้
                Profile_Name: user.Profile_Name,
                Profile_Description: user.Profile_Description,
                Profile_Picture: imageString,
                Gender_ID: user.Gender_ID,
                Favorite_Game_ID: convertType(user.Favorite_Game_ID),
                Is_Seller: user.Is_Seller,
                Store_Description: user.Store_Description,
                Out_Standing_Game_ID: convertType(user.Out_Standing_Game_ID), // ยังไม่ได้ทำ ดึงข้อมูลจากตารางเกมกรองด้วยคนขาย
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
                    setErrorMsg(" - "+res.error);
                }
            });
        }else{
            setSubmitError(true); // password ไม่ตรงกัน
            setErrorMsg(" - รหัสผ่านไม่ตรงกัน");
        }

    }

    const handleApplySeller = async () => {
        let UpdateData = {
            Email: localStorage.getItem("email"), // รอทำ localStorage.getitem
            Password: new_password, // ตัวแปรชื่อ new_password ก็จริงแต่อาจเป็น password เดิมก็ได้
            Profile_Name: user.Profile_Name,
            Profile_Description: user.Profile_Description,
            Profile_Picture: imageString,
            Gender_ID: user.Gender_ID,
            Favorite_Game_ID: convertType(user.Favorite_Game_ID),
            Is_Seller: true,
            Store_Description: user.Store_Description,
            Out_Standing_Game_ID: convertType(user.Out_Standing_Game_ID), // ยังไม่ได้ทำ ดึงข้อมูลจากตารางเกมกรองด้วยคนขาย
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
                window.location.reload();
            } else {
                setSubmitError(true);
                setErrorMsg(" - "+res.error);
            }
        });
    
    }

    const deleteAccount = () => {
        const signout = () => {
            localStorage.clear();
            window.location.href = "/";
        };

        const apiUrl = "http://localhost:8080/users/"+localStorage.getItem("email");
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
                signout();
            } else {
                setSubmitError(true);
            }
        });
    }

    React.useEffect(() => {
        const fetchData = async () => {
            await getUser();
            await getGender();
            await getOWNStorage();
            await getOWNGame();
            await getALLStorage();
            await getALLGame();
            setIsDataloaded(true);
        }
        fetchData();
    }, []); // ในช่อง [] ถ้าเกิดใส่อะไรเข้าไปเช่น [isLoaded] ถ้าหาก isLoaded มีการอัพเดท useEffect จะถูกเรียกใช้งานอีกครั้ง

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
                                options={OWNgames}
                                fullWidth
                                size="medium"
                                defaultValue={ALLgames[Number(user.Out_Standing_Game_ID) - 1]} // ใช้ไม่ได้จะมีปัญหาเวลา ID = 3 แต่มีเกมที่ขายแค่เกมเดียวงี้
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

    if (isDataLoaded) return(
        <Container>
            <Snackbar // บันทึกสำเร็จ
                id="success"
                open={submitSuccess}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert onClose={handleClose} severity="success">              
                    บันทึกข้อมูลสำเร็จ
                </Alert>
            </Snackbar>

            <Snackbar // บันทึกไม่สำเร็จ
                id="error"
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
                                    type="password"
                                    variant="outlined"
                                    onChange={(event) => setNew_password(String(event.target.value))}/>
                            </Grid>
                            <Grid margin={1} item xs={2}>
                                <TextField
                                    fullWidth
                                    id="confirm-password"
                                    label="Confirm Password"
                                    type="password"
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
                                    </FormControl>
                                </Grid>

                                <Grid marginTop={2}> {/** Favorite Game on profile */}
                                    <Autocomplete
                                        id="storages-autocomplete"
                                        options={OWNstorages}
                                        fullWidth
                                        size="medium"
                                        defaultValue={ALLstorages[Number(user.Favorite_Game_ID)-1]} // ใช้ไม่ได้จะมีปัญหาเวลา ID = 3 แต่มีเกมในคลังแค่เกมเดียวงี้
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

                        {/* Button */}
                        <Grid container justifyContent="center" margin={2}>
                            {/* Submit Button */}
                            <Button variant="contained" color="success" onClick={submit} endIcon={<SaveIcon />}>
                                submit
                            </Button>
                            {/* Delete Account Button */}
                            <Grid container justifyContent="right">
                                <Button variant="contained" color="error" onClick={handleDialogClickOpen} endIcon={<DeleteForeverOutlinedIcon />}>
                                    DELETE ACCOUNT
                                </Button>
                                <Dialog
                                    open={dialogOpen}
                                    onClose={handleDialogClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                    >
                                    <DialogTitle id="alert-dialog-title">
                                        {"Are you sure to DELETE your account?"}
                                    </DialogTitle>

                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            การกดที่ปุ่ม YES จะทำให้บัญชีของคุณหายไปตลอดกาลและไม่สามารถกู้คืนได้
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleDialogClose}>No</Button>
                                        <Button onClick={deleteAccount} color="error" autoFocus>Yes</Button>
                                    </DialogActions>
                                </Dialog>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    );
    return null;
}

export default User
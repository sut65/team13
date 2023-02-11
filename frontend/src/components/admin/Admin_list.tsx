import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Table from '@mui/material/Table';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import BuildIcon from '@mui/icons-material/Build';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { GamesInterface } from "../../models/game/IGame";
import { UsersInterface } from "../../models/user/IUser";
import { RatingsInterface } from "../../models/game/IRating";
import { Type_GamesInterface } from "../../models/game/IType_Game";
import { Game_StatusInterface } from "../../models/game/IGame_Status";
import { Container, Box, Snackbar, TextField, Paper, Card, CardActionArea, CardContent, CardMedia, Fab, TableContainer, Stack, DialogContentText, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Autocomplete from "@mui/material/Autocomplete";
import Moment from 'moment';
import AddIcon from '@mui/icons-material/Add';
import { AdminsInterface } from "../../models/admin/IAdmin";
import { CreateAdmin, GetDepartment, GetGender, GetProvince, GetAdmin } from "./Admin_Service";
import { GetGame } from "../game/GameService";
import { DepartmentInterface } from "../../models/admin/IDepartment";
import { ProvinceInterface } from "../../models/admin/IProvince";
import { GendersInterface } from "../../models/user/IGender";
import Admin from "../admin/Admin_UI";
const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));
function Admin_list() {
    const [admin, setAdmin] = useState<AdminsInterface[]>([]);

    const [adminEdit, setAdminEdit] = React.useState<Partial<AdminsInterface>>({});

    const [department, setDepartment] = useState<DepartmentInterface[]>([]);
    const [province, setProvince] = useState<ProvinceInterface[]>([]);
    const [gender, setGender] = useState<GendersInterface[]>([]);

    const [openForCreate, setOpenForCreate] = React.useState(false);
    const [openForEdit, setOpenForEdit] = React.useState(false);
    const [openForDelete, setOpenForDelete] = React.useState(false);

    const [name, setName] = React.useState<string>("");

    const [UpdateSuccess, setUpdateSuccess] = useState(false);
    const [UpdateError, setUpdateError] = useState(false);
    const [DeleteSuccess, setDeleteSuccess] = useState(false);
    const [DeleteError, setDeleteError] = useState(false);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

    const [searchQuery, setSearchQuery] = React.useState("");
    const [imageString, setImageString] = useState<string | ArrayBuffer | null>(null);


    const classes = useStyles();

    const deleteAdmin = (id: number) => {

        const signout = () => {
            localStorage.clear();
            window.location.href = "/";
        };


        const apiUrl = "http://localhost:8080/admin/" + id;
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

                    if (String(id) == localStorage.getItem("aid")) {
                        signout();
                    }
                    setDeleteSuccess(true);
                    window.location.reload();
                } else {
                    setDeleteError(true);
                    setErrorMsg(" - " + res.error);
                }
            });
    }


    const UpdateAdmin = (id: number) => {

        let UpdateData = {
            ID: adminEdit?.ID,
            Email: adminEdit?.Email,
            Name: adminEdit?.Name,
            Password: adminEdit?.Password,
            Address: adminEdit?.Address,
            Gender_ID: adminEdit?.Gender_ID,
            Department_ID: adminEdit?.Department_ID,
            Province_ID: adminEdit?.Province_ID,
            Profile_Picture: imageString,
        };
        const apiUrl = "http://localhost:8080/admin";
        const requestOptions = {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },

            body: JSON.stringify(UpdateData),
        };
        console.log(UpdateData)

        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                if (res.data) {
                    setUpdateSuccess(true);
                    window.location.reload()
                } else {
                    setUpdateError(true);
                    setErrorMsg(" - " + res.error);

                }
            });


    }

    const getDepartment = async () => {
        let res = await GetDepartment();
        if (res) {
            setDepartment(res);
            console.log(res);
        }
    };

    const getProvince = async () => {
        let res = await GetProvince();
        if (res) {
            setProvince(res);
        }
    };

    const getGender = async () => {
        let res = await GetGender();
        if (res) {
            setGender(res);
        }
    };
    const getAdmin = async () => {
        let res = await GetAdmin();
        if (res) {
            // setImageString(rese)// เพื่อให้ มันมีภาพ ตอนแรกไม่มีภาพ defaultvaule
            // setAdmin(res);
            setAdmin(res);
            setAdminEdit(res);
        }
    };


    const handleCloseSnackbar = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }
        setUpdateSuccess(false);
        setUpdateError(false);
        setDeleteSuccess(false);
        setDeleteError(false);
    };

    //image
    const handleImageChange = (event: any) => {
        const image = event.target.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => {
            const base64Data = reader.result;
            setImageString(base64Data)
        }
    }

    // TextField
    const handleInputChange = (
        event: React.ChangeEvent<{ id?: string; value: any }>
    ) => {
        const id = event.target.id as keyof typeof Admin_list;
        const { value } = event.target;
        //setAdmin1({ ...admin1, [id]: value });
        setAdminEdit({ ...adminEdit, [id]: value });
    };
    const handleClickOpenForCreate = () => {
        setOpenForCreate(true);

    };

    const handleCloseForCreate = () => {
        setOpenForCreate(false);
    };

    const handleClickOpenForEdit = (item: AdminsInterface) => {
        setOpenForEdit(true);
        setImageString(item.Profile_Picture);


        setAdminEdit(item);


    };

    const handleCloseForEdit = () => {
        setOpenForEdit(false);
    };

    const handleClickOpenForDelete = (item: AdminsInterface) => {
        setOpenForDelete(true);
        //  setDeleteFriend(item);
    };

    const handleCloseForDelete = () => {
        setOpenForDelete(false);
    };
    useEffect(() => {
        getAdmin();
        getDepartment();
        getProvince();
        getGender();

    }, []);
    return (
        <Container maxWidth="xl" sx={{ p: 5 }}  >
            {/*snackbar update*/}
            <Snackbar
                open={UpdateSuccess}
                autoHideDuration={1500}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    Update complete
                </Alert>
            </Snackbar>
            <Snackbar
                open={UpdateError}
                autoHideDuration={1500}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity="error">
                    Failed to Update {errorMsg}
                </Alert>
            </Snackbar>

            {/*snackbar delete*/}
            <Snackbar
                open={DeleteSuccess}
                autoHideDuration={1500}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success">
                    Delete complete
                </Alert>
            </Snackbar>
            <Snackbar
                open={DeleteError}
                autoHideDuration={1500}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert onClose={handleCloseSnackbar} severity="error">
                    Failed to Delete {errorMsg}
                </Alert>
            </Snackbar>
            <Grid container> {/** Search direction={"column-reverse"} */}
                <Grid container>

                    <Grid item xs={11}>
                        <TextField sx={{ width: "20%" }}
                            id="search-bar"
                            onChange={(event) => (
                                setSearchQuery(event.target.value)
                            )}
                            label="Search by name, department"
                            variant="outlined"
                            placeholder="Searching..."
                            size="medium"

                        />
                    </Grid>
                    <Grid item xs={1} display="flex"
                        justifyContent="flex-end"
                        alignItems="flex-end">
                        <Fab color="secondary" aria-label="add" onClick={() => handleClickOpenForCreate()}>
                            <AddIcon />
                        </Fab>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container sx={{ mt: 1 }}>
                <TableContainer component={Paper}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell><h4>Name</h4></TableCell>
                                <TableCell align="center"><h4>Profile</h4></TableCell>
                                <TableCell align="center"><h4>Email</h4></TableCell>
                                <TableCell align="center"><h4>Department</h4></TableCell>
                                <TableCell align="center"><h4></h4></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* //.filter(item => item.Seller_ID == Number(localStorage.getItem("uid")) */}
                            {admin.filter(item => item.Name.toLowerCase().includes(searchQuery.toLowerCase()) || item.Department.Department_Title.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                                <TableRow key={item.ID} >
                                    <TableCell align="center">{item.Name}</TableCell>
                                    <TableCell align="center"><img src={`${item.Profile_Picture}`} width="100" height="100" /> {/** src={`${games.Picture}`} เอาไว้ตอนนัททำใส่รูปให้แล้ว*/}</TableCell>
                                    <TableCell align="center">{item.Email}</TableCell>
                                    <TableCell align="center">{item.Department?.Department_Title}</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="column" spacing={2}>
                                            {/* <Button variant="outlined" color="primary" component={RouterLink} to={"/admin_profile/" + String(item.Email)}>
                                            Profile
                                        </Button> */}
                                            <Button variant="outlined" color="inherit" onClick={() => handleClickOpenForEdit(item)} >
                                                Edit
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => deleteAdmin(Number(item.ID))}>
                                                Delete
                                            </Button>


                                        </Stack>
                                    </TableCell>
                                    <Dialog maxWidth="xl" open={openForEdit} onClose={handleCloseForEdit} >
                                        <DialogTitle>{adminEdit?.Name}</DialogTitle>
                                        <DialogContent>
                                            <Grid container spacing={3} sx={{ padding: 2 }} columns={{ xs: 16 }}>
                                                <Grid item xs={3}>
                                                    <h2 style={{
                                                        color: "black"

                                                    }}>Name</h2>

                                                    <FormControl fullWidth variant="outlined"  >
                                                        <TextField
                                                            id="Name"
                                                            variant="outlined"
                                                            type="string"
                                                            size="medium"
                                                            placeholder="------------------------------------"
                                                            defaultValue={adminEdit?.Name}
                                                            // value={game.Game_Name || ""}
                                                            onChange={handleInputChange}
                                                        />
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={3} >
                                                    <h2>Email</h2>
                                                    <FormControl fullWidth variant="outlined" >
                                                        <TextField
                                                            id="Email"
                                                            variant="outlined"

                                                            size="medium"
                                                            placeholder="------------------------------------"
                                                            // value={game.Game_Price || ""}
                                                            // onWheel={event => { event.preventDefault();  }}
                                                            defaultValue={adminEdit?.Email}
                                                            onChange={handleInputChange}



                                                        />
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={3} >
                                                    <h2>Password</h2>
                                                    <FormControl fullWidth variant="outlined" >
                                                        <TextField
                                                            id="Password"
                                                            variant="outlined"
                                                            type="string"
                                                            size="medium"
                                                            placeholder="------------------------------------"
                                                            defaultValue={adminEdit?.Password}
                                                            onChange={handleInputChange}

                                                        />
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={7} >
                                                </Grid >
                                            </Grid>
                                            <Grid container spacing={3} sx={{ padding: 2 }} columns={{ xs: 16 }}>

                                                <Grid item xs={4} >

                                                    <Autocomplete sx={{ mt: 5 }}
                                                        id="Departments-autocomplete"
                                                        options={department} //ตัวที่เราจะเลือกมีอะไรบ้าง
                                                        fullWidth
                                                        size="medium"
                                                        defaultValue={adminEdit?.Department} // ใช้ไม่ได้จะมีปัญหาเวลา ID = 3 แต่มีเกมในคลังแค่เกมเดียวงี้ //ค่า default ที่ดึงมาแสดง
                                                        onChange={(event: any, value) => {
                                                            setAdminEdit({ ...adminEdit, Department_ID: value?.ID }); // บันทึกค่าลง interface
                                                        }}
                                                        getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                                                            `${option.Department_Title}`
                                                        } //filter value // เว้นวรรคระว่าง } กับ $ มีผลกับการแสดงผล
                                                        renderInput={(params) => <TextField {...params} label="Department" />}
                                                        renderOption={(props: any, option: any) => {
                                                            return (
                                                                <li
                                                                    {...props}
                                                                    value={`${option.ID}`}
                                                                    key={`${option.ID}`}
                                                                >{`${option.Department_Title}`}</li>
                                                            ); //การแสดงผล อันนี้เราเลือกแสดงผลเฉพาะ personal id แต่คืนค่าค่าเป็น id 
                                                        }}
                                                    />
                                                    <Autocomplete sx={{ mt: 5 }}
                                                        id="Province-autocomplete"
                                                        options={province} //ตัวที่เราจะเลือกมีอะไรบ้าง
                                                        fullWidth
                                                        size="medium"
                                                        defaultValue={adminEdit?.Province} // ใช้ไม่ได้จะมีปัญหาเวลา ID = 3 แต่มีเกมในคลังแค่เกมเดียวงี้ //ค่า default ที่ดึงมาแสดง
                                                        onChange={(event: any, value) => {
                                                            setAdminEdit({ ...adminEdit, Province_ID: value?.ID }); // บันทึกค่าลง interface
                                                        }}
                                                        getOptionLabel={(option: any) => // option ในการ search สามารถ search ด้วยตามรายการที่เราใส่
                                                            `${option.Province_Title}`
                                                        } //filter value // เว้นวรรคระว่าง } กับ $ มีผลกับการแสดงผล
                                                        renderInput={(params) => <TextField {...params} label="Province" />}
                                                        renderOption={(props: any, option: any) => {
                                                            return (
                                                                <li
                                                                    {...props}
                                                                    value={`${option.ID}`}
                                                                    key={`${option.ID}`}
                                                                >{`${option.Province_Title}`}</li>
                                                            ); //การแสดงผล อันนี้เราเลือกแสดงผลเฉพาะ personal id แต่คืนค่าค่าเป็น id 
                                                        }}
                                                    />


                                                    <FormControl>
                                                        <FormLabel sx={{ mt: 5 }} id="radio-buttons-group-gender">Gender</FormLabel >
                                                        <RadioGroup
                                                            aria-labelledby="radio-buttons-group-gender"
                                                            name="radio-buttons-group-gender"
                                                            defaultValue={adminEdit?.Gender_ID}
                                                            onChange={(event) => setAdminEdit({ ...adminEdit, Gender_ID: Number(event.target.value) })}
                                                        >
                                                            {gender.map((o) => (
                                                                <FormControlLabel
                                                                    value={o.ID} // <---- pass a primitive id value, don't pass the whole object here
                                                                    control={<Radio size="small" />}
                                                                    label={o.Gender}
                                                                />
                                                            ))}
                                                        </RadioGroup>
                                                    </FormControl>

                                                </Grid>

                                                <Grid item xs={4}  >

                                                    <h2>Address</h2>
                                                    <FormControl fullWidth variant="outlined">

                                                        <TextField
                                                            id="Address"
                                                            variant="outlined"
                                                            type="string"
                                                            size="medium"
                                                            placeholder="------"
                                                            multiline={true}
                                                            rows={16}
                                                            defaultValue={adminEdit.Address}
                                                            // value={game.Game_description || ""}
                                                            onChange={handleInputChange}
                                                        />
                                                    </FormControl>

                                                </Grid>
                                                <Grid item xs={4}  >


                                                    <Grid item xs={8}>
                                                        <h2>Admin Profiles</h2>
                                                        <Grid>
                                                            <img src={`${imageString}`} width="250" height="250" /> {/** show base64 picture from string variable (that contain base64 picture data) */}
                                                        </Grid>
                                                        <input type="file" onChange={handleImageChange} />
                                                        {/* <FormHelperText>recommend size is 250*250 pixels</FormHelperText> */}
                                                    </Grid>
                                                </Grid>


                                            </Grid>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleCloseForEdit}>Cancel</Button>
                                            <Button onClick={() => UpdateAdmin(item.ID)}>Update</Button>
                                            {/* <Button>onClick ={UpdateAdmin}</Button> */}
                                        </DialogActions>
                                    </Dialog>
                                    <Dialog fullWidth maxWidth="xl" open={openForDelete} onClose={handleCloseForDelete} >
                                        <DialogTitle>DELETE</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                {/* Are you SURE to DELETE Friend "{item.User_Friend.Profile_Name}" ? */}
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleCloseForDelete}>Cancel</Button>
                                            {/* <Button color="error" onClick={() => deleteUserFriend(deleteFriend?.ID||0)}>Delete</Button> */}
                                        </DialogActions>
                                    </Dialog>
                                   
                                </TableRow>
                            ))}

                        </TableBody>

                    </Table>
                </TableContainer>
            </Grid>
            <Dialog fullWidth maxWidth="md" open={openForCreate} onClose={handleCloseForCreate}>
                                        <DialogTitle sx={{
                                            bgcolor: "#E3E3E3"

                                        }}>Create Admin</DialogTitle>
                                        <DialogContent sx={{
                                            bgcolor: "#E3E3E3"

                                        }}>
                                            <Admin/>
                                        </DialogContent>
                                    </Dialog>
        </Container>
    );

}

export default Admin_list;
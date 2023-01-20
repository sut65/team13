import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions } from "@material-ui/core";
import { FormControl,FormLabel,RadioGroup,Radio,FormControlLabel,FormHelperText } from "@mui/material";

import { SigninUserInterface } from "../models/ISignIn_User";
import { GendersInterface } from "../models/user/IGender";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const theme = createTheme();

function SignIn_User() {
  // Register
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState(false);
  
  const [email, setEmail] = React.useState<string | null>(null);
  const [profile_name, setProfile_name] = React.useState<string | null>(null);
  const [gender_id, setGender_id] = React.useState<Number | null>(null);
  const [profile_description, setProfile_description] = React.useState<string | null>(null);
  const [new_password, setNew_password] = React.useState<string | null>(null);
  const [confirm_password, setConfirm_password] = React.useState<string | null>(null);
  const [imageString, setImageString] = React.useState<string | ArrayBuffer | null>(null);
  const [genders, setGenders] = React.useState<GendersInterface[]>([]);
  // Sign in
  const [signin, setSignin] = useState<Partial<SigninUserInterface>>({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  async function Login(data: SigninUserInterface) {
    const apiUrl = "http://localhost:8080";
    console.log(data)

//============================================== Start step 2 โหลดข้อมูลสมาชิก(Email) ==============================================
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/login`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("uid", res.data.id);
          localStorage.setItem("email", res.data.email);
          return res.data;
        } else {
          return false;
        }
      });
      
    return res;
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

//============================================== END step 2 โหลดข้อมูลสมาชิก(Email) ==============================================

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof signin;
    const { value } = event.target;
    setSignin({ ...signin, [id]: value });
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
    setRegisterSuccess(false);
    setRegisterError(false);
  };

  const handleDialogClickOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
      setDialogOpen(false);
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

  const submit = async () => {
    let res = await Login(signin);
    if (res) {
      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setError(true);
    }
  };

  const createAccount = () => {
    const signout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    if(new_password == confirm_password){ // password ตรงกันก็จะ มีการ submit
      let data = {
          Email: email,
          Password: new_password, // ตัวแปรชื่อ new_passwotf ก็จริงแต่อาจเป็น password เดิมก็ได้
          Profile_Name: profile_name,
          Profile_Description: profile_description,
          Profile_Picture: imageString,
          Gender_ID: gender_id,
      };

      console.log(data)

      const apiUrl = "http://localhost:8080/users"; // create user
      const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json",},
      };

      fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
          if (res.data) {
            setRegisterSuccess(true);
            signout();
          } else {
            setRegisterError(true);
          }
      });
    }else{
      setRegisterError(true);
    }
  }

  React.useEffect(() => {
    const fetchData = async () => {
        await getGender();
    }
    fetchData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {/** Sign In */}
      <Grid container component="main" sx={{ height: "100vh" }}>
        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity="success">
            เข้าสู่ระบบสำเร็จ
          </Alert>
        </Snackbar>
        <Snackbar
          open={error}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity="error">
            อีเมลหรือรหัสผ่านไม่ถูกต้อง
          </Alert>
        </Snackbar>
        
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(http://www.sut.ac.th/2012/images/upload/news/1410/1410/news.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="Email"
                label="Email"
                name="Email"
                autoComplete="Email"
                autoFocus
                value={signin.Email || ""}
                onChange={handleInputChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="Password"
                autoComplete="current-password"
                value={signin.Password || ""}
                onChange={handleInputChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={submit}
              >
                Sign In
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 1, mb: 2 }}
                onClick={handleDialogClickOpen}
              >
                Register
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/** register dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
            {"REGISTER"}
        </DialogTitle>

        <Snackbar
          open={registerSuccess}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity="success">
            สมัครสมาชิกสำเร็จ
          </Alert>
        </Snackbar>
        <Snackbar
          open={registerError}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity="error">
            สมัครสมาชิกไม่สำเร็จ
          </Alert>
        </Snackbar>

        <DialogContent>
          <Box>
            <Paper elevation={2} sx={{padding:2,margin:2}}>
                <Grid container>
                    <Grid container justifyContent="center"> {/** Profile */}
                        <h1> Profile </h1>
                    </Grid>

                    <Grid container> {/** password */}
                        <Grid item xs={3}>
                          <TextField
                                  fullWidth
                                  id="nemail"
                                  label="Email"
                                  variant="outlined"
                                  onChange={(event) => setEmail(String(event.target.value))}/>
                          </Grid>
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
                            {/** เอาไว้เตือนว่า password match หรือไม่ */}
                            {/*<FormHelperText>if you don't want to change password, Please do not touch password field</FormHelperText>*/}
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
                                onChange={(event) => setProfile_name(event.target.value)}/>
                            <Grid marginTop={1}> {/* gender radio button */}
                                <FormControl>
                                    <FormLabel id="radio-buttons-group-gender">Gender</FormLabel>
                                        <RadioGroup
                                            aria-labelledby="radio-buttons-group-gender"
                                            name="radio-buttons-group-gender"
                                            onChange={(event) => setGender_id(Number(event.target.value))}
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
                        </Grid>

                        <Grid margin={1} item xs={4}> {/** Profile Description */}
                            <TextField
                                multiline
                                rows={8}
                                fullWidth
                                id="profile-description"
                                label="Profile Description"
                                variant="outlined"
                                onChange={(event) => setProfile_description(event.target.value)}/>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={createAccount} color="error" autoFocus>Submit</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default SignIn_User;

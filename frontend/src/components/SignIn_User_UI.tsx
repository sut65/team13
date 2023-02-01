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
import { FormControl,FormLabel,RadioGroup,Radio,FormControlLabel,FormHelperText, getOffsetLeft } from "@mui/material";

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
  const [dialogRegisterOpen, setDialogRegisterOpen] = React.useState(false);
  const [dialogAdminOpen, setDialogAdminOpen] = React.useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState(false);
  const [errorMsg,setErrorMsg] = useState<String | null>(null);
  
  const [email, setEmail] = React.useState<string | null>(null);
  const [profile_name, setProfile_name] = React.useState<string | null>(null);
  const [gender_id, setGender_id] = React.useState<Number | null>(null);
  const [profile_description, setProfile_description] = React.useState<string | null>(null);
  const [new_password, setNew_password] = React.useState<string | null>(null);
  const [confirm_password, setConfirm_password] = React.useState<string | null>(null);
  const [imageString, setImageString] = React.useState<string | ArrayBuffer | null>("data:image/png;base64,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");
  const [genders, setGenders] = React.useState<GendersInterface[]>([]);
  // Sign in
  const [signin, setSignin] = useState<Partial<SigninUserInterface>>({});
  const [signinAdmin, setSigninAdmin] = useState<Partial<SigninUserInterface>>({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  async function LoginUser(data: SigninUserInterface) {
    const apiUrl = "http://localhost:8080";

//============================================== Start step 2 โหลดข้อมูลสมาชิก(Email) ==============================================
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/login/user`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("uid", res.data.id);
          localStorage.setItem("email", res.data.email);
          localStorage.setItem("position", res.data.position);
          return res.data;
        } else {
          console.log(res.error);
          return false;
        }
      });
      
    return res;
  }

  async function LoginAdmin(data: SigninUserInterface) {
    const apiUrl = "http://localhost:8080";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  
    let res = await fetch(`${apiUrl}/login/admin`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("aid", res.data.id);
          localStorage.setItem("name", res.data.name);
          localStorage.setItem("email", res.data.email);
          localStorage.setItem("position", res.data.position);
          return res.data;
        } else {
          console.log(res.error);
          return false;
        }
      });
      
    return res;
  }

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

//============================================== END step 2 โหลดข้อมูลสมาชิก(Email) ==============================================

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof signin;
    const { value } = event.target;
    setSignin({ ...signin, [id]: value });
  };

  const handleInputChangeAdmin = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof signin;
    const { value } = event.target;
    setSigninAdmin({ ...signinAdmin, [id]: value });
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

  const handleDialogRegisterClickOpen = () => {
    setDialogRegisterOpen(true);
  };

  const handleDialogRegisterClose = () => {
      setDialogRegisterOpen(false);
  };

  const handleDialogAdminClickOpen = () => {
    setDialogAdminOpen(true);
  };

  const handleDialogAdminClose = () => {
      setDialogAdminOpen(false);
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

  const submitUser = async () => {
    let res = await LoginUser(signin);
    if (res) {
      setSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setError(true);
    }
  };

  const submitAdmin = async () => {
    let res = await LoginAdmin(signinAdmin);
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
      };

      fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
          if (res.data) {
            setRegisterSuccess(true);
            setDialogRegisterOpen(false);
            signout();
          } else {
            setRegisterError(true);
            setErrorMsg(String(res.error))
          }
      });
    }else{
      setRegisterError(true);
      setErrorMsg("รหัสผ่านไม่ตรงกัน");
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
        {/** Sign In Alert*/}
        <Snackbar
          id="success"
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
          id="error"
          open={error}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity="error">
            อีเมลหรือรหัสผ่านไม่ถูกต้อง
          </Alert>
        </Snackbar>

        {/** Register Alert */}
        <Snackbar
          id="success"
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
          id="error"
          open={registerError}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity="error">
            {errorMsg}
          </Alert>
        </Snackbar>
        
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://cdn.cloudflare.steamstatic.com/store/home/store_home_share.jpg)",
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
                onClick={submitUser}
              >
                Sign In
              </Button>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 1, mb: 2 }}
                onClick={handleDialogRegisterClickOpen}
              >
                Register
              </Button>
            </Box>  
          </Box>
          <Box sx={{ mt: 1}}
            m={1}
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <Button
              size="small"
              sx={{ mt: 50 }}
              onClick={handleDialogAdminClickOpen}
            >
              Admin
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/** register dialog */}
      <Dialog
        open={dialogRegisterOpen}
        onClose={handleDialogRegisterClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
            {"REGISTER"}
        </DialogTitle>

        <DialogContent>
          <Box>
            <Paper elevation={2} sx={{padding:2,margin:2}}>
              <Grid container>
                <Grid container> {/** email & password */}
                  <Grid margin={1} item xs={12}>
                    <TextField
                            fullWidth
                            id="nemail"
                            label="Email"
                            variant="outlined"
                            onChange={(event) => setEmail(String(event.target.value))}/>
                  </Grid>
                  <Grid margin={1} item xs={12}>
                      <TextField
                          fullWidth
                          type="password"
                          id="new-password"
                          label="New Password"
                          variant="outlined"
                          onChange={(event) => setNew_password(String(event.target.value))}/>
                  </Grid>
                  <Grid margin={1} item xs={12}>
                      <TextField
                          fullWidth
                          type="password"
                          id="confirm-password"
                          label="Confirm Password"
                          variant="outlined"
                          onChange={(event) => setConfirm_password(String(event.target.value))}/>
                  </Grid>
                </Grid>

                <Grid container>
                  <Grid margin={1} item xs={5}> {/** Profile Name */}
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

                <Grid margin={1} item xs={6}> {/** Profile Description */}
                    <TextField
                        multiline
                        rows={8}
                        fullWidth
                        id="profile-description"
                        label="Profile Description"
                        variant="outlined"
                        onChange={(event) => setProfile_description(String(event.target.value))}/>
                </Grid>

                <Grid item xs={12}> {/* Profile Picture */}
                      <h4>Profile Picture</h4>
                      <Grid>
                          <img src={`${imageString}`} width="250" height="250"/> {/** show base64 picture from string variable (that contain base64 picture data) */}
                      </Grid>
                      <input type="file" onChange={handleImageChange} />
                      <FormHelperText>recommend size is 250*250 pixels</FormHelperText>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleDialogRegisterClose}>Cancel</Button>
            <Button onClick={createAccount} color="error" autoFocus>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Login Admin */}
      <Dialog
        open={dialogAdminOpen}
        onClose={handleDialogAdminClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">
            {"ADMIN Sign in"}
        </DialogTitle>

        <DialogContent>
          <Box>
            <Paper elevation={2} sx={{padding:2,margin:2}}>
              <Grid container>
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
                    value={signinAdmin.Email || ""}
                    onChange={handleInputChangeAdmin}
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
                    value={signinAdmin.Password || ""}
                    onChange={handleInputChangeAdmin}
                  />
                </Box>
              </Grid>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleDialogAdminClose} color="error">Cancel</Button>
            <Button onClick={submitAdmin} autoFocus>SIGN IN</Button>
        </DialogActions>
      </Dialog>

    </ThemeProvider>
  );
}

export default SignIn_User;

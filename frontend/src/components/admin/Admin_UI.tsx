
import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Container } from "@material-ui/core";
import { Box, Paper, Grid, TextField, Button, Autocomplete, Alert } from "@mui/material";
import { FormControl, FormLabel, RadioGroup, Radio, FormControlLabel, FormHelperText } from "@mui/material";
import { Dialog, Snackbar, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { GendersInterface } from "../../models/admin/IGender";
import { DepartmentInterface } from "../../models/admin/IDepartment";
import { ProvinceInterface } from "../../models/admin/IProvince";
import { AdminsInterface } from "../../models/admin/IAdmin";
import { CreateAdmin, GetDepartment, GetGender, GetProvince } from "./Admin_Service";
function Admin() {

  const [gender, setGender] = useState<GendersInterface[]>([]);
  const [department, setDepartment] = useState<DepartmentInterface[]>([]);
  const [province, setProvince] = useState<ProvinceInterface[]>([]);
  const [admin, setAdmin] = useState<Partial<AdminsInterface>>({});
  const [imageString, setImageString] = useState<string | ArrayBuffer | null>(null);

  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [isDataLoaded, setIsDataloaded] = React.useState<boolean | null>(false);

  useEffect(() => {
    getGender();
    getDepartment();
    getProvince();
    setIsDataloaded(true);
  }, []);
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

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
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
    const id = event.target.id as keyof typeof Admin;
    const { value } = event.target;
    setAdmin({ ...admin, [id]: value });
  };
  async function submit() {
    let data = {
      Name: admin.Name,
      Email: admin.Email,
      Password: admin.Password,
      Address:  admin.Address,
      Department_ID: admin.Department_ID,
      Province_ID: admin.Province_ID,
      Gender_ID: admin.Gender_ID,
      //adreass
      Profile_Picture: imageString,
    };
    const apiUrl = "http://localhost:8080/admin";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then(async (res) => {
        if (res.data) {
          setSuccess(true);
          //await timeout(500);
          window.location.reload();
        } else {
          setError(true);
          setErrorMsg(" - " + res.error);
        }
      });

  }
  if (isDataLoaded)  return (
    <Container maxWidth="xl"   >
              <Snackbar
          open={success}
          autoHideDuration={1500}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity="success">
            Crate complete
          </Alert>
        </Snackbar>
        <Snackbar
          open={error}
          autoHideDuration={1500}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleClose} severity="error">
            Failed to Crate {errorMsg}
          </Alert>
        </Snackbar>
      <Box >
        <Paper  elevation={10} sx={{
          mt: 4,
          // mb: 5,
          // mr: 10
          // , width: "1500px"
          // , height: "1200px"
          // , opacity: 1

        }}>
          <Grid container spacing={3} sx={{ padding: 2 }} columns={{ xs: 16 }} display="flex">
            <Grid item xs={4} >
              <h2 style={{
                color: "black"

              }}>Name</h2>

              <FormControl fullWidth variant="outlined"  >
                <TextField
                  id="Name"
                  variant="outlined"
                  type="string"
                  size="medium"
                 

                  // value={game.Game_Name || ""}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>

            <Grid item xs={4} >
              <h2>Email</h2>
              <FormControl fullWidth variant="outlined" >
                <TextField
                  id="Email"
                  variant="outlined"

                  size="medium"
                
                  // value={game.Game_Price || ""}
                  // onWheel={event => { event.preventDefault();  }}
                  onChange={handleInputChange}



                />
              </FormControl>
            </Grid>
            <Grid item xs={4} >
              <h2>Password</h2>
              <FormControl fullWidth variant="outlined" >
                <TextField
                  id="Password"
                  variant="outlined"
                  type="string"
                  size="medium"
                
                  // defaultValue={localStorage.getItem("email")}
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
                //defaultValue={admin.Department} // ใช้ไม่ได้จะมีปัญหาเวลา ID = 3 แต่มีเกมในคลังแค่เกมเดียวงี้ //ค่า default ที่ดึงมาแสดง
                onChange={(event: any, value) => {
                  setAdmin({ ...admin, Department_ID: value?.ID }); // บันทึกค่าลง interface
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
                //  defaultValue={admin.Department} // ใช้ไม่ได้จะมีปัญหาเวลา ID = 3 แต่มีเกมในคลังแค่เกมเดียวงี้ //ค่า default ที่ดึงมาแสดง
                onChange={(event: any, value) => {
                  setAdmin({ ...admin, Province_ID: value?.ID }); // บันทึกค่าลง interface
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
                  defaultValue={admin.Gender_ID}
                  onChange={(event) => setAdmin({ ...admin, Gender_ID: Number(event.target.value) })}
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
              <Button
                sx = {{mt : 5 ,ml : 10}}
                style={{ float: "right" }}
                onClick={submit}
                variant="contained"
                color="primary"
              //startIcon={< CloudUploadIcon />}
              >
                Create
              </Button>
            </Grid>
            


          </Grid>


        </Paper>

      </Box>
    </Container>
  );
  return null;
}



export default Admin
import React, { useState, useEffect } from "react";
import { StoragesInterface } from '../../models/storage/IStorage';
import { CollectionsInterface } from '../../models/storage/ICollection';
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Dialog, Paper, TableContainer } from '@mui/material';
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { Autocomplete, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { UsersInterface } from "../../models/user/IUser";

const apiUrl = "http://localhost:8080";

function Collection_UI() {

  const [collections, setCollections] = useState<CollectionsInterface[]>([]);
  const [user, setUser] = useState<UsersInterface>();
  const [CollecAdd, setCollecAdd] = useState<Partial<CollectionsInterface>>({});
  const [collecEdit, setcoleccEdit] = useState<CollectionsInterface[]>([]);
  const [toEditCollec, settoEditCollec] = useState<CollectionsInterface[]>([]);

  const [name, setName] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [date, setDate] = useState<Dayjs | null>(dayjs());

  const [idEdit, setIdEdit] = useState<Number>();
  const [nameEdit, setNameEdit] = useState<string>("");
  const [noteEdit, setNoteEdit] = useState<string>("");

  const [click, setClick] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorForAdd, setErrorForAdd] = useState(false);
  const [openForAdd, setOpenForAdd] = useState(false);
  const [openForEdit, setOpenForEdit] = useState(false);
  const [openForDelete, setOpenForDelete] = useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
    setNameEdit(params.row.Name);
    setNoteEdit(params.row.Note);
    setIdEdit(params.row.ID);
    setClick(false);
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
    setErrorForAdd(false);
  };

  const handleClickOpenForAdd = () => {
    setOpenForAdd(true);
  };

  const handleCloseForAdd = () => {
    setOpenForAdd(false);
  };

  const handleClickOpenForEdit = () => {
    setOpenForEdit(true);
    // setToEditFriend(item);
  };

  const handleCloseForEdit = () => {
    setOpenForEdit(false);
  };

  const handleClickOpenForDelete = () => {
    setOpenForDelete(true);
    // setDeleteFriend(item);
  };

  const handleCloseForDelete = () => {
    setOpenForDelete(false);
  };
  function timeout(delay: number) {
    return new Promise(res => setTimeout(res, delay));
  }

  async function GetCollection() {
    let uid = localStorage.getItem("uid");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    let res = await fetch(`${apiUrl}/collections/${uid}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          return res.data;
        } else {
          return false;
        }
      });

    return res;
  }


  async function AddCollection() {
    let data = {
      User_ID: Number(localStorage.getItem("uid")),
      Name: name,
      Note: note,
      Date: date,
    };
    console.log(data)
    const apiUrl = "http://localhost:8080/collections";           //ส่งขอบันทึก
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
          setOpenForAdd(false);
          setErrorMsg("บันทึกสำเร็จ")
          await timeout(1000); //for 1 sec delay
          window.location.reload();

        } else {
          setError(true);
          setErrorMsg(res.error)
        }
      });

  }

  async function updateCollection() {
    let data = {       //ประกาศก้อนข้อมูล
      ID: idEdit,
      Name: nameEdit,
      Note: noteEdit,
    };
    console.log(data)
    const apiUrl = "http://localhost:8080/collections";
    const requestOptions = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(apiUrl, requestOptions)                                            //ขอการส่งกลับมาเช็คว่าบันทึกสำเร็จมั้ย
      .then((response) => response.json())
      .then(async (res) => {
        if (res.data) {
          setSuccess(true);
          setOpenForEdit(false);
          setErrorMsg("บันทึกสำเร็จ");
          await timeout(1000); //for 1 sec delay
          window.location.reload();
        } else {
          setErrorMsg(res.error);
          setError(true);
          
        }
      });
  }

  async function deleteCollection() {
    let data = {                                                            //ประกาศก้อนข้อมูล
      ID: idEdit,
    };
    console.log(data)
    const apiUrl = "http://localhost:8080/collections/:id";                      //ส่งขอการลบ  
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(apiUrl, requestOptions)                                            //ขอการส่งกลับมาเช็คว่าบันทึกสำเร็จมั้ย
      .then((response) => response.json())
      .then(async (res) => {
        if (res.data) {
          setSuccess(true);
          setErrorMsg("ลบ Collection สำเร็จ");
          await timeout(1000); //for 1 sec delay
          window.location.reload();
        } else {
          setError(true);
        }
      });
  }


  useEffect(() => {
    getCollection();
  }, []);

  const getCollection = async () => {
    let res = await GetCollection();
    if (res) {
      setCollections(res);
    }
  };

  const columns: GridColDef[] = [
    { field: "ID", headerName: "ลำดับ", width: 50 },
    {
      field: "Name",
      headerName: "Game",
      width: 250,
      valueFormatter: (params) => params.value.Name,
    },
    // {
    //   field: "User",
    //   headerName: "User",
    //   width: 150,
    //   valueFormatter: (params) => params.value.Profile_Name,
    // },
    {
      field: "Note",
      headerName: "Note",
      width: 150,
      valueFormatter: (params) => params.value.Note,
    },
    {
      field: "Date",
      headerName: "Date",
      width: 150,
      valueFormatter: (params) => params.value.Date,
    },
  ];

  return (

    <Container maxWidth="lg">
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success">
          {errorMsg}
        </Alert>
      </Snackbar>
      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="error">
          {errorMsg}
        </Alert>
      </Snackbar>
      <Box
        display="flex"
        sx={{
          marginTop: 2,
        }}
      >
        <Box flexGrow={1}>
          <Typography
            component="h1"
            variant="h6"
            color="primary"
            gutterBottom
          >
            Collection
          </Typography>
        </Box>
        <Box>
          <Button variant="contained" color="primary" onClick={() => handleClickOpenForAdd()}>
            Add
          </Button>
        </Box>
        <Box sx={{ marginLeft: 2 }}>
          <Button variant="contained" color="primary" disabled={click} onClick={() => handleClickOpenForEdit()}>
            Edit
          </Button>
        </Box>
        <Box sx={{ marginLeft: 2 }}>
          <Button variant="contained" color="error" disabled={click} onClick={() => handleClickOpenForDelete()}>
            Delete
          </Button>
        </Box>

      </Box>

      <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
        <DataGrid
          rows={collections}
          getRowId={(row) => row.ID}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          onRowClick={handleRowClick}
        />
        {nameEdit && <Alert severity="info">{nameEdit}</Alert>}
      </div>

      <Dialog open={openForAdd} onClose={handleCloseForAdd} >
        <DialogTitle>Collection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add Collection
          </DialogContentText>


          <Grid marginTop={2}>
            <Grid>
              Name
            </Grid>
            <Grid>
              <TextField
                id="outlined-basic"
                placeholder="Insert Name"
                variant="outlined"
                size="small"
                multiline={true}
                minRows={9}
                maxRows={2}
                fullWidth={true}
                onChange={(event) => setName(event.target.value)}
              />
            </Grid>
          </Grid>
          <Grid marginTop={2}>
            <Grid>
              Note
            </Grid>
            <Grid>
              <TextField
                id="outlined-basic"
                placeholder="Insert Note"
                variant="outlined"
                size="medium"
                multiline={true}
                minRows={9}
                maxRows={2}
                fullWidth={true}

                onChange={(event) => setNote(event.target.value)}
              />
            </Grid>
          </Grid>

          <Grid marginTop={2}>
            <Grid>
              Date
            </Grid>
            <Grid>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="disabled"
                  disabled
                  value={date}
                  onChange={(newValue) => {
                    setDate(newValue);
                  }}
                  renderInput={(params) => <TextField sx={{ marginY: 2 }} {...params} />}
                />
              </LocalizationProvider>
            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleCloseForAdd}>Cancel</Button>
          <Button color="success" onClick={() => AddCollection()}>Add</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={openForEdit} onClose={handleCloseForEdit} >
        <DialogTitle>Collection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit Collection
          </DialogContentText>
          <Grid marginTop={2}>
            <Grid>
              Select collection for edit
            </Grid>
            <Grid>

            </Grid>
          </Grid>

          <Grid marginTop={2}>
            <Grid>
              Name
            </Grid>
            <Grid>
              <TextField
                id="outlined-basic"
                placeholder="Insert Name"
                variant="outlined"
                size="small"
                multiline={true}
                minRows={9}
                maxRows={2}
                fullWidth={true}
                defaultValue={nameEdit}
                onChange={(event) => setNameEdit(event.target.value)}
              />
            </Grid>
          </Grid>
          <Grid marginTop={2}>
            <Grid>
              Note
            </Grid>
            <Grid>
              <TextField
                id="outlined-basic"
                placeholder="Insert Note"
                variant="outlined"
                size="medium"
                multiline={true}
                minRows={9}
                maxRows={2}
                fullWidth={true}
                defaultValue={noteEdit}
                onChange={(event) => setNoteEdit(event.target.value)}
              />
            </Grid>
          </Grid>

        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleCloseForEdit}>Cancel</Button>
          <Button color="success" onClick={() => updateCollection()}>Edit</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openForDelete} onClose={handleCloseForDelete} >
        <DialogTitle>ลบ Collection ของคุณ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Collection จะถูกลบออกรายการของคุณ
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={handleCloseForDelete}>Cancel</Button>
          <Button color="error" onClick={() => deleteCollection()}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>




  );

}
export default Collection_UI
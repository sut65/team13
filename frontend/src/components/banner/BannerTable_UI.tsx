import * as React from 'react';
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Grid } from "@mui/material";
import Moment from 'moment';

import { BannersInterface } from '../../models/banner/IBanner';

function BannerTable_UI() {
  const [banners, setBanners] = React.useState<BannersInterface[]>([]);

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
            }
        });
  };

  useEffect(() => {
    getBanner();
  }, []);

  const banner_columns: GridColDef[] = [
    { field: "ID", headerName: "ID", width: 50 },
    {
      field: "Game",
      headerName: "Game",
      width: 200,
      valueGetter:(params) => params.value.Game_Name,
    },
    {
      field: "User",
      headerName: "Owner",
      width: 200,
      valueGetter: (params) => params.value.Profile_Name,
    },
    {
      field: "Admin",
      headerName: "Editor",
      width: 200,
      valueGetter: (params) => params.value.Name,
    },
    {
      field: "Description",
      headerName: "Description",
      width: 200,
      valueGetter: (params) => params.value,
    },
    {
      field: "Edit_at",
      headerName: "Edit_at",
      width: 200,
      valueGetter: (params) => Moment(params.value).format('DD MMMM YYYY HH:mm:ss'),
    },
  ];

  return (
    <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={banners}
          getRowId={(row) => row.ID}
          columns={banner_columns}
          pageSize={10}
          rowsPerPageOptions={[10]}/>
    </Box>
  );
}
export default BannerTable_UI;
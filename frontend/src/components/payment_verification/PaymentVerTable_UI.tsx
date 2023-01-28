import * as React from 'react';
import { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Grid } from "@mui/material";

import { PaymentVerificationInterface } from '../../models/payment_verification/IPaymentVerification';

function PaymentVerTable_UI() {
    const [payment_ver, setPaymentVer] = React.useState<PaymentVerificationInterface[]>([]);

    const getPaymentVer = async () => {
        const apiUrl = "http://localhost:8080/payment_ver";
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
                    setPaymentVer(res.data);
                }
            });
      };

      useEffect(() => {
        getPaymentVer();
      }, []);

      const paymentver_columns: GridColDef[] = [
        { field: "ID", headerName: "ID", width: 50 },
        {
            field: "Order",
            headerName: "Order",
            width: 200,
            valueGetter:(params) => params.value.ID,
        },
        {
            field: "Verification_Status",
            headerName: "Status",
            width: 200,
            valueGetter:(params) => params.value.Status_type,
        },
        {
            field: "Note",
            headerName: "Note",
            width: 400,
            valueGetter:(params) => params.value,
        },
        {
            field: "Admin",
            headerName: "Admin",
            width: 200,
            valueGetter: (params) => params.value.Name,
          },
        {
            field: "Date",
            headerName: "Date",
            width: 300,
            valueGetter:(params) => params.value,
        },
      ];

      return (
        <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={payment_ver}
              getRowId={(row) => row.ID}
              columns={paymentver_columns}
              pageSize={10}
              rowsPerPageOptions={[10]}/>
        </Box>
      );
    
}
export default PaymentVerTable_UI;
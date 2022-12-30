import { Box } from "@mui/material";
import * as React from "react";

function User(){

    // const getUser = async () => {
    //     const apiUrl = "http://localhost:8080/patients";
    //     const requestOptions = {
    //         method: "GET",
    //         headers: {
    //             Authorization: `Bearer ${localStorage.getItem("token")}`,
    //             "Content-Type": "application/json",
    //         },
    //     };
       
    //     fetch(apiUrl, requestOptions)
    //         .then((response) => response.json())
    //         .then((res) => {
    //             if (res.data) {
    //                 setPatients(res.data);
    //             }
    //         });
    // };

    React.useEffect(() => {

    }, []);

    return(
        <Box>
            
        </Box>
    )
}

export default User
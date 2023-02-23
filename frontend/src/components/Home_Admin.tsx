import { Box, Grid, Paper, Stack } from '@mui/material';
import * as React from 'react';

function Home_Admin() {

    return (
        <Box>
            <Paper elevation={2} sx={{ marginTop: 2 , paddingY: 1 ,marginX: 45}}>
                <Grid container padding={2} justifyContent={"center"}>
                    <Grid alignSelf={"center"}>
                        <h2> ระบบหลัก : ระบบร้านค้าขายเกม </h2>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={2} sx={{ marginTop: 2 , paddingY: 1 ,marginX: 45}}>
                <Grid container padding={2} justifyContent={"center"}>
                    <Stack>
                        <Grid alignSelf={"center"}>
                            <h2> ระบบย่อย : ระบบตรวจสอบการชำระเงิน </h2>
                        </Grid>
                        <Grid marginBottom={2}>
                            ระบบตรวจสอบการชำระเงินเป็นระบบที่ให้ผู้ใช้ระบบที่เป็นผู้ดูแลระบบ สามารถตรวจสอบการสั่งซื้อ
                            เกม แก้ไขข้อมูลการสั่งซื้อ เมื่อตรวจสอบการสั่งซื้อแล้ว ระบบจะบันทึกการตรวจสอบการสั่งซื้อลงในฐานข้อมูล
                            ของระบบ
                        </Grid>
                    </Stack>
                </Grid>
            </Paper>

            <Paper elevation={2} sx={{ marginTop: 2 , paddingY: 1 ,marginX: 45}}>
                <Grid container padding={2} justifyContent={"center"}>
                    <Stack>
                        <Grid alignSelf={"center"}>
                            <h2> ระบบย่อย : ระบบจัดการแบนเบอร์โฆษณา </h2>
                        </Grid>
                        <Grid marginBottom={2}>
                            ระบบจัดการแบนเนอร์โฆษณาเป็นระบบที่ให้ผู้ใช้ระบบซึ่งเป็นแอดมินสามารถจัดการแบนเนอร์
                            โฆษณาที่จะไปแสดงผลที่หน้า Dashboard ได้ โดยจะมีการเก็บว่าแบนเนอร์นี้เป็นของเกมไหนจากรายการเกม
                            ที่ลงขาย และยังสามารถระบุได้อีกว่าใครเป็นเจ้าของแบนเนอร์นี้ผ่านการเชื่อมโยงฐานข้อมูลกับสมาชิกร้านค้า
                            ขายเกม
                        </Grid>
                    </Stack>
                </Grid>
            </Paper>

            <Paper elevation={2} sx={{ marginTop: 2 , paddingY: 1 ,marginX: 45}}>
                <Grid container padding={2} justifyContent={"center"}>
                    <Stack>
                        <Grid alignSelf={"center"}>
                            <h2>  ระบบย่อย : ระบบจัดการข้อมูล admin </h2>
                        </Grid>
                        <Grid marginBottom={2}>
                            ฉันต้องการให้มี ระบบจัดการข้อมูลของ admin เพื่อให้ admin สามารถ ตรวจสอบการชำระเงิน
                            ของผู้ซื้อได้ จัดการแบรนเนอร์ หรือ จัดอันดับเกมได้ และ สามารถเพิ่มข้อมูล หรือ อัพเดทข้อมูล email , 
                            password ได้ และหากที่จะต้องการปลด adminสามารถ ที่จะลบข้อมูล ออกจากระบบไปได
                        </Grid>
                    </Stack>
                </Grid>
            </Paper>

            <Paper elevation={2} sx={{ marginTop: 2 , paddingY: 1 ,marginX: 45}}>
                <Grid container padding={2} justifyContent={"center"}>
                    <Stack>
                        <Grid alignSelf={"center"}>
                            <h2>  ระบบย่อย : ระบบจัดอันดับเกม </h2>
                        </Grid>
                        <Grid marginBottom={2}>
                            ระบบจัดอันดับเกม เป็นระบบที่ให้แอดมินสามารถจัดอันดับให้เกมแต่ละเกมได้ หรือแก้ไขอันดับ
                            เพื่อให้ง่ายต่อผู้ซื้อ สามารถดูว่าเกมไหนติดอันดับยอดขาย
                        </Grid>
                    </Stack>
                </Grid>
            </Paper>
        </Box>
    );
}

export default Home_Admin;
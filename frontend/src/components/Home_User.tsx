import { Box, Grid, Paper, Stack } from '@mui/material';
import * as React from 'react';

function Home_User() {

    return (
        <Box>
            <Paper elevation={2} sx={{ marginTop: 2 , paddingY: 1 ,marginX: 45}}>
                <Grid container padding={2} justifyContent={"center"}>
                    <Grid alignSelf={"center"}>
                        <h2> ระบบหลัก : ระบบร้านค้าขายเกม </h2>
                    </Grid>
                    <Grid marginBottom={2}>

                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={2} sx={{ marginTop: 2 , paddingY: 1 ,marginX: 45}}>
                <Grid container padding={2}>
                    <Stack>
                        <Grid alignSelf={"center"}>
                            <h2> ระบบย่อย : ระบบตะกร้าสินค้า </h2>
                        </Grid>
                        <Grid marginBottom={2}>
                            โดยระบบตะกร้าสินค้าจะเป็นระบบที่ให้ผู้ใช้ระบบที่เป็นสมาชิกร้านค้าขายเกม จัดการเกมที่เข้ามาใน
                            ตะกร้าเพื่อที่จะรวบรวมไว้ชำระในครั้งเดียว โดยมีการเพิ่มหรือลดเกม และมีการอัปเดตสถานะการชำระเงินว่า
                            มีการชำระเงินไปแล้วโดยมีการดึงข้อมูลเกี่ยวกับเกม เพื่อที่จะระบุตัวตนเกมและราคา
                        </Grid>
                    </Stack>
                </Grid>
            </Paper>

            <Paper elevation={2} sx={{ marginTop: 2 , paddingY: 1 ,marginX: 45}}>
                <Grid container padding={2}>
                    <Stack>
                        <Grid alignSelf={"center"}>
                            <h2> ระบบย่อย : ระบบเพื่อน </h2>
                        </Grid>
                        <Grid marginBottom={2}>
                            โดยระบบเพื่อนจะเป็นระบบที่ให้ผู้ใช้ระบบที่เป็นสมาชิกร้านค้าขายเกมจัดการรายละเอียดเกี่ยวกับ
                            เพื่อน โดยมีการบันทึกรายชื่อเพื่อนที่เป็นผู้ใช้ระบบที่เป็นสมาชิกร้านค้าขายเกมอีกคน การปรับเปลี่ยน
                            รายละเอียดเกี่ยวกับเพื่อนเช่นระดับความสนิท เกมที่เพื่อนเล่น และการสามารถลบเพื่อนได้ โดยมีการดึงข้อมูล
                            เกี่ยวกับสมาชิกร้านค้าขายเกม เพื่อที่จะระบุตัวตนสมาชิกร้านค้าขายเกม
                        </Grid>
                    </Stack>
                </Grid>
            </Paper>

            <Paper elevation={2} sx={{ marginTop: 2 , paddingY: 1 ,marginX: 45}}>
                <Grid container padding={2}>
                    <Stack>
                        <Grid alignSelf={"center"}>
                            <h2> ระบบย่อย : ระบบสั่งซื้อเกม </h2>
                        </Grid>
                        <Grid marginBottom={2}>
                            ระบบสั่งซื้อเกมเป็นระบบที่ให้ผู้ใช้ระบบที่เป็นสมาชิกร้านค้าขายเกม สามารถเลือกได้ว่าจะสั่งซื้อเกม
                            ให้ตัวเอง หรือสั่งซื้อเป็นของขวัญส่งให้เพื่อนในระบบ โดยผู้ใช้ระบบสามารถอัพโหลดรูปภาพสลิปเพื่อยืนยัน
                            การชำระเงินได้ 
                        </Grid>
                    </Stack>
                </Grid>
            </Paper>

            <Paper elevation={2} sx={{ marginTop: 2 , paddingY: 1 ,marginX: 45}}>
                <Grid container padding={2}>
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
                <Grid container padding={2}>
                    <Stack>
                        <Grid alignSelf={"center"}>
                            <h2> ระบบย่อย : ระบบจัดการข้อมูลสมาชิกร้านค้าขายเกม </h2>
                        </Grid>
                        <Grid marginBottom={2}>
                            ระบบจัดการข้อมูลสมาชิกร้านค้าขายเกมเป็นระบบซึ่งให้ผู้ใช้สามารถ login เข้ามาในฐานะสมาชิก
                            ร้านค้าขายเกม ผู้ใช้จะสามารถจัดการโปรไฟล์ส่วนตัวผู้ซื้อ และสามารถจัดการโปรไฟล์บัญชีผู้ขาย โดยผู้ใช้
                            สามารถเข้าไปแก้ไขข้อมูลในโปรไฟล์ผู้ซื้อและผู้ขายได้ แต่หากเป็นผู้ขายจะต้องลงทะเบียนก่อนจึงจะสามารถ
                            แก้ไขได้
                        </Grid>
                    </Stack>
                </Grid>
            </Paper>

            <Paper elevation={2} sx={{ marginTop: 2 , paddingY: 1 ,marginX: 45}}>
                <Grid container padding={2}>
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
                <Grid container padding={2}>
                    <Stack>
                        <Grid alignSelf={"center"}>
                            <h2> ระบบย่อย : ระบบคลังเกม </h2>
                        </Grid>
                        <Grid marginBottom={2}>
                            ระบบคลังเกมเป็นระบบที่ให้ผู้ใช้ระบบซึ่งเป็นสมาชิกระบบร้านค้าขายเกม(ผู้ซื้อ) สามารถ login เข้า
                            มาเพื่อทำการเช็ครายการเกมที่อยู่ภายในคลังได้ โดยที่เกมจะถูกเพิ่มเข้ามาภายในคลังอัตโนมัติเมื่อผู้ใช้ทำการ
                            ซื้อเกมเรียบร้อยแล้ว ผู้ซื้อสามารถลบเกมที่อยู่ภายในคลังได้ สามารถเพิ่มเกมเข้าไปในรายการโปรดได้ หรือลบ
                            เกมออกจากรายการโปรดได้
                        </Grid>
                    </Stack>
                </Grid>
            </Paper>

            <Paper elevation={2} sx={{ marginTop: 2 , paddingY: 1 ,marginX: 45}}>
                <Grid container padding={2}>
                    <Stack>
                        <Grid alignSelf={"center"}>
                            <h2> ระบบย่อย : ระบบ wishlist </h2>
                        </Grid>
                        <Grid marginBottom={2}>
                            ระบบ wishlist เป็นระบบที่ให้ผู้ใช้ระบบซึ่งเป็นสมาชิกระบบร้านค้าขายเกม(ผู้ซื้อ) สามารถ login 
                            เข้ามาเพื่อทำการเพิ่มเกมที่อยากในรายการ wishlist และผู้ซื้อสามารถลบเกมที่อยู่ในรายการ wishlist ผู้ซื้อ
                            สามารถเพิ่มหรือแก้ไขโน๊ตในรายการ wishlist
                        </Grid>
                    </Stack>
                </Grid>
            </Paper>

            <Paper elevation={2} sx={{ marginTop: 2 , paddingY: 1 ,marginX: 45}}>
                <Grid container padding={2}>
                    <Stack>
                        <Grid alignSelf={"center"}>
                            <h2> ระบบย่อย : ระบบลงขายเกม </h2>
                        </Grid>
                        <Grid marginBottom={2}>
                            ระบบลงขายเกมเป็นระบบที่ให้ ผู้ขายสามารถ สามารถเข้ามาเพื่อ ลงขายเกมต่างๆตามที่ ผู้ขาย
                            ต้องการ และยังสามารถ อัพเดท โดย สามารถอัพเดท สถานะเกม ราคา วันที่ลงขายหรือ
                            ประเภทของเกม ได้ และ ยังสามารถ ลบเกม ออกจากร้านค้าได้หาก ไม่ต้องการที่ จะขายเกมนั้นอีกต่อไป
                        </Grid>
                    </Stack>
                </Grid>
            </Paper>

            <Paper elevation={2} sx={{ marginTop: 2 , paddingY: 1 ,marginX: 45}}>
                <Grid container padding={2}>
                    <Stack>
                        <Grid alignSelf={"center"}>
                            <h2>  ระบบจัดการข้อมูล admin </h2>
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
                <Grid container padding={2}>
                    <Stack>
                        <Grid alignSelf={"center"}>
                            <h2>  ระบบย่อย : ระบบรีวิวเกม </h2>
                        </Grid>
                        <Grid marginBottom={2}>
                            ระบบรีวิวเกม เป็นระบบที่ให้ผู้ใช้ระบบซึ่งให้สมาชิกสามารถรีวิวเกมได้ ให้คะแนนและเขียนวิจารณ์
                            หรือแนะนำคนอื่นได้เพื่อให้เป็นประโยชน์ต่อ
                        </Grid>
                    </Stack>
                </Grid>
            </Paper>

            <Paper elevation={2} sx={{ marginTop: 2 , paddingY: 1 ,marginX: 45}}>
                <Grid container padding={2}>
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

export default Home_User;
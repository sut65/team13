import { DepartmentInterface } from "./IDepartment";
import{ ProvinceInterface } from "./IProvince"
import{GendersInterface } from "../admin/IGender"
export interface AdminsInterface {
    ID:         number,
    Email:      string,
    Name :       string,
	Password:   string,
    Address:    string,
    Gender_ID: number,
	Gender: GendersInterface,
    Department_ID: number,
    Department : DepartmentInterface,
    Province_ID : number,
    Province :  ProvinceInterface,
    Profile_Picture: string,
    
}
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength, IsArray, ArrayNotEmpty } from "class-validator";
import { Role } from "../enum/role.enum";

export class AuthCredentialsDto {

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;
   
    @IsString()
    phone: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    password: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    confirmPassword: string;

    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean; 

    @IsNotEmpty()
    role: Role;

    @IsArray()
    @ArrayNotEmpty()
    idSuccursales: number[];

   
}
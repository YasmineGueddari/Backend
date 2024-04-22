import { IsEmail, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { Role } from "../enum/role.enum";

export class AuthCredentialsDto{

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;
   
    @IsString()
    phone: string;

    @IsString()
    image: string;

    @IsEmail()
    email:string;

   @IsString()
   @MinLength(4)
   @MaxLength(20)
   password: string;

   @IsString()
   @MinLength(4)
   @MaxLength(20)
   confirmPassword: string;

   role: Role;
   

}
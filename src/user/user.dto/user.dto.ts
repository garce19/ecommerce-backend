import { IsDate, IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class UserDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsStrongPassword()
    @IsNotEmpty()
    readonly password: string;

    @IsString()
    @IsNotEmpty()
    readonly phone: string;

    @IsString()
    @IsNotEmpty()
    readonly country: string;

    @IsString()
    @IsNotEmpty()
    readonly city: string;

    @IsString()
    @IsNotEmpty()
    readonly address: string;

    @IsDate()
    @IsNotEmpty()
    readonly birthdate: Date;

    @IsString()
    @IsNotEmpty()
    readonly type: string; 
}

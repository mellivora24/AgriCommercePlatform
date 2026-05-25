import { IsEmail, IsString, MinLength, IsPhoneNumber } from 'class-validator';

export class UserRegisterDto {
  @IsEmail()
  email!: string;

  @IsPhoneNumber('VN')
  phone!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

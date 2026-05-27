import {
  IsEmail,
  IsString,
  MinLength,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';

export class UserRegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  phone?: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

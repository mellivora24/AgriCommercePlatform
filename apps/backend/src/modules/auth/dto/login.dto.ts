import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';

export class UserLoginDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

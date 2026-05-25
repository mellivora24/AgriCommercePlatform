import { IsOptional, IsPhoneNumber, IsEmail } from 'class-validator';

export class UpdateUsersProfileDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}

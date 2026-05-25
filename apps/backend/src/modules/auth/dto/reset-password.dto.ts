import { IsJWT, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsJWT()
  token!: string;

  @MinLength(8)
  newPassword!: string;
}

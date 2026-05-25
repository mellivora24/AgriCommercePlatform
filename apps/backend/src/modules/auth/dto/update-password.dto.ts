import { IsJWT, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsJWT()
  token!: string;

  @MinLength(8)
  newPassword!: string;
}

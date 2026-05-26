import { IsJWT, IsUUID } from 'class-validator';

export class AdminDeleteUserDto {
  @IsJWT()
  token!: string;

  @IsUUID()
  userId!: string;
}

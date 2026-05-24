import { IsUUID } from 'class-validator';

export class UserLogoutDto {
  @IsUUID()
  userId!: string;
}

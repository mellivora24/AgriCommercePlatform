import { IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  role!: 'SUPER_ADMIN' | 'SUPPORT_ADMIN' | 'FINANCE_ADMIN';
}

export class AdminNoteDto {
  @IsString()
  note!: string;
}

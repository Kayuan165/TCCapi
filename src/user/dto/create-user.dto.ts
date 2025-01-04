import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name!: string;
  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 20, {
    message: 'The password must be between 6 and 20 characters.',
  })
  password!: string;
}

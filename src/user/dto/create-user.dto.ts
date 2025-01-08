import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: 'O campo email é obrigatório.' })
  @IsEmail()
  email!: string;

  @IsNotEmpty({ message: 'O campo rg é obrigatório.' })
  @IsEmail()
  rg!: string;

  @IsString()
  @IsNotEmpty({ message: 'O campo photo_path é obrigatório.' })
  photo_path!: string;
}

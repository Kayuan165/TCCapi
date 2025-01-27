import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: 'O campo email é obrigatório.' })
  @IsEmail(
    {},
    { message: 'O campo email deve ser um endereço de email válido!' },
  )
  email!: string;

  @IsNotEmpty({ message: 'O campo rg é obrigatório.' })
  @IsString()
  rg!: string;

  @IsNotEmpty({ message: 'O campo foto é obrigatório.' })
  @IsString()
  photo_path!: string;
}

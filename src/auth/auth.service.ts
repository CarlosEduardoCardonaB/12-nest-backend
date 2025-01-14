import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';

//De esta manera exportamos cada dto (data transfer object) 
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
// import { LoginDto } from './dto/login.dto';
// import { RegisterDto } from './dto/register-user.dto';

//De esta manera exportamos lo mismo que los anteriores, pero implementando el archivo index.ts en la carpeta /dto
import { CreateUserDto, UpdateAuthDto, LoginDto, RegisterUserDto } from './dto'

import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    //console.log(CreateUserDto)
    //return 'This action adds a new auth';   

    try {
      //De la siguiente manera desestructuramos el json "createUserDto" y solo sacamos a parte el campo "password", el resto del objeto json lo colocamos en una variable llamada "userData"
      //Por lo tanto el userData quedaría solo con la información de "email y name"
      const {password, ...userData } = createUserDto;

      const newUser = new this.userModel({
        // 1- encriptar contraseña 
        password: bcryptjs.hashSync( password, 10 ),
        ...userData
      });

      // 2- guardar el usuario
      await newUser.save();

      // esto "password:_," (con el guion bajo) significa que es un nombre privado, o sea que se cambia el nombre para que no se confunda con la variable password declarada anteriormente
      const { password:_, ...user} = newUser.toJSON();

      return user;

      
    } catch (error) {
      console.log(error.code);

      if(error.code === 11000){
        throw new BadRequestException(`${ createUserDto.email } alredy exist `)
      }

      throw new InternalServerErrorException('ops!! something hapend and i don´t kow about it. Sorry')
    }

    // 3- generar el JWT    
  }

  async register(registerUserDto: RegisterUserDto):Promise<LoginResponse>{

    const { password, confirmPassword, email, name} = registerUserDto;
    if( password != confirmPassword ) 
      {
        throw new BadRequestException('Password y confirmación de password no coinciden.');
    }
    
    //Una fomra de enviarlo
    // var newUser = new CreateUserDto;
    // newUser.email = email;
    // newUser.name = name;
    // newUser.password = password
    //const userCreated = this.create(newUser);

    //Otra forma de enviarlo
    const userCreated = await this.create({email: registerUserDto.email, name: registerUserDto.name, password: registerUserDto.password});

   return {
    user: userCreated,
    token: this.getJwtToken({ id: userCreated._id})
   }

  }


  async login( loginDto: LoginDto): Promise<LoginResponse>{

    //console.log({ loginDto });
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if( !user ){
      throw new UnauthorizedException('Not valid credential - e');
    }

    if( !bcryptjs.compareSync( password, user.password ) ){
      throw new UnauthorizedException('Not valid credential - p')
    }

    const { password:_, ...rest } = user.toJSON();  

    return {
      user: rest,
      token: this.getJwtToken( {id: user.id} )
    }



    /**
     * user {_id, name, email, roles}
     * Token -> ASDAASD.ASDASD.ASDASDASD
     */

  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById( id: string ){
    const user = await this.userModel.findById(id);
    const { password, ...rest } = user.toJSON();
    return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }


  getJwtToken( payload: JwtPayload){
      const token = this.jwtService.sign(payload);
      return token;
  }
 


}

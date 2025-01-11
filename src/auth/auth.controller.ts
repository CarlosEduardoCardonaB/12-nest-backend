import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

//De esta manera exportamos cada dto (data transfer object) 
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
// import { LoginDto } from './dto/login.dto';
// import { RegisterDto } from './dto/register-user.dto';

//De esta manera exportamos lo mismo que los anteriores, pero implementando el archivo index.ts en la carpeta /dto
import { CreateUserDto, UpdateAuthDto, LoginDto, RegisterUserDto } from './dto'
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    //console.log(CreateUserDto);
    return this.authService.create(createUserDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    //return('login works');
    return this.authService.login(loginDto);
  }

  @Post('/register')
  register(@Body() registerUserDto: RegisterUserDto) {
    //console.log(CreateUserDto);
    return this.authService.register(registerUserDto);
  }

  @UseGuards( AuthGuard )
  @Get()
  findAll( @Request() req: Request ) {
    //console.log(req);    
    return this.authService.findAll();

    //Con esto retornamos la información de un usuario solamente, con el anterior retornamos todos los usuarios
    //const user = req['user'];   
    //return user;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}

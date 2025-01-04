import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,  
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

  // constructor(){
  //Este nos sirve para ver que tenemos en las variables de entorno
  //   console.log(process.env)
  // }

}

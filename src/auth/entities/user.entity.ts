import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {

    //dejamos el _id como opcional por que en algunas creaciones se va a retornar después de la creación del usuario
    _id?: string;
    @Prop({ unique: true, required: true })
    email: string;
    @Prop({ required: true })
    name: string;
    @Prop({ minlength: 6, required: true })
    password?: string;
    @Prop({ default: true })
    isActive: boolean;
    @Prop({ type: [String], default:['user'] })
    roles: string[];

}


export const UserSchema = SchemaFactory.createForClass( User);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { UserRoles } from '@common/enums/app.enums';

@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, enum: UserRoles, default: UserRoles.CLIENT })
  role: UserRoles;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: false })
  address?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongoosePaginate);

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

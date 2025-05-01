import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { User } from '@modules/users/schemas/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class Admin extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId | User;

  @Prop({ type: Date, default: Date.now })
  creationDate: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
AdminSchema.plugin(mongoosePaginate);

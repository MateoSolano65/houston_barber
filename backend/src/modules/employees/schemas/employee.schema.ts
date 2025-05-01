import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { User } from '@modules/users/schemas/user.schema';

@Schema({ timestamps: true, versionKey: false })
export class Employee extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId | User;

  @Prop({ required: true })
  specialty: string;

  @Prop()
  phone: string;

  @Prop({ type: Object })
  schedule: Record<string, any>;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
EmployeeSchema.plugin(mongoosePaginate);

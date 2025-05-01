import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { User } from '@modules/users/schemas/user.schema';
import { PopulatedEntity } from '@common/helpers/mongo.helpers';
import mongoose from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Employee extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: PopulatedEntity<User>;

  @Prop({ required: true })
  specialty: string;

  @Prop({ type: Object })
  schedule: Record<string, any>;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
EmployeeSchema.plugin(mongoosePaginate);

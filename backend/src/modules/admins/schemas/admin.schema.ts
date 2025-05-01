import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { User } from '@modules/users/schemas/user.schema';
import { PopulatedEntity } from '@common/helpers/mongo.helpers';
import mongoose from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Admin extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: PopulatedEntity<User>;

  @Prop({ type: Date, default: Date.now })
  creationDate: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
AdminSchema.plugin(mongoosePaginate);

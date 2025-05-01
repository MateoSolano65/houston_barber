import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { User } from '@modules/users/schemas/user.schema';
import { PopulatedEntity } from '@common/helpers/mongo.helpers';
import mongoose from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Client extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: PopulatedEntity<User>;

  @Prop()
  phone: string;

  @Prop()
  address: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
ClientSchema.plugin(mongoosePaginate);

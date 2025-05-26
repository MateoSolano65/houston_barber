import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { validateMongo } from '@common/helpers/mongo.helpers';

export type CatalogDocument = HydratedDocument<Catalog>;

@Schema({ timestamps: true, versionKey: false })
export class Catalog {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  price: number;
}

export const CatalogSchema = SchemaFactory.createForClass(Catalog);

CatalogSchema.post('save', validateMongo);

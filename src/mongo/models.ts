import { Document, model, Schema } from 'mongoose';
import { Army as IArmy } from '../entity/Army';
import { Army } from '../generated/entity/Army';

export const ArmySchema = new Schema<IArmy>(Army);

export const ArmyModel = model<IArmy & Document>('Army', ArmySchema);

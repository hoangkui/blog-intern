import { Types } from 'mongoose';

export interface JwtPayload {
  username: string;
  id: Types.ObjectId;
}

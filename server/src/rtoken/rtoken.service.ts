import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RToken, RTokenDocument } from './rtoken.schema';

@Injectable()
export class RTokenService {
  constructor(
    @InjectModel(RToken.name) private rTokenModel: Model<RTokenDocument>, // private readonly articleService: ArticleService,
  ) {}
  async create(content: string): Promise<RToken> {
    return await this.rTokenModel.create({ content });
  }
  async findAndUpdate(oldContent: string, content: string): Promise<boolean> {
    const res = await this.rTokenModel.findOneAndUpdate(
      { content: oldContent },
      { content },
    );
    return res !== null;
  }
  async delete(content: string): Promise<boolean> {
    const res = await this.rTokenModel.deleteOne({ content });
    return res !== null;
  }
  async find(content: string): Promise<boolean> {
    return (await this.rTokenModel.findOne({ content })) !== null;
  }
}

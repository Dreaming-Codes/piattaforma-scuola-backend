import { Injectable } from '@nestjs/common';
import {Disorder, DisorderData, DisorderDocument} from "./disorder.entity";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";

@Injectable()
export class DisorderService {
    constructor(@InjectModel(Disorder.name) private DisorderModel: Model<DisorderDocument>) {
    }

    getDisordersList(): Promise<DisorderData[]>{
        return this.DisorderModel.aggregate([
            {
                '$project': {
                    '_id': 1,
                    'name': 1,
                    'description': 1
                }
            }
        ]).exec() as unknown as Promise<DisorderData[]>;
    }

    newDisorder(disorder: DisorderDocument): Promise<DisorderDocument> {
        return this.DisorderModel.create(disorder)
    }
}

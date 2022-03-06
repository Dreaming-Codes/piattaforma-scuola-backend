import {Injectable} from "@nestjs/common";
import {OnEvent} from "@nestjs/event-emitter";
import {User, UserDocument} from "./user.entity";
import {_FilterQuery, Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {ClassService} from "../class/class.service";

@Injectable()
export class UserListener {
    constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>, private ClassService: ClassService) {}

    @OnEvent(User.name + ":deleteMany")
    async onDeleteMany(usersToBeDeletedFilter: _FilterQuery<any>) {
        const usersToDelete = await this.UserModel.find(usersToBeDeletedFilter.originalQuery);
        const idsToBeDeleted = usersToDelete.map(user => user._id);

        await this.ClassService.removeUsers(idsToBeDeleted);

        return idsToBeDeleted;
    }

    @OnEvent(User.name + ":deleteOne")
    async onDeleteOne(userToBeDeletedFilter: _FilterQuery<any>) {
        const userToDelete = await this.UserModel.findOne(userToBeDeletedFilter.originalQuery);

        await this.ClassService.removeUsers([userToDelete._id]);

        return [userToDelete._id];
    }
}

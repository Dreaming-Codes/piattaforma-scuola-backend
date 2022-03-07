import {Injectable} from "@nestjs/common";
import {OnEvent} from "@nestjs/event-emitter";
import {User, UserDocument} from "./user.entity";
import {_FilterQuery, Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {ClassService} from "../class/class.service";
import {SearchService} from "../search/search.service";

@Injectable()
export class UserListener {
    constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>, private ClassService: ClassService, private SearchService: SearchService) {}

    @OnEvent(User.name + ":deleteMany")
    async onDeleteMany(usersToBeDeletedFilter: _FilterQuery<any>) {
        const usersToDelete = await this.UserModel.find(usersToBeDeletedFilter.originalQuery);
        const idsToBeDeleted = usersToDelete.map(user => user._id);

        try {
            await this.SearchService.unindexUsers(idsToBeDeleted);
        } catch (e) {
            //Ignore errors derived by not existing index
        }
        await this.ClassService.removeUsers(idsToBeDeleted);

        return idsToBeDeleted;
    }

    @OnEvent(User.name + ":deleteOne")
    async onDeleteOne(userToBeDeletedFilter: _FilterQuery<any>) {
        const userToDelete = await this.UserModel.findOne(userToBeDeletedFilter.originalQuery);

        try{
            await this.SearchService.unindexUsers([userToDelete._id]);
        }catch (e) {
            //Ignore errors derived by not existing index
        }
        await this.ClassService.removeUsers([userToDelete._id]);

        return [userToDelete._id];
    }
}

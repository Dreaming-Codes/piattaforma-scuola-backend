import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {Disorder, DisorderData, DisorderDocument} from "./disorder.entity";
import {DisorderService} from "./disorder.service";
import {FileUpload, GraphQLUpload} from "graphql-upload-minimal";

@Resolver()
export class DisorderResolver {
    constructor(private readonly DisorderService: DisorderService) {
    }

    @Query(()=>[DisorderData])
    async getDisordersList(){
        return this.DisorderService.getDisordersList();
    }

    @Mutation(()=>Boolean)
    async newDisorder(@Args("disorderDocument", {type: ()=> Disorder}) disorderDocument: DisorderDocument,
                      @Args("pdf", {type: ()=> GraphQLUpload}) {createReadStream,filename}: FileUpload){
        console.log(filename)
        console.log(disorderDocument)
        this.DisorderService.newDisorder(disorderDocument);
        //TODO: Handle errors
        return true
    }
}

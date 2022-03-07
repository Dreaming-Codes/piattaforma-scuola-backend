import { Injectable } from '@nestjs/common';
import {ElasticsearchService} from "@nestjs/elasticsearch";

@Injectable()
export class SearchService {
    constructor(private readonly elasticsearchService: ElasticsearchService) {}

    /**
     * Search for a name + surname in the database using elasticsearch and return the _id of the users found
     * @param query Name + surname
     * @param size Number of users to return
     * @param from Number of users to skip
     */
    async searchUsers(query: string, size = 20, from = 0): Promise<{ count: number, hits: string[] }> {
        const elasticResult = (await this.elasticsearchService.search({
            index: 'users',
            body: {
                query: {
                    query_string: {
                        "query": query.replace(" ", "* ") + "*"
                    }
                },
                size,
                from
            },
        }));

        return {
            // @ts-ignore
            count: elasticResult.hits.total.value,
            hits: elasticResult.hits.hits.map(hit => hit._id)
        };
    }

    unindexUsers(userIds: string[]) {
        return this.elasticsearchService.deleteByQuery({
            index: 'users',
            body: {
                query: {
                    terms: {
                        _id: userIds
                    }
                }
            }
        });
    }

}

import merge from "lodash/merge.js"
import { userResolver } from "./user.resolver.ts"
import { postResolver } from "./post.resolver.ts"
import { categoryResolver } from "./category.resolver.ts";
import { commentResolver } from "./comment.resolver.ts";


export const resolvers = merge({}, userResolver, postResolver,categoryResolver,commentResolver);
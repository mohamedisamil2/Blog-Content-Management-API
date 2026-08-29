import merge from "lodash/merge.js"
import { userResolver } from "./user.resolver.ts"


export const resolvers = merge({}, userResolver)
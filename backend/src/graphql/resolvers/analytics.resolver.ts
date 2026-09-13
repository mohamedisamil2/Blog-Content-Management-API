import { Categories } from "../../models/categoryModel.ts";
import { Comments } from "../../models/commentModel.ts";
import { Posts } from "../../models/postModel.ts";
import { Users } from "../../models/userModel.ts";



export const analyticsResolver = {
    Query: {
        analytics: async (_: unknown) => {

            const [totalUsers, totalPosts, totalComments, totalCategories] =
                await Promise.all([Users.countDocuments(), Posts.countDocuments(),
                Categories.countDocuments(), Comments.countDocuments()
                ]);
            return {
                totalUsers, totalPosts, totalComments, totalCategories
            }
        },
    },
};
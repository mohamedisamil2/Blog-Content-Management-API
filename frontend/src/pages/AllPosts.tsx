import { useQuery } from "@apollo/client/react";
import type { PostsQuery } from "./Home";
import IsLoading from "../components/IsLoading";
import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"
import { PostQuery } from "../graphql/queries/post";
import PostCard from "../components/PostCard";
import { useState } from "react";


function AllPosts() {
    const [selectedCategory, setSelectedCategory] = useState("all");

    const { data, loading, error } = useQuery<PostsQuery>(PostQuery);
    
    const categories = [...new Set(data?.posts.map((post) => post.category.name))];
    const filteredPost =
        selectedCategory === "all" ?
            data?.posts
            :
            data?.posts.filter((post) => post.category.name === selectedCategory);
    
            if(loading) return <IsLoading/>
            if(error) return <p>{error.message}</p>;
    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 30, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="container mt-20 mx-auto py-8 "
            >
                <div className="flex mx-auto  justify-end">

                <select value={selectedCategory}
                    onChange={(e)=> setSelectedCategory(e.target.value)}
                    className="select select-secondary">
                    <option value="all">All</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                        
                    ))}
                    
                </select>
                        </div>
                <div className="grid gap-6  md:grid-cols-2 lg:grid-cols-3 mt-12">
                    {filteredPost?.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

export default AllPosts
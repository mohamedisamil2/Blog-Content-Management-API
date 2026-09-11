import { useQuery } from "@apollo/client/react"
import { PostQuery } from "../graphql/queries/post"
import IsLoading from "../components/IsLoading";
import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"
import { Link } from "react-router-dom";
import { GetAllCategories } from "../graphql/queries/categories";
import { ArrowRight } from "lucide-react";
import Hero from "../components/Hero";
import LatestPostsCard from "../components/LatestPostsCard";
import Footer from "../components/Footer";


interface Post {
    id: string;
    title: string;
    content: string;
    author: {
    name: string;
    };
    category: {
    name: string;
    };
    createdAt: string;
    likesCount?: number;   
    commentsCount?: number;
}

export interface PostsQuery {
    posts: Post[];
}

interface Category {
  id: string;
  name: string;
}

interface CategoriesQuery {
  categories: Category[];
}




function Home() {

    const { data, loading, error } = useQuery<PostsQuery>(PostQuery);
    const { data: categoriesData } = useQuery<CategoriesQuery>(GetAllCategories);

    const latestPost = data?.posts.slice(0, 4)
    
    const latestCategory = categoriesData?.categories.slice(0,3)

        if(loading) return <IsLoading/>
        if(error) return <p>{error.message}</p>;
    
    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -30, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                {/* Hero */}
                <Hero />

                {/* Latest Posts */}
                <section className="max-w-6xl mx-auto px-4 py-16">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900">Latest Posts</h2>
                        <Link to="/post" className="text-rose-500 text-sm font-medium hover:underline flex items-center gap-1">
                            View all <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {latestPost?.map((post) => (
                            <LatestPostsCard key={post.id} post={post} />
                        ))}
                    </div>
                   
                </section>

                {/* Browse by Category */}
                <section className="bg-gray-50 py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
                            Browse by Category
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {latestCategory?.map((cat) => (
                                <Link
                                    key={cat.id}
                                    to={`/category/${cat.id}`}
                                    className="bg-white hover:bg-rose-100 border border-gray-100 rounded-lg p-6 text-center transition-colors shadow-sm"
                                >
                                    <span className="font-medium text-gray-700">{cat.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
                <Footer />
            </motion.div>
        </AnimatePresence>
    );
}

export default Home

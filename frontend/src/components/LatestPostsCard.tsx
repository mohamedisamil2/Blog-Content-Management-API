import { Clock, User } from "lucide-react";
import { Link } from "react-router-dom"
import type { PostCardProps } from "./PostCard";


function formatDate(timestamp: string) {
    return new Date(Number(timestamp)).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function LatestPostsCard({ post }: PostCardProps) {

    return (
        <div
            className="card bg-base-100 shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
        >
            <div className="card-body">
                <div className="badge badge-error badge-outline">{post.category.name}</div>
                <h3 className="card-title text-base line-clamp-2">{post.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{post.content.slice(0, 10)}</p>

                <div className="flex items-center gap-3 text-xs text-gray-400 mt-3">
                    <span className="flex items-center gap-1">
                        <User size={12} /> {post.author.name}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={12} /> {formatDate(post.createdAt)}
                    </span>
                </div>

                <div className="card-actions justify-end mt-2">
                    <Link to={`/post/${post.id}`} className="btn btn-sm btn-error btn-outline">
                        Read more
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LatestPostsCard
import { Link } from "react-router-dom";
import { MessageCircle, Heart, Clock, User } from "lucide-react";

export interface PostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    category: {
      name: string;
    };
    author: {
      name: string;
    };
    likesCount?: number;
    commentsCount?: number;
    createdAt: string;
  };
}

function formatDate(timestamp: string) {
    return new Date(Number(timestamp)).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function PostCard({ post }: PostCardProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {/* Author */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full text-white bg-rose-500 font-semibold">
            {post.author?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="">
            <span className="flex items-center gap-1">
              <User size={12} /> {post.author.name.slice(0, 15)}
            </span>
                   
          </div>
        </div>

        {post.category && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
            {post.category.name}
          </span>
        )}
      </div>

      <span className="flex items-center gap-1 mb-4">
        <Clock size={12} /> {formatDate(post.createdAt)}
      </span>

      {/* Content */}
      <div className="mb-5">
        <h2 className="mb-2 text-xl font-bold text-rose-500">
          {post.title}
        </h2>

        <p className="line-clamp-3 text-rose-400">
          {post.content.slice(0,25)}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-5 text-sm text-rose-500">
          <span className="flex items-center gap-1">
            <Heart size={18} />
            {post.likesCount ?? 0}
          </span>

          <span className="flex items-center gap-1">
            <MessageCircle size={18} />
            {post.commentsCount ?? 0}
          </span>
        </div>

        <Link
          to={`/post/${post.id}`}
          className="font-medium text-rose-500 hover:text-rose-400 hover:underline"
        >
          Read more
        </Link>
      </div>
    </div>
  );
}

export default PostCard;
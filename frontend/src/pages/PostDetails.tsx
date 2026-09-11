import { useMutation, useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom"
import { GetPostId } from "../graphql/queries/post";
import CommentItems from "../components/CommentItems";
import type { AuthUser } from "../components/ProtectRoute";
import { DeleteComment, Update_Comment } from "../graphql/mutations/comment";
import CreateCommentsForm from "../components/CreateCommentsForm";

interface Post { 
    id: string;
    title: string;
    content: string;
    category: {
      name: string;
    };
  author: {
      name: string;
  };
  comments: {
    id: string;
    content: string;
    author: {id: string; name: string; }
    createdAt: string;
  }[];
  
}

interface PostQuery{
  post: Post
}

interface PostDetailsProps{
  auth: AuthUser ; 
}


function PostDetails({auth}:PostDetailsProps) {
  const { id } = useParams();
  const { data, refetch } = useQuery<PostQuery>(GetPostId, { variables: { id } });
  const [deleteComment] = useMutation(DeleteComment)
  const [updateComment] = useMutation(Update_Comment);

  const handleUpdateComment = async (commentId:string, content:string) => {
    try {
      await updateComment({
        variables: {
          id: commentId,
          input: {
            content,
          }
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (commentId:string) => {
    try {
      await deleteComment({
        variables: {
          id:commentId
        }
      });
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-24 px-4 pb-16">
      {/* رأس البوست */}
      <div className="mb-8">
        <span className="inline-block bg-rose-100 text-rose-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          {data?.post?.category.name}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {data?.post?.title}
        </h1>
        <p className="text-sm text-gray-500">
          بقلم <span className="font-medium text-gray-700">{data?.post?.author.name}</span>
        </p>
      </div>
      {/* محتوى البوست */}
      <div className="prose max-w-none text-gray-700 leading-relaxed mb-12">
        <p>{data?.post?.content}</p>
      </div>
      <hr className="border-gray-200 mb-8" />
      {auth && data?.post ? (
        <CreateCommentsForm postId={data?.post.id} onSuccess={refetch} />
      ) : (<h1 className="text-sm text-gray-500">Log in to leave a comment.</h1>)}

      <div className="comments-section">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Comments{data?.post.comments.length}</h2>
        <div className="space-y-1 mb-8">
          
          {data?.post.comments.map((comment) => (
            <CommentItems key={comment.id} comment={comment} currentUserId={auth.id} isAdmin={auth.role === "admin"} onDelete={handleDelete} onUpdate={handleUpdateComment} />
          ))}
          {data?.post?.comments.length === 0 && (
            <p className="text-gray-400 text-sm py-4">No comments yet. Be the first!</p>
          )}
        </div>
        

        
      </div>
    </div>
  );
}

export default PostDetails

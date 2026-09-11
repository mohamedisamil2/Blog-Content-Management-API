import { useMutation, useQuery } from "@apollo/client/react";
import { PostQuery } from "../../graphql/queries/post";
import { DeletePost } from "../../graphql/mutations/posts";
import toast from "react-hot-toast";
import IsLoading from "../../components/IsLoading";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import EditPostForm from "../../components/EditPostForm";

export interface Post {
    id: string;
    title:string;
    content:string;
    author :{
      name:string;
    }
    category: {
        id: string;
        name:string;
    }
    createdAt:string;
    updatedAt:string;
}
  
interface PostData{
    posts:Post[]
}


function EditPosts() {
      const [selectedPost, setSelectedPost] =
    useState<Post | null>(null);
    const { data, loading } = useQuery<PostData>(PostQuery);
    const [deletePost, {loading:isDeleteLoading}] = useMutation(DeletePost);

    const handleDelete = async (postId:string) => {
        try {
            await deletePost({
                variables: {
                   id: postId
                },
                refetchQueries:[PostQuery],
            });
            toast.success("deleted post successfully");
        } catch (error) {
            console.error(error);
        }
    }

    if(loading)return <IsLoading/>

    return (
        <div className="relative flex justify-center items-center">
            <div className="flex flex-col overflow-x-auto w-3/4 space-y-8 p-4 text-rose-500">
            <h1 className="text-2xl font-semibold">Edit Posts</h1>
            <table className="table w-full">
            {/* head */}
           <thead>
      <tr>
        <th>#</th>
        <th>Title</th>
        <th>Category</th>
        <th>Author</th>
        <th>Action</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
        {data?.posts.map((post,index) => ( 
        <tr key={post.id}>
        <th>{index + 1}</th>
        <td>{post.title}</td>
        <td>{post.category.name}</td>
        <td>{post.author.name}</td>
        <td>
            <button
                className="btn btn-outline btn-error"
                onClick={() => setSelectedPost(post)}
            >
                Edit
            </button>
        </td>
        <td>
            <button 
            className="btn btn-outline btn-error"
            onClick={()=> handleDelete(post.id)}>
                {isDeleteLoading ?
                (
                <LoaderIcon className="w-full h-6 animate-spin text-center" />
                    )
                :("Delete Post")
                }
            </button>
        </td>
      </tr>
    ))}
      
    </tbody>
    </table>
    </div>
    {selectedPost &&(
        <div className="absolute z-50 w-full top-8">
                    
        <EditPostForm post={selectedPost}
        onClose={() => setSelectedPost(null)}
        />
        </div>
    )}
    </div>
    );
}

export default EditPosts
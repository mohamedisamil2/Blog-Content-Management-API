import { useMutation } from "@apollo/client/react";
import { UpdatePost } from "../graphql/mutations/posts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPostSchema } from "../schema/createPost";
import type z from "zod";
import InputField from "./InputField";
import TextArea from "./TextArea";
import { LoaderIcon } from "lucide-react";
import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"
import type { Post } from "../pages/admin/EditPosts";


  
interface EditPostFormProps{
    post: Post;
    onClose: () => void;
}

type PostFormData= z.infer<typeof createPostSchema>

function EditPostForm({post, onClose}:EditPostFormProps) {

const [updatePost, {loading}]=useMutation(UpdatePost)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PostFormData>({ resolver: zodResolver(createPostSchema) });
    
    const handleUpdateEditPost = async (data:PostFormData) => {
        try {
            await updatePost({
                variables: {
                    id: post.id,
                    input: {
                        title: data.title,
                        content: data.content,
                        categoryId: data.categoryId,
                    }
                }
            });
            onClose();
        } catch (error) {
            console.error(error)
        }
    }

    return (
      <div className="flex justify-center items-center text-rose-500 ">
      <div className="w-1/2 ">
      <AnimatePresence mode="wait">          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -30, opacity: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
            className="bg-base-200 shadow-md p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Edit Posts By Id</h1>
        <form onSubmit={handleSubmit(handleUpdateEditPost)} className="space-y-4">
            <div>
                <InputField
                    label="Title"
                    name="title"
                    type="text"
                    register={register}
                    error={errors.title}
                />
            </div> 
            <div>
                  <TextArea
                      label="Content"
                      name="content"
                      placeholder="write your content here ..."
                      register={register}
                      error={errors.content}
                  />
            </div> 
              <div className="flex flex-col gap-1">
                  <label>Category</label>
                  <select {...register("categoryId")} className="w-full select select-error">
                      <option value={post.category.id}>{post.category.name}</option>
                  </select>
            </div>
            <div className="flex justify-between">
                <button type="submit" disabled={loading} className="btn btn-outline btn-error">
                    {loading ? <LoaderIcon className="w-full h-6 animate-spin text-center"/> : "Update Post"}
                </button>
                <button
                    className="btn btn-outline btn-error"
                    type="button"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
      </form>
        </motion.div>
        </AnimatePresence>
        </div>
        </div>
  )
}

export default EditPostForm

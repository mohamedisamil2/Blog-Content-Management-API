import { useForm } from "react-hook-form"
import { createPostSchema } from "../../schema/createPost"
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { useMutation, useQuery } from "@apollo/client/react";
import { CreatePostMutat } from "../../graphql/mutations/posts";
import toast from "react-hot-toast";
import InputField from "../../components/InputField";
import TextArea from "../../components/TextArea";
import { GetAllCategories } from "../../graphql/queries/categories";
import { LoaderIcon } from "lucide-react";
import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"


interface CreatePostFormData{
  title: string,
  content: string,
  categoryId:string,
}
type CreatePostForm = z.infer<typeof createPostSchema>;

interface Category{
  id: string;
  name: string;
}

interface CategoriesQuery{
  categories: Category[];
}

function CreatePosts() {

  const [createPost, {loading: isCreatePost }] = useMutation<CreatePostForm>(CreatePostMutat);
  const { data: categoriesData, loading: categoriesLaoding } = useQuery<CategoriesQuery>(GetAllCategories);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createPostSchema) });
  

  const submitHandler = async (data:CreatePostFormData) => {
    try {
        await createPost({
          variables: {
            input:{
              title: data.title,
              content: data.content,
              categoryId:data.categoryId,
            }
        }
        });
      
      toast.success("Created Post Successfully");
      reset();
    } catch (error) {
       console.error(error);
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
            className="bg-base-200 shadow-sm p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Create Posts</h1>

          <form onSubmit={handleSubmit(submitHandler)} className="w-full space-y-2 mb-4">
            <div>
              <InputField
                label="Title"
                type="text"
                name="title"
                register={register}
                error={errors.title}
              />
            </div>
            <div>
              <TextArea
                label="Content"
                name="content"
                register={register}
                placeholder="write your post content here..."
                rows={8}
                error={errors.content}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="categoryId">Category</label>
              <select
                id="categoryId"
                {...register("categoryId")}
                disabled={categoriesLaoding}
                className="w-full select select-error"
              >
                <option value="">Select a Category</option>
                {categoriesData?.categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                  
                ))}
              </select>
            </div>
            <button type="submit" disabled={isCreatePost}  className="btn btn-outline btn-error w-full mt-6">
              {isCreatePost ?
                (<LoaderIcon className="w-full h-6 animate-spin text-center" />) 
                :
                ("Create Post")  
            }
            </button>
        </form>
        </motion.div>
      </AnimatePresence>
      </div>
      </div>
  )
}

export default CreatePosts

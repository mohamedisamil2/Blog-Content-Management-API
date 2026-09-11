import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { commentSchema } from "../schema/commentSchema";
import { useMutation } from "@apollo/client/react";
import { Create_Comment } from "../graphql/mutations/comment";
import InputField from "./InputField";
import { LoaderIcon } from "lucide-react";
import toast from "react-hot-toast";

interface CreateCommentsFormProps {
    postId: string;
    onSuccess: () => void;  
}

interface CreateCommentsData{
    content: string;
}

function CreateCommentsForm({ postId, onSuccess }: CreateCommentsFormProps) {
    
    const [createComment,{loading:isCreateComment}] = useMutation(Create_Comment);
    
    const {
        register,
        reset,
        handleSubmit,
        formState:{errors}

    }=useForm({resolver:zodResolver(commentSchema)})


    const handleCreateComment = async (data:CreateCommentsData) => {
        try {
            await createComment({
                variables: {
                    input: {
                        content: data.content,
                        postId: postId,
                    },
                }
            });

            toast.success("Creat Comment Successfully");
            reset();
            onSuccess?.();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="mb-10">
            <form onSubmit={handleSubmit(handleCreateComment)} className="flex items-center gap-3">
                <div className="flex-1">
                <InputField
                    label=""
                    name="content"
                    placeholder="Write a comment..."
                    register={register}
                    error={errors.content}
                    />
                </div>
                <button type="submit"
                    className="btn btn-outline btn-error"
                    disabled={isCreateComment}
                >
                    {isCreateComment ?
                        <LoaderIcon className="w-full h-6 animate-spin text-center" />
                    :"Create Comment"
                    }
                </button>
            </form>
        </div>
    );
}

export default CreateCommentsForm

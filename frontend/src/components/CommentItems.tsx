import { zodResolver } from "@hookform/resolvers/zod";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { commentSchema } from "../schema/commentSchema";
import { useState } from "react";
import InputField from "./InputField";

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;   // من auth.id، عشان نعرف هل هو صاحب التعليق
  isAdmin?: boolean;         // من auth.role === 'admin'
  onDelete: (commentId: string) => void;
  onUpdate: (commentId: string, content:string) => Promise<void>;
};

interface CommentFormData {
  content: string;
}

function CommentItems({comment, currentUserId, isAdmin, onDelete, onUpdate}:CommentItemProps) {
    
     const [isEditing, setIsEditing] = useState(false);

    
    const isOwner = comment.author.id === currentUserId;
    const canDelete = isOwner || isAdmin;
    const canUpdate = isOwner;

     const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: comment.content },   // ← يبدأ بالقيمة الحالية
  });
    
    const handleSaveEdit = async (data: CommentFormData) => {
    await onUpdate(comment.id, data.content);
    setIsEditing(false);   // يرجع لعرض النص العادي بعد الحفظ
  };

    return (
        <div className="border-b border-gray-200 py-4">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-sm">{comment.author.name}</p>
                    <p className="text-xs text-gray-400">
                        {new Date(Number(comment.createdAt)).toLocaleDateString()}
                    </p>
                    <p>{comment.content}</p>

                </div>
                {isEditing ? (
                    <form onSubmit={handleSubmit(handleSaveEdit)} className="flex gap-2 items-start">
                        <div className="flex-1">
                            <InputField
                                label=""
                                name="content"
                                register={register}
                                error={errors.content}
                            
                            />
                            <button type="submit" className="text-rose-500 text-sm font-medium">
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="text-gray-400 text-sm"
                            >
                                Cancel
                            </button>
            
                        </div>
                    </form>
                ) : (
                    <p className="text-gray-700">{comment.content}</p>
                )}

                {!isEditing && (
                    <details className="dropdown">
                        <summary className="btn m-1"> <EllipsisVertical /></summary>
                        <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-16 p-2 shadow-sm">
                            {canUpdate && (
                                <li>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-green-500">
                                        <Pencil />
                                    </button>
                                </li>
                            )}
                            {canDelete && (
                                <li><button
                                    onClick={() => onDelete(comment.id)}
                                    className="text-rose-500 text-sm"
                                >
                                    <Trash />
                                </button></li>
                            )}
                        </ul>
                    </details>
                )}
                    
            </div>
        </div>
    );
}

export default CommentItems
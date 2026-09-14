import { useMutation } from "@apollo/client/react";
import { CreateCategory } from "../../graphql/mutations/categories";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CreateCategoryData } from "../../schema/categorySchema";
import toast from "react-hot-toast";
import InputField from "../../components/InputField";
import { LoaderIcon } from "lucide-react";



function Categries() {
  
  const [createCategory, {loading:isCreateCategory }] = useMutation(CreateCategory);

  const {
    register,
    handleSubmit,
   formState:{errors},
  }=useForm({resolver:zodResolver(categorySchema)})
  

  const createCategoryHandler = async (data:CreateCategoryData) => {
    try {
      await createCategory(
        {
          variables: {
            name: data.name
          
        }
        } 
      );
      toast.success("create category successfully");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex justify-center items-center ">
      <div className="flex flex-col space-y-4 p-4 w-3/4">
      <h1 className="text-rose-500 text-2xl font-semibold">Create Categries</h1>
      <form onSubmit={handleSubmit(createCategoryHandler)}
      className="flex flex-col space-y-4"
      >
        <div>
          <InputField
            label="Name"
            name="name"
            register={register}
            type="text"
            placeholder="write your category name here ..."
            error={errors.name}
          />
        </div>
        <button className="btn btn-outline btn-error">
          {isCreateCategory ? 
            (<LoaderIcon className="w-full h-6 animate-spin text-center"/>)
          :("Create Category")
          }
        </button>
        </form>
        </div>
    </div>
  )
}

export default Categries
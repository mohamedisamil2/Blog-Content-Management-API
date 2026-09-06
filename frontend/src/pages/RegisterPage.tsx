import { useApolloClient, useMutation } from "@apollo/client/react";
import { registerSchema } from "../schema/registerSchema";
import { RegisterMutation } from "../graphql/mutations/user";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LoaderIcon } from "lucide-react";
import InputField from "../components/InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";

type RegisterMutationData = {
  registerUser: {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
};

type RegisterMutationVariables = {
  input: {    
    name:string,
    email: string,
    password:string,
  }
};

type RegisterFormData = z.infer<typeof registerSchema>;


function RegisterPage() {
  const [registerUser, { loading: isSignUp }] = useMutation<RegisterMutationData, RegisterMutationVariables>(RegisterMutation);

   const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const client = useApolloClient();
  const navigate = useNavigate();
  
  const submitHandler = async (data: RegisterFormData) => {
  try {
    const result = await registerUser({
      variables: {
        input:{ 
          name: data.name,
          email: data.email,
          password: data.password,
        }
      }
    });

    const token = result.data?.registerUser.accessToken;

      if (token) {
        localStorage.setItem("accessToken", token);
      }
      toast.success("User Sign Up Successfully");
      await client.resetStore()
      navigate("/")
  } catch (error) {
    console.error(error);
    
  }
}


  return (
     <div className="w-full flex justify-center items-center mt-20 ">
       <div className="flex justify-center items-center">
          <div className="w-full min-w-md">
            {/* heading */}
          <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-rose-500 mb-2">Sign Up</h2>
              <p className="text-slate-400">Sign Up to access your Account </p>
          </div>
          <form className="space-y-4 bg-rose-400/45 p-4 w-full rounded-md" onSubmit={handleSubmit(submitHandler)}>
            <div className="flex flex-col space-y-2">
              <InputField
                label="User Nmae"
                name="name"
                register={register}
                placeholder="enter your name"
                error={errors.name}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <InputField
                label="Email"
                name="email"
                register={register}
                placeholder="enter valid email"
                error={errors.email}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <InputField
                label="Password"
                name="password"
                register={register}
                placeholder="enter password"
                error={errors.password}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                register={register}
                placeholder="confirm password"
                error={errors.confirmPassword}
              />
            </div>
            <button
                type="submit"
                disabled={isSignUp}
                className="w-full bg-rose-500 text-slate-200 py-2.5 font-medium rounded-lg
                hover:bg-rose-400 focus:ring-2 focus:ring-rose-400"
              >
                {isSignUp ? (
                  <LoaderIcon className="w-full h-6 animate-spin text-center" />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-block px-4 py-2 bg-cyan-400/10 text-rose-400
                  hover:text-rose-500 text-sm transition-colors"
              >
               Already have an Account ? Login
              </Link>
            </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

import { useApolloClient, useMutation } from "@apollo/client/react";
import { Login_Mutation} from "../graphql/mutations/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schema/loginSchema";
import type z from "zod";
import InputField from "../components/InputField";
import { Link, useNavigate } from "react-router-dom";
import { LoaderIcon } from "lucide-react";
import toast from "react-hot-toast";

type LoginMutationData = {
  login: {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
};

type LoginMutationVariables = {
  email: string;
  password: string;
};

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginData{
    email: string,
    password:string,
  }


function LoginPage() {
  const [login, { loading: isSignIn }] = useMutation<LoginMutationData, LoginMutationVariables>(Login_Mutation);

   const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const client = useApolloClient();
    const navigate = useNavigate();
  

   const submitHandler = async (data:LoginData) => {
    try {
      const result = await login({
        variables: {
          email: data.email,
          password: data.password,
        },
      });

      const token = result.data?.login.accessToken;

      if (token) {
        localStorage.setItem("accessToken", token);
      }
      toast.success("User Logged In Successfully");
      await client.resetStore();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full flex justify-center items-center p-4 mt-20 ">
       <div className=" p-8 flex justify-center items-center">
          <div className="w-full  min-w-md">
            {/* heading */}
          <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-rose-500 mb-2">Login</h2>
              <p className="text-slate-400">Sign In to access your Account </p>
          </div>
          <form className="space-y-6 bg-rose-400/45 p-8 w-full rounded-md" onSubmit={handleSubmit(submitHandler)}>
            <div className="flex flex-col space-y-2">
              <InputField
                label="Email"
                name="email"
                register={register}
                error={errors.email}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <InputField
                label="Password"
                name="password"
                register={register}
                error={errors.password}
              />
            </div>
            <button
                type="submit"
                disabled={isSignIn}
                className="w-full btn btn-outline btn-error hover:bg-rose-500"
              >
                {isSignIn ? (
                  <LoaderIcon className="w-full h-6 animate-spin text-center" />
                ) : (
                  "Sign In "
                )}
              </button>
            </form>
            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="inline-block px-4 py-2 bg-cyan-400/10 text-rose-400
                  hover:text-rose-500 text-sm transition-colors"
              >
                Don't have an Account ? Sign Up
              </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage
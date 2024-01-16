import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { validateSignInInput, checkCred } from "../../utils/Auth/signInUtils";
import { getCookie, setCookie } from "../../utils/Auth/signupUtils";
import { useNavigate } from "react-router-dom";
import { initializeDB } from "../../utils/app/appUtils";

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    const isValidInput = validateSignInInput(email, password);

    if (!isValidInput) return;

    //check for credentials
    try {
      const result = await checkCred(email, password);
      if (result) {
        setCookie("email", email, 1);
        toast.success("successfully sign In");
        navigate("/");
      }
    } catch (error) {
      toast.error(error as string);
    }
  };

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await initializeDB();
        if (getCookie("email")) {
          navigate("/");
          return;
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error("something went wrong");
        console.log(error);
      }
    };

    checkAuthentication();
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSignIn} action="#">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{" "}
          <a
            href="/auth/signup"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign Up here!
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;

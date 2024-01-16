import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignIn from "./components/Auth/SignIn"
import SignUp from "./components/Auth/SignUp"
import Homepage from "./components/Home/Homepage"

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Homepage />,
    },
    {
      path: "/auth/signin",
      element: <SignIn />,
    },
    {
      path: "/auth/signup",
      element: <SignUp />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}

export default App

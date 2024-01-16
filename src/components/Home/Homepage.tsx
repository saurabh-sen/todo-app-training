import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { getCookie } from "../../utils/Auth/signupUtils";
import Todos from "../Todos/Todos";
import { initializeDB } from "../../utils/app/appUtils";

interface IIsLoggedIn {
  isLoading: boolean;
  isLoggedIn: boolean;
}

const Homepage: React.FC = () => {
  if (!("indexedDB" in window)) {
    alert("This browser doesnt support IndexedDB");
    console.log("This browser doesn't support IndexedDB");
    return <h1>DB is not supported by browser</h1>;
  }
  const navigate = useNavigate();
  const [isLogIn, setIsLogIn] = useState<IIsLoggedIn>({
    isLoading: true,
    isLoggedIn: false,
  });

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        await initializeDB();
        if (!getCookie("email")) {
          navigate("/auth/signin");
          setIsLogIn({ isLoading: false, isLoggedIn: false });
          toast.error("Not authorized");
          return;
        }
        setIsLogIn({ isLoading: false, isLoggedIn: true });
      } catch (error) {
        navigate("/auth/signin");
        setIsLogIn({ isLoading: false, isLoggedIn: false });
        toast.error("Not authorized");
        console.log(error);
      }
    };

    checkAuthentication();
  }, []);

  if (isLogIn.isLoading) return <p>Loading...</p>;
  else if (isLogIn.isLoggedIn) return <Todos />;
  else return <p>redirectin...</p>;
};

export default Homepage;

import toast from "react-hot-toast";

const idb =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

const validateSignUpInput = (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): boolean => {
  // Define regex patterns
  const nameRegex = /^(?!\s*$).+/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}|:<>?~]).{8,}$/;

  const isNameValid = nameRegex.test(name);
  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = passwordRegex.test(password);
  const isConfirmPasswordValid = passwordRegex.test(confirmPassword);

  if (!isNameValid) {
    toast.error("Name is not valid");
    return false;
  }
  if (!isEmailValid) {
    toast.error("Email is badly formatted");
    return false;
  }
  if (!isPasswordValid) {
    toast.error(
      "Password should have minimum 8 chars including 1 uppercase, 1 lowercase and 1 special character."
    );
    return false;
  }
  if (!isConfirmPasswordValid) {
    toast.error(
      "Confirm Password should have minimum 8 chars including 1 uppercase, 1 lowercase and 1 special character."
    );
    return false;
  }
  if (confirmPassword !== password) {
    toast.error("Password and confirm password not matched");
    return false;
  }
  return true;
};

interface ISaveToDB {
  name: string;
  email: string;
  password: string;
}

const setCookie = (name: string, value: string, days: number) => {
  let cookie = `${name}=${encodeURIComponent(value)}`;

  // Add expiry date
  if (days) {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);
    cookie += `; expires=${expiry.toUTCString()}`;
  }

  // Set an HTTP cookie
  document.cookie = cookie;
};

const getCookie = (name: string) => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim().split("=");
    if (c[0] === name) {
      return decodeURIComponent(c[1]);
    }
  }
  return "";
};

const saveToDB = ({ name, email, password }: ISaveToDB) => {
  return new Promise((res, rej) => {
    try {
      if (!idb) {
        rej("IndexedDB is not supported");
        return;
      }

      const request = idb.open("todos", 1);

      request.onerror = function (event) {
        console.error(event);
        rej("An error occurred with IndexedDB");
      };

      request.onsuccess = function () {
        const db = request.result;

        if (!db.objectStoreNames.contains("userData")) {
          rej("userData not found");
          return;
        }

        // Create a transaction
        const tx = db.transaction("userData", "readwrite");
        const userData = tx.objectStore("userData");

        // Add item to the object store
        const item = {
          name: name,
          email: email,
          password: password,
        };

        const addRequest = userData.add(item);

        addRequest.onsuccess = (event) => {
          res("item added successfully");
        };

        addRequest.onerror = (error) => {
          rej("Error while registering");
        };
      };
    } catch (error) {
      rej("something went wrong");
    }
  });
};

export { validateSignUpInput, saveToDB, setCookie, getCookie };

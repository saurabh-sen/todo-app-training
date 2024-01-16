import toast from "react-hot-toast";

const idb = window.indexedDB

const validateSignInInput = (email: string, password: string) => {
  // Define regex patterns
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?!\s*$).+/;

  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = passwordRegex.test(password);

  if (!isEmailValid) {
    toast.error("Email is badly formatted");
    return false;
  }
  if (!isPasswordValid) {
    toast.error("Password cannot be empty.");
    return false;
  }
  return true;
};

const checkCred = (emailClient: string, passwordClient: string) => {
  return new Promise((res, rej) => {
    try {
      if (!idb) {
        rej("IndexedDB is not supported");
        return;
      }

      const request = idb.open("todos", 1);

      request.onerror = function (event) {
        console.log(event);
        rej("An error occurred with IndexedDB");
      };

      request.onsuccess = function () {
        const db = request.result;

        if (!db.objectStoreNames.contains("userData")) {
          console.log("userData object store not found");
          rej("invalid credentials");
          return;
        }

        // Create a transaction
        const tx = db.transaction("userData", "readonly");
        const userData = tx.objectStore("userData");

        const addRequest = userData.get(emailClient);

        addRequest.onsuccess = () => {
          if (!addRequest.result) return rej("Invalid Credentials");
          const { email, password } = addRequest.result;
          if (emailClient === email && passwordClient === password) res(true);
          rej("Invalid Credentials");
        };

        addRequest.onerror = () => {
          rej("Invalid Credentials");
        };
      };
    } catch (error) {
      rej("something went wrong");
    }
  });
};

export { validateSignInInput, checkCred };

import toast from "react-hot-toast";

const idb =
  window.indexedDB

interface ITodos {
  title: string;
  description: string;
  date: string;
}

const validateTodosInput = (
  title: string,
  description: string,
  date: string
) => {
  // Define regex patterns
  const checkBlankSpaceRegex = /^(?!\s*$).+/;
  const isTitleValid = checkBlankSpaceRegex.test(title);
  const isDescriptionValid = checkBlankSpaceRegex.test(description);
  const isDateValid = checkBlankSpaceRegex.test(date);
  if (!isTitleValid) {
    toast.error("Title is not valid");
    return false;
  }
  if (!isDescriptionValid) {
    toast.error("Title is not valid");
    return false;
  }
  if (!isDateValid) {
    toast.error("Title is not valid");
    return false;
  }
  return true;
};

const saveTodoInDB = (title: string, description: string, date: string) => {
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

      request.onsuccess = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains("todosData")) {
          rej("todosData not found");
          return;
        }

        // Create a transaction
        const tx = db.transaction("todosData", "readwrite");
        const todosData = tx.objectStore("todosData");

        // Add item to the object store
        const item = {
          title: title,
          description: description,
          date: date,
        };

        const addRequest = todosData.add(item);

        addRequest.onsuccess = () => {
          res("item added successfully");
        };

        addRequest.onerror = () => {
          rej("Error while saving");
        };
      };
    } catch (error) {
      rej("something went wrong");
    }
  });
};

const getAllTodos = () => {
  return new Promise((res, rej) => {
    try {
      const request = idb.open("todos", 1);

      request.onerror = function (event) {
        console.log(event);
        rej("An error occurred with IndexedDB");
      };

      request.onsuccess = function () {
        const db = request.result;

        if (!db.objectStoreNames.contains("todosData")) {
          console.log("todosData object store not found");
          rej("No data found");
          return;
        }

        // Create a transaction
        const tx = db.transaction("todosData", "readonly");
        const todosData = tx.objectStore("todosData");

        let data : ITodos[] = [];

        todosData.openCursor().onsuccess = function (cursorEvent) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const cursor = cursorEvent.target.result;

          if (cursor) {
            // Process each record and add it to the data array
            data.push(cursor.value);

            // Move to the next record
            cursor.continue();
          } else {
            // All records have been processed, invoke the callback with the data
            res(data);

            // Close the transaction and the database
            tx.oncomplete = function () {
              db.close();
            };
          }
        };
      };
    } catch (error) {
      console.log(error);
      rej("something went wrong");
    }
  });
};

export { validateTodosInput, saveTodoInDB, getAllTodos };

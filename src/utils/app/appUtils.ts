const idb = window.indexedDB

const initializeDB = () => {
  return new Promise((res, rej) => {
    try {
      if (!idb) {
        rej("IndexedDB is not supported");
        return;
      }

      const request = idb.open("todos", 1);

      request.onerror = async function (event) {
        console.error(event);
        rej("An error occurred with IndexedDB");
      };

      request.onupgradeneeded = async () => {
        const db = request.result;

        // Check if the object store exists, and create it if it doesn't
        if (!db.objectStoreNames.contains("todosData")) {
          const objectStore = await db.createObjectStore("todosData", {
            autoIncrement: true,
          });

          // Define what data items the objectStore will contain
          objectStore.createIndex("title", "title", { unique: false });
          objectStore.createIndex("description", "description", {
            unique: false,
          });
          objectStore.createIndex("date", "date", { unique: false });
        }

        if (!db.objectStoreNames.contains("userData")) {
          const objectStore = await db.createObjectStore("userData", {
            keyPath: "email",
          });

          // Define what data items the objectStore will contain
          objectStore.createIndex("name", "name", { unique: false });
          objectStore.createIndex("email", "email", { unique: true });
          objectStore.createIndex("password", "password", { unique: false });
        }
      };

      request.onsuccess = () => {
        res("initiated successfully");
      };
    } catch (error) {
      rej("something went wrong");
    }
  });
};

export { initializeDB };

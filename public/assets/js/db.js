let db;
const request = window.indexedDB.open("budgetDB", 1);

request.onupgradeneeded = ({ target }) => {
  const db = target.result;
  const objectStore = db.createObjectStore("budgetDB", { keyPath: "ID" });
  objectStore.createIndex("transactionIndex", "transaction");
};

request.onsuccess = event => {
  const db = request.result;
    const transaction = db.transaction(["budgetDB"], "readwrite");
    const budgetStore = transaction.objectStore("budgetDB");
    const budgetIndex = budgetStore.index("transactionIndex");

    // Adds data to our objectStore
    budgetStore.add({ ID: 1, transaction: 500 });
   
    // Return an item by keyPath
    const getRequest = budgetStore.get("1");
    getRequest.onsuccess = () => {
      console.log(getRequest.result);
    };

    // Return an item by index
    const getRequestIdx = budgetIndex.getAll("complete");
    getRequestIdx.onsuccess = () => {
      console.log(getRequestIdx.result); 
    };
};
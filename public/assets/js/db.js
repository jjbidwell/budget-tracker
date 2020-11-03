let db;
const request = indexedDB.open("budgetDB", 1);

request.onupgradeneeded = function(e) {
  db = e.target.result;
  db.createObjectStore("pendingTransactions", { autoIncrement: true });
};

request.onsuccess = function(e) {
  db = e.target.result;

  if (navigator.onLine) {
    readDB();
  }
};

request.onerror = function(e) {
  console.log("Error: " + e.target.errorCode);
};

function saveRecord(data) {
  const transaction = db.transaction(["pendingTransactions"], "readwrite");

  const budgetStore = transaction.objectStore("pendingTransactions");

  budgetStore.add(data);
}

function readDB() {
  const transaction = db.transaction(["pendingTransactions"], "readwrite");
  const budgetStore = transaction.objectStore("pendingTransactions");
  const getData = budgetStore.getAll();

  getData.onsuccess = function() {
    if (getData.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getData.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
        const transaction = db.transaction(["pendingTransactions"], "readwrite");
        const budgetStore = transaction.objectStore("pendingTransactions");
        budgetStore.clear();
      });
    }
  };
}

window.addEventListener("online", readDB);
document.getElementById("save").addEventListener("click", () => {
  const skipNotify = document.getElementById("skipNotify").checked;

  chrome.storage.sync.set({ skipNotify: skipNotify }, () => {
    // Update status to let user know options were saved.
    //   const status = document.getElementById('status');
    //   status.textContent = 'Options saved.';
    setTimeout(() => {
      console.log("Options saved.");
    }, 750);
  });
});

const restoreOptions = () => {
  chrome.storage.sync.get({ skipNotify: false }, (items) => {
    document.getElementById("skipNotify").checked = items.skipNotify;
  });
};

document.addEventListener("DOMContentLoaded", restoreOptions);

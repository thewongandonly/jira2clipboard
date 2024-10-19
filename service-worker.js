function collectStory() {
  let resolvedVal = "";

  const sendMessage = async (textToCopy) => {
    const result = await chrome.runtime.sendMessage({ clipped: textToCopy });
    //console.log(result);
  };

  const sendError = async (error) => {
    const result = await chrome.runtime.sendMessage({ error });
    //console.log(result);
  };

  const copyClip = function (textToCopy) {
    if (!textToCopy) return;
    const clipBoard = navigator.clipboard;
    clipBoard.writeText(textToCopy).then(() => {
      console.log(textToCopy);

      //send result back to worker:
      sendMessage(textToCopy);
    });
  };

  let subTasks = document.body.querySelector(
    ".ghx-parent-group div.ghx-selected"
  );
  if (!!subTasks) {
    const taskcontainer = document.body.querySelector(
      ".ghx-parent-group :has(> .ghx-selected) "
    );

    if (!!taskcontainer) {
      const parent = taskcontainer.parentElement;

      if (!!parent) {
        const keyresolved = parent.getAttribute("data-issue-key");
        // console.log(keyresolved);
        const querySelectorkey =
          ".ghx-parent-group[data-issue-key='" +
          keyresolved +
          "'] .ghx-parent-stub";
        // console.log(querySelectorkey);
        const titeldiv = document.body.querySelector(querySelectorkey);
        resolvedVal = titeldiv.getAttribute("title");

        // console.log(resolvedVal);
      }
    }
  }

  let tegel = document.body.querySelector("div.ghx-selected");
  if (!!tegel) {
    //main tile:
    resolvedVal = !!resolvedVal ? resolvedVal + "\r\n- " : "";
    resolvedVal = resolvedVal + tegel.getAttribute("aria-label");

    // console.log(resolvedVal);
  }

  if (!!resolvedVal) {
    copyClip(resolvedVal);
    return;
  }

  //detail view:
  const myselector = "issue-view";
  let detailPage = document.querySelector(`.${CSS.escape(myselector)}`);
  if (!!detailPage) {
    const tkey = "aui-page-header-main";
    let detailPagemain = document.querySelector(`.${CSS.escape(tkey)}`);
    if (!!detailPagemain) {
      const anchorHeaderTagsParent = document.body.querySelector(
        ".aui-page-header-main a#parent_issue_summary.issue-link"
      );
      const anchorHeaderTags = document.body.querySelector(
        ".aui-page-header-main a#key-val.issue-link"
      );
      let storynummer = anchorHeaderTags.getAttribute("data-issue-key");
      const summaryElement = document.querySelector(
        ".aui-page-header-main h1#summary-val"
      );
      if (!!anchorHeaderTagsParent) {
        let storynummerParent = anchorHeaderTagsParent.textContent;
        resolvedVal =
          storynummerParent +
          "\r\n- " +
          storynummer +
          ": " +
          summaryElement.textContent;
      } else {
        //detail pagina zonder parent:
        resolvedVal = storynummer + ": " + summaryElement.textContent;
      }

      if (!!resolvedVal) {
        copyClip(resolvedVal);
        return;
      }
    }
  }

  sendError('jira story not found here');
}


function copyStory(tab) {
  if (tab.url.startsWith("https:")) {//add you own rule
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: collectStory,
    });
  }
   
}


function notify(message) {
  chrome.storage.sync.get({ skipNotify: false }).then((items) => {
    if (!items.skipNotify) {
      doNotify(message);
    }
  });
}


function notifyError(error) {
  doNotify('Fout: ' + error);
}


function doNotify(message) {
  chrome.notifications.create("", {
    type: "basic",
    title: "Copy story",
    message: message,
    iconUrl: "cake_128x128.png",
  });
}

chrome.action.onClicked.addListener(copyStory);

 
// https://bugzilla.mozilla.org/show_bug.cgi?id=1843866
chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
    if (command === "copy-story") 
      copyStory(tabs[0]);
  });
});

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  if (!!data.clipped) {
    notify(data.clipped);
  }

  if (!!data.error) {
    notifyError(data.error);
  }
});

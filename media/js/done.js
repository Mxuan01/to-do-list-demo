// @ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();

  /** @type {{ doneList: { id: string; content: string; }[]; }} */
  const doneState = vscode.getState() || {
    doneList: [],
  };

  /** @type {{ id: string; content: string; }[] }} */
  let doneList = doneState.doneList || [];

  /**
   * @param { string[] } classnames
   * @param { string | undefined } textContent
   * @param { string | undefined } dataId
   */
  function createDivElement(
    classnames,
    textContent = undefined,
    dataId = undefined
  ) {
    const div = document.createElement("div");
    div.classList.add(...classnames);

    if (textContent) {
      div.textContent = textContent;
    }

    if (dataId) {
      div.setAttribute("data-id", dataId);
    }

    return div;
  }

  /**
   * @param {{ id: string; content: string; }[]} tasks
   */
  function updateDoneList(tasks) {
    vscode.setState({ doneList: tasks });

    const newDoneListEle = createDivElement(["task-list"]);
    tasks.forEach((task) => {
      const taskItem = createDivElement(["task-item"], task.content, task.id);
      newDoneListEle.appendChild(taskItem);
    });

    const viewContainerEle = document.querySelector(".view-container");
    const oldDoneListEle = document.querySelector(".task-list");
    if (oldDoneListEle) {
      viewContainerEle?.replaceChild(newDoneListEle, oldDoneListEle);
    } else {
      viewContainerEle?.appendChild(newDoneListEle);
    }
  }

  /**
   * @param {{ id: string; content: string; }} data
   */
  function toUpdateDoneList(data) {
    doneList.push(data);
    updateDoneList(doneList);
  }

  // Handle messages sent from the extension to the webview
  window.addEventListener("message", (event) => {
    // The json data that the extension sent
    const message = event.data;

    switch (message.type) {
      case "addTask":
        return toUpdateDoneList(message.data);
    }
  });

  function undoTask(event) {
    const targetDataId = event.target.getAttribute("data-id");
    if (targetDataId) {
      let undoTaskData;
      const filteredList = [...doneList].filter((task) => {
        const isUndoTask = task.id === targetDataId;
        if (isUndoTask) {
          undoTaskData = task;
        }
        return !isUndoTask;
      });
      doneList = filteredList;
      updateDoneList(doneList);
      vscode.postMessage({ type: "undoTask", data: undoTaskData });
    }
  }

  document
    .querySelector(".view-container")
    ?.addEventListener("click", undoTask);

  updateDoneList(doneList);
})();

// @ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();

  /** @type {{ id: string; content: string; }[] }} */
  let toDoList = [];

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
  function updateToDoList(tasks) {
    const newToDoListEle = createDivElement(["task-list"]);
    tasks.forEach((task) => {
      const taskItem = createDivElement(["task-item"], task.content, task.id);
      newToDoListEle.appendChild(taskItem);
    });

    const viewContainerEle = document.querySelector(".view-container");
    const oldToDoListEle = document.querySelector(".task-list");
    if (oldToDoListEle) {
      viewContainerEle?.replaceChild(newToDoListEle, oldToDoListEle);
    } else {
      viewContainerEle?.appendChild(newToDoListEle);
    }
  }

  /**
   * @param {{ id: string; content: string; } | string} data
   */
  function toUpdateToDoList(data) {
    const tasks = toDoList;
    if (typeof data === "string") {
      tasks.push({ id: `${Date.now()}`, content: data });
    } else {
      tasks.push(data);
    }
    updateToDoList(tasks);
  }

  // Handle messages sent from the extension to the webview
  window.addEventListener("message", (event) => {
    // The json data that the extension sent
    const message = event.data;

    switch (message.type) {
      case "addTask":
        return toUpdateToDoList(message.data);
    }
  });

  function doneTask(event) {
    const targetDataId = event.target.getAttribute("data-id");
    if (targetDataId) {
      let doneTaskData;
      const filteredList = [...toDoList].filter((task) => {
        const isDoneTask = task.id === targetDataId;
        if (isDoneTask) {
          doneTaskData = task;
        }
        return !isDoneTask;
      });
      toDoList = filteredList;
      updateToDoList(toDoList);
      vscode.postMessage({ type: "doneTask", data: doneTaskData });
    }
  }

  document
    .querySelector(".view-container")
    ?.addEventListener("click", doneTask);
})();

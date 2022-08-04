class Header extends Component {
  constructor(props) {
    super();
    console.log(props);
    this.state = {
      theme: props.theme,
      inputif: props.inputif,
      buttonif: props.buttonif,
      placeholder: props.placeholder,
      id: props.id
    };
  }

  render() {
    const inputFrame = createElement("input", {
      type: "text",
      placeholder: this.state.placeholder,
      id: this.state.id
    });
    const buttonFrame = createElement("button", null, "\u6DFB\u52A0");
    var List = [];
    if (this.state.inputif) List.push(inputFrame);
    if (this.state.buttonif) List.push(buttonFrame);
    return createElement("div", {
      class: "header"
    }, createElement("div", {
      class: "logo"
    }, this.state.theme), createElement("form", {
      action: "javascript:;",
      method: "get"
    }, List));
  }

}

class TaskItem extends Component {
  constructor(props) {
    super();
    console.log(props);
    this.state = {
      checked: props.checked,
      index: props.index,
      content: props.content
    };
  }

  render() {
    if (this.state.checked) return createElement("div", {
      class: "todoItem"
    }, createElement("input", {
      type: "checkbox",
      "data-index": this.state.index,
      checked: true
    }), createElement("div", {
      class: "content"
    }, this.state.content), createElement("div", {
      class: "del",
      "data-index": this.state.index
    }, "\u5220\u9664"));else return createElement("div", {
      class: "todoItem"
    }, createElement("input", {
      type: "checkbox",
      "data-index": this.state.index,
      unchecked: true
    }), createElement("div", {
      class: "content"
    }, this.state.content), createElement("div", {
      class: "del",
      "data-index": this.state.index
    }, "\u5220\u9664"));
  }

}

class TaskList extends Component {
  constructor(props) {
    super();
    console.log(props);
    this.state = {
      class: props.class,
      tasksfor: props.tasksfor,
      title: props.title,
      checkif: props.checkif
    };
  }

  render() {
    if (this.state.tasksfor !== undefined) var num = this.state.tasksfor.length;
    var taskList = [];

    for (var i = 0; i < this.state.tasksfor.length; i++) {
      taskList.push(createElement(TaskItem, {
        checked: this.state.checkif,
        index: this.state.tasksfor[i].index,
        content: this.state.tasksfor[i].content
      }));
    }

    return createElement("div", {
      class: this.state.class
    }, createElement("h3", null, createElement("span", {
      class: "title"
    }, this.state.title), createElement("span", {
      class: "num"
    }, num)), createElement("div", {
      class: "list"
    }, taskList));
  }

}

var todoList = [];
var TrueVal = true;
var FalseVal = false;
var tasksTodo = [];
var taskComplete = [];

function renderHtml() {
  $.ajax({
    type: "GET",
    url: "/todoList",
    success: res => {
      console.log("res");
      console.log(res);
      todoList = res;
      console.log(res.length);
      document.getElementById('root').innerHTML = "";
      tasksTodo = [];
      taskComplete = [];

      for (var i = 0; i < todoList.length; i++) {
        var task = {
          content: todoList[i].content,
          index: todoList[i].index
        };

        if (todoList[i].isDone) {
          taskComplete.push(task);
        } else {
          tasksTodo.push(task);
        }
      }

      console.log(todoList);
      console.log(tasksTodo);
      console.log(taskComplete);
      const jsx = createElement("div", null, createElement(Header, {
        theme: "ToDoList",
        inputif: TrueVal,
        buttonif: FalseVal,
        placeholder: "\u8BF7\u8F93\u5165\u5F85\u529E\u4E8B\u9879",
        id: "input"
      }), createElement(TaskList, {
        class: "doing todo",
        tasksfor: tasksTodo,
        title: "\u6B63\u5728\u8FDB\u884C",
        checkif: FalseVal
      }), createElement(TaskList, {
        class: "done todo",
        tasksfor: taskComplete,
        title: "\u8FDB\u884C\u5B8C\u6BD5",
        checkif: TrueVal
      }));
      console.log(jsx);
      render(jsx, document.getElementById('root'));
      flush();
    }
  });
}

var todoList = [];
renderHtml();
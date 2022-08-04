function Header(props) {
  return createElement("h1", {
    style: props.style,
    onClick: () => alert("哼!点击标题做什么?")
  }, props.children);
}

class TimeItem extends Component {
  constructor(props) {
    super();
    this.state = {
      textColor: props.textColor,
      index: props.index,
      timeIf: props.timeif,
      idxIf: props.indexif,
      time: props.time,
      style: props.style,
      children: props.children
    };
  }

  render() {
    return createElement("li", {
      style: this.state.style,
      onClick: () => {
        alert("这是一条记载于" + this.state.time + "的记录");
      }
    }, this.state.idxIf ? this.state.index : '', "\xA0", this.state.timeIf ? this.state.time : '', "\xA0", this.state.children);
  }

}

var getRandomColor = function () {
  return '#' + function (color) {
    return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)]) && color.length == 6 ? color : arguments.callee(color);
  }('');
};

class TimeList extends Component {
  constructor(props) {
    super();
    this.state = {
      timeif: props.timeif,
      indexif: props.indexif,
      time: props.timefor
    };
  }

  render() {
    var list = [];

    for (var i = 0; i < this.state.time.length; i++) {
      list.push(createElement(TimeItem, {
        timeif: this.state.timeif,
        indexif: this.state.indexif,
        time: this.state.time[i].time,
        style: {
          color: this.state.time[i].color
        },
        index: i + 1
      }, "\u8FD9\u662F\u4E00\u4E2A\u65F6\u95F4\u6807\u7B7E"));
    }

    return createElement("ul", {
      style: 'list-style:none'
    }, list);
  }

}

var TimeListS = [];
var timeJudge = false;
var indexJudge = false;

var getRandomColor = function () {
  return '#' + function (color) {
    return (color += '0123456789abcdef'[Math.floor(Math.random() * 16)]) && color.length == 6 ? color : arguments.callee(color);
  }('');
};

var jsx = createElement("div", {
  style: "text-align:center"
}, createElement(Header, {
  style: 'text-align:center'
}, "\u8FD9\u662F\u4E00\u4E2A\u53EF\u4EE5\u70B9\u51FB\u7684\u6807\u9898"), indexJudge ? createElement("input", {
  type: "checkbox",
  checked: true,
  id: "index",
  onClick: "indexChange()"
}) : createElement("input", {
  type: "checkbox",
  id: "index",
  onClick: "indexChange()"
}), createElement("label", null, "\u6807\u7B7E"), createElement("br", null), timeJudge ? createElement("input", {
  type: "checkbox",
  checked: true,
  id: "time",
  onClick: "timeChange()"
}) : createElement("input", {
  type: "checkbox",
  id: "time",
  onClick: "timeChange()"
}), createElement("label", null, "\u65F6\u95F4"), createElement("br", null), createElement("button", {
  onClick: "addTime()"
}, "\u65B0\u589E\u4E00\u6761\u8BB0\u5F55"), createElement(TimeList, {
  timeif: timeJudge,
  indexif: indexJudge,
  timefor: TimeListS
}));
console.log(jsx);

function timeChange() {
  console.log("click");
  if (document.getElementById("time").checked) timeJudge = true;else timeJudge = false;
  console.log(timeJudge);
  flushRender();
}

function indexChange() {
  if (document.getElementById("index").checked) indexJudge = true;else indexJudge = false;
  flushRender();
}

function addTime() {
  document.getElementById('root').innerHTML = "";
  var newtime = {
    time: String(Date()),
    color: getRandomColor()
  };
  TimeListS.push(newtime);
  console.log(newtime);
  console.log(timeJudge);
  flushRender();
}

function flushRender() {
  document.getElementById('root').innerHTML = "";
  var jsx = createElement("div", {
    style: "text-align:center"
  }, createElement(Header, {
    style: 'text-align:center'
  }, "\u8FD9\u662F\u4E00\u4E2A\u53EF\u4EE5\u70B9\u51FB\u7684\u6807\u9898"), indexJudge ? createElement("input", {
    type: "checkbox",
    checked: true,
    id: "index",
    onClick: "indexChange()"
  }) : createElement("input", {
    type: "checkbox",
    id: "index",
    onClick: "indexChange()"
  }), createElement("label", null, "\u6807\u7B7E"), createElement("br", null), timeJudge ? createElement("input", {
    type: "checkbox",
    checked: true,
    id: "time",
    onClick: "timeChange()"
  }) : createElement("input", {
    type: "checkbox",
    id: "time",
    onClick: "timeChange()"
  }), createElement("label", null, "\u65F6\u95F4"), createElement("br", null), createElement("button", {
    onClick: "addTime()"
  }, "\u65B0\u589E\u4E00\u6761\u8BB0\u5F55"), createElement(TimeList, {
    timeif: timeJudge,
    indexif: indexJudge,
    timefor: TimeListS
  }));
  console.log(jsx);
  render(jsx, document.getElementById('root'));
}

render(jsx, document.getElementById('root'));
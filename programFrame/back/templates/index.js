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
        }
    }
    render() {
        const inputFrame = <input type="text" placeholder={this.state.placeholder} id={this.state.id}></input>
        const buttonFrame = <button>添加</button>
        var List = [];
        if (this.state.inputif)
            List.push(inputFrame);
        if (this.state.buttonif)
            List.push(buttonFrame);
        return <div class="header">
               <div class="logo">{ this.state.theme }</div>
               <form action="javascript:;" method="get">
                {List}
               </form>
    </div>
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
        }
    }
    render() {
        if(this.state.checked)
            return <div class="todoItem">
            <input type="checkbox" data-index={this.state.index} checked></input>
                <div class="content">{ this.state.content }</div>
                <div class="del" data-index={ this.state.index }>删除</div>
            </div>
        else
            return <div class="todoItem">
            <input type="checkbox" data-index={this.state.index} unchecked></input>
                <div class="content">{ this.state.content }</div>
                <div class="del" data-index={ this.state.index }>删除</div>
            </div>
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
        }
    }
    render() {
        if (this.state.tasksfor !== undefined)
            var num = this.state.tasksfor.length;
        var taskList = [];
        for (var i = 0; i < this.state.tasksfor.length; i++){
            taskList.push(<TaskItem checked={this.state.checkif} index={this.state.tasksfor[i].index} content={this.state.tasksfor[i].content} />);
        }
        return <div class={this.state.class}>
            <h3><span class="title">{this.state.title}</span><span class="num">{ num }</span></h3>
            <div class="list">
                { taskList }
            </div>
        </div>
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
        url: "http://119.3.169.4:5000/todoList",
        success: (res) => {
            console.log("res");
            console.log(res);
        }
    })
    document.getElementById('root').innerHTML=""
    tasksTodo = []
    taskComplete = []
    for (var i = 0; i < todoList.length; i++){
        var task = {
            content: todoList[i].content,
            index: i
        }
        if (todoList[i].isDone) {
            taskComplete.push(task);
        }
        else {
            tasksTodo.push(task);
        }
    }
    console.log(todoList)
    console.log(tasksTodo)
    console.log(taskComplete)
    const jsx = <div>
            <Header theme="ToDoList" inputif={TrueVal} buttonif={FalseVal} placeholder="请输入待办事项" id="input" />
            <TaskList class="doing todo" tasksfor={tasksTodo} title="正在进行" checkif={FalseVal}/>
            <TaskList class="done todo" tasksfor={taskComplete} title="进行完毕" checkif={TrueVal} />
            </div>
    console.log(jsx);
    render(jsx, document.getElementById('root'));
    flush();
}

var todoList = [];
renderHtml();
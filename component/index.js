function Header(props) {
    return <h1 style={props.style} onClick={()=>alert("哼!点击标题做什么?") }>{props.children}</h1>;
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
        }
    }

    render() {
        
        return <li style={this.state.style} onClick={() => {alert("这是一条记载于"+this.state.time+"的记录")}}>
            {this.state.idxIf ? this.state.index:''}
            &nbsp;
            {this.state.timeIf ? this.state.time:''}
            &nbsp;
            {this.state.children}
        </li>
    }
}
var getRandomColor = function(){    
    return  '#' + (function(color){    
         return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])    
         && (color.length == 6) ?  color : arguments.callee(color);    
    })('');    
 } 
class TimeList extends Component {
    constructor(props) {
        super();
        this.state = {
            timeif: props.timeif,
            indexif: props.indexif,
            time: props.timefor
        }
    }
    render() {
        var list=[];
        for (var i = 0; i < this.state.time.length; i++){
            list.push(<TimeItem timeif={this.state.timeif} indexif={this.state.indexif} time={this.state.time[i].time} style={{color:this.state.time[i].color}} index={i+1}>这是一个时间标签</TimeItem>)
        }
        return <ul style={'list-style:none'}>
            {list}
        </ul>
    }
}
var TimeListS = [];
var timeJudge = false;
var indexJudge = false;

var getRandomColor = function(){    
    return  '#' + (function(color){    
         return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])    
         && (color.length == 6) ?  color : arguments.callee(color);    
    })('');    
 } 

var jsx = <div style={"text-align:center"}>
    <Header style={'text-align:center'}>这是一个可以点击的标题</Header>
                {indexJudge ?<input type="checkbox" checked id="index" onClick="indexChange()" ></input>:<input type="checkbox" id="index" onClick="indexChange()" ></input>}
                <label>标签</label>
                <br/>
                {timeJudge ?<input type="checkbox" checked id="time" onClick="timeChange()" ></input>:<input type="checkbox" id="time" onClick="timeChange()" ></input>}
                <label>时间</label>
                <br/>
                <button onClick="addTime()">新增一条记录</button>
                <TimeList timeif={timeJudge} indexif={indexJudge} timefor={TimeListS}></TimeList>
            </div>
console.log(jsx);

function timeChange() {
    console.log("click")
    if (document.getElementById("time").checked)
        timeJudge = true;
    else
        timeJudge = false;
    console.log(timeJudge);
    flushRender();
}
function indexChange() {
    if (document.getElementById("index").checked)
        indexJudge = true;
    else
        indexJudge = false;
    flushRender();
}
function addTime() {
    document.getElementById('root').innerHTML = "";
    var newtime = { time: String(Date()), color: getRandomColor() };
    TimeListS.push(newtime);
    console.log(newtime);
    console.log(timeJudge);
    flushRender();
}
function flushRender() {
    document.getElementById('root').innerHTML = "";
    var jsx = <div style={"text-align:center"}>
    <Header style={'text-align:center'}>这是一个可以点击的标题</Header>
            {indexJudge ?<input type="checkbox" checked id="index" onClick="indexChange()" ></input>:<input type="checkbox" id="index" onClick="indexChange()" ></input>}
            <label>标签</label>
            <br/>
            {timeJudge ?<input type="checkbox" checked id="time" onClick="timeChange()" ></input>:<input type="checkbox" id="time" onClick="timeChange()" ></input>}
            <label>时间</label>
            <br/>
            <button onClick="addTime()">新增一条记录</button>
            <TimeList timeif={timeJudge} indexif={indexJudge} timefor={TimeListS}></TimeList>
        </div>
    console.log(jsx);
    render(jsx, document.getElementById('root'));
}
render(jsx, document.getElementById('root'));

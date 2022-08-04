# 小程序框架的编写

我是陈志远，在过去的一段时间中，我初步接触到了小程序的框架，该github记录了我在编写该小程序框架的过程中的一些成果以及对编写小程序框架的一些思考。

* [vdom的实现](#1. vdom的实现)
* [双线程 web worker的实现](#2. 双线程 web worker的实现)
* [JSX编译与自定义组件渲染功能的实现](#3. JSX编译与自定义组件渲染功能的实现)
* [最后亿步 合成一个小程序框架](#4. 最后亿步 合成一个小程序框架)
* [下一步的尝试](#5. 下一步的尝试)


#### 1. vdom的实现

[vdom实现](./vdom)

![image-20220804165734806.png](https://img1.imgtp.com/2022/08/04/HyZIYUap.png)

**想要实现vdom就要明白，为什么要使用vdom？**

这主要是因为，JS修改DOM树的代价很大(修改一个元素结点就有可能因为引发DOM树的平衡，从而带来十分大的代价),因此用JS维护一个虚拟DOM树(JS操作内存中的虚拟DOM对象明显迅速很多)，在需要的时候，将vdom diff的部分同步到真实DOM中，并在浏览器中显示出来。

**首先，是vdom的定义：**

本程序对于vdom的定义主要还是采用了json的方式，但是由于有对于onClick类的function函数的定义，因此并非是严格意义的json文件，下述是一个极简的示例([源代码](./vdom/index.html)有点长……)。

```JS
var vdom = {
            type: 'ul',
            props: {
                className: 'list',
                style: 'list-style:none;text-align:center;'
            };
        };
```

vdom的实现与渲染，分成了两种关键的结点进行渲染：

1. 首先是只用文本的TextNode结点

   这种所谓的结点实际上并不是html上的标记结点，其一般仅仅是位于html标签中的文本内容

   ```javascript
   if (isTextVdom(vdom)) {
           return mount(document.createTextNode(vdom));
       }
   ```

2. 另一种则是其他的结点

   这种一般是html标签内容，可以试下对于html中结点的渲染。其渲染的过程主要包含了createElement创建结点，并使用setAttribute来设置结点属性。

   ```javascript
   if (isElementVdom(vdom)) {
   	const dom = mount(document.createElement(vdom.type));
   	if (vdom.children !== undefined)
   		for (const child of vdom.children) {
   			render(child, dom);
   		}
   	if (vdom.props !== undefined)
   		for (const prop in vdom.props) {
   			setAttribute(dom, prop, vdom.props[prop]);
   		}
   	return dom;
   	}
   ```

#### 2. 双线程 web worker的实现2. 双线程 web worker的实现

[双线程web worker实现](./webWorker)

![image-20220804171801142.png](https://img1.imgtp.com/2022/08/04/TcuT5dZK.png)

测试方法：需要使用http方法加载，所以最简单的方法就是使用VSCode 的Live sharer插件

双线程实现的意义：小程序使用双线程可以实现GUI渲染线程与JS引擎执行线程。这样可以保证不会因为JS出现错误而阻塞GUI渲染。

首先，是GUI渲染进程(主进程)会使用new Worker来创建web worker，同时在web worker中使用message传递来传递信息。

**创建web worker**

```javascript
const myworker=new Worker('worker.js');
```

**主线程传递信息**

```javascript
myworker.onmessage = function(e){
	vdom=e.data;
	document.getElementById('view').innerHTML = "";
	render(vdom, document.getElementById('view'));
}
```

**从进程传递信息**

```javascript
onmessage = function(e) {
    vdom = e.data;
    vdom.children.push(newadd);
    this.postMessage(vdom);
}
```

#### 3. JSX编译与自定义组件渲染功能的实现

[JSX编译与自定义组件渲染功能的实现](./component)

<img src="https://img1.imgtp.com/2022/08/04/K6ReKklC.png" alt="image-20220804185017015.png" style="zoom:50%;" />

**虚拟DOM树渲染升级**

由于在本阶段需要试下对于自定义组件的升级操作，因此需要在vdom的渲染上添加一些关于自定义组件结点的部分上去(因此我改写了createElement函数)

```javascript
if (isComponentVdom(vdom)) {
    const props = Object.assign({}, vdom.props, {
        children: vdom.children
    });

    if (Component.isPrototypeOf(vdom.type)) {
        const instance = new vdom.type(props);
        instance.componentWillMount();
        const componentVdom = instance.render();
        instance.dom = render(componentVdom, parent);
        instance.componentDidMount();
        return instance.dom;
    } else {
        const componentVdom = vdom.type(props);
        return render(componentVdom, parent);
    }
}
```

**条件编译的实现**

当然，在本题目中，实际上一个十分重要的点就在于对于类似v-if与v-for等操作的实现。

首先是v-if的实现，这个的实现，实际上主要依靠的还是JSX语句中的三元表达式，如下述部分就是本题目中对于时间标签前具体时间信息是否显示的条件控制指令。以及渲染出的checkbox前是否选中的选择。

```javascript
{this.state.timeIf ? this.state.time:''}
```

```javascript
{indexJudge ?<input type="checkbox" checked id="index" onClick="indexChange()" ></input>
:<input type="checkbox" id="index" onClick="indexChange()" ></input>}
```

其次，是v-for功能的实现，这个的实现是借助JSX中类似JS的for循环控制来实现的，如下，就是for循环渲染有很多时间标签的时间列表。

```javascript
for (var i = 0; i < this.state.time.length; i++){
            list.push(<TimeItem timeif={this.state.timeif} indexif={this.state.indexif} time=		{this.state.time[i].time} style={{color:this.state.time[i].color}} index={i+1}>这是一个时间标签</TimeItem>)
      		}
            return <ul style={'list-style:none'}>
            	{list}
            </ul>
```

**自定义组件渲染的实现**

最后是自定义的组件渲染。

自定义组件的渲染，实际上我包含着两个重要的部分，即组件的构成(即组件各种参数的输入接收)与组件的渲染，下述展示的就是时间项目类的渲染(其重要的两个操作就是constructor与render)

```javascript
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
```

当然除了构造类之外，构造一个函数也可以解决上述自定义组件的问题，如自定义的头部组件。

```javascript
function Header(props) {
    return <h1 style={props.style} onClick={()=>alert("哼!点击标题做什么?") }>{props.children}</h1>;
}
```

#### 4. 最后亿步 合成一个小程序框架

[最终的小程序框架](./programFrame)  [项目在线演示](http://119.3.169.4:5000/)

<img src="https://img1.imgtp.com/2022/08/04/RySGmcJm.png" alt="image-20220804190746924.png" style="zoom:67%;" />

**小程序框架的功能：**

1. **小程序支持http请求完成项目运行**

   该框架内部引用了jquery库，因此支持使用ajax方法发送http请求完成前后端的对接。

   <img src="https://img1.imgtp.com/2022/08/04/obDCUM3m.png" alt="image-20220804192708238.png" />

2. **小程序建立了基于vdom的前端渲染框架**

   该小程序通过编写完整的render.js内容，完成了一个基于vdom的前端渲染框架。

   ![image-20220804192734175.png](https://img1.imgtp.com/2022/08/04/ePHMSI0f.png)

3. **小程序实现了web worker双线程作业**

   该框架实现了一个GUI线程(渲染层)与一个JS引擎线程(逻辑层)分离的双线程操作。

   在渲染层，程序主要通过运行JSX编译产生的代码来完成整个程序页面的渲染，而同时，逻辑层则会运行JS代码，完成与后台的交互、事项数据的计算等任务。

   当然，有个有意思的地方在于建立起的worker进程实际上不能访问DOM，而DOM树是jQuery库在初始化时所需要的。因此，就需要我们的worker进程建立一个虚假的DOM树来欺骗JQuery，这个可以通过**JQuery.nodom.js**来实现。

   ![image-20220804192805839.png](https://img1.imgtp.com/2022/08/04/X6tCsVg7.png)

4. **小程序实现了JSX编译与自定义组件的编译**

   该框架在vdom的基础上建立了完成的JSX编译体系，实现了对自定义的DSL语言的编译。

   并自定义了包括Header,TaskList(任务列表),TaskItem(任务项)等多种的组件的自定义功能。

**小程序的功能与亮点：**

该小程序作为一个完整的(前后端兼具)小程序，其后端的主要框架是Flask框架，而前端的框架则是我自写的框架。

其主要的功能点在于：

1. 查看所有待办事项(包括已完成与未完成)，且保证多端登陆时数据的一致性。
2. 新建待办事项(输入事项内容后点击回车)
3. 完成实现与重新开始事项(控制checkbox)

该小程序实际上只是小程序框架的一个Demo而已，该小程序框架实际上同样可以进行别的程序的编写。

**小程序的运行与调试：**

云服务器形式：访问[http://119.3.169.4:5000/](http://119.3.169.4:5000/)即可

本地形式：clone programFrame文件夹中代码，在back/templates文件夹中npm install+npm run dev之后使用python运行app.py即可。

#### 5. 下一步的尝试

该小程序框架我想已经是基本符合要求的了，但是，它距离我预期目标还有这一段距离……这种距离主要来源与当前的框架是运行了浏览其上的一个框架，与其说它是一个小程序框架不如说他是一个接近小程序处理方式浏览器前端框架。而我想要的是一个真正的小程序框架——一个运行在小程序平台上的框架。

对此，我进行了很多的尝试——并最终决定，仿照mpvue项目那样，将vue框架建立起合适的JSX编译体系，实现将vue框架语言运行在字节小程序平台的目的。奈何，项目很大，而且我能力有限，精力有限，很难在这一周的时间中完成这个任务……这算的上是我本次在字节跳动实训营的一个最大的遗憾吧。但是我会努力下去……接下来的时间中，我会对此进行不断的尝试与努力。
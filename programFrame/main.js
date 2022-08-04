const myworker = new Worker("/static/worker.js")
myworker.onmessage = function (e) {
    console.log(e.data);
    renderHtml();
}
function flush() {
    var doingListDiv = document.querySelector(".doing .list");
    // 获取done List对象
    var doneListDiv = document.querySelector(".done .list");
    // 获取输入框对象
    var inputDom = document.querySelector("#input");
    // 获取main对象
    var mainDiv = document.querySelector(".main");
    console.log(doneListDiv);
    // 监听输入按键事件
    inputDom.onkeydown = function (event) {
        // 当按下回车键时候，获取输入框内容，并且生成未完成列表
        if (event.key == "Enter") {
            console.log(event);
            // 获取输入框内容
            var value = inputDom.value;
            var objItem = {
                content: value,
                isDone: false
            }
            todoList.push(objItem);
            // console.log(todoList);
            myworker.postMessage(["add", value]);
            inputDom.value = "";
        }
    }


    // js委托doingListDiv监听发生修改事件，根据索引重新渲染
    doingListDiv.onchange = function (e) {
        console.log(e);
        // 通过事件对象找到Dom对象，获取索引值
        var index = parseInt(e.target.dataset.index);
        myworker.postMessage(["complete", index]);
    }

    // js委托doneListDiv监听发生修改事件，根据索引重新渲染
    doneListDiv.onchange = function (e) {
        console.log(e);
        // 通过事件对象找到Dom对象，获取索引值
        var index = parseInt(e.target.dataset.index);
        myworker.postMessage(["uncomplete", index]);
    }

    // 删除todoItem
    mainDiv.onclick = function (e) {
        if (e.target.className == "del") {
            // console.log(e);
            var index = parseInt(e.target.dataset.index);
            myworker.postMessage(["del", index]);
        }
    }
}
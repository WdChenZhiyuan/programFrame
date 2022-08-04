// worker.js
onmessage = function(e) {
    console.log('Worker: Message received from main script');
    vdom = e.data;
    console.log(vdom);
    var newadd = {
        type: 'li',
        props: {
            className: 'item'
        },
        children: [
            String(Date()) + '新增结点'
        ]
    };
    //将新增的vdom结点插入到数组之中
    vdom.children.push(newadd);
    this.postMessage(vdom);
}
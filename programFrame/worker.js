importScripts('/static/jquery.nodom.js')
onmessage = function(e) {
    console.log('Worker: Message received from main script');
    type = e.data[0];
    if (type === "add")
    {
        content = e.data[1];
        data = {};
        data["content"] = content;
        console.log(data);
        $.ajax({
            type: 'POST',
            url: "/add",
            contentType:'application/json',
            data: JSON.stringify(data),
            dataType:"json",
            success: ()=>{
                this.postMessage("success");
            }
        })
    }
    else if (type == "del") {
        index = e.data[1];
        data = {};
        data["index"] = index;
        console.log(data);
        $.ajax({
            type: 'POST',
            url: "/delete",
            contentType:'application/json',
            data: JSON.stringify(data),
            dataType:"json",
            success: ()=>{
                this.postMessage("success");
            }
        })
    }
    else if (type == "complete") {
        index = e.data[1];
        data = {};
        data["index"] = index;
        console.log(data);
        $.ajax({
            type: 'POST',
            url: "/complete",
            contentType:'application/json',
            data: JSON.stringify(data),
            dataType:"json",
            success: ()=>{
                this.postMessage("success");
            }
        })
    }
    else if (type == "uncomplete") {
        index = e.data[1];
        data = {};
        data["index"] = index;
        console.log(data);
        $.ajax({
            type: 'POST',
            url: "/uncomplete",
            contentType:'application/json',
            data: JSON.stringify(data),
            dataType:"json",
            success: ()=>{
                this.postMessage("success");
            }
        })
    }
}

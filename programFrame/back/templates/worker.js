importScripts('jquery.nodom.js', 'jquery-3.5.1.min.js')
onmessage = function(e) {
    console.log('Worker: Message received from main script');
    type = e.data[0];
    if (type === "add")
    {
        content = e.data[1];
        $.ajax({
            type: 'POST',
            url: "http://119.3.169.4:5000/add",
            data: {
                content:content
            },
            success: function () {
                this.postMessage("success");
            }
        })
    }
}
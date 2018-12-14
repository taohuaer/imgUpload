var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());

app.get('/', function(req, res) {
    res.send("hua hello")
})
app.post('/uploadimg', function(req, res) {
        console.log(req)
        res.send({
            state: 200,
            status: 'ok'
        })
    })
    // 监听3000端口
app.listen(3456)
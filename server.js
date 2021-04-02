const Koa = require('koa');
const serve = require('koa-static');
const render = require('koa-ejs');
const path = require('path');
const chat_routes = require('./routes/chat_room');

const server = new Koa();
const httpServer = require('http').createServer(server.callback());

render(server, {
    root: path.join(__dirname, 'views'),
    layout: '',
    viewExt: 'html',
    cache: false,
    debug: false
});

server.use(serve('.'));
server.use(chat_routes.routes());
server.use(chat_routes.allowedMethods());

httpServer.listen(4000, () => {
    console.log('Client 1 running on port 4000');
})
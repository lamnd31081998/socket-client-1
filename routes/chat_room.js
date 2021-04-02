const Router = require('koa-router');

const router = new Router();

router.get('/chat-room', async(ctx) => {
    await ctx.render('index');
})

module.exports = router
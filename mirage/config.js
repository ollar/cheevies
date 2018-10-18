export default function() {
    // These comments are here to help you get started. Feel free to delete them.
    /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */
    // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
    // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
    // this.timing = 400;      // delay for each request, automatically set to 0 during testing
    /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.3.x/shorthands/
  */
    // const protocol = location.protocol.match(/^https/) ? 'wss' : 'ws';
    // const url = `${protocol}://${
    //     location.host
    // }/api/admin/websocket?access_token=${ACCESS_TOKEN}&vsn=2.0.0`;
    // const wss = new Server(url);
    // wss.on('connection', ws => {
    //     ws.on('message', msg => {
    //         adminHandler.absinthe(ws, this.db, msg);
    //     });
    //     // TODO: teardown subscription if socket dies
    // });
    // const origShutdown = this.shutdown;
    // this.shutdown = () => {
    //     wss.stop();
    //     origShutdown.call(this);
    // };

    this.passthrough('https://securetoken.googleapis.com/**');
    this.passthrough('https://www.googleapis.com/identitytoolkit/**');
}

// 7839456573

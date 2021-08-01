# emit-listenner

emit-listenner is a slim EventEmitter implementation based on ESM.

NOTE: Please ensure your nodejs version is great than **12.17**!


## Install

```sh
npm install --save emit-listenner
```

## Usage

### Normal usage

```js
// foo.js
import emitListenner from 'emit-listenner'
const event = new emitListenner.EventEmitter()
event.addListenner("eventname", callback);        // register a listenner
event.emit("eventname", {
    a: 'some args'
});  // emit event
```
`emit-listenner` is a module based on ES-module, if you want use it in Nodejs with CommonJS pattern, you can use dynamic `import` expression that is a nodejs new feature that used to import ES module in Commonjs module. But if you do this, make sure your nodejs version is great than v12.13!
```js
// foo.cjs
(async ()=>{
    const { EventEmitter } = await import('emit-listenner')
    const ev = new EventEmitter()
    ev.addListenners([
        {
            name: "change",
            handler: args=>console.log(args),
            once: true
        }
    ])
})
``` 
## Documentation


### EventEmitter class

#### EventEmitter#addListenner(name, handler)

Register a listenner for certain specified event, when event trigged them will be called orderly.

#### EventEmitter#addListenners(events)

Register multiple events at once. the `events` is an array of structure like below:
```js
{
    name: string;           // event name
    handler: args=>any;     // it will be called when event is triggered
    once?: boolean;         // same as `EventEmitter#once`, default false
}
```

#### EventEmitter#off(name, handler?)

Alias of `EventEmitter#removeListenner`

#### EventEmitter#on(name, handler)

Alias of `EventEmitter#addListenner`

#### EventEmitter#once(name, handler)

Register a listenner for certain specified event, but just only effects one time.  

**Note**: Register a same event continuously for the same time, and the latter will overwrite the former

#### EventEmitter#removeListenner(name, handler?)

Remove specified listenner for the specified event, but will remove all listenners of `name` event when handler is not set.

#### EventEmitter#removeAllListenners()

Remove all registered events and its listenners.

#### EventEmitter#hasListenner(name, handler)



#### EventEmitter#listennerCount(name)

Get count of listenners of specified event.

#### EventEmitter#emit(name, args)

Emit a event with optional arguments.

#### EventEmitter#trigger(name, args)

alias of `EventEmitter#emit`.

## License

MIT.
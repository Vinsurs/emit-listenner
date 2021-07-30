import { IListenner, IListennerEntry, IListennerMap, handlerArg } from '../types/index'
import SparkMD5 from 'spark-md5'
function getKey(str: string, prefix = 'm'): string {
    return prefix + SparkMD5.hash(str)
}
function getListennerEntry(key: string, handler: IListenner, once = false):IListennerEntry {
    return {
        key,
        handler,
        once
    }
} 
function getDetailFromArgs(args: any): handlerArg {
    return {
        detail: args
    }
}
/**
 * @class emitListenner.EventEmitter
 */
class EventEmitter {
    #listennersMap: IListennerMap
    constructor() {
        this.#listennersMap = new Map<string, IListennerEntry[]>()
    }
    /**
     * register a listenner for certain specified event, when event trigged them will be called orderly
     * @param name event name
     * @param handler it will be called when event is triggered
     */
    addListenner(name: string, handler: IListenner): void {
        const eventKey = getKey(name)
        const handlerStr = handler.toString()
        const handlerKey = getKey(handlerStr)
        const hasContained = this.hasListenner(name, handler)
        if(hasContained) return ;
        const entries = this.#listennersMap.get(eventKey)||[]
        const listennerEntry = getListennerEntry(handlerKey, handler)
        entries.push(listennerEntry)
        this.#listennersMap.set(eventKey, entries)
    }
    /**
     * Register multiple events at once
     * @param events event entry array
     * - `events[number]#name` event name
     * - `events[number]#handler` it will be called when event is triggered
     * - `events[number]#handler` same as `emitListenner.EventEmitter#once`
     */
    addListenners(events: {name: string, handler: IListenner, once?: boolean}[]): void {
        events.forEach(ev=>{
            if(ev.once) {
                this.once(ev.name, ev.handler)
            } else {
                this.addListenner(ev.name, ev.handler)
            }
        })
    }
    /**
     * @alias EventEmitter#addListenner
     */
    on(name: string, handler: IListenner): void {
        this.addListenner(name, handler)
    }
    /**
     * register a listenner for certain specified event, but just only effects one time     
     * **Note**: Register a same event continuously for the same time, and the latter will overwrite the former
     * @alias EventEmitter#addListenner
     */
    once(name: string, handler: IListenner): void {
        const eventKey = getKey(name)
        const handlerKey = getKey(handler.toString())
        const listennerEntry = getListennerEntry(handlerKey, handler, true)
        this.#listennersMap.set(eventKey, [listennerEntry])
    }
    removeListenner(name: string, handler?: IListenner):void {
        if(!this.listennerCount(name)) return ;
        const eventKey = getKey(name)
        if(!handler) {
            this.#listennersMap.delete(eventKey)
        } else {
            const handlerKey = getKey(handler.toString())
            const entries = this.#listennersMap.get(eventKey)
            const findIndex = entries.findIndex(entry=>entry.key===handlerKey)
            if(findIndex===-1) return ;
            entries.splice(findIndex, 1)
            this.#listennersMap.set(eventKey, entries)
        }
    }
    /**
     * remove all registered events and its listenners
     */
    removeAllListenners():void {
        this.#listennersMap.clear()
    }
    hasListenner(name: string, handler: IListenner): boolean {
        const eventKey = getKey(name)
        const entries = this.#listennersMap.get(eventKey)
        if(!entries || entries.length===0) return false;
        const handlerKey = getKey(handler.toString())
        return entries.findIndex(entry=>entry.key===handlerKey)!==-1
    }
    /**
     * get count of listenners of specified event 
     * @param name event name
     */
    listennerCount(name: string): number {
        const entries = this.#listennersMap.get(getKey(name))||[]
        return entries.length
    }
    /**
     * emit a event with optional arguments
     * @param name event name
     * @param args arguments to be passed to listenner
     */
    emit(name: string, args: any): void {
        if(this.listennerCount(name)===0) {
            throw new Error(`The event '${name}' had been not registered, please sure register it before emitting it.`)
        }
        const eventKey = getKey(name)
        const entries = this.#listennersMap.get(eventKey)
        entries.forEach(entry=>{
            entry.handler(getDetailFromArgs(args))
            if(entry.once) {
                this.#listennersMap.delete(eventKey)
            }
        })
    }
    /**
     * @alias EventEmitter#emit
     */
    trigger(name: string, args: any): void {
        this.emit(name, args)
    }
}
export default {
    EventEmitter
}
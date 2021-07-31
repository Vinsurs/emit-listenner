export interface handlerArg {
    detail: any;
    /**event type */
    type: string;
    timestamp: number;
}
export type IListennerEntry = {
    /**handler key */
    key: string;
    handler: IListenner;
    once: boolean;
}
export type IListennerMap = Map<string, IListennerEntry[]>;
export interface IListenner {
    (ev: handlerArg): any;
}
declare namespace emitListenner {
    export class EventEmitter {
        /**
         * @private
         */
        #listennersMap: IListennerMap;
        /**
         * register a listenner for certain specified event, when event trigged them will be called orderly
         * @param name event name
         * @param handler it will be called when event is triggered
         */
        addListenner(name: string, handler: IListenner): void;
        /**
         * @alias EventEmitter#addListenner
         */
        on(name: string, handler: IListenner): void;
        /**
         * register a listenner for certain specified event, but just only effects one time
         * @alias EventEmitter#addListenner
         */
        once(name: string, handler: IListenner): void;
        removeListenner(name: string, handler?: IListenner):void;
        /**
         * remove all registered events and its listenners
         */
        removeAllListenners():void;
        hasListenner(name: string, handler?: IListenner): boolean;
        /**
         * get count of listenners of specified event 
         * @param name event name
         */
        listennerCount(name: string): number;
        /**
         * emit a event with optional arguments
         * @param name event name
         * @param args arguments to be passed to listenner
         */
        emit(name: string, args: any): void;
        /**
         * @alias EventEmitter#emit
         */
        trigger(name: string, args: any): void;
    }
}
export default emitListenner;
export const EventEmitter:emitListenner.EventEmitter;
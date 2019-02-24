import CozalEvent, { CozalEventType } from "./cozal-event";

export default class CozalInputEvent implements CozalEvent {
    readonly type = CozalEventType.Input;
    readonly time: number;
    readonly priority = 0;
    readonly key: string;
    constructor(time: number, key: string) {
        this.time = time;
        this.key = key;
    }
}
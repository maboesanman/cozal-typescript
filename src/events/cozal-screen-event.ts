import CozalEvent, { CozalEventType } from "./cozal-event"

export default interface CozalScreenEvent extends CozalEvent {
    readonly type: CozalEventType.Screen
}
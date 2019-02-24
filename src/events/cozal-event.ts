export default interface CozalEvent {
    readonly type: CozalEventType;
    readonly time: number;
    readonly priority?: number;
}

export enum CozalEventType {
    Input,
    PropsChange,
    Screen
}
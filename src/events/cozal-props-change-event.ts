import CozalEvent, { CozalEventType } from "./cozal-event";

export default class CozalPropsChangeEvent<Props> implements CozalEvent{
    readonly type = CozalEventType.PropsChange;
    readonly time: number;
    readonly priority = 0;
    readonly oldProps: Readonly<Props>;
    readonly newProps: Readonly<Props>;
    constructor(time: number, oldProps: Props, newProps: Props) {
        this.time = time;
        this.oldProps = oldProps;
        this.newProps = newProps;
    }
}
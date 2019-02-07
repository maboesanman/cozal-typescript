import CozalEvent from './cozal-event';
import CozalSoundCall from "./cozal-sound-call";
import CozalRenderCall from "./cozal-render-call";
import PriorityQueue from './priority-queue';

abstract class CozalScreen<State, Props> {
    private State: State;
    private Events: PriorityQueue<CozalEvent>;
    public constructor(props: Props) {
        const {state, events, soundCalls, renderCalls} = this.Init(props);
        this.State = state;
        this.Events = new PriorityQueue<CozalEvent>("time").insertRange(events);
        this.BridgeSoundCalls(soundCalls);
        this.BridgeRenderCalls(renderCalls);
    }

    //#region User Supplied Functions
    protected abstract Init(props: Props): {
        state: State;
        events: CozalEvent[];
        soundCalls: CozalSoundCall[];
        renderCalls: CozalRenderCall[];
    }

    protected abstract Update(state: State, event: CozalEvent, currentTimeMilliseconds: number): {
        state: State;
        events: CozalEvent[];
        soundCalls: CozalSoundCall[];
    }
    
    protected abstract Render(state: State, currentTimeMilliseconds: number): {
        renderCalls: CozalRenderCall[];
    }
    //#endregion

    private RunUpdate(time: number): void {
        const allSoundCalls: CozalSoundCall[] = [];
        while(this.Events.peek() != undefined && this.Events.peek()!.time <= time) {
            const {state, events, soundCalls} = this.Update(this.State, this.Events.peek()!, time);
            this.State = state;
            this.Events = this.Events.insertRange(events);
            allSoundCalls.concat(soundCalls);
        }
        this.BridgeSoundCalls(allSoundCalls);
    }

    private RunRender(time: number): void {
        const {renderCalls} = this.Render(this.State, time);
        this.BridgeRenderCalls(renderCalls);
    }

    private BridgeSoundCalls(soundCalls: CozalSoundCall[]) {
        console.log(soundCalls);
    }
    private BridgeRenderCalls(renderCalls: CozalRenderCall[]) {
        console.log(renderCalls);
    }
}

export default CozalScreen;
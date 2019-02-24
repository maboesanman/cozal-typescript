import CozalEvent, { CozalEventType } from './events/cozal-event';
import CozalSoundCall from "./cozal-sound-call";
import CozalRenderCall from "./cozal-render-call";
import PriorityQueue from './utilities/priority-queue';
import CozalInputEvent from './events/cozal-input-event';
import { DeepReadonly } from "./utilities/type-utilities";
import CozalPropsChangeEvent from './events/cozal-props-change-event';
import CozalScreenEvent from './events/cozal-screen-event';

abstract class CozalScreen<
    Props = any,
    State = any,
    CustomEvent extends CozalScreenEvent = CozalScreenEvent
> {
    private Events: PriorityQueue<CustomEvent | CozalInputEvent | CozalPropsChangeEvent<Props>>;
    private State?: DeepReadonly<State>;

    /**
     * Creates an uninitialized CozalScreen.
     */
    public constructor() {
        this.Events = new PriorityQueue<CustomEvent | CozalInputEvent | CozalPropsChangeEvent<Props>>(
            "time",
            ["priority", "descending"]
        );
    }

    //#region User Supplied Functions

    /**
     * Initialize the screen from the given props object.
     * this will run at the beginning
     * when input is recieved out of order.
     * @param state The State to initialize rendering and sound from
     */
    protected abstract Init(props: DeepReadonly<Props>): {
        /** The initial state */
        state: State;
        /** The initial events */
        events: CustomEvent[];
        /** A collection of sound calls */
        soundCalls: CozalSoundCall[];
        /** A collection of render calls */
        renderCalls: CozalRenderCall[];
    };
    
    protected abstract HandlePropsChangeEvent(state: DeepReadonly<State>, event: CozalPropsChangeEvent<Props>): {
        /** The new screen State */
        state: State;
        /** A collection of new screen-specific events */
        events: CustomEvent[];
        /** A collection of sound calls */
        soundCalls: CozalSoundCall[];
        /** A collection of render calls */
        renderCalls: CozalRenderCall[];
    };
    /**
     * Initialize the screen with the registered props.
     * @param state a readonly copy of the event state.
     * @param event the event to handle
     */
    protected abstract HandleCustomEvent(state: DeepReadonly<State>, event: CustomEvent): {
        /** The new screen State */
        state: State;
        /** A collection of new screen-specific events */
        events: CustomEvent[];
        /** A collection of sound calls */
        soundCalls: CozalSoundCall[];
        /** A collection of render calls */
        renderCalls: CozalRenderCall[];
    };
    protected abstract HandleInputEvent(state: DeepReadonly<State>, event: CozalInputEvent): {
        /** The new screen State */
        state: State;
        /** A collection of new screen-specific events */
        events: CustomEvent[];
        /** A collection of sound calls */
        soundCalls: CozalSoundCall[];
        /** A collection of render calls */
        renderCalls: CozalRenderCall[];
    };

    private HandleEvent(state: DeepReadonly<State>, event: CustomEvent | CozalInputEvent | CozalPropsChangeEvent<Props>): {
        state: State;
        events: CustomEvent[];
        soundCalls: CozalSoundCall[];
        renderCalls: CozalRenderCall[];
    } {
        switch (event.type) {
            case CozalEventType.Input:
                return this.HandleInputEvent(state, event);
            case CozalEventType.PropsChange:
                return this.HandlePropsChangeEvent(state, event);
            case CozalEventType.Screen:
                return this.HandleCustomEvent(state, event);
        }
    }
    /**
     * Initialize the screen with the registered props.
     * @param event the input event which will be either handled, passed, or both.
     */
    protected abstract ShouldHandleInputEvent(event: CozalInputEvent): "handle" | "pass" | "both"
    //#endregion

    public AddInputEvents(events: CozalInputEvent[]): CozalInputEvent[] {
        const handle: CozalInputEvent[] = [];
        const skip: CozalInputEvent[] = [];
        events.forEach(event => {
            switch(this.ShouldHandleInputEvent(event)) {
                case "handle":
                    handle.push(event);
                    break;
                case "pass":
                    skip.push(event);
                    break;
                case "both":
                    handle.push(event);
                    skip.push(event);
                    break;
            }
        });
        this.Events = this.Events.insertRange(handle);
        return skip;
    }

    public RunInit(props: Props): {
        soundCalls: CozalSoundCall[];
        renderCalls: CozalRenderCall[];
    } {

        const {state, events, soundCalls, renderCalls} = this.Init(props as DeepReadonly<Props>);
        this.State = {...state} as DeepReadonly<State>;
        this.Events = this.Events.insertRange(events);
        return {
            soundCalls,
            renderCalls,
        };
    }

    public RunUpdate(time: number): {
        soundCalls: CozalSoundCall[],
        renderCalls: CozalRenderCall[],
    } {
        if(this.State === undefined)
            return { soundCalls: [], renderCalls: [] };

        const soundCalls: CozalSoundCall[] = [];
        const renderCalls: CozalRenderCall[] = [];
        while(true) {
            const event = this.Events.peek();
            if (event === undefined)
                break;
            if(event.time > time)
                break;
            
            const eventResult = this.HandleEvent({ ...this.State }, event)
            this.State = eventResult.state as DeepReadonly<State>;
            this.Events = this.Events.insertRange(eventResult.events);
            soundCalls.concat(eventResult.soundCalls);
            renderCalls.concat(eventResult.renderCalls);
        }
        return { soundCalls, renderCalls }
    }
}

export default CozalScreen;
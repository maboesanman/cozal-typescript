import CozalScreen from "./cozal-screen";
import CozalScreenEvent from "./events/cozal-screen-event";
import CozalRenderCall from "./cozal-render-call";
import CozalSoundCall from "./cozal-sound-call";
import CozalInputEvent from "./events/cozal-input-event";
import { DeepReadonly } from "./utilities/type-utilities";
import { CozalEventType } from "./events/cozal-event";

interface State {
    count: number;
}
interface Props {
    startingCount: number;
}
interface TickEvent extends CozalScreenEvent { }

class MyScreen extends CozalScreen<Props, State, TickEvent> {
    protected Init(props: DeepReadonly<Props>): {
        state: State;
        events: TickEvent[];
        soundCalls: CozalSoundCall[];
        renderCalls: CozalRenderCall[];
    } {
        const startingTickEvent: TickEvent = {
            type: CozalEventType.Screen,
            time: 0,
        }

        return {
            state: { count: 0 },
            events: [startingTickEvent],
            soundCalls: [],
            renderCalls: [],
        }
    }
    protected HandlePropsChangeEvent(state: { readonly count: number; }, event: import("/Users/mason/Projects/cozal-typescript/src/events/cozal-props-change-event").default<Props>): { state: State; events: TickEvent[]; soundCalls: CozalSoundCall[]; renderCalls: CozalRenderCall[]; } {
        throw new Error("Method not implemented.");
    }
    protected HandleCustomEvent(state: { readonly count: number; }, event: TickEvent): { state: State; events: TickEvent[]; soundCalls: CozalSoundCall[]; renderCalls: CozalRenderCall[]; } {
        throw new Error("Method not implemented.");
    }
    protected HandleInputEvent(state: { readonly count: number; }, event: CozalInputEvent): { state: State; events: TickEvent[]; soundCalls: CozalSoundCall[]; renderCalls: CozalRenderCall[]; } {
        throw new Error("Method not implemented.");
    }


    protected Update(state: DeepReadonly<State>, event: TickEvent | CozalInputEvent, currentTimeMilliseconds: number): {
        state: State;
        events: TickEvent[];
        soundCalls: CozalSoundCall[];
    } {
        return {
            state: {
                ...state,
                count: state.count + 1,
            },
            events: [{
                type: CozalEventType.Screen,
                time: event.time + 1000,
            }],
            soundCalls: [],
        }
    }

    protected Render(state: DeepReadonly<State>, currentTimeMilliseconds: number): {
        renderCalls: CozalRenderCall[];
    } {
        return {
            renderCalls: [],
        }
    }

    protected ShouldHandleInputEvent(event: CozalInputEvent): "handle" | "pass" | "both" {
        return "pass";
    }
}

export default MyScreen;
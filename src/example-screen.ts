import CozalScreen from "./cozal-screen";
import CozalEvent from "./cozal-event";
import CozalRenderCall from "./cozal-render-call";
import CozalSoundCall from "./cozal-sound-call";

interface MyState {
    score: number;
}

class MyScreen extends CozalScreen<MyState, any> {
    protected Init(props: any): {
        state: MyState;
        events: CozalEvent[];
        soundCalls: CozalSoundCall[];
        renderCalls: CozalRenderCall[];
    } {
        return {
            state: { score: 0 },
            events: [],
            soundCalls: [],
            renderCalls: [],
        }
    }

    protected Update(state: MyState, event: CozalEvent, currentTimeMilliseconds: number): {
        state: MyState;
        events: CozalEvent[];
        soundCalls: CozalSoundCall[];
    } {
        return {
            state: { score: state.score + 1 },
            events: [],
            soundCalls: [],
        }
    }

    protected Render(state: MyState, currentTimeMilliseconds: number): {
        renderCalls: CozalRenderCall[];
    } {
        return {
            renderCalls: [],
        }
    }
}

export default MyScreen;
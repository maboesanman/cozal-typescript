import CozalScreen from "./cozal-screen";
import CozalInputEvent from "./events/cozal-input-event";
import CozalSoundCall from "./cozal-sound-call";
import CozalRenderCall from "./cozal-render-call";

interface ScreenInstance {
    screen: CozalScreen;
    startTime: number;
    zIndex: number;
}

export default class CozalScreenCollection {
    private Screens: ScreenInstance[] = [];

    public RegisterScreen<T extends CozalScreen>(screen: T, props: (T extends CozalScreen<infer P> ? P : never), zIndex: number, currentTime: number) {
        screen.RunInit({...props});
        this.Screens.push({
            screen,
            startTime: currentTime,
            zIndex
        });
    }

    public AddInput(events: CozalInputEvent[]) {
        let currentEvents = events;
        const screens = this.Screens;
        screens.sort(x => x.zIndex);
        screens.forEach(screenInstance => {
            currentEvents = screenInstance.screen.AddInputEvents(currentEvents);
        });
    }

    private Update(currentTime: number) {
        const soundCalls: CozalSoundCall[] = [];
        const renderCalls: CozalRenderCall[] = [];
        const screens = this.Screens;
        screens.sort();
        screens.forEach(screenInstance => {
            const calls = screenInstance.screen.RunUpdate(currentTime - screenInstance.startTime);
            soundCalls.concat(calls.soundCalls);
            renderCalls.concat(calls.renderCalls);
        });
        this.BridgeSoundCalls(soundCalls);
        this.BridgeRenderCalls(renderCalls);
    }

    private BridgeSoundCalls(soundCalls: CozalSoundCall[]) {
        console.log(soundCalls);
    }

    private BridgeRenderCalls(renderCalls: CozalRenderCall[]) {
        console.log(renderCalls);
    }
}
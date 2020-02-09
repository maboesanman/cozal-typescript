import { Immutable } from "./utilities/type-utilities";
import PriorityQueue from "./utilities/priority-queue";
import Stack from "./utilities/stack";

// InternalEvents are sorted by time, then by sort, then by id.
interface InternalEvent extends LogicEvent {
    id: number,
}

interface LogicEvent {
    time: number;
    sort?: number;
}

// this is the logic of your game
interface LogicContext {
    setState(partialState: Immutable): Immutable;
    // added and removed events must sort later than the event currently being handled (no time traveling).
    addEvent(event: any): number; // returns event id
    removeEvent(eventID: number): void;
}

interface LogicEventHandlerContext extends LogicContext {
    state: Immutable,
}


function initializeLogic(
    name: string,
    initFn: (context: LogicContext) => (context: LogicEventHandlerContext) => void,
): void {

}

// this is the logic of Cozal's real time interpretation of your context.
// this includes things like declarative rendering and hitsound playing.
interface RepresentationContext {
    logicState: Immutable,
    setRepresentationState(partialState: Immutable): Immutable;
    addListener(listener: any): number;
    removeListener(id: number): void;
}

interface RepresentationEventHandlerContext extends RepresentationContext {
    representationState: Immutable,
}

// you can use this separately for different things, like video and audio for example
// or possibly to break out BGAs into their own representation.
function initializeRepresentation(
    name: string,
    initFn: (context: RepresentationContext) => (context: RepresentationEventHandlerContext) => void,
): void {

}

interface CozalFrame {
    event: InternalEvent,
    futureEvents: PriorityQueue<InternalEvent>,
    logicStates: { [K: string]: Immutable },
    representationStates: { [K: string]: Immutable },
}

const CozalInternal = {
    cozalHistory: new Stack<CozalFrame>().push({
        event: {time: 0, sort: 0, id: 0},
        futureEvents: new PriorityQueue("time", "sort", "id"),
        logicStates: {},
        representationStates: {},
    }),
    handleEvent(event: InternalEvent) {
        // rollback if necessary

        // call logic event handlers

        // call representation event handlers

        // push cozal frame
    },
};

const Cozal = {
    initializeLogic,
    initializeRepresentation,
    /*
    possibly some helpers here for reframing coordinates of components
    a "component" is simply another initFunction you call from the
    main initializeScreen function, possibly with modified arguments from context
    */
}
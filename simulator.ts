type Direction = "L" | "R";
type Transition = {
    write: string;
    move: Direction;
    nextState: string;
};

type TransitionMap = {
    [key: string]: Transition;
};

interface TuringConfig {
    tape: string[];
    head: number;
    state: string;
    transitions: TransitionMap;
    acceptStates: string[];
    rejectStates: string[];
    maxSteps?: number;
}

export function runTuringMachine(config: TuringConfig): { result: "ACCEPT" | "REJECT" | "TIMEOUT", tape:string[], log:string[]} {
    const {
        tape,
        head,
        state,
        transitions,
        acceptStates,
        rejectStates,
        maxSteps = 1000
    } = config;

    let currentTape = [...tape];
    let currentHead = head;
    let currentState = state;
    const log: string[] = [];

    for (let step = 0; step < maxSteps; step++) {
        const symbol = currentTape[currentHead] || "_";
        const key = `${currentState}_${symbol}`;
        const action = transitions[key];

        log.push(`Step ${step}: [${currentState}] reads '${symbol}'`);

        if (acceptStates.includes(currentState)) {
            log.push("Input ACCEPTED");
            return {result: "ACCEPT", tape:currentTape, log};
        }

        if (rejectStates.includes(currentState)){
            log.push("Input REJECTED");
            return {result: "REJECT", tape:currentTape, log};
        }

        if (!action) {
            log.push("No transition found. Input REJECTED");
            return {result: "REJECT", tape:currentTape, log};
        }

        currentTape[currentHead] = action.write;
        currentHead += action.move === "R" ? 1: -1;
        currentState = action.nextState;
    }

    log.push("Max steps exceeded. Machine TIMEOUT.");
    return {result: "TIMEOUT", tape: currentTape, log};
}
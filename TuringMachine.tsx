"use client";
import { useState } from "react";

export default function TuringMachine() {
    interface Transition {
        fromState: string;
        readSymbol: string;
        toState: string;
        writeSymbol: string;
        direction: "L" | "R" | "S";
    }

    const [acceptStates, setAcceptStates] = useState<Set<string>>(new Set(["q_accept"]));
    const [input, setInput] = useState("");
    const [alphabet, setAlphabet] = useState<string>("0,1,_");
    const [alphabetSet, setAlphabetSet] = useState<string[]>(["0", "1", "_"]);
    const [stateList, setStateList] = useState<string[]>(["q0", "q1", "q_accept"]);
    const [newState, setNewState] = useState<string>("");
    const [transitions, setTransitions] = useState<Transition[]>([]);
    const [newTransition, setNewTransition] = useState<Transition>({
        fromState: "",
        readSymbol: "",
        toState: "",
        writeSymbol: "",
        direction: "R",
    });
    const [output, setOutput] = useState<string>("");

    const loadExample = () => {
        setInput("101");
        setAlphabet("0,1,_");
        setAlphabetSet(["0", "1", "_"]);
        setStateList(["q0", "q_accept"]);
        setAcceptStates(new Set(["q_accept"]));
        setTransitions([
            { fromState: "q0", readSymbol: "1", toState: "q0", writeSymbol: "0", direction: "R" },
            { fromState: "q0", readSymbol: "0", toState: "q0", writeSymbol: "1", direction: "R" },
            { fromState: "q0", readSymbol: "_", toState: "q_accept", writeSymbol: "_", direction: "S" },
        ]);
        setOutput("");
    };

    const handleAlphabetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAlphabet(value);
        const chars = value.split(",").map(char => char.trim()).filter(char => char.length > 0);
        setAlphabetSet(chars);
    };

    const addState = () => {
        const trimmed = newState.trim();
        if (trimmed && !stateList.includes(trimmed)) {
            setStateList([...stateList, trimmed]);
            setNewState("");
        }
    };

    const removeState = (state: string) => {
        setStateList(stateList.filter(s => s !== state));
    };

    const addTransition = () => {
        const { fromState, readSymbol, toState, writeSymbol } = newTransition;
        if (fromState && readSymbol && toState && writeSymbol) {
            setTransitions([...transitions, newTransition]);
            setNewTransition({ fromState: "", readSymbol: "", toState: "", writeSymbol: "", direction: "R" });
        }
    };

    const removeTransition = (index: number) => {
        setTransitions(transitions.filter((_, i) => i !== index));
    };

    const runTuringMachine = () => {
        const tape = input.split("");
        let head = 0;
        let currentState = "q0";
        let steps = 0;

        while (steps < 1000) {
            const symbol = tape[head] ?? "_";
            const transition = transitions.find(t => t.fromState === currentState && t.readSymbol === symbol);

            if (!transition) break;

            tape[head] = transition.writeSymbol;
            currentState = transition.toState;
            if (transition.direction === "R") head++;
            else if (transition.direction === "L") head--;
            else if (transition.direction === "S") {
            // Do nothing — head stays in place
        }
            steps++;
        }

        const result = acceptStates.has(currentState) ? "Accepted" : "Rejected";
        setOutput(`${tape.join("")} | ${result} | ${currentState}`);

    };

    return (
        <div className="p-6 text-white bg-gray-900 min-h-screen">
            <h2 className="text-3xl font-bold mb-4">Try the simulator</h2>
            <p className="mb-4">Start in q0, use _ for a blank cell, and define a transition for each symbol. Try the example to flip each bit in 101.</p>
            <button type="button" onClick={loadExample} className="button button-secondary mb-6">Load bit-flip example</button>
            <label className="block mb-2">
                Input Tape: <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded"
                    placeholder="Enter tape input..."
                />
            </label>
            <p className="mt-4">Input: {input}</p>
            <p className="mt-2 text-sm text-gray-300" role="status">Output: {output}</p>
            <button onClick={runTuringMachine} className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded">
                Run Machine
            </button>

            <label className="block mt-6 mb-2">
                Alphabet (comma separated):
                <input
                    value={alphabet}
                    onChange={handleAlphabetChange}
                    className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded"
                    placeholder="e.g. 0,1,_"
                />
            </label>
            <p className="mt-2 text-sm text-gray-400">Parsed Alphabet: [{alphabetSet.join(", ")}]</p>

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">States</h2>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        aria-label="New state name"
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded"
                        placeholder="Enter state name"
                    />
                    <button
                        onClick={addState}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                    >
                        Add State
                    </button>
                </div>
                <ul className="list-disc ml-5 text-sm space-y-1">
                {stateList.map((state) => (
                <li key={state} className="flex justify-between items-center">
                    <span>{state}</span>
                    <div className="flex items-center gap-2">
                    <label className="text-sm">
                        <input
                            type="checkbox"
                            checked={acceptStates.has(state)}
                            onChange={(e) => {
                            const newSet = new Set(acceptStates);
                            if (e.target.checked) {
                                newSet.add(state);
                            } else {
                                newSet.delete(state);
                            }
                            setAcceptStates(newSet);
                        }}
                        className="mr-1"
                        />
                        Accept
                    </label>
                    <button
                        onClick={() => removeState(state)}
                        className="text-red-400 hover:text-red-600 text-xs"
                        >
                        Remove
                        </button>
                    </div>
                </li>
    ))}
</ul>

            </div>

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Transition Rules</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">
                    <input
                        value={newTransition.fromState}
                        aria-label="Transition from state"
                        onChange={(e) => setNewTransition({ ...newTransition, fromState: e.target.value })}
                        placeholder="From state"
                        className="p-2 bg-gray-800 border border-gray-700 rounded"
                    />
                    <input
                        value={newTransition.readSymbol}
                        aria-label="Symbol to read"
                        onChange={(e) => setNewTransition({ ...newTransition, readSymbol: e.target.value })}
                        placeholder="Read"
                        className="p-2 bg-gray-800 border border-gray-700 rounded"
                    />
                    <input
                        value={newTransition.toState}
                        aria-label="Transition to state"
                        onChange={(e) => setNewTransition({ ...newTransition, toState: e.target.value })}
                        placeholder="To state"
                        className="p-2 bg-gray-800 border border-gray-700 rounded"
                    />
                    <input
                        value={newTransition.writeSymbol}
                        aria-label="Symbol to write"
                        onChange={(e) => setNewTransition({ ...newTransition, writeSymbol: e.target.value })}
                        placeholder="Write"
                        className="p-2 bg-gray-800 border border-gray-700 rounded"
                    />
                    <select
                        value={newTransition.direction}
                        aria-label="Head movement direction"
                        onChange={(e) => setNewTransition({ ...newTransition, direction: e.target.value as "L" | "R" | "S"})}
                        className="p-2 bg-gray-800 border border-gray-700 rounded"
                    >
                        <option value="L">L</option>
                        <option value="R">R</option>
                        <option value="S">S</option>
                    </select>
                </div>
                <button
                    onClick={addTransition}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                >
                    Add Transition
                </button>
                <ul className="mt-4 text-sm space-y-1">
                    {transitions.map((t, i) => (
                        <li key={i} className="flex justify-between items-center">
                            <span>
                                ({t.fromState}, {t.readSymbol}) → ({t.toState}, {t.writeSymbol}, {t.direction})
                            </span>
                            <button
                                onClick={() => removeTransition(i)}
                                className="text-red-400 hover:text-red-600 text-xs"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

"use client";
import { useState } from "react";
export default function TuringMachine() {
    const [input, setInput] = useState("");

    return (
        <div className="p-6 text-white bg-gray-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Turing Machine Simulator</h1>
            <label className="block mb-2">
                Input Tape: <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                className="w-full mt-1 p-2 bg-gray-800 border border-gray-700 rounded" placeholder="Enter tape input..."/>
            </label>
            {/* Future: add dynamic UI for states, alphabet, transitions */}
            <p className="mt-4">Input: {input}</p>
        </div>
    );
}
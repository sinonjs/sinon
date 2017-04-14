"use strict";

const suffixes: string[] = ["", "once", "twice", "thrice"];

export default function timesInWords(count: number): string {
    return suffixes[count] || `${(count || 0)} times`;
}

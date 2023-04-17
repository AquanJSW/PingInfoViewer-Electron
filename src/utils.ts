export function sum(a: number[]) {
    return a.reduce((a, b) => a + b)
}

export function mean(a: number[]) {
    return sum(a) / a.length
}
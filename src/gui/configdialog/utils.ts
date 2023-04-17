export function splitMultiLines(str: string) {
    const src = str.split('\n')
    const dst: string[] = []
    src.forEach((element) => {
        const trimmed = element.trim();
        if (trimmed) dst.push(trimmed)
    })
    return dst
}

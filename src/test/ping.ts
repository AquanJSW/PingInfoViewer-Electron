const testStr = `
8.8.8.8 "Google DNS"
google.com
2400:3200::1 "Ali DNS"
`

interface RawHostInput {
    hostname?: string,
    description?: string,
}

function processContents(c: string) {
    let ret: RawHostInput[] = []
    for (let line of c.split('\n')) {
        let result = line.match(/\s*(\S+)(?:\s*"(.+?)")?.*/)
        if (result == null)
            continue
        let tmp: RawHostInput = {}

        tmp.hostname = result[1]
        tmp.description = result[2] == undefined ? '' : result[2]

        ret.push(tmp)
    }
    return ret
}

console.log(processContents(testStr))
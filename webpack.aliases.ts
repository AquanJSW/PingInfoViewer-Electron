import path from 'path';
const cwd = process.cwd();


function createWebpackAliases(aliases: Record<string, string>) {
    const result = new Object as Record<string, string>;
    for (const name in aliases) {
        result[name] = path.join(cwd, aliases[name])
    }
    return result;
}

const aliases = createWebpackAliases({
    '@core': 'src/core',
    '@utils': 'src/utils.ts',
    '@configdialog': 'src/gui/configdialog'
})

export default aliases
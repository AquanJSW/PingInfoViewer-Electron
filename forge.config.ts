import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
    packagerConfig: {},
    rebuildConfig: {},
    makers: [new MakerSquirrel({}), new MakerZIP({}, ['darwin']), new MakerRpm({}), new MakerDeb({})],
    plugins: [
        new WebpackPlugin({
            devContentSecurityPolicy: `default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-inline' data:`,
            mainConfig,
            renderer: {
                config: rendererConfig,
                entryPoints: [
                    {
                        html: './src/gui/mainwindow/index.html',
                        js: './src/gui/mainwindow/renderer.tsx',
                        name: 'main_window',
                        preload: {
                            js: './src/gui/mainwindow/preload.ts',
                        },
                    }, {
                        name: 'config_dialog',
                        html: './src/gui/configdialog/index.html',
                        js: './src/gui/configdialog/renderer.tsx',
                        preload: {
                            js: './src/gui/configdialog/preload.tsx',
                        }
                    }
                ],
            },
            devServer: {
                liveReload: false,
            }
        }),
    ],
};

export default config;

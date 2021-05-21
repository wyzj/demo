/*
 * @Author: JackFly
 * @since: 2020-07-08 16:08:15
 * @lastTime: 2020-07-08 18:22:25
 * @FilePath: /TrunkOS/vue.config.js
 * @message:electron配置文件
 */

// vue.config.js

module.exports = {
  pluginOptions: {
    electronBuilder: {
      removeElectronJunk: false,
      externals: ["sql.js"], //这里是你使用的原生模块名字列表，改成自己的即可
      nodeModulesPath: ['../../node_modules', './node_modules','../node_modules'],//这里是多个node_modules路径，按自己需要配置即可
      builderOptions: {
        appId: "com.demosql.app",
        productName: "demosql", //项目名，也是生成的安装文件名，即aDemo.exe
        copyright: "北京八号地信息技术有限公司 © 2021",
        directories: {
          output: "electron", //输出文件路径
        },
        publish: [
          {
            provider: "generic",
            url: "http://locald.in.com"
          }
        ],
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: "link",
              path: "/Applications"
            },
            {
              x: 130,
              y: 150,
              type: "file"
            }
          ]
        },
        mac: {
          icon: "./public/icons/icon.icns",
          artifactName: "${productName}_setup_${version}.${ext}"
        },
        nsis: {
          oneClick: false,
          perMachine: true,
          allowElevation: true,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          runAfterFinish: true
        },
        win: {
          icon: "./public/icons/icon.ico",
          artifactName: "${productName}_setup_${version}.${ext}",
          target: [
            {
              target: "nsis",//利用nsis制作安装程序
              arch: [
                "x64",//64位
                "ia32"//32位
              ]
            }
          ]
        },
        linux: {
          icon: "./public/icons",
          artifactName: "${productName}_setup.${ext}",
          category: "office"
        }
      }
    },
  },
};

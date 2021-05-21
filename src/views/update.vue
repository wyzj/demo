<template>
    <div style="text-align: center;padding-top: 100px">
        <h1>更新更新</h1>
        <h1>{{text}}</h1>
        <div style="margin-top: 140px">
            <el-progress :percentage="downloadPercent" type="circle" :stroke-width="12" :width="200"></el-progress>
        </div>
    </div>
</template>

<script>
    import {ipcRenderer} from 'electron';
    import os from 'os';

    export default {
        name: "update",
        data() {
            return {
                text: "正在检测升级,请稍后,请勿关闭当前页面.....",
                downloadPercent: 0,
                os: os,
                virtualProcess: null
            }
        },
        mounted() {
            let _this = this;
            ipcRenderer.on("downloadProgress", (event,
                                                progressObj
            ) => {
                _this.downloadPercent = Number.parseInt(progressObj.percent || 0);
            });
            ipcRenderer.on("isUpdateNow", () => {
                if (_this.virtualProcess) {
                    clearInterval(_this.virtualProcess);
                }
                _this.downloadPercent = 100;
                ipcRenderer.send("isUpdateNow");
            });
            ipcRenderer.on("message", function (event, param) {
                switch (param.code) {
                    case 2: {
                        _this.text = param.msg;
                        if (_this.os.platform() == 'linux') {
                            _this.startVirtualTimer();
                        }
                        break;
                    }
                    case -1: {
                        _this.checkAndLogin();
                        break;
                    }
                    case 0: {
                        _this.checkAndLogin();
                        break;
                    }
                }
            });
            console.log(navigator)
            if (navigator.onLine) {
                ipcRenderer.send("checkForUpdate");
            } else {
                this.checkAndLogin();
            }
        },
        methods: {
            registered: function () {
                return true;
            },
            checkAndLogin() {
                alert("当前是222222222222222")
            },
            startVirtualTimer() {
                let _this = this;
                this.virtualProcess = setInterval(function () {
                    let a = Math.random() * 7;
                    if (_this.downloadPercent + a < 99) {
                        _this.downloadPercent = Number.parseInt(_this.downloadPercent + a);
                    }
                }, 1500);
            }
        }

    }
</script>

<style scoped>

</style>

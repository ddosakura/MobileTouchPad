# MobileTouchPad

Let MobilePhone to be TouchPad.

## 完整构建流程

```bash
cd vtp
yarn build
cd ..
cp -r ./vtp/build/* ./mtp-agent/assets/
cd mtp-agent
go generate
go build -o build/mtpa .
```

## mtp-agent

Runing in the PC.

## vtp

The web used in mobile.

### TODO

+ [x] 按住移动
+ [x] 缓存配置
+ [x] ws自动重连
+ [x] ws rxjs化
+ [ ] 键盘控制
+ [ ] 还是用react/vue重写吧 - 由于图片处理问题导致的美化困难

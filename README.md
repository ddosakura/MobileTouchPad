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
go build
```

## mtp-agent

Runing in the PC.

## vtp

The web used in mobile.

### TODO

+ [ ] double tap
+ [ ] 按住移动

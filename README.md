# draw_and_guess
你画我猜——移动端多人游戏

## 端口配置
### 打开客户端入口文件main.js
```bash
   cd client/src
```
### 找到第43行，修改为本机ip地址
```bash
   const webSocket = WebSocketClient.init({
      path: 'ws://10.19.128.101:9001/ws/',
```

## 客户端启动
### install dependencies
```bash
npm install
```
### run dev
```bash
npm run dev
```

### build file
```bash
npm run build
```
## 服务端启动
### install dependencies
```bash
npm install
```
### run dev
```bash
npm run dev
```

```
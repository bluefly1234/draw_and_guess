import ws from 'ws'
import GlobalEmitService from './service/GlobalEmitService'
import DataService from './service/DataService'
import ConnectController from './controller/ConnectController'
const wsServer = ws.Server({port: 9001})
const globalMap = {
  userMap: {},
  roomMap: {},
  roomUser: {},
  gameMap: {}
}

wsServer.on('connection', ws => {
  new ConnectController(ws, globalMap)
})

console.log('websocket start:', wsServer.options.port)

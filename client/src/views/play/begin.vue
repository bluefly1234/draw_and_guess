<template>
<div class="game-begin">
  <game-header :isCurrentPlay="isCurrentPlay" :gameDataKey="gameData.key" :typeName="typeName" :countTime="countTime" :gameStatus="gameStatus">
  </game-header>
  <draw :can-draw="isCurrentPlay" :image-data="gameData.imageData" ref="draw">
  <div class="fiexd-msg-list" slot="ondraw" ref="msgScroll" :style="{opacity:messageListShow ? 1 : 0}">
    <div class="msg-auto-scroll">
      <div class="msg-list-all" ref="msgList">
        <span v-for="msg in msgList" :class="msg.type">{{msg.msg}}</span>
      </div>
    </div>
  </div>
  </draw>
  <chat @receive="showMessage" v-show="!isCurrentPlay" ref="chat"></chat>
  <div class="player-list-wrap">
    <div class="player-list">
    <player-item v-for="user in users" :user="user" :class="{me: user.id === currentUser, draw: user.id === currentPlay, leave: isOffline(user.id)}"></player-item>
  </div>
</div>
<mt-popup v-model="isShowAnswerCard">
<div class="answer-card" @click="hideAnswerCart">
  <div>
    <span>答案是:</span>
    <span class="answer">{{this.currentAnswer}}</span>
  </div>
</div>
</mt-popup>
<mt-popup v-model="isShowGameOver">
<div class="answer-card">
  <div class="quick-send">
    <p v-for="(u,index) in gameOverData">第{{index+1}}名: {{u.username}} {{u.score}}分</p>
  </div>
  <mt-button class="return-btn" size="large" type="primary" @click="goBackToRoom">返回房间</mt-button>
</div>
</mt-popup>
</div>
</template>

<script>
import Draw from './draw'
import Chat from './chat'
import PlayerItem from '../room/PlayerItem'
import GameHeader from '../gameHeader'
export default {
  components: { Draw, Chat, PlayerItem, GameHeader },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getGameData()
    })
  },
  beforeRouteLeave (to, from, next) {
    this.stopAutoScroll()
    next()
  },
  data () {
    return {
      socketEvents: {
        timeout (time) {
          this.countTime = time
        },
        typeHints (type) {
          this.typeName = type
        },
        countScore (userScore) {
          const users = this.gameData.users
          if (users) {
            users.forEach(u => {
              u.score = userScore[u.id] || u.score
            })
          }
        },
        thisOver (data) {
          this.currentAnswer = data.key
          this.isShowAnswerCard = true
          this.gameData.player = ''
        },
        changeGamer () {
          this.isShowAnswerCard = false
          this.typeName = ''
          this.gameData.imageData = ''
          this.getGameData()
        },
        userOffline ({id}) {
          this.offlineUser[id] = 1
          this.offlineUser = {...this.offlineUser}
        },
        userOnline ({id}) {
          delete this.offlineUser[id]
          this.offlineUser = {...this.offlineUser}
        },
        gameOver (data) {
          this.isShowAnswerCard = false
          this.isShowGameOver = true
          this.gameOverData = this.gameData.users.sort((u1, u2) => {
            return u1.score < u2.score
          })
        }
      },
      isShowGameOver: false,
      isShowAnswerCard: false,
      offlineUser: {},
      currentAnswer: '',
      typeName: '',
      gameData: {},
      countTime: 60,
      msgList: [],
      speed: 10,
      userScore: {},
      scrollInterval: '',
      messageListShow: false,
      gameOverData: [],
      gameStatus: 1
    }
  },
  watch: {
    currentPlay (val) {
      if (this.isCurrentPlay) {
        this.$message('你来画')
      } else {
        this.users.every(u => {
          if (u.id === this.currentPlay) {
            this.$message(u.username + '作画')
            return false
          }
          return true
        })
      }
    }
  },
  computed: {
    users () {
      const users = this.gameData.users
      return users
    },
    currentUser () {
      return this.$store.getters.user.id
    },
    currentPlay () {
      return this.gameData.player
    },
    isCurrentPlay () {
      return this.currentUser === this.currentPlay
    }
  },
  methods: {
    isOffline (id) {
      return this.offlineUser[id]
    },
    hideAnswerCart () {
      this.isShowAnswerCard = false
    },
    getGameData () {
      const vm = this
      vm.loading()
      vm.$webSocket.request({id: parseInt(this.$route.params.id)}, 'gameData').then((gameData) => {
        vm.gameData = gameData
        vm.countTime = gameData.time
        vm.loaded()
      }).catch(e => {
        if (e.type === 'gameOver') {
          this.goBackToRoom()
        } else {
          vm.$router.replace('/')
        }
        vm.loaded()
      })
    },
    goBackToRoom () {
      this.$router.replace({name: 'room', params: this.$route.params})
    },
    startAutoScroll () {
      this.messageListShow = true
      if (this.scrollInterval) {
        clearInterval(this.scrollInterval)
      }
      this.scrollInterval = setInterval(_ => {
        try {
          this.$refs.msgScroll.scrollLeft++
          if (this.$refs.msgScroll.scrollLeft >= this.$refs.msgList.clientWidth + this.$refs.msgScroll.clientWidth) {
            this.stopAutoScroll()
          }
        } catch (e) {
          console.error(e)
          this.stopAutoScroll()
        }
      }, this.speed)
    },
    // 重置聊天滚动栏
    stopAutoScroll () {
      this.messageListShow = false
      clearInterval(this.scrollInterval)
      this.$refs.msgScroll.scrollLeft = 0
      this.msgList = []
    },
    showMessage (msg) {
      this.msgList.push(msg)
      this.startAutoScroll()
    }
  }
}
</script>

<style lang="less">
@import "~assets/less/base.less";
.answer-card{
  width: 100vw;
  padding: 2vw;
  text-align: center;
}
.answer{
  font-size: 1.2em;
  margin-left: 10px;
}
.quick-send{
  p{
    margin: .2em;
    border: 1px solid rgb(99,237,232);
    padding: 10px;
    color: #000;
  }
}
.return-btn{
  background-color: rgb(99,237,232);
  color: #000;
}
.player-list{
  width: 100%;
  display: -webkit-flex;
  display: flex;
  justify-content: space-around;
  flex-wrap: nowrap;
  .player-item{
    box-sizing: border-box;
    width: 33%;
    display: inline-block;
    padding: 2vw;
  }
}
.fiexd-msg-list{
  position: absolute;
  bottom: 0;
  min-width: 100%;
  background: rgba(0, 0, 0, 0.13);
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  transition: all .5s;
  font-size: .9em;
}
.msg-auto-scroll{
  width: 10000%;
  margin-left: 80%;
  .msg-list-all{
    display: inline-block;
    span + span{
      padding-left: 30vw;
    }
  }
}
</style>

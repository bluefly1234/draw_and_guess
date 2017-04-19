<template>
<div>
  <game-header :gameStatus="gameStatus">
  </game-header>
  <div class="player-blocks" >
    <player-item v-for="(user,index) in users" :key="user.id" :user="user">
      <div class="head"></div>
      <div class="username">{{user.username}}</div>
    </player-item>
    <div class="player-item empty-item" v-for="emptyUser in emptyNumber">
      <div class="head">
        <div class="user"></div>
      </div>
      <div class="username">等待加入</div>
    </div>
  </div>
  <div class="begin" size="large" type="primary" :disabled="!canBegin" @click="beginGame">{{canBegin ? '开始游戏' : '至少两人才能开始'}}</div>
  <chat showList="1"></chat>
</div>
</template>
<!-- 进入房间后自动坐下，房主可开始游戏 -->
<script>
import PlayerItem from './PlayerItem'
import Chat from '~/views/play/chat'
import GameHeader from '../gameHeader'
export default {
  components: {Chat, PlayerItem, GameHeader},
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.loading()
      vm.$webSocket.request({id: to.params.id}, 'enterRoom').then(vm.enterSuccess).catch(e => {
        vm.$message(e.msg)
      })
    })
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'begin') {
      this.$webSocket.send({}, 'leaveRoom')
    }
    next()
  },
  data () {
    return {
      socketEvents: {
        roomClose: this.showBackError,
        roomFull: this.showBackError,
        // 新用户加入，重新渲染用户UI界面
        userEnter (data) {
          this.refreshUser(data)
        },
        gameBegin ({id}) {
          this.$router.replace({name: 'begin', params: {id: id}})
        },
        userLeave ({id}) {
          delete this.userMap[id]
          this.userMap = {...this.userMap}
          this.refreshUser(this.userMap)
        }
      },
      room: {},
      userMap: {},
      playerNumber: 6,
      gameStatus: 0
    }
  },
  computed: {
    me () {
      return this.$store.getters.user
    },
    users () {
      return Object.values(this.userMap)
    },
    isRoomMaster () {
      const userId = this.me.id
      const firstUser = this.users[0]
      return firstUser && (firstUser.id === userId)
    },
    canBegin () {
      return this.users.length > 1
    },
    emptyNumber () {
      const users = this.users
      let number = 6
      if (this.room.playNumber) {
        number = this.room.playNumber - users.length
      }
      return number
    }
  },
  methods: {
    beginGame () {
      this.$webSocket.send(null, 'beginGame')
    },
    showBackError (data) {
      this.loaded()
      this.$message(data.message)
    },
    enterSuccess (data) {
      this.room = data
      this.loaded()
    },
    refreshUser (users) {
      const userMap = {}
      users.forEach(u => {
        userMap[u.id] = u
      })
      this.userMap = userMap
    },
    leavlRoom () {
      this.$webSocket.send({}, 'leaveRoom')
    }
  }
}
</script>

<style lang="less">
@import "~assets/less/base.less";

.player-blocks {
  display: flex;
  text-align: center;
  flex-wrap: wrap;
  justify-content: center;
  margin: 1rem auto 0;
}
.begin {
  height: 2rem;
  width: 70%;
  margin: 1rem auto;
  background-color: rgb(99,237,232);
  border: 3px solid #fff;
  border-radius: 24px;
  font-size: 16px;
  font-family: "microsoft yahei";
  line-height: 2rem;
  text-align: center;
  font-weight: 400;

}

.player-item{
  width: 33%;
}
</style>

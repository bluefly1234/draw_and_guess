<template>
	<header class="header">
    <span class="header__subject" v-show="gameStatus">{{isCurrentPlay ? '请画: ' : '提示: '}}{{gameDataKey}}
    </span>
		<span class="header__image">
			<img src="../assets/logo.png" alt="你画我猜"/>
		</span>
    <span class="header__time">{{countTime}}</span>
	</header>
</template>
<script>
export default {
  name: 'gameHeader',
  props: ['isCurrentPlay', 'gameDataKey', 'typeName', 'countTime', 'gameStatus'],
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.header {
    background-color: rgb(99,227,232);
    width: 100%;
    height: 4rem;
    font-size: 1.6rem;
}

.header span {
    display: inline-block;
    position: absolute;
    font-size: 14px;
    font-weight: 500;
    line-height: 4rem;
}

.header__subject {
    left: 10px;
    width: 80px;
    word-wrap: wrap;
    word-break: break-all;
}

.header__image {
    left: 50%;
    width: 12rem;
    height: 4rem;
    transform: translateX(-50%);
}

.header__image img {
    width: 12rem;
    height: 4rem;
}

.header__time {
    right: 1rem;
}


</style>

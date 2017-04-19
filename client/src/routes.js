export default [
  {
    path: '/',
    name: 'room',
    component: r => require(['src/views/room/room.vue'], r)
  },
  {
    path: '/begin/:id',
    name: 'begin',
    component: r => require(['src/views/play/begin.vue'], r)
  }
]

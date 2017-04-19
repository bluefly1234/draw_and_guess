// events是所有事件的数组集合，每一项是类type的数组
const events = {}

// 监听事件
global.$on = (type, fn) => {
  if (typeof fn === 'function') {
  	// 将同一type的事件push到同一个数组中
    const allFunction = events[type] || []
    allFunction.push(fn)
    events[type] = allFunction
  }
}

// 触发事件
global.$emit = (type, data) => {
  const allFunction = events[type] || []
  allFunction.forEach(fn => fn(data))
}

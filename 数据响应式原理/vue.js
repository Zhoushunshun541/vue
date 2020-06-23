class Vue extends EventTarget{
  constructor(options) {
    super()
    this.options = options
    this._data = this.options.data
    this.el = document.querySelector(this.options.el)
    this.compileNode(this.el)
    this.observe(this._data)
  }
  // 数据双向绑定
  observe(data){
    let _this = this
    // Proxy vue3.0中最重要的特性  代理  实际作用就是在访问对象前  进行拦截 从而对数据进行处理
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
    this._data = new Proxy(data,{
      //修改数据时候  触发set方法
      // target:当前目标 这指data   
      // handler: 对象被修改的属性  
      // newValue: 被修改的新值
      set(target, handler, newValue) {
        // 创建一个自定义事件  其中第一个参数  是自定义事件的名称 这里用handler
        // 比如我修改了 data.name   那就自定义了一个 name的时间
        // https://developer.mozilla.org/zh-CN/docs/Web/API/CustomEvent/CustomEvent
        let event = new CustomEvent(handler,{
          // detail  可选的默认值是 null 的任意类型数据，是一个与 event 相关的值
          detail:newValue,
        })
        // 发布事件  因为是new Proxy  所以这里this指向改变  
        _this.dispatchEvent(event)
        // 发布时间后  在compileNode 方法中的文本节点哪里  监听事件 并修改值  
        return Reflect.set(...arguments)
      },
    })
  }

  // el编译 分析{{}}  显示对应参数
  compileNode(el) {
    let child = el.childNodes
    ;[...child].forEach((node) => {
      // nodeType 1： 元素  2  属性  3  文本节点
      if (node.nodeType === 3) {
        // 获取文本节点内容
        let text = node.textContent
        // 正则表达式   匹配 {{}} 允许有空  和匹配多个{{}}
        let req = /\{\{\s*([^\s\{\}]+)\s*\}\}/g
        let list = text.match(req)
        if (list) {
          list.forEach((res,i) => {
            var $1 = res.replace("{{",'').replace("}}",'').trim()
            // 匹配到有值 就进行字符串替换  将原文中匹配到{{}} 替换成 data中对应的key
            let _this = this
            this._data.$1 &&
            (node.textContent = text.replace(req, function(a,i) {
              return _this._data.i
            }))
            // 这里匹配到了 $1 为name  监听他的事件 然后如果有事件  就将当前节点的内容  替换成 当前时间传入的参数
            // 这个参数  就是上面observe中的自定义事件
            this.addEventListener($1, e => {
              node.textContent = text.replace(req,function(a,i,t,tq) {
                return i == $1? e.detail : _this._data.i
              })
            })
          })
        }
      } else if (node.nodeType === 1) {
        // 先去拿到 attributes  获取节点的属性  
        let attr = node.attributes
        // 如果有 v-model
        if (attr.hasOwnProperty("v-model")) {
          //获取属性的值
          let key = attr['v-model'].nodeValue
          // 将data中的数据显示到节点上
          node.value = this._data.key
          node.addEventListener("input",e => {
            this._data.key = node.value
          })
        }
        this.compileNode(node)
      }
    })
  }
}

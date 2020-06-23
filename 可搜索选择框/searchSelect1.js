;(function () {
  class zssSelect extends HTMLElement {
    constructor() {
      super()
      var root = document.createElement('div')
      var input = document.createElement('input')
      var ul = document.createElement('ul')
      var list = eval(this.getAttribute('options'))
      const event = this.getAttribute('onchange')
      this.setAttribute('options','')
      root.setAttribute('id', 'zssSelect')
      root.setAttribute('class', 'zss-select')
      root.style.position = 'relative'
      input.setAttribute('class', 's-input')
      input.setAttribute('value', '')
      ul.setAttribute('class', 's-select s-select-hide')
      ul.setAttribute('id', 'searchContent')
      let nodes = []
      list.forEach((res) => {
        let li = document.createElement('li')
        li.setAttribute('data-id', res.id)
        li.innerHTML = res.value
        res.disable && li.setAttribute('class','disabled')
        nodes.push(li)
        if (!res.disable) {
          li.onclick = () => {
            input.value = li.innerHTML
            this.setAttribute('value',li.innerHTML)
            ul.setAttribute('class', 's-select s-select-hide')
            event && window[event]()
          }
        }
        ul.appendChild(li)
      })
      // 防抖
      function fangdou(fn, wait) {
        let timmer = null
        return function () {
          var args = arguments
          timmer && clearTimeout(timmer);
          timmer = setTimeout(() => {
            fn.apply(this, args)
          }, wait)
        }
      }
      // 添加输入事件
      input.addEventListener('input',fangdou(function() {
        ul.childNodes.forEach(li => {
          if (input.value == '') {
            li.style.display = "block"
          }else{
            if (li.innerHTML != input.value) {
              li.style.display = 'none'
            }else{
              li.style.display = 'block'
            }
          }
        })
      },300))

      function hideUl() {
        ul.setAttribute('class', 's-select s-select-hide')
      }
      input.onclick = function(){
        ul.setAttribute('class', 's-select s-select-show')
        input.addEventListener('blur',hideUl)
      }

      ul.onmouseenter = function () {
        ul.setAttribute('class', 's-select s-select-show')
        input.removeEventListener('blur',hideUl)
      }

      ul.onmouseleave = function () {
        input.addEventListener('blur',hideUl)
      }

      // 引入外部文件
      var style = document.createElement('link')
      style.setAttribute('rel','stylesheet')
      style.setAttribute('href','./searchSelect.css')
      // 创建根元素，作用其实是将分离的css和html聚合起来
      var shadow = this.attachShadow({ mode: 'open' })
      root.appendChild(input)
      root.appendChild(ul)
      // 将创建的style节点追加到影子节点中
      shadow.appendChild(style)
      shadow.appendChild(root)
    }
  }
  // 定义组件
  customElements.define('zss-select', zssSelect)
})()

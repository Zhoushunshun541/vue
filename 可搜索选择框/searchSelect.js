function search(params) {
  
}
function init(element,data) {
  // 原始数据
  const nowData = data
  // 根节点
  var root = document.querySelector(element)
  root.style.position =  'relative';
  // 创建一个input 设置好属性
  var sInput = document.createElement('input')
  sInput.setAttribute('class','s-input')
  sInput.setAttribute('value','')
  sInput.setAttribute('id','keyWord')
  root.appendChild(sInput)
  let html = `
  <ul class="s-select" id="searchContent">`
    data.forEach(res => {
      html += `<li data-id=`+res.id+`>`+res.value+`</li>`
    })
  html += `</ul>`
  // 元素的宽高 和定位
  var h = sInput.offsetHeight
  var w = sInput.offsetWidth
  // position: absolute;
  root.insertAdjacentHTML('beforeend',html)
  // 搜索展示框样式
  var child = document.getElementById('searchContent')
  child.style.width = w + 'px'
  child.style.top = (h + 10) + 'px'
  child.setAttribute('class','s-select-hide s-select')
  child.style.position = "absolute"
  // 添加输入事件
  sInput.addEventListener('input',function() {
    var newData = []
    document.getElementById('searchContent').setAttribute('class','s-select-show s-select')
    let keyWord = sInput.value
    newData = keyWord?nowData.filter(res => res.value == keyWord ) : nowData
    let html = `
    <ul class="s-select" id="searchContent">`
    newData.forEach(item => {
      html += `<li data-id=`+item.id+`>`+item.value+`</li>`
    })
    html += `</ul>`
    let cont = document.getElementById('searchContent')
    cont.remove()
    root.insertAdjacentHTML('beforeend',html)
  })
  function getFocus() {
    document.getElementById('searchContent').setAttribute('class','s-select-hide s-select')
  }
  // 点击显示内容
  sInput.onclick = function() {
    document.getElementById('searchContent').setAttribute('class','s-select-show s-select')
    sInput.addEventListener('blur',getFocus)
  }

  child.onmouseenter = function() {
    sInput.removeEventListener('blur',getFocus)
    document.getElementById('searchContent').setAttribute('class','s-select-show s-select')
  }
  child.onmouseleave = function() {
    sInput.addEventListener('blur',getFocus)
  }
  // 给个li点击事件
  document.getElementById('searchContent').childNodes.forEach(node => {
    if (node.nodeType == 1) {
      (function(el) {
        el.onclick = function() {
          sInput.value = el.innerHTML
          document.getElementById('searchContent').setAttribute('class','s-select-hide s-select')
        }
      })(node)
    }
  })
}
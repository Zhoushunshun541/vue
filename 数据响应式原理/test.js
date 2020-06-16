var str = '{{name}} 123  {{age}}'
var req = /\{\{\s*([^\s\{\}]+)\s*\}\}/g
console.log(
  str.replace(req, function (a, b, i) {
    return b
  })
)

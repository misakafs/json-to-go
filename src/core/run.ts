import { Scanner } from './scanner'
import { Parser } from './parse'
// import { CodegenJson } from './codegen_json'
import { CodegenGo } from './codegen_go'

// 生成json字符串
function run(s: string): string {
    // 扫描器生成tokens
    const scan = new Scanner(s)
    // console.log(scan.tokens)
    // 将tokens解析成树结构
    const parser = new Parser(scan.tokens)
    // console.log(JSON.stringify(parser.root, null, 2))
    // 生成json字符串
    // const codegen = new CodegenJson(parser.root)
    const codegen = new CodegenGo(parser.root)
    // return JSON.stringify(codegen.root, function(key,value) {
    //     console.log(key,value)
    // }, 2)
    // console.log(codegen.result)
    return ''
}

// const s = `{"c":[[{"d":[{"e":[true]}]}]]}`
// const s = `[[{"d":[{"e":[true]}], "x": 123}]]`
// const s = `[{}]`
// const s = `[[[[[[[[[[[[[1]]]]]]]]]]]]]`
// const s = `[[[[[[[[[[[[[{}]]]]]]]]]]]]]`
// const s = `[{"a":1231},{"a":1231, "b":123},{"a":1231}]`
// const s = `[[[{"a":1231},{"a":1231, "b":123},{"a":1231}]]]`
// const s = `[[{"a":1231},{"a":1231, "b":[[[1,2]]]},{"a":1231}]]`
// const s = `{"a":-1231.323,"b":{"z":31,"p":true,"-1.23":"key是字符串"}}`
// const s = `{"a":1,"b":true,"c":false,"d":null,"e":-1.234,"f":"xxx"}`
// const s = `{"a":1,"b":{"c":true,"d":null,"e":{"f":"xxx"}}}`
// const s = `{a:132,b:true,a:1.23,b:null,c:xxwda,f:{g:sda},b:0}`
const s = `[a b c {c:false} true null]`
console.log(run(s))

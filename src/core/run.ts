import { Scanner } from './scanner'
import { Parser } from './parse'
import { CodegenJson } from './codegen_json'
// import { CodegenGo } from "./codegen_go";

// 生成json字符串
function run(s: string): string {
    // 扫描器生成tokens
    const scan = new Scanner(s)
    // 将tokens解析成树结构
    const parser = new Parser(scan.tokens)
    console.log(JSON.stringify(parser.root, null, 2))
    // 生成json字符串
    const codegen = new CodegenJson(parser.root)
    // const codegen = new CodegenGo(parser.root)
    // return JSON.stringify(codegen.root, function(key,value) {
    //     console.log(key,value)
    // }, 2)
    return codegen.json
}

const s = `{"a":1,"b":{"c":true,"d":null,"e":{"f":"xxx"}}}`
console.log(run(s))

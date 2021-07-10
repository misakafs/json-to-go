import { Scanner } from './scanner'
import { Parser } from './parse'
// import { CodegenJson } from './codegen_json'
import { CodegenGo } from './codegen_go'

// 生成json字符串
function run(s: string): string {
    // 扫描器生成tokens
    const scan = new Scanner(s)
    console.log(scan.tokens)
    // 将tokens解析成树结构
    const parser = new Parser(scan.tokens)
    // console.log(JSON.stringify(parser.root, null, 2))
    // 生成json字符串
    // const codegen = new CodegenJson(parser.root)
    const codegen = new CodegenGo(parser.root)
    console.log(codegen.result)
    return ''
}

// const s = `{"c":[[{"d":[{"e":[true]}]}]]}`
// const s = `[[{"d":[{"e":[true]}], "x": 123}]]`
// const s = `[{}]`
// const s = `[]`
// const s = `[[[[[[[[[[[[[1]]]]]]]]]]]]]`
// const s = `[[[[[[[[[[[[[{}]]]]]]]]]]]]]`
// const s = `[{"a":1231},{"a":1231, "b":123},{"a":1231}]`
// const s = `[[[{"a":1231},{"a":1231, "b":123},{"a":1231}]]]`
// const s = `[[{"a":1231},{"a":1231, "b":[[[1,2]]]},{"a":1231}]]`
// const s = `{"asdadasdadadadsadasdada":-1231.323,"b":{"z":31,"p":true,"-1.23":"key是字符串"}}`
// const s = `{"a":1,"b":true,"cxxxxxxxxxxxx":false,"d":null,"e":-1.234,"f":"xxx"}`
// const s = `{"a":1,"b":{"c":true,"d":null,"e":{"f":"xxx"}}}`
// const s = `{a:132,b:true,a:1.23,b:null,c:xxwda,f:{g:sda},b:0}`
// const s = `[a b c {c:false} true null]`
// const s = `{"basic":{"null":null,"true":true,"false":false,"integer0":0,"integer1":23123,"integer2":-2434234,"float0":0.1232,"float1":231.34234,"float2":-31.1231,"float3":-0.2313,"string1":"this is string1","string2":"23121","string3":"sda3242;klk3423"},"complex":{"object1":{"key1":123,"key2":-1.2,"key3":true,"key4":false,"key5":null,"key6":"value","object2":{"arr":["1","2","3"],"arr2":[{"arr2_key1":-123.231,"arr2_key2":"2313","arr2_key3":"[3121]"}]}}},"array1":[1,2,3,4],"array2":[1.342,4.342,-123.34,34,0,-313],"array3":["aaa","bbb","ccc","dddd"],"array4":[true,null,231,"sd32",23.343],"array5":[[1,2,3],[4,5,6]],"array6":[["aaa","bbb"],["ccc"]],"array7":[[true,null],[0,false,null,3.4,-23]],"array8":[[{"key1":123,"key2":"sdad","key3":213.4}]],"array9":[[[{"key1":123,"key2":"sdad","key3":213.4}]]]}`
// const s = `{"null":null,"true":true,"false":false,"integer0":0,"integer1":23123,"integer2":-2434234,"float0":0.1232,"float1":231.34234,"float2":-31.1231,"float3":-0.2313,"string1":"this is string1","string2":"23121","string3":"sda3242;klk3423"}`
const s = `a:1/haha`
console.log(run(s))

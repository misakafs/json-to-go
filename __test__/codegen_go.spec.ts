import { Scanner } from '../src/core/scanner'
import { Parser } from '../src/core/parse'
import { CodegenGo } from '../src/core/codegen_go'

// 生成json字符串
function run(s: string): string {
    // 扫描器生成tokens
    const scan = new Scanner(s)
    // 将tokens解析成树结构
    const parser = new Parser(scan.tokens)
    // 生成json字符串
    const codegen = new CodegenGo(parser.root)
    return codegen.result.trim()
}

test('测试简单对象', () => {
    const s = '{"a":1,"b":true,"c":false,"d":null,"e":-1.234,"f":"xxx"}'
    const expected = `type RootObject struct {
    a int
    b bool
    c bool
    d interface{}
    e float64
    f string
}`
    expect(run(s)).toBe(expected)
})
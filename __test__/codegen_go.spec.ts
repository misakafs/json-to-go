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

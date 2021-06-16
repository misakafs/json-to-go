import { Node, NodeType } from './parse'
import { Scanner } from './scanner'
import { Parser } from './parse'
import { Option } from './types'
import { CodegenJson } from './codegen_json'
import { CodegenGo } from './codegen_go'
// import { CodegenGo } from "./codegen_go";

export enum CodegenStrategy {
    JSON,
    GOLANG,
    YAML
}

interface Strategy {
    codegen(node: Node, opt?: Option): string
}

class JsonStrategy implements Strategy {
    codegen(node: Node, opt?: Option): string {
        let s = new CodegenJson(node, opt).result
        return s
    }
}
const jsonStrategy = new JsonStrategy()

class GolangStrategy implements Strategy {
    codegen(node: Node, opt?: Option): string {
        return new CodegenGo(node).result
    }
}
const golangStrategy = new GolangStrategy()

class YamlStrategy implements Strategy {
    codegen(node: Node, opt?: Option): string {
        return new CodegenJson(node).result
    }
}
const yamlStrategy = new JsonStrategy()

export class Codegen {
    private strategy!: Strategy

    switchStrategy(strategy: CodegenStrategy) {
        switch (strategy) {
            case CodegenStrategy.JSON:
                this.strategy = jsonStrategy
                break
            case CodegenStrategy.GOLANG:
                this.strategy = golangStrategy
                break
            case CodegenStrategy.YAML:
                this.strategy = yamlStrategy
                break
        }
    }

    public do(strategy: CodegenStrategy, raw: string, opt?: Option): string {
        this.switchStrategy(strategy)
        const scan = new Scanner(raw)
        const parser = new Parser(scan.tokens)
        return this.strategy.codegen(parser.root, opt)
    }
}

import { Token, TokenType } from './token'

export enum NodeType {
    OBJECT,
    ARRAY,
    BASE
}

export class Node {
    level: number
    key!: Token
    value!: Token | Node[]
    size: number
    nodeType: NodeType

    constructor() {
        this.level = 0
        this.size = 0
        this.nodeType = NodeType.BASE
    }

    addValue(node: Node) {
        if (this.value instanceof Token) {
            return
        }
        if (!this.value) {
            this.value = new Array()
        }
        this.value.push(node)
        this.size++
    }

    getNodes(): Node[] {
        return this.value as Node[]
    }

    setValue(token: Token) {
        this.value = token
    }

    getToken(): Token {
        return this.value as Token
    }
}

export class Parser {
    tokens!: Token[]
    size!: number
    index!: number
    root!: Node

    constructor(tokens: Token[]) {
        this.tokens = tokens
        this.size = tokens.length
        this.index = 0
        this.root = new Node()
        if (!this.size) {
            return
        }
        this.parse(this.root)
    }

    parse(root: Node, level: number = 1) {
        if (this.tokens[this.index].tokenType === TokenType.OPEN_OBJECT) {
            root.nodeType = NodeType.OBJECT
            this.index++
            this.parseObject(root, level)
        }
        if (this.tokens[this.index].tokenType === TokenType.OPEN_ARRAY) {
            root.nodeType = NodeType.ARRAY
            this.index++
            this.parseArray(root, level)
        }
    }

    parseObject(root: Node, level: number = 0) {
        for (; this.index < this.size; this.index++) {
            this.skip()
            if (this.tokens[this.index].tokenType === TokenType.CLOSE_OBJECT) {
                return
            }
            if (this.tokens[this.index].tokenType === TokenType.SEP_COLON) {
                const node = new Node()
                node.level = level
                node.key = this.prev()

                // 解析value
                const nextToken = this.next()
                if (nextToken.isBasicType()) {
                    node.setValue(nextToken)
                } else {
                    this.index++
                    this.parse(node, level + 1)
                }
                root.addValue(node)
            }
        }
    }

    parseArray(root: Node, level: number = 0) {
        for (; this.index < this.size; this.index++) {
            this.skip()
            if (this.tokens[this.index].tokenType === TokenType.CLOSE_ARRAY) {
                return
            }
            const token = this.tokens[this.index]
            const node = new Node()
            node.level = level

            if (token.isBasicType()) {
                node.setValue(token)
            } else {
                this.parse(node, level + 1)
            }
            root.addValue(node)
        }
    }

    skip() {
        while (this.index < this.size) {
            switch (this.tokens[this.index].tokenType) {
                case TokenType.SEP_COMMA:
                case TokenType.COMMENT:
                    this.index++
                    continue
            }
            return
        }
    }

    prev(): Token {
        return this.tokens[this.index - 1]
    }

    next(): Token {
        return this.tokens[this.index + 1]
    }
}

export enum TokenType {
    OPEN_OBJECT = 'open_object', // {
    CLOSE_OBJECT = 'close_object', // }
    OPEN_ARRAY = 'open_array', // [
    CLOSE_ARRAY = 'close_array', // ]
    SEP_COLON = 'sep_colon', // :
    SEP_COMMA = 'sep_comma', // ,
    COMMENT = 'comment', // 注释

    NULL = 'null', // null
    BOOLEAN = 'boolean', // true/false
    STRING = 'string', // 字符串
    INTEGER = 'integer', // 整数
    FLOAT = 'float' // 浮点数
}

// 基础类型
const basicTypes = [TokenType.NULL, TokenType.BOOLEAN, TokenType.STRING, TokenType.INTEGER, TokenType.FLOAT]

export class Token {
    tokenType: TokenType
    value: string
    start: number
    end: number

    constructor(tokenType: TokenType, value: string, start: number) {
        this.tokenType = tokenType
        this.value = value
        this.start = start
        this.end = start + value.length
    }

    isBasicType(): boolean {
        return basicTypes.indexOf(this.tokenType) > -1
    }
}

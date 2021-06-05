import { Token, TokenType } from './token'

type TokenEmpty = Token | null

// 数字
const numerics = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

export class Scanner {
    tokens: Token[]
    raw: string
    index: number
    size: number

    constructor(raw: string) {
        this.raw = raw
        this.size = raw.length
        this.index = 0
        this.tokens = new Array()
        this.tokenize()
    }

    tokenize() {
        for (;;) {
            const token = this.getToken()
            // console.log(token)
            if (token) {
                this.tokens.push(token)
                continue
            }
            break
        }
        // console.log(JSON.stringify(this.tokens, null, 4))
    }

    getToken(): TokenEmpty {
        if (this.index >= this.size) {
            return null
        }
        const cur = this.index
        switch (this.raw[this.index]) {
            case '{':
                this.next()
                return new Token(TokenType.OPEN_OBJECT, '{', cur)
            case '}':
                this.next()
                return new Token(TokenType.CLOSE_OBJECT, '}', cur)
            case '[':
                this.next()
                return new Token(TokenType.OPEN_ARRAY, '[', cur)
            case ']':
                this.next()
                return new Token(TokenType.CLOSE_ARRAY, ']', cur)
            case ':':
                this.next()
                return new Token(TokenType.SEP_COLON, ':', cur)
            case ',':
                this.next()
                return new Token(TokenType.SEP_COMMA, ',', cur)
            case 'n':
                if (this.next('null')) {
                    return new Token(TokenType.NULL, 'null', cur)
                }
                break
            case 't':
                if (this.next('true')) {
                    return new Token(TokenType.BOOLEAN, 'true', cur)
                }
                break
            case 'f':
                if (this.next('false')) {
                    return new Token(TokenType.BOOLEAN, 'false', cur)
                }
                break
            case '"':
                return this.parseString('"')
            case "'":
                return this.parseString("'")
            case '-':
            case '+':
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                const token = this.parseNumber()
                if (token) {
                    return token
                }
                break
            case '/':
                return this.parseComment()
            case ' ':
            case '\n':
            case '\r':
            case '\t':
                this.next()
                return this.getToken()
        }
        return this.parseString()
    }

    next(s?: string): boolean {
        if (!s || s === '') {
            this.index++
            return true
        }
        if (this.raw.substr(this.index, s.length) === s) {
            this.index += s.length
            return true
        }
        return false
    }

    finish(i: number = -1): boolean {
        if (i === -1) {
            i = this.index
        }
        return i >= this.size
    }

    parseString(quote: string = ''): TokenEmpty {
        let i = this.index
        let sep = [':', ' ', ']', '}', ',']
        if (quote.length) {
            sep = [quote]
            i++
        }
        while (sep.indexOf(this.raw[i]) === -1 && !this.finish(i)) {
            i++
        }
        const start = this.index + quote.length
        const value = this.raw.slice(start, i)
        this.index = i + quote.length
        return new Token(TokenType.STRING, value, start)
    }

    parseNumber(): TokenEmpty {
        // 针对浮点数
        let isDecimal = false

        // TODO
        // 针对科学计数法 大数
        // 针对二进制 八进制 十六进制  正0 负0
        //

        let i = this.index
        if (['-', '+'].indexOf(this.raw[this.index]) > -1) {
            i++
        }

        if (this.raw[i] === '0') {
            // 0 后面如果接数字直接返回
            if (numerics.indexOf(this.raw[i + 1]) > 0) {
                return null
            }
        }
        while (numerics.indexOf(this.raw[i]) > -1 && !this.finish(i)) {
            if (numerics.indexOf(this.raw[i]) === 0) {
                if (isDecimal) {
                    // 出现了两次
                    return null
                }
                isDecimal = true
            }
            i++
        }
        const value = this.raw.slice(this.index, i)
        this.index = i
        if (isDecimal) {
            return new Token(TokenType.FLOAT, value, this.index)
        }
        return new Token(TokenType.INTEGER, value, this.index)
    }

    parseComment(): TokenEmpty {
        let i = this.index
        const nextIndex = i + 1
        let end = ''
        switch (this.raw[nextIndex]) {
            case '/':
                end = '\n'
                break
            case '*':
                end = '*/'
                break
            default:
                return null
        }
        const endIndex = this.raw.indexOf(end, nextIndex)
        if (endIndex == -1) {
            return null
        }
        this.index = endIndex + end.length
        const value = this.raw.slice(nextIndex + 1, endIndex)
        return new Token(TokenType.COMMENT, value, nextIndex + 1)
    }
}

import { namedWays } from '../src/util/index'

test('小驼峰命名-1', () => {
    const s = 'hello world'
    expect(namedWays[0](s)).toBe('helloWorld')
})

test('小驼峰命名-2', () => {
    const s = 'hello_world'
    expect(namedWays[0](s)).toBe('helloWorld')
})

test('小驼峰命名-3', () => {
    const s = 'HelloWorld'
    expect(namedWays[0](s)).toBe('helloWorld')
})

test('小驼峰命名-4', () => {
    const s = 'hello-world'
    expect(namedWays[0](s)).toBe('helloWorld')
})

test('大驼峰命名-1', () => {
    const s = 'hello world'
    expect(namedWays[1](s)).toBe('HelloWorld')
})

test('大驼峰命名-2', () => {
    const s = 'hello_world'
    expect(namedWays[1](s)).toBe('HelloWorld')
})

test('大驼峰命名-3', () => {
    const s = 'helloWorld'
    expect(namedWays[1](s)).toBe('HelloWorld')
})

test('大驼峰命名-4', () => {
    const s = 'hello-world'
    expect(namedWays[1](s)).toBe('HelloWorld')
})

test('下划线命名-1', () => {
    const s = 'HelloWorld'
    expect(namedWays[2](s)).toBe('hello_world')
})

test('下划线命名-2', () => {
    const s = 'helloWorld'
    expect(namedWays[2](s)).toBe('hello_world')
})

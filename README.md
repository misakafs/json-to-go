# json-to-go
将json生成go的数据结构。Online tool that convert JSON to Go.

## Online Link | 地址

- [Link1 | 国内](https://json-to-go.vercel.app/)
- [Link2 | 国外](https://misakafs.github.io/json-to-go/)

## Local Develope | 本地开发


> suggest use(强烈建议使用) `pnpm` !!!

- install `pnpm install`

- dev `pnpm dev`

- build `pnpm build`

## custom tag | 自定义tag

- format | 格式

```
<tag name>:[name method]:[is add omitempty]
<tag名字>:[命名方式]:[是否添加omitempty]
```

- name method | 命名方式

0. original | 原样返回
1. abcDef | 小驼峰 - 默认
2. AbcDef | 大驼峰
3. abc_def | 下划线
4. Abcdef | 只有第一个字母大写
5. abcdef | 全都小写

- examples | 例子

`json`

`form`

`json:1:true`

`json:3:false,form:2:true,query:1:false`

## Features | 特征

- custom tag | 支持自定义tag
- custom root object name | 支持自定义根对象名
- support inline | 支持内联结构
- support edit | 支持编辑
- json syntax extension | 对json语法进行了扩展，支持不规范的json
- json check/format/compress | 支持不规范的json的纠正、格式化、压缩


## Reference | 参考

- [UI框架](https://primefaces.org/primevue/showcase/#/setup)
- [ace](https://ace.c9.io/#nav=api)
- [全局事件总线](https://vue3.chengpeiquan.com/communication.html#eventbus-new)
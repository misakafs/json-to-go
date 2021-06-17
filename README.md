# json-to-go
将json生成go的数据结构。Online tool that convert JSON to Go.


## 本地开发

> 强烈建议使用 `pnpm` !!!

- 安装 `pnpm install`

- 调试 `pnpm dev`

- 构建 `pnpm build`

- 部署到github `pnpm page`

## 自定义tag

- 格式

> tag名字:命名方式:是否添加omitempty

- 命名方式

0. 原样返回
1. abcDef 小驼峰 - 默认
2. AbcDef 大驼峰
3. abc_def 下划线
4. Abcdef 
5. abcdef

- 例子

`json`

`form`

`json:1:true`

`json:3:false,form:2:true,query:1:false`

## 特征

- 支持自定义tag
- 支持自定义根对象名
- 支持内联结构
- 支持编辑
- 对json语法进行了扩展，支持不规范的json
- 支持不规范的json的纠正、格式化、压缩


## 参考

- [UI框架](https://primefaces.org/primevue/showcase/#/setup)
- [ace](https://ace.c9.io/#nav=api)
- [全局事件总线](https://vue3.chengpeiquan.com/communication.html#eventbus-new)
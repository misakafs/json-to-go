import { Scanner } from '../src/core/scanner'
import { Parser } from '../src/core/parse'
import { CodegenJson } from '../src/core/codegen_json'

// 生成json字符串
function run(s: string): string {
    // 扫描器生成tokens
    const scan = new Scanner(s)
    // 将tokens解析成树结构
    const parser = new Parser(scan.tokens)
    // 生成json字符串
    const codegen = new CodegenJson(parser.root)
    return codegen.json
}

test('测试简单对象', () => {
    const s = '{"a":1,"b":true,"c":false,"d":null,"e":-1.234,"f":"xxx"}'
    expect(run(s)).toBe(s)
})

test('测试特殊对象', () => {
    const s = '{"a":+1,"b":+0,"c":-0}'
    expect(run(s)).toBe(`{"a":1,"b":0,"c":0}`)
})

test('测试空对象', () => {
    const s = '{}'
    expect(run(s)).toBe(s)
})

test('测试简单数组', () => {
    const s = '[1,true,false,null,"xxx",0,1.23,-0.234]'
    expect(run(s)).toBe(s)
})

test('测试空数组', () => {
    const s = '[]'
    expect(run(s)).toBe(s)
})

test('测试复杂对象-1', () => {
    const s = `{"basic":{"null":null,"true":true,"false":false,"integer0":0,"integer1":23123,"integer2":-2434234,"float0":0.1232,"float1":231.34234,"float2":-31.1231,"float3":-0.2313,"string1":"this is string1","string2":"23121","string3":"sda3242;klk3423"},"complex":{"object1":{"key1":123,"key2":-1.2,"key3":true,"key4":false,"key5":null,"key6":"value","object2":{"arr":["1","2","3"],"arr2":[{"arr2_key1":-123.231,"arr2_key2":"2313","arr2_key3":"[3121]"}]}}},"array1":[1,2,3,4],"array2":[1.342,4.342,-123.34,34,0,-313],"array3":["aaa","bbb","ccc","dddd"],"array4":[true,null,231,"sd32",23.343],"array5":[[1,2,3],[4,5,6]],"array6":[["aaa","bbb"],["ccc"]],"array7":[[true,null],[0,false,null,3.4,-23]],"array8":[[{"key1":123,"key2":"sdad","key3":213.4}]],"array9":[[[{"key1":123,"key2":"sdad","key3":213.4}]]]}`
    expect(run(s)).toBe(s)
})

test('测试复杂对象-2', () => {
    const s = `{"a":1,"b":{"c":true,"d":null,"e":{"f":"xxx"}}}`
    expect(run(s)).toBe(s)
})

test('测试复杂对象-3', () => {
    const s = `{"c":[[{"d":[{"e":[true]}]}]]}`
    expect(run(s)).toBe(s)
})

test('测试复杂对象-4', () => {
    const s = `[{"input_index":0,"candidate_index":0,"delivery_line_1":"1 N Rosedale St","last_line":"Baltimore MD 21229-3737","delivery_point_barcode":"212293737013","components":{"primary_number":"1","street_predirection":"N","street_name":"Rosedale","street_suffix":"St","city_name":"Baltimore","state_abbreviation":"MD","zipcode":"21229","plus4_code":"3737","delivery_point":"01","delivery_point_check_digit":"3"},"metadata":{"record_type":"S","zip_type":"Standard","county_fips":"24510","county_name":"Baltimore City","carrier_route":"C047","congressional_district":"07","rdi":"Residential","elot_sequence":"0059","elot_sort":"A","latitude":39.28602,"longitude":-76.6689,"precision":"Zip9","time_zone":"Eastern","utc_offset":-5,"dst":true},"analysis":{"dpv_match_code":"Y","dpv_footnotes":"AABB","dpv_cmra":"N","dpv_vacant":"N","active":"Y"}},{"input_index":0,"candidate_index":1,"delivery_line_1":"1 S Rosedale St","last_line":"Baltimore MD 21229-3739","delivery_point_barcode":"212293739011","components":{"primary_number":"1","street_predirection":"S","street_name":"Rosedale","street_suffix":"St","city_name":"Baltimore","state_abbreviation":"MD","zipcode":"21229","plus4_code":"3739","delivery_point":"01","delivery_point_check_digit":"1"},"metadata":{"record_type":"S","zip_type":"Standard","county_fips":"24510","county_name":"Baltimore City","carrier_route":"C047","congressional_district":"07","rdi":"Residential","elot_sequence":"0064","elot_sort":"A","latitude":39.2858,"longitude":-76.66889,"precision":"Zip9","time_zone":"Eastern","utc_offset":-5,"dst":true},"analysis":{"dpv_match_code":"Y","dpv_footnotes":"AABB","dpv_cmra":"N","dpv_vacant":"N","active":"Y"}}]`
    expect(run(s)).toBe(s)
})

test('测试复杂对象-5', () => {
    const s = `[[[[[[[[[[[[[1]]]]]]]]]]]]]`
    expect(run(s)).toBe(s)
})

test('测试复杂对象-6', () => {
    const s = `[{"a":1231},{"a":1231},{"a":1231}]`
    expect(run(s)).toBe(s)
})

test('测试复杂对象-7', () => {
    const s = `{a:23,b:{"z":true,"x":[{p:-0.2,q:null}]}}`
    expect(run(s)).toBe(`{"a":23,"b":{"z":true,"x":[{"p":-0.2,"q":null}]}}`)
})

test('测试复杂对象-8', () => {
    const s = `{1:"a",2:"b",3:"c"}`
    expect(run(s)).toBe(`{"1":"a","2":"b","3":"c"}`)
})

test('测试复杂对象-9', () => {
    const s = `{
    b:1,
    c:dad
    }`
    expect(run(s)).toBe(`{"b":1,"c":"dad"}`)
})

test('语法扩展-1', () => {
    const s = `{
        "a":123
        "b":true
        c:[1 2 3]
    }`
    expect(run(s)).toBe(`{"a":123,"b":true,"c":[1,2,3]}`)
})

test('语法扩展-2', () => {
    const s = `[a b c {c:false} true null]`
    expect(run(s)).toBe(`["a","b","c",{"c":false},true,null]`)
})

test('语法扩展-3', () => {
    const s = `{
        a:-1231.323
        b:     {
            z:31
            // 测试
            p:       true
            123:"key是字符串"
        }
    }`
    expect(run(s)).toBe(`{"a":-1231.323,"b":{"z":31,"p":true,"123":"key是字符串"}}`)
})

test('测试注释-1', () => {
    const s = `{
        "a": 123, // 数字
        "b": "xxx",
        "c": [  /* 数组 */
            true,
            23123,
            0
        ]
    }`
    expect(run(s)).toBe(`{"a":123,"b":"xxx","c":[true,23123,0]}`)
})

test('测试注释-2', () => {
    const s = `{
        "a": 123, // 数字
        "b": "xxx",
        "c": [  /* 数组 */
            true,
            /* 注释1 */
            23123,
            0
            // 注释2
        ]
    }`
    expect(run(s)).toBe(`{"a":123,"b":"xxx","c":[true,23123,0]}`)
})

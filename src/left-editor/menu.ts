import { ref } from 'vue'
import { setLeftEditorValue, onLeftEditorCheck, onLeftEditorFmt, onLeftEditorCompress } from '../bus/event'

const demo1 = `{
        a:-1231.323
        b:     {
            z:31
            // 测试
            p:       true
            123:"key是字符串"
        }
    }`
const demo2 = `{
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
const demo3 = `[{"input_index":0,"candidate_index":0,"delivery_line_1":"1 N Rosedale St","last_line":"Baltimore MD 21229-3737","delivery_point_barcode":"212293737013","components":{"primary_number":"1","street_predirection":"N","street_name":"Rosedale","street_suffix":"St","city_name":"Baltimore","state_abbreviation":"MD","zipcode":"21229","plus4_code":"3737","delivery_point":"01","delivery_point_check_digit":"3"},"metadata":{"record_type":"S","zip_type":"Standard","county_fips":"24510","county_name":"Baltimore City","carrier_route":"C047","congressional_district":"07","rdi":"Residential","elot_sequence":"0059","elot_sort":"A","latitude":39.28602,"longitude":-76.6689,"precision":"Zip9","time_zone":"Eastern","utc_offset":-5,"dst":true},"analysis":{"dpv_match_code":"Y","dpv_footnotes":"AABB","dpv_cmra":"N","dpv_vacant":"N","active":"Y"}},{"input_index":0,"candidate_index":1,"delivery_line_1":"1 S Rosedale St","last_line":"Baltimore MD 21229-3739","delivery_point_barcode":"212293739011","components":{"primary_number":"1","street_predirection":"S","street_name":"Rosedale","street_suffix":"St","city_name":"Baltimore","state_abbreviation":"MD","zipcode":"21229","plus4_code":"3739","delivery_point":"01","delivery_point_check_digit":"1"},"metadata":{"record_type":"S","zip_type":"Standard","county_fips":"24510","county_name":"Baltimore City","carrier_route":"C047","congressional_district":"07","rdi":"Residential","elot_sequence":"0064","elot_sort":"A","latitude":39.2858,"longitude":-76.66889,"precision":"Zip9","time_zone":"Eastern","utc_offset":-5,"dst":true},"analysis":{"dpv_match_code":"Y","dpv_footnotes":"AABB","dpv_cmra":"N","dpv_vacant":"N","active":"Y"}}]`


export function useMenu() {
    const items = ref([
        {
            label: '例子',
            items: [
                {
                    label: '第一个🌰',
                    command: () => {
                        setLeftEditorValue(demo1)
                    }
                },
                {
                    label: '第二个🌰',
                    command: () => {
                        setLeftEditorValue(demo2)
                    }
                },
                {
                    label: '第三个🌰',
                    command: () => {
                        setLeftEditorValue(demo3)
                    }
                }
            ]
        },
        {
            label: '操作',
            items: [
                {
                    label: 'JSON纠正',
                    command: () => {
                        onLeftEditorCheck()
                    }
                },
                {
                    label: 'JSON格式化',
                    command: () => {
                        onLeftEditorFmt()
                    }
                },
                {
                    label: 'JSON压缩',
                    command: () => {
                        onLeftEditorCompress()
                    }
                }
            ]
        }
    ])

    const menu = ref<any>({})
    const toggleFn = (event: any) => {
        menu.value.toggle(event)
    }

    return {
        items,
        menu,
        toggleFn
    }
}

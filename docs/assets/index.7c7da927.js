import{m as e,h as t,d as n,C as i,P as s,T as r,a,s as l,b as o,c as u,e as d,f as c,g as h,i as p,j as m,k as g,l as v,n as f}from"./vendor.8f3df4b3.js";var V,N;function k(e,t){const n=Vue.ref(null);return Vue.onMounted((()=>{n.value=ace.edit(e),n.value.setTheme("ace/theme/tomorrow"),t&&n.value.session.setMode(t)})),{editor:n}}ace.config.set("basePath","https://cdn.jsdelivr.net/npm/ace-builds@1.4.12/src-noconflict/"),(N=V||(V={})).hjson="ace/mode/hjson",N.go="ace/mode/golang";var y,x,T=e();(x=y||(y={})).OPEN_OBJECT="open_object",x.CLOSE_OBJECT="close_object",x.OPEN_ARRAY="open_array",x.CLOSE_ARRAY="close_array",x.SEP_COLON="sep_colon",x.SEP_COMMA="sep_comma",x.COMMENT="comment",x.NULL="null",x.BOOLEAN="boolean",x.STRING="string",x.INTEGER="integer",x.FLOAT="float";const _=[y.NULL,y.BOOLEAN,y.STRING,y.INTEGER,y.FLOAT];class w{constructor(e,t,n){this.tokenType=e,this.value=t,this.start=n,this.end=n+t.length}isBasicType(){return _.indexOf(this.tokenType)>-1}}const b=[".","0","1","2","3","4","5","6","7","8","9"],O=[" ",",","\n","\r","\t","}","]","/"];class E{constructor(e){this.raw=e,this.size=e.length,this.index=0,this.tokens=new Array,this.tokenize()}tokenize(){for(;;){const e=this.getToken();if(!e)break;this.tokens.push(e)}}getToken(){if(this.index>=this.size)return null;const e=this.index;switch(this.raw[this.index]){case"{":return this.next(),new w(y.OPEN_OBJECT,"{",e);case"}":return this.next(),new w(y.CLOSE_OBJECT,"}",e);case"[":return this.next(),new w(y.OPEN_ARRAY,"[",e);case"]":return this.next(),new w(y.CLOSE_ARRAY,"]",e);case":":return this.next(),new w(y.SEP_COLON,":",e);case",":return this.next(),new w(y.SEP_COMMA,",",e);case"n":if(this.next("null"))return new w(y.NULL,"null",e);break;case"t":if(this.next("true"))return new w(y.BOOLEAN,"true",e);break;case"f":if(this.next("false"))return new w(y.BOOLEAN,"false",e);break;case'"':return this.parseString('"');case"'":return this.parseString("'");case"-":case"+":case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":const t=this.parseNumber();if(t)return t;break;case"/":return this.parseComment();case" ":case"\n":case"\r":case"\t":return this.next(),this.getToken()}return this.parseString()}next(e){return e&&""!==e?this.raw.substr(this.index,e.length)===e&&(this.index+=e.length,!0):(this.index++,!0)}finish(e=-1){return-1===e&&(e=this.index),e>=this.size}parseString(e=""){let t=this.index,n=[":"," ","]","}",",","\n","\r"],i=!1;for(e.length&&(i=!0,n=[e],t++);!this.finish(t);)if(i&&"\\"==this.raw[t])t+=2;else{if(-1!==n.indexOf(this.raw[t]))break;t++}const s=this.index+e.length,r=this.raw.slice(s,t);return this.index=t+e.length,new w(y.STRING,r,s)}parseNumber(){let e=!1,t=this.index;if(["-","+"].indexOf(this.raw[this.index])>-1&&t++,"0"===this.raw[t]&&b.indexOf(this.raw[t+1])>0)return null;for(;b.indexOf(this.raw[t])>-1&&!this.finish(t);){if(0===b.indexOf(this.raw[t])){if(e)return null;e=!0}t++}if(!this.finish(t)&&-1===O.indexOf(this.raw[t]))return null;if("/"===this.raw[t]&&"/"!==this.raw[t+1]&&"*"!==this.raw[t+1])return null;const n=this.raw.slice(this.index,t);return this.index=t,new w(e?y.FLOAT:y.INTEGER,n,this.index)}parseComment(){const e=this.index+1;let t="";switch(this.raw[e]){case"/":t="\n";break;case"*":t="*/";break;default:return null}const n=this.raw.indexOf(t,e);if(-1==n)return null;this.index=n+t.length;const i=this.raw.slice(e+1,n);return new w(y.COMMENT,i,e+1)}}var A,S;(S=A||(A={}))[S.OBJECT=0]="OBJECT",S[S.ARRAY=1]="ARRAY",S[S.BASE=2]="BASE";class C{constructor(){this.level=0,this.size=0,this.nodeType=2}addNode(e){var t,n;if(!(this.value instanceof w)){if(this.value||(this.value=new Array),null==(t=null==e?void 0:e.key)?void 0:t.value)for(let t=0;t<this.size;t++)if((null==(n=this.value[t].key)?void 0:n.value)===e.key.value)return void(this.value[t]=e);this.value.push(e),this.size++}}getNodes(){return this.value}setValue(e){this.value=e}getToken(){return this.value}}class R{constructor(e){this.tokens=e,this.size=e.length,this.index=0,this.root=new C,this.size&&this.parse(this.root)}parse(e,t=1){if(this.tokens[this.index].tokenType===y.OPEN_ARRAY)return e.nodeType=1,this.index++,void this.parseArray(e,t);e.nodeType=0,this.index++,this.parseObject(e,t)}parseObject(e,t=0){for(;this.index<this.size;this.index++){if(this.skip())return;if(this.tokens[this.index].tokenType===y.CLOSE_OBJECT)return;if(this.tokens[this.index].tokenType===y.SEP_COLON){const n=new C;n.level=t,n.key=this.prev();const i=this.next();if(!i)return;i.isBasicType()?n.setValue(i):(this.index++,this.parse(n,t+1)),e.addNode(n)}}}parseArray(e,t=0){for(;this.index<this.size;this.index++){if(this.skip())return;if(this.tokens[this.index].tokenType===y.CLOSE_ARRAY)return;const n=this.tokens[this.index],i=new C;i.level=t,n.isBasicType()?i.setValue(n):this.parse(i,t+1),e.addNode(i)}}skip(){for(;this.index<this.size;){switch(this.tokens[this.index].tokenType){case y.SEP_COMMA:case y.COMMENT:this.index++;continue}return!1}return!0}prev(){return this.tokens[this.index-1]}next(){return this.tokens[this.index+1]}}class L{constructor(e,t){this.layer=0,this.result="",this.opt=t,this.traverseTree(e),this.result=this.result.trim()}getIndent(){var e;return(null==(e=this.opt)?void 0:e.format)?"    ".repeat(this.layer):""}getSpace(){var e;return(null==(e=this.opt)?void 0:e.format)?" ":""}getWrapRow(){var e;return(null==(e=this.opt)?void 0:e.format)?"\n":""}traverseTree(e){const t=e.size-1;if(e.key&&(this.result+=`${this.getIndent()}"${e.key.value}":${this.getSpace()}`),this.handlerElement(e),e.nodeType===A.OBJECT){this.result+=`{${this.getWrapRow()}`,this.layer++;for(let n=0;n<e.size;n++)this.traverseTree(e.getNodes()[n]),this.result+=n==t?`${this.getWrapRow()}`:`,${this.getWrapRow()}`;this.layer--,this.result+=`${this.getIndent()}}`}if(e.nodeType===A.ARRAY){this.result+="[";for(let n=0;n<e.size;n++)this.traverseTree(e.getNodes()[n]),this.result+=n==t?"":`${this.getSpace()},`;this.result+="]"}}handlerElement(e){if(null==e?void 0:e.value){let t=e.getToken().value;switch(e.getToken().tokenType){case y.INTEGER:t=Number.parseInt(t).toString();case y.FLOAT:t=Number.parseFloat(t).toString();case y.NULL:case y.BOOLEAN:this.result+=t;break;case y.STRING:this.result+=`"${t}"`}}}}const $=function(e){return e},B=function(e){return t.camelize(e)},I=function(e){return t.pascalize(e)},z=function(e){return t.decamelize(e,{separator:"_"})},M=function(e){return(e=t.decamelize(e,{separator:""})).replace(e[0],e[0].toUpperCase())},F=function(e){return t.decamelize(e,{separator:""})};function j(e,t){switch(e){case 0:return $(t);case 1:return B(t);case 2:return I(t);case 3:return z(t);case 4:return M(t);case 5:return F(t)}return t}var G,J;(J=G||(G={})).BOOL="bool",J.STRING="string",J.INT="int",J.INT64="int64",J.FLOAT="float64",J.INTERFACE="interface{}",J.STRUCT="struct";let Y=1;const D=new RegExp(/^[a-zA-Z]{1}[\w-]*$/),P=new RegExp(/^(\-|\+)?\d+(\.\d+)?$/);class U{constructor(e){this.origin=e,this.name=j(2,this._handlerName(e)),this.allowEmpty=!1,this.repeatTimes=0,this.childNameMaxLength=0,this.childKindMaxLength=0}_handlerName(e){return""===(e=e.trim())&&(e="EmptyField"+Y,Y++),D.test(e)||(e=P.test(e)?"NumberField"+Y:"StringField"+Y,Y++),e}addNode(e,t){var n;if(this.childs||(this.childs=new Array),e.name.length>this.childNameMaxLength&&(this.childNameMaxLength=e.name.length),e.kind){let n=e.kind;const i=e.kind.lastIndexOf("[]");let s=e.kind;i>-1&&(s=e.kind.slice(i+2)),!1===(null==t?void 0:t.inline)&&-1===K.indexOf(s)&&(n=e.name,i>-1&&(n=n.slice(0,i+2)+e.name)),n.length>this.childKindMaxLength&&(this.childKindMaxLength=n.length)}for(let i=this.childs.length-1;i>=0;i--)if(e.name===(null==(n=this.childs[i])?void 0:n.name))return this.childs[i]=e,this.allowEmpty=!0,void(e.repeatTimes+=1);this.childs.push(e)}}const K=[G.BOOL.toString(),G.INT.toString(),G.INT64.toString(),G.FLOAT.toString(),G.STRING.toString(),G.INTERFACE.toString()],W=[G.INT.toString(),G.INT64.toString(),G.FLOAT.toString()],Z={rootName:"RootObject",inline:!1,tags:[{name:"json",named:1,omitempty:!1}]},q=BigInt(1073741824),H=BigInt(-2147483648),Q=BigInt(0x4000000000000000),X=BigInt(-0x8000000000000000);class ee{constructor(e,t){var n;Y=1,this.result="",this.structs=new Array,this.opt=Object.assign({},Z,t);const i=this.gen(e);i&&(this.result=this.codegen(i),!(null==(n=this.opt)?void 0:n.inline)&&this.structs.length&&(this.result=this.structs.join("\n"))),this.result=this.result.trim()}addStruct(e){for(let t=this.structs.length-1;t>=0;t--)if(this.structs[t]===e)return;this.structs.unshift(e)}gen(e,t,n){var i,s,r,a,l,o,u,d;let c=null;switch(e.nodeType){case A.BASE:return t===A.ARRAY?null:e.getToken()?(c=new U(null!=(s=null==(i=null==e?void 0:e.key)?void 0:i.value)?s:"field"),c.kind=this.getKind(e),c):null;case A.ARRAY:t!==A.ARRAY&&(c=new U(null!=(l=null==(r=null==e?void 0:e.key)?void 0:r.value)?l:null==(a=this.opt)?void 0:a.rootName),c.kind=this.getKind(e));for(let t=0;t<e.size;t++){const i=this.gen(e.getNodes()[t],A.ARRAY,null!=c?c:n);i&&(c?null==c||c.addNode(i,this.opt):n&&n.addNode(i,this.opt))}return c;case A.OBJECT:if(t===A.ARRAY&&0===e.size)return null;c=new U(null!=(d=null==(o=null==e?void 0:e.key)?void 0:o.value)?d:null==(u=this.opt)?void 0:u.rootName),c.kind=this.getKind(e);for(let t=0;t<e.size;t++){const n=this.gen(e.getNodes()[t],A.OBJECT);n&&c.addNode(n,this.opt)}if(t===A.ARRAY&&n){for(let e=0;e<c.childs.length;e++)n.addNode(c.childs[e],this.opt);return null}return c}return null}getKind(e){switch(e.nodeType){case A.OBJECT:return G.STRUCT;case A.ARRAY:if(0==e.size)return"[]"+G.INTERFACE;let t=this.getKind(e.getNodes()[0]);for(let n=1;n<e.size;n++){let i=this.getKind(e.getNodes()[n]);if(i!==t){if(W.indexOf(i)>-1&&W.indexOf(t)>-1){t=G.FLOAT;continue}return"[]"+G.INTERFACE}}switch(t){case G.BOOL:case G.STRING:case G.INT:case G.INT64:case G.FLOAT:return"[]"+t;default:return"[]"+this.getKind(e.getNodes()[0])}}let t=0;switch(e.getToken().tokenType){case y.BOOLEAN:return G.BOOL;case y.STRING:return G.STRING;case y.INTEGER:return t=+e.getToken().value,t>Q||t<X?G.FLOAT:t>q||t<H?G.INT64:G.INT;case y.FLOAT:return t=+e.getToken().value,G.FLOAT}return G.INTERFACE}getTag(e,t=null){var n,i;if(!(null==(i=null==(n=this.opt)?void 0:n.tags)?void 0:i.length))return"";let s=new Array;for(let r=0;r<this.opt.tags.length;r++){const n=this.opt.tags[r];let i=`${n.name}:"${j(n.named,e.origin)}`;(n.omitempty||t&&t.allowEmpty&&0===e.repeatTimes)&&(i+=",omitempty"),i+='"',s.push(i)}return"`"+s.join(" ")+"`"}codegen(e,t=null,n=""){var i,s,r;const a=null!=(i=null==t?void 0:t.childNameMaxLength)?i:0,l=null!=(s=null==t?void 0:t.childKindMaxLength)?s:0;let o="";return e.kind&&-1!==K.indexOf(e.kind)&&(o+=`${n}${e.name.padEnd(a)} ${e.kind.padEnd(l)} ${this.getTag(e,t)}\n`),(null==(r=this.opt)?void 0:r.inline)?o+=this.codegen_inline(e,t,n):o+=this.codegen_noinline(e,t,n),o}codegen_inline(e,t=null,n=""){var i,s,r,a,l,o,u,d,c,h,p,m;const g=null!=(i=null==t?void 0:t.childNameMaxLength)?i:0,v=null!=(s=null==t?void 0:t.childKindMaxLength)?s:0;let f="";if(e.kind===G.STRUCT){if(n.length?f+=`${n}${e.name.padEnd(g)} ${e.kind} {\n`:f+=`type ${e.name} ${e.kind} {\n`,e.childs){const t=null!=(a=null==(r=e.childs)?void 0:r.length)?a:0;for(let i=0;i<t;i++)f+=this.codegen(e.childs[i],e,"    "+n)}n.length?f+=`${n}} ${this.getTag(e,t)}\n`:f+=`${n}}\n`}if(-1!==(null==(l=e.kind)?void 0:l.indexOf("[]"))){const i=(null!=(u=null==(o=e.kind)?void 0:o.indexOf("struct"))?u:-1)>-1,s=null!=(c=null==(d=e.childs)?void 0:d.length)?c:0;if(i?n.length?f+=`${n}${e.name.padEnd(g)} ${e.kind} {\n`:f+=`type ${e.name} ${e.kind} {\n`:n.length?f+=`${n}${e.name.padEnd(g)} ${null==(h=e.kind)?void 0:h.padEnd(v)} ${this.getTag(e,t)}\n`:(f+=`type ${e.name} ${e.kind}`,s>0&&(f+=" {\n")),i&&e.childs){const t=null!=(m=null==(p=e.childs)?void 0:p.length)?m:0;for(let i=0;i<t;i++)f+=this.codegen(e.childs[i],e,"    "+n)}i&&(n.length?f+=`${n}} ${this.getTag(e,t)}\n`:s>0&&(f+=`${n}}\n`))}return f}codegen_noinline(e,t=null,n=""){var i,s,r,a,l;const o=null!=(i=null==t?void 0:t.childNameMaxLength)?i:0,u=null!=(s=null==t?void 0:t.childKindMaxLength)?s:0;let d="";if(e.kind===G.STRUCT){let i="";if(t&&(d+=`${n.length?n:"type "}${e.name.padEnd(o)} ${e.name.padEnd(u)} ${this.getTag(e,t)}\n`),i+=`type ${e.name} struct {\n`,e.childs){const t=null!=(r=e.childs.length)?r:0;for(let n=0;n<t;n++)i+=this.codegen(e.childs[n],e,"    ")}i+="}\n",this.addStruct(i)}if(e.kind&&-1!==e.kind.indexOf("[]")){const i=(null!=(a=e.kind.indexOf("struct"))?a:-1)>-1;let s="";if(i){s+=`type ${e.name} ${n.length?"struct":e.kind} {\n`;const i=e.kind.replaceAll("struct","")+e.name;d+=`${n}${e.name.padEnd(o)} ${i.padEnd(u)} ${this.getTag(e,t)}\n`}else d+=`${n.length?n:"type "}${e.name.padEnd(o)} ${e.kind.padEnd(u)}`,n.length&&(d+=` ${this.getTag(e,t)}`),d+="\n";if(i&&e.childs){const t=null!=(l=e.childs.length)?l:0;for(let n=0;n<t;n++)s+=this.codegen(e.childs[n],e,"    ")}i&&(s+="}\n",this.addStruct(s))}return d}}var te,ne;(ne=te||(te={}))[ne.JSON=0]="JSON",ne[ne.GOLANG=1]="GOLANG";const ie=new class{codegen(e,t){return new L(e,t).result}};const se=new class{codegen(e,t){return new ee(e,t).result}};class re{switchStrategy(e){switch(e){case 0:this.strategy=ie;break;case 1:this.strategy=se}}do(e,t,n){this.switchStrategy(e);const i=new E(t),s=new R(i.tokens);return this.strategy.codegen(s.root,n)}}let ae;const le=e=>{T.emit("left.editor.set",e)},oe=()=>{T.emit("left.editor.transform")};const ue=e=>{T.emit("right.editor.set",e)};function de(){const e=Vue.ref([{label:"例子",items:[{label:"第一个🌰",command:()=>{le('{\n        a:-1231.323\n        b:     {\n            z:31\n            // 测试\n            p:       true\n            123:"key是字符串"\n        }\n    }')}},{label:"第二个🌰",command:()=>{le('{\n        "a": 123, // 数字\n        "b": "xxx",\n        "c": [  /* 数组 */\n            true,\n            /* 注释1 */\n            23123,\n            0\n            // 注释2\n        ]\n    }')}},{label:"第三个🌰",command:()=>{le('[{"input_index":0,"candidate_index":0,"delivery_line_1":"1 N Rosedale St","last_line":"Baltimore MD 21229-3737","delivery_point_barcode":"212293737013","components":{"primary_number":"1","street_predirection":"N","street_name":"Rosedale","street_suffix":"St","city_name":"Baltimore","state_abbreviation":"MD","zipcode":"21229","plus4_code":"3737","delivery_point":"01","delivery_point_check_digit":"3"},"metadata":{"record_type":"S","zip_type":"Standard","county_fips":"24510","county_name":"Baltimore City","carrier_route":"C047","congressional_district":"07","rdi":"Residential","elot_sequence":"0059","elot_sort":"A","latitude":39.28602,"longitude":-76.6689,"precision":"Zip9","time_zone":"Eastern","utc_offset":-5,"dst":true},"analysis":{"dpv_match_code":"Y","dpv_footnotes":"AABB","dpv_cmra":"N","dpv_vacant":"N","active":"Y"}},{"input_index":0,"candidate_index":1,"delivery_line_1":"1 S Rosedale St","last_line":"Baltimore MD 21229-3739","delivery_point_barcode":"212293739011","components":{"primary_number":"1","street_predirection":"S","street_name":"Rosedale","street_suffix":"St","city_name":"Baltimore","state_abbreviation":"MD","zipcode":"21229","plus4_code":"3739","delivery_point":"01","delivery_point_check_digit":"1"},"metadata":{"record_type":"S","zip_type":"Standard","county_fips":"24510","county_name":"Baltimore City","carrier_route":"C047","congressional_district":"07","rdi":"Residential","elot_sequence":"0064","elot_sort":"A","latitude":39.2858,"longitude":-76.66889,"precision":"Zip9","time_zone":"Eastern","utc_offset":-5,"dst":true},"analysis":{"dpv_match_code":"Y","dpv_footnotes":"AABB","dpv_cmra":"N","dpv_vacant":"N","active":"Y"}}]')}},{label:"第四个🌰",command:()=>{le('{\n    "basic": {\n        "null": null,\n        "true": true,\n        "false": false,\n        "integer0": 0,\n        "integer1": 23123,\n        "integer2": -2434234,\n        "float0": 0.1232,\n        "float1": 231.34234,\n        "float2": -31.1231,\n        "float3": -0.2313,\n        "string1": "this is string1",\n        "string2": "23121",\n        "string3": "sda3242;klk3423",\n        "int64": 4876918452693760\n    },\n    "complex": {\n        "object1": {\n            "key1": 123,\n            "key2": -1.2,\n            "key3": true,\n            "key4": false,\n            "key5": null,\n            "key6": "value",\n            "object2": {\n                "arr": ["1" ,"2" ,"3"],\n                "arr2": [{\n                    "arr2_key1": -123.231,\n                    "arr2_key2": "2313",\n                    "arr2_key3": "[3121]"\n                }]\n            }\n        }\n    },\n    "array1": [1 ,2 ,3 ,4],\n    "array2": [1.342 ,4.342 ,-123.34 ,34 ,0 ,-313],\n    "array3": ["aaa" ,"bbb" ,"ccc" ,"dddd"],\n    "array4": [true ,null ,231 ,"sd32" ,23.343],\n    "array5": [[1 ,2 ,3] ,[4 ,5 ,6]],\n    "array6": [["aaa" ,"bbb"] ,["ccc"]],\n    "array7": [[true ,null] ,[0 ,false ,null ,3.4 ,-23]],\n    "array8": [[{\n        "key1": 123,\n        "key2": "sdad",\n        "key3": 213.4\n    }]],\n    "array9": [[[{\n        "key1": 123,\n        "key2": "sdad",\n        "key3": 213.4\n    }]]]\n}')}}]},{label:"操作",items:[{label:"JSON纠正",command:()=>{T.emit("left.editor.check")}},{label:"JSON格式化",command:()=>{T.emit("left.editor.fmt")}},{label:"JSON压缩",command:()=>{T.emit("left.editor.compress")}}]}]),t=Vue.ref({});return{items:e,menu:t,toggleFn:e=>{t.value.toggle(e)}}}const ce=Vue.createVNode("span",{class:"pi pi-github"},null,-1),he=Vue.createVNode("span",{class:"pi pi-trash"},null,-1),pe={class:"left-copy p-panel-header-icon p-link p-mr-4"},me=Vue.createVNode("span",{class:"pi pi-copy"},null,-1),ge=Vue.createVNode("span",{class:"pi pi-forward"},null,-1),ve=Vue.createVNode("span",{class:"pi pi-bars"},null,-1),fe=Vue.createVNode("pre",{id:"leftEditor",class:"editor"},null,-1);var Ve=Vue.defineComponent({expose:[],setup(e){const{editor:t}=k("leftEditor",V.hjson),{items:s,menu:r,toggleFn:a}=de();!function(e){const t=new re;T.on("left.editor.set",(t=>{e.value.setValue(t),e.value.execCommand("gotolineend")})),T.on("left.editor.check",(()=>{const n=t.do(te.JSON,e.value.getValue(),{format:!0});le(n)})),T.on("left.editor.fmt",(()=>{const n=t.do(te.JSON,e.value.getValue(),{format:!0});le(n)})),T.on("left.editor.compress",(()=>{const n=t.do(te.JSON,e.value.getValue());le(n)})),T.on("left.editor.transform",(()=>{const n=t.do(te.GOLANG,e.value.getValue(),ae);ue(n)}))}(t),Vue.onMounted((()=>{t.value.setOption("wrap","free"),t.value.on("blur",(function(){u()})),t.value.on("change",n((function(){u()}),300))}));const l=()=>{window.open("https://github.com/misakafs/json-to-go","_blank")},o=()=>{le(""),oe()};Vue.onMounted((()=>{new i(".left-copy",{text:function(e){return t.value.getValue()}})}));const u=()=>{oe()};return(e,t)=>{const n=Vue.resolveComponent("Menu"),i=Vue.resolveComponent("Panel"),d=Vue.resolveDirective("tooltip");return Vue.openBlock(),Vue.createBlock(i,{header:"JSON"},{icons:Vue.withCtx((()=>[Vue.withDirectives(Vue.createVNode("button",{class:"p-panel-header-icon p-link p-mr-4",onClick:l},[ce],512),[[d,"源码",void 0,{bottom:!0}]]),Vue.withDirectives(Vue.createVNode("button",{class:"p-panel-header-icon p-link p-mr-4",onClick:o},[he],512),[[d,"清空",void 0,{bottom:!0}]]),Vue.withDirectives(Vue.createVNode("button",pe,[me],512),[[d,"复制",void 0,{bottom:!0}]]),Vue.withDirectives(Vue.createVNode("button",{class:"p-panel-header-icon p-link p-mr-4",onClick:u},[ge],512),[[d,"转换",void 0,{bottom:!0}]]),Vue.withDirectives(Vue.createVNode("button",{class:"p-panel-header-icon p-link p-mr-4",onClick:t[1]||(t[1]=(...e)=>Vue.unref(a)&&Vue.unref(a)(...e))},[ve],512),[[d,"更多",void 0,{bottom:!0}]]),Vue.createVNode(n,{id:"config_menu",ref:r,model:Vue.unref(s),popup:!0},null,8,["model"])])),default:Vue.withCtx((()=>[fe])),_:1})}}});const Ne=Vue.createVNode("span",{class:"pi pi-question"},null,-1),ke=Vue.createVNode("span",{class:"pi pi-refresh"},null,-1),ye={class:"right-copy p-panel-header-icon p-link p-mr-2"},xe=Vue.createVNode("span",{class:"pi pi-copy"},null,-1),Te=Vue.createVNode("span",{class:"pi pi-cog"},null,-1),_e=Vue.createVNode("pre",{id:"rightEditor",class:"editor"},null,-1),we=Vue.createVNode("p",null,"基本功能已完善",-1),be={class:"p-field-checkbox"},Oe=Vue.createVNode("label",{for:"binary"}," 是否内联类型",-1),Ee=Vue.createVNode("h5",null,"根对象名",-1),Ae=Vue.createVNode("h5",null,[Vue.createTextVNode("自定义Tag "),Vue.createVNode("a",{href:"https://github.com/misakafs/json-to-go/blob/main/README.md#%E8%87%AA%E5%AE%9A%E4%B9%89tag",target:"_blank"},"使用教程")],-1);var Se=Vue.defineComponent({expose:[],setup(e){const{editor:t}=k("rightEditor",V.go);!function(e){T.on("right.editor.set",(t=>{e.value.setValue(t),e.value.execCommand("gotolineend")}))}(t);const n=Vue.ref(!1),s=()=>{n.value=!0},r=Vue.ref(!1),a=Vue.ref("只读"),l=Vue.ref("pi-eye"),o=()=>{r.value=!r.value,a.value=r.value?"编辑":"只读",l.value=r.value?"pi-pencil":"pi-eye",t.value.setReadOnly(r.value)},u=()=>{g()};Vue.onMounted((()=>{new i(".right-copy",{text:function(e){return t.value.getValue()}})}));const d=Vue.ref(!1),c=()=>{d.value=!0},h=Vue.ref(!1),p=Vue.ref("json:1:false"),m=Vue.ref("RootObject"),g=()=>{(e=>{var t,n,i;if(e){if(null==(t=null==e?void 0:e.tag)?void 0:t.length){const t=e.tag.split(","),s=new Array;for(let e=0;e<t.length;e++){const r=t[e].split(":");r[0]&&s.push({name:r[0],named:+(null!=(n=r[1])?n:1),omitempty:"true"===(null!=(i=r[2])?i:"false")})}e.tags=s}else e.tags=[];ae=e,oe()}})({inline:h.value,tag:p.value.trim(),rootName:m.value})};return Vue.watch([h,p,m],(()=>{g()})),Vue.onMounted((()=>{g()})),(e,t)=>{const i=Vue.resolveComponent("Panel"),r=Vue.resolveComponent("Dialog"),g=Vue.resolveComponent("Checkbox"),v=Vue.resolveComponent("InputText"),f=Vue.resolveComponent("Sidebar"),V=Vue.resolveDirective("tooltip");return Vue.openBlock(),Vue.createBlock(Vue.Fragment,null,[Vue.createVNode(i,{header:"GO"},{icons:Vue.withCtx((()=>[Vue.withDirectives(Vue.createVNode("button",{class:"p-panel-header-icon p-link p-mr-4",onClick:s},[Ne],512),[[V,"关于",void 0,{bottom:!0}]]),Vue.withDirectives(Vue.createVNode("button",{class:"p-panel-header-icon p-link p-mr-4",onClick:o},[Vue.createVNode("span",{class:["pi",l.value]},null,2)],512),[[V,a.value,void 0,{bottom:!0}]]),Vue.withDirectives(Vue.createVNode("button",{class:"p-panel-header-icon p-link p-mr-2",onClick:u},[ke],512),[[V,"刷新",void 0,{bottom:!0}]]),Vue.withDirectives(Vue.createVNode("button",ye,[xe],512),[[V,"复制",void 0,{bottom:!0}]]),Vue.withDirectives(Vue.createVNode("button",{class:"p-panel-header-icon p-link p-mr-2",onClick:c},[Te],512),[[V,"设置",void 0,{bottom:!0}]])])),default:Vue.withCtx((()=>[_e])),_:1}),Vue.createVNode(r,{header:"关于",visible:n.value,"onUpdate:visible":t[1]||(t[1]=e=>n.value=e),breakpoints:{"960px":"75vw"},style:{width:"50vw"},modal:!0},{default:Vue.withCtx((()=>[we])),_:1},8,["visible"]),Vue.createVNode(f,{visible:d.value,"onUpdate:visible":t[5]||(t[5]=e=>d.value=e),baseZIndex:1e3,position:"right",class:"p-sidebar-lg",showCloseIcon:!1},{default:Vue.withCtx((()=>[Vue.createVNode(i,{header:"设置"},{default:Vue.withCtx((()=>[Vue.createVNode("div",be,[Vue.createVNode(g,{id:"binary",modelValue:h.value,"onUpdate:modelValue":t[2]||(t[2]=e=>h.value=e),binary:!0},null,8,["modelValue"]),Oe]),Ee,Vue.createVNode(v,{type:"text",modelValue:m.value,"onUpdate:modelValue":t[3]||(t[3]=e=>m.value=e)},null,8,["modelValue"]),Ae,Vue.createVNode(v,{type:"text",modelValue:p.value,"onUpdate:modelValue":t[4]||(t[4]=e=>p.value=e)},null,8,["modelValue"])])),_:1})])),_:1},8,["visible"])],64)}}}),Ce=Vue.defineComponent({expose:[],setup(e){const t=Vue.ref("horizontal"),i=()=>{window.innerWidth<=800?t.value="vertical":t.value="horizontal"};return Vue.onMounted((()=>{i(),window.addEventListener("resize",n(i,200))})),(e,n)=>{const i=Vue.resolveComponent("SplitterPanel"),s=Vue.resolveComponent("Splitter");return Vue.openBlock(),Vue.createBlock("main",null,[Vue.createVNode(s,{style:{height:"100vh"},layout:t.value},{default:Vue.withCtx((()=>[Vue.createVNode(i,{minSize:25},{default:Vue.withCtx((()=>[Vue.createVNode(Ve)])),_:1}),Vue.createVNode(i,{minSize:20},{default:Vue.withCtx((()=>[Vue.createVNode(Se)])),_:1})])),_:1},8,["layout"])])}}});const Re=Vue.createApp(Ce);Re.use(s),Re.use(r),Re.directive("tooltip",a),Re.component("Panel",l),Re.component("Menu",o),Re.component("Splitter",u),Re.component("SplitterPanel",d),Re.component("Dialog",c),Re.component("Sidebar",h),Re.component("Checkbox",p),Re.component("CascadeSelect",m),Re.component("SelectButton",g),Re.component("InputText",v),Re.component("Chips",f),Re.component("router-link",{}),Re.mount("#app");

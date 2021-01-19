//此文件为将produst中封装的不同的模块的接口函数引入并同意暴露出去  集中管理接口请求函数
export {default as trademark} from './product/trademark'
export {default as category} from './product/category'

export {default as attr} from './product/attr'
export {default as sku} from './product/sku'
export {default as spu} from './product/spu'

//采用分别暴露的形式  将上面四个模块暴露  在main中引入时  使用对象形式统一
//默认暴露  分别暴露  统一暴露等 暴露的都是一个对象  在引入时 可以通过解构语法将对象内部属性或方法拿出来



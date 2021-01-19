import request from '@/utils/request' 
export default {
//     /admin/product/getCategory1
// getCategory1
reqgetCategory1(){
    return request.get('/admin/product/getCategory1')
},
// GET /admin/product/getCategory2/{category1Id}
// getCategory2
reqgetCategory2(category1Id){
    return request.get(`/admin/product/getCategory2/${category1Id}`)
},
// GET /admin/product/getCategory3/{category2Id}
reqgetCategory3(category2Id){
    return request.get(`/admin/product/getCategory3/${category2Id}`)
}
}
import request from '@/utils/request'
export default {
//     /admin/product/attrInfoList/{category1Id}/{category1Id}/{category3Id}
// attrInfoList
getAttrList(category1Id,category2Id,category3Id){
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
},

// DELETE /admin/product/deleteAttr/{attrId}
// deleteAttr
deleteAttr(attrId){
    return request.delete(`/admin/product/deleteAttr/${attrId}`)
},
// GET /admin/product/getAttrValueList/{attrId}
// getAttrValueList

// POST /admin/product/saveAttrInfo
// saveAttrInfo
addOrUpdataAttr(attrInfo){
    return request.post('/admin/product/saveAttrInfo',attrInfo)
}


}
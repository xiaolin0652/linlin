import request from '@/utils/request'
export default {
    //获取商品列表
    //GET /admin/product/baseTrademark/{page}/{limit
     getTrademarkList(page,limit){
        return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
    },

    // DELETE /admin/product/baseTrademark/remove/{id}
    // 删除BaseTrademark
    deleteTrade(id){
        return request.delete(`/admin/product/baseTrademark/remove/${id}`)
    },

    // POST /admin/product/baseTrademark/save
    // 新增BaseTrademark
    // PUT /admin/product/baseTrademark/update
    // 修改BaseTrademark
    //新增和修改都是请求体参数  
    //参数为{
        // "id": 0,
        // "logoUrl": "string",
        // "tmName": "string"
        // }

    //新增商品的不需要id  因为id是后台在增加的时候返回的数据  如果是修改  则必须要带上id
    //所以可以将新增与修改封装为一个请求接口函数  根据判断的是否有id  改为请求不同的路径
    addOrUpdataTrade(trademarkInfo){
        if(trademarkInfo.id){//如果有id  代表是修改  如果没有id  代表是新增
            return request.put('/admin/product/baseTrademark/update',trademarkInfo)
        }else{
            return request.post('/admin/product/baseTrademark/save',trademarkInfo)
        }
    },

    //GET admin/product/baseTrademark/getTrademarkList   获取所有的品牌列表
  getList(){
    return request.get('admin/product/baseTrademark/getTrademarkList')
  }

}
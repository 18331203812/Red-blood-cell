import util from "../../../utils/util.js";
import HTTP from "../../../utils/request.js";
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls:[
      "https://cn.bing.com/th?id=OHR.Wachsenburg_ZH-CN5224299503_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp",
      "https://cn.bing.com/th?id=OHR.Wachsenburg_ZH-CN5224299503_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp",
      "https://cn.bing.com/th?id=OHR.Wachsenburg_ZH-CN5224299503_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp"
    ],
    isCur:false,
    details:{},
    number:1,
    goodsAttrId:0,
    ids:"",
    isShow:false,
    status:"",
    order_id:""
  },
  /**
   * 点击立即兑换弹出框
   */
  Exchange(){
    this.setData({
      isCur: true
    })
  },
  //删除弹框
  Iscur(){
    this.setData({
      isCur: false
    })
  },
  //选择商品增加
  Add(){
    this.setData({
      number: this.data.number < this.data.details.stock ? this.data.number + 1 : this.data.details.stock
    })
  },
  //选择商品减少
  Reduce(){
    this.setData({
      number:this.data.number > 1 ? this.data.number - 1 : 1
    })
  },
  //选择商品的属性
  Category(e){
    this.setData({
      goodsAttrId: e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.Details(options.id)
  },
  Details(id){
    _http.request({
      url:"/api/exchange/detail",
      method:"GET",
      data:{goods_id:id}
    }).then(res=>{
      console.log(res)
      this.setData({
        details:res.data.list,
        ids:id
      })
    })
  },
  /**
   * 立即兑换
   */
  Submit(){
    let { number , ids }=this.data;
    _http.request({
      url:"/api/exchange/takeoffDo",
      method:"POST",
      data:{
        quantity: number,
        goods_id:ids
      }
    }).then(res=>{
      let data=res.data.code;
      if(res.code == 200){
        this.Confirmation(number,ids)
        return;
      }
      switch(data){
        case 8003:
          //积分不足
          this.setData({
            isShow:true,
            status:"Enough",
            isCur:false
          })
        break;
        case 8002:
          //为完善个人信息
          this.setData({
            isShow: true,
            status: "Personal",
            isCur: false
          })
        break;
        default:
        console.log('默认')
      }
    })
  },
  //取消弹框
  Cancel(){
    this.setData({
      isShow: false
    })
  },
  //确认跳转
  Confirm(){
    this.setData({
      isShow: false
    })
    if (this.data.order_id){
      wx.navigateTo({
        url: '/pages/me/recordDetails/recordDetails?id=' + this.data.order_id,
      })
    }else{
      this.setData({
        isShow: false
      })
    }
    
  },
  /**
   * 确认兑换
   */
  Confirmation(number,ids){
    _http.request({
      url:"/api/exchange/confirm",
      method:"GET",
      data:{
        quantity: number,
        goods_id:ids
      }
    }).then(res=>{
      console.log(res)
      if(res.code == 200){
        //兑换成功
        this.setData({
          isShow: true,
          status: "Exchange",
          isCur: false,
          order_id: res.data.order_id
        })
      }else{
        util.showToast('兑换失败',none)
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
import HTTP from "../../../utils/request.js";
import utils from "../../../utils/util.js";
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details:{},
    tYear:"" , //年份
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.Details(options.id)
    this.doHandleDate();
  },
  //详情
  Details(id){
    _http.request({
      url:"/api/user/exchangeDetail",
      method:"GET",
      data:{
        order_id:id
      }
    }).then(res=>{
      console.log(res)
      this.setData({
        details:res.data.list
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

   doHandleDate() {
     
    var myDate = new Date();
    var tYear = myDate.getFullYear();
    var tMonth = myDate.getMonth();

    var m = tMonth + 1;
    if(m.toString().length == 1) {
      m = "0" + m;
    }
     console.log(tYear)
      this.setData({
        tYear: tYear
      })
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
import util from "../../../utils/util.js"
import HTTP from "../../../utils/request.js"
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    pagesize:10,
    list:[],
    isShow:true,
    integral:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.List(1);
  },
  /**
   * 积分列表记录
   */
  List(page){
    _http.request({
      url:"/api/user/record",
      method:"GET",
      data:{
        page:page,
        pagesize:this.data.pagesize
      }
    }).then(res=>{
      if(res.data.list.length < 10){
        this.setData({
          isShow:false
        })
      }
      this.setData({
        list:this.data.list.concat(res.data.list),
        integral:res.data.integral
      })
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
    this.setData({
      page: this.data.page + 1
    })
    this.List(this.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
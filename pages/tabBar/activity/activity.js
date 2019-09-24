// pages/tabBar/activity/activity.js
const app = getApp();
import util from "../../../utils/util.js"
import HTTP from "../../../utils/request.js"
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    ids:1,
    list:[],
    page:1,
    pagesize:10,
    isShow:true
  },
  Category(e){
    this.setData({
      ids: e.currentTarget.dataset.id,
      page:1
    })
    this.List(1);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    this.List(1)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideTabBar({
      fail: function () {
        setTimeout(function () {
          wx.hideTabBar()
        }, 500)
      }
    });
  },
  List(page){
    _http.request({
      url:"/api/activity/index",
      method:"GET",
      data:{
        page:page,
        pagesize:this.data.pagesize,
        type:this.data.ids
      }
    }).then(res=>{
      let data=res.data.list;
      if(data.length < 10){
        this.setData({
          isShow:false
        })
      }
      this.setData({
        list:res.data.list
      })
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

  onReachBottom: function(){
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
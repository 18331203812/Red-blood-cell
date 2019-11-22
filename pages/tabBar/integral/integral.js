// pages/tabBar/integral/integral.js
const app = getApp();
import util from "../../../utils/util.js";
import HTTP from "../../../utils/request.js";
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    goodsList:[],
    isShow:true,
    isPage:false,
    page:1,
    pagesize:10,
    integral:""
  },
  List(page) {
    _http.request({
      url: "/api/user/record",
      method: "GET",
      data: {
        page: page,
        pagesize: this.data.pagesize
      },
    }).then(res=>{
      console.log(res)
      this.setData({
        integral: res.data.integral
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
   
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideTabBar({
      fail: function(){
        setTimeout(function () {
          wx.hideTabBar()
        }, 500)
      }
    });
  },
  Goods(page){
    _http.request({
      url:"/api/exchange/index",
      method:"GET",
      data:{
        page:page,
        pagesize:this.data.pagesize
      }
    }).then(res=>{
      let data=res.data.list;
      if(data.length < 9){
        this.setData({
          isShow:false
        })
      }
      this.setData({
        goodsList: this.data.goodsList.concat(data)
      })
      if (this.data.goodsList.length == 0) {
        this.setData({
          isPage: true
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let token = wx.getStorageSync('login').token || '';
    if (token){
      this.List(1)
      this.setData({
        goodsList:[],
        page:1
      })
      this.Goods(1);
    }else{
      this.setData({
        goodsList: [],
        page: 1
      })
      this.Goods(1);
    }
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
    this.Goods(this.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
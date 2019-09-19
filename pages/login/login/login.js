import HTTP from "../../../utils/request.js";
import utils from "../../../utils/util.js";
var _http=new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //授权登录
  getPhoneNumber(){
    let that=this;
    wx.showLoading({
      title: '正在授权',
      icon:"none"
    })
    wx.login({
      success: res => {
        setTimeout(function(){
          that.prom().then(variable => {
            let data = {};
            data.data = JSON.stringify({
              iv: encodeURIComponent(variable.iv),
              code: res.code,
              decode: encodeURIComponent(variable.encryptedData)
            })
            _http.request({
              url: "/api/ssoauth/",
              method: "POST",
              data: data
            }).then(res => {
              wx.hideLoading();
              wx.setStorageSync("login", res.data)
              wx.navigateTo({
                url: '/pages/me/personal/personal',
              })
            }).catch(res=>{
              wx.hideLoading();
            })
          })
        },500)
      },
      fail:()=>{
        wx.showToast({
          title: '授权失败',
          icon:"none"
        })
      }
    })
  },
  prom() {
    return new Promise((reslove, rej) => {
      wx.getUserInfo({
        success: res => {
          reslove(res)
        }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
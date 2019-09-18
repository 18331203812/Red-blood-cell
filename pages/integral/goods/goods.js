// pages/integral/goods/goods.js
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
    isCur:false
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
// pages/me/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime:60,
    disabled:false,
    time:"60秒后可重新获取"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  code(){
    this.setData({
      disabled: true
    })
    // 设置发送验证码按钮样式
    let interval = null , _this=this;
    let currentTime = _this.data.currentTime;
    interval = setInterval(function () {
      currentTime--;
      _this.setData({
        time: currentTime + '秒后可重新获取',
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        _this.setData({
          time: '60秒后可重新获取',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
    
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
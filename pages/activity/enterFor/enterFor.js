import utils from "../../../utils/util.js"
import HTTP from "../../../utils/request.js"
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{},
    point:"",
    activity_id:"",
    isBut:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.User();
    this.setData({
      point: options.point,
      activity_id: options.id
    })
  },
  //获取个人信息
  User() {
    _http.request({
      url: "/api/user/profile",
      method: "GET",
    }).then(res => {
      let data = res.data.list;
      this.setData({
        data: data,
      })
      this.Category(data.identity_id)
    })
  },
  //获取身份标题信息
  Category(id) {
    _http.request({
      url: "/api/tag/index",
      method: "GET"
    }).then(res => {
      console.log(res)
      let data = res.data.list;
      for (let i in data) {
        if (data[i].id == id) {
          this.setData({
            [`data.identity`]: data[i].tag_name
          })
        }
      }
    })
  },
  //报名
  SignUp() {
    _http.request({
      url: "/api/activity/enrollDo",
      method: "POST",
      data: { activity_id: this.data.activity_id }
    }).then(res => {
      console.log(res)
      if (res.data.code == 7004) {
        utils.showToast('您不是本小区居民，不能参加', "none")
      } else if (res.data.code == 7003) {
        wx.showModal({
          title: '提示',
          content: '请先完善个人信息',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/me/personal/personal',
              })
            } else if (res.cancel) {

            }
          }
        })
      } else if (res.data.code == 7002) {
        utils.showToast('不需要重复报名', 'none')
      } else if (res.code == 200) {
        utils.showToast('报名成功', 'none')
        this.setData({
          isBut: false
        })
        wx.navigateTo({
          url: '/pages/activity/enterForSuccess/enterForSuccess?id=' + this.data.activity_id,
        })
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
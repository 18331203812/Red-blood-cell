import utils from "../../../utils/util.js"
import HTTP from "../../../utils/request.js"
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code:{},
    data:{},
    details:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.DetailsSuccess(options.id)
    this.Details(options.id)
    this.User();
  },
  Details(id) {
    _http.request({
      url: "/api/activity/detail",
      method: "GET",
      data: { activity_id: id }
    }).then(res => {
      this.setData({
        details: res.data.list
      })
    })
  },
  DetailsSuccess(id){
    _http.request({
      url:"/api/activity/getEnroll",
      data:{
        enroll_id:id
      },
      method:"GET"
    }).then(res=>{
      console.log(res)
      this.setData({
        code:res.data.list
      })
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
// pages/tabBar/me/me.js
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
    details:{},
    isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    
  },
  Details(){
    return new Promise((reslove,seject)=>{
      _http.request({
        url: "/api/user/profile",
      }).then(res => {
        console.log(res)
        this.setData({
          details: res.data.list,
          isShow:false
        })
        reslove(res.data.list)
      })
    })
  },
  //获取身份标题信息
  Category(id){
    _http.request({
      url:"/api/tag/index",
      method:"GET"
    }).then(res=>{
      console.log(res)
      let data=res.data.list;
      for(let i in data){
        if (data[i].id == id){
          this.setData({
            [`details.identity`]: data[i].tag_name
          })
        }
      }
    })
  },
  //是否授权登录
  Navigators(e){
    let login = wx.getStorageSync('login'), id = Number(e.currentTarget.dataset.id);
    console.log(id)
    if (login) {
      switch (id) {
        case 1:
          wx.navigateTo({
            url: '/pages/integral/Mypoints/Mypoints',
          })
        break;
        case 2:
          wx.navigateTo({
            url: '/pages/me/ginseng/ginseng',
          })
        break;
        case 3:
          wx.navigateTo({
            url: '/pages/me/record/record',
          })
        break;
        case 4:
          wx.navigateTo({
            url: '/pages/me/personal/personal?isBut=true',
          })
          break;
        default:
          console.log('//')
      } 
    } else {
      this.setData({
        isShow:true
      })
    }
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let login = wx.getStorageSync('login')
    if (login) {
      this.Details().then(res => {
        this.Category(res.identity_id);
      });
    } else {
      console.log('没有授权')
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
  Cancel(){
    this.setData({
      isShow:false
    })
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
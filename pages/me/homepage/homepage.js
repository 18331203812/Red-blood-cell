// pages/me/homepage/homepage.js
import HTTP from "../../../utils/request.js";
import utils from "../../../utils/util.js";
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details:{},
    list:[],
    pagesize: 10,
    page: 1,
    type: 1,  //社群 街道 市
    isMore: true, //加载动效
    video: [], //视频
    status: false,
    text: "",
    community: "",
    keyword: "",
    isPage: false, //省缺页
    isShow: false,
    ids:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.List(1,options.action_id)
    this.setData({
      ids: options.action_id
    })
  },
  List(page,id){
    _http.request({
      url:"/api/news/filter",
      method:'get',
      data:{
        page: page,
        pagesize:10,
        action_id:id
      }
    }).then(res=>{
      this.setData({
        list: this.data.list.concat(res.data.list),
        details: res.data.top_header
      })
      if (res.data.list.length < 9) {
        this.setData({
          isMore: false,
          isPage: false
        })
      }
      if (this.data.list.length == 0) {
        this.setData({
          isMore: false,
          isPage: true
        })
      }
     
    })
  },
  //文章点赞
  Fabulous(e) {
    let { id, zan } = e.currentTarget.dataset;
    if (zan == 1) {
      util.showToast('您不能重复点赞', 'none')
      return;
    }
    _http.request({
      url: "/api/news/articleZanDo",
      method: "POST",
      data: {
        news_id: id
      }
    }).then(res => {
      let { list } = this.data;
      for (let i in list) {
        if (list[i].id == id) {
          list[i].is_zan = list[i].is_zan == 1 ? 0 : 1
          list[i].zan_count = list[i].is_zan == 1 ? list[i].zan_count + 1 : list[i].zan_count - 1
          this.setData({
            status: true,
            text: "文章点赞+" + res.data.point + "积分"
          })
          setTimeout(() => {
            this.setData({
              status: false,
            })
          }, 2000)
        }
      }
      this.setData({
        list: list,
      })
    })
  },
  //视频点赞
  FabulousV(e) {
    let { id, zan } = e.currentTarget.dataset;
    if (zan == 1) {
      util.showToast('您不能重复点赞', 'none')
      return
    }
    _http.request({
      url: "/api/video/articleZanDo",
      method: "POST",
      data: {
        video_id: id
      }
    }).then(res => {
      let { video } = this.data;
      for (let i in video) {
        if (video[i].id == id) {
          video[i].is_zan = video[i].is_zan == 1 ? 0 : 1
          video[i].zan_count = video[i].is_zan == 1 ? video[i].zan_count + 1 : video[i].zan_count - 1
          this.setData({
            status: true,
            text: "视频点赞+" + res.data.point + "积分"
          })
          setTimeout(() => {
            this.setData({
              status: false,
            })
          }, 2000)
        }
      }
      this.setData({
        video: video,
      })
    })
  },
  Confirm() {
    wx.navigateTo({
      url: '/pages/me/personal/personal',
    })
    this.setData({
      isShow: false
    })
  },
  Cancel() {
    this.setData({
      isShow: false
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
    this.List(this.data.ids,this.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
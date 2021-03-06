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
    isMore: true, //加载动效
    video: [], //视频
    status: false,
    text: "",
    community: "",
    keyword: "",
    isPage: false, //省缺页
    isShow: false,
    ids:"",
    categoryid:1,
    name:"",
    newsid:"",
    videoid:""
  },
  Category(e){
    let id = e.currentTarget.dataset.id;
    this.setData({
      categoryid: id,
      list: [],
      pagesize: 10,
      page: 1,
      isMore: true, //加载动效
      isPage: false, //省缺页
      isShow: false,
      video:[]
    })
    if (id == 1){
      this.List(1, this.data.ids)
    }else{
      this.videoList(1,this.data.ids)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      ids: options.action_id,
      iSstatus: options.status,
      name: options.name,
      newsid: options.newid || null,
      videoid: options.videoid 
    })
    this.List(1,options.action_id)
    
  },
  videoList(page,id){
    _http.request({
      url:'/api/video/filter',
      method:'get',
      data:{
        page: page,
        pagesize: 10,
        action_id:id,
        video_id: this.data.videoid
      }
    }).then(res=>{
      console.log(res)
      this.setData({
        video: this.data.video.concat(res.data.list)
      })
      if (res.data.list.length < 9) {
        this.setData({
          isMore: false,
          isPage: false
        })
      }
      if (this.data.video.length == 0) {
        this.setData({
          isMore: false,
          isPage: true
        })
      }
    })
  },
  List(page,id){
    _http.request({
      url:"/api/news/filter",
      method:'get',
      data:{
        page: page,
        pagesize:10,
        action_id:id,
        news_id: this.data.newsid
      }
    }).then(res=>{
      console.log(res)
      if(res.data.code == 5011){
        wx.showModal({
          title: '提示',
          content: '您暂无权限查看,请切换相应的小区',
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            } else if (res.cancel) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
        return
      }
      for (let i in res.data.list) {
        if (res.data.list[i].publish_time.length != 2) {
          res.data.list[i].publish_time = res.data.list[i].publish_time.substr(5)
        }
      }
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
    wx.navigateTo({
      url: '/pages/index/details/details?id=' + id,
    }) 
    return
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
    wx.navigateTo({
      url: '/pages/video/details/details?id=' + id,
    })
    return
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
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    let { fabulousStatus, fabulousid } = currPage.data;
    if (fabulousid) {
      if (fabulousStatus == 'list') {
        let { list } = this.data;
        for (let i in list) {
          if (list[i].id == fabulousid) {
            list[i].is_zan = list[i].is_zan == 1 ? 0 : 1
            list[i].zan_count = list[i].is_zan == 1 ? list[i].zan_count + 1 : list[i].zan_count - 1
          }
        }
        this.setData({
          list,
        })
      } else if (fabulousStatus == 'video') {
        let { video } = this.data;
        for (let i in video) {
          if (video[i].id == id) {
            video[i].is_zan = video[i].is_zan == 1 ? 0 : 1
            video[i].zan_count = video[i].is_zan == 1 ? video[i].zan_count + 1 : video[i].zan_count - 1
          }
        }
        this.setData({
          video: video,
        })
      }
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
    if (this.data.categoryid == 1){
      this.List(this.data.page,this.data.ids)
    }else{
      this.videoList(this.data.page, this.data.ids)
    }
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
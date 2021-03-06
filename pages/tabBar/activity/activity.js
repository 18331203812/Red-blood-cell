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
    isShow:true,
    keyword:"",
    isPage:false,
    currentTab:0,
    iSPagesed:true,
    height:0
  },
  Category(e){
    this.setData({
      ids: Number(e.currentTarget.dataset.id),
      currentTab: Number(e.currentTarget.dataset.id) - 1,

    })
  },
  bindChange(e) {
    if (e.detail.source == "touch" || e.detail.source == '') {
      if (this.data.iSPagesed) {
        this.setData({
          ids: Number(e.detail.current) + 1,
          currentTab: Number(e.detail.current),
          page: 1,
          list: [],
          video: [],
          isPage: false, //省缺页
          keyword: "",
          isShow: true
        })
        let status = true
        this.List(1, status)
      } else {

      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   **/
  onLoad: function (options) {
    app.editTabbar();
  
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
  List(page, status = false){
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
    this.setData({
      iSPagesed: false
    })
    _http.request({
      url:"/api/activity/index",
      method:"GET",
      data:{
        page:page,
        pagesize:this.data.pagesize,
        type: this.data.ids == '1' ? '2' : (this.data.ids == '2' ? '1' : this.data.ids)
      }
    }).then(res=>{
      let data=res.data.list;
      if (status) {
        this.setData({
          list: [],
        })
      }
      if(data.length < 10){
        this.setData({
          isShow:false,
          isPage:false
        })
      }
      this.setData({
        list:this.data.list.concat(res.data.list),
        iSPagesed: true
      })
      if(this.data.list.length == 0){
        this.setData({
          isShow: false,
          isPage: true
        })
      }
    })
  },
  //获取搜索文字
  Search(e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  //点击搜索
  SearchSubmit() {
    let { keyword } = this.data;
    if (!keyword) {
      return;
    }
    this.setData({
      list: [], //新闻
      video: [], //视频
    })
    _http.request({
      url: "/api/search/index",
      method: "GET",
      data: {
        type: 3,
        keyword: keyword
      }
    }).then(res => {
      console.log(res)
      if(res.data.list.length == 0){
        this.setData({
          isPage:true
        })
      }
      this.setData({
        list: res.data.list
      })
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let returns = wx.getStorageSync('returns')
    if (!returns){
      this.setData({
        list: [],
        page: 1
      })
      this.List(1)
    }else{
      wx.setStorageSync("returns", false)
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
  lower() {
    this.setData({
      page: this.data.page + 1
    })
    this.List(this.data.page)
  },
  onReachBottom: function(){
    // this.setData({
    //   page: this.data.page + 1
    // })
    // this.List(this.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
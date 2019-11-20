import HTTP from "../../../utils/request.js";
import utils from "../../../utils/util.js";
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    pagesize:15,
    isPage:false,
    isShow:true,
    ids:'1',
    list:[],
    iSPagesed: true
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
  //点击tabBar
  Category(e){
    this.setData({
      ids: Number(e.currentTarget.dataset.id),
      currentTab: Number(e.currentTarget.dataset.id) - 1,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.List(1);
  },
  //列表
  List(page, status = false){
    this.setData({
      iSPagesed: false
    })
    _http.request({
      url:"/api/activity/join",
      method:"GET",
      data:{
        page:page,
        pagesize: this.data.pagesize,
        type:this.data.ids
      }
    }).then(res=>{
      if (res.data.list.length == 0){
        this.setData({
          isPage:true
        })
      }
      if (res.data.list.length < 10) {
        this.setData({
          isShow: false
        })
      }
      this.setData({
        list:res.data.list,
        iSPagesed: true
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
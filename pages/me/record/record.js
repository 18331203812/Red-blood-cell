import HTTP from "../../../utils/request.js";
import utils from "../../../utils/util.js";
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    ids:0,
    isShow:true,
    isPage:false,
    page:1,
    pagesize:10,
    iSPagesed: true
  },
  List(page,status = false){
    this.setData({
      iSPagesed: false
    })
    _http.request({
      url:"/api/user/exchange",
      method:"GET",
      data:{
        page:page,
        pagesize: this.data.pagesize,
        type:this.data.ids
      }
    }).then(res=>{
      console.log(res)
      let data = res.data.list;
      if(data.length < 9){
        this.setData({
          isShow:false
        })
      }
      this.setData({
        list:this.data.list.concat(data),
        iSPagesed: true
      })
      if (this.data.list.length == 0){
        this.setData({
          isPage:true,
          isShow: false
        })
      }
    })
  },
  //分类
  Category(e){
    this.setData({
      ids: Number(e.currentTarget.dataset.id),
      currentTab: Number(e.currentTarget.dataset.id) ,
    })
  },
  bindChange(e) {
    if (e.detail.source == "touch" || e.detail.source == '') {
      if (this.data.iSPagesed) {
        this.setData({
          ids: Number(e.detail.current) ,
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
   */
  onLoad: function (options) {
    this.List(1);
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
  lower() {
    this.setData({
      page: this.data.page + 1
    })
    this.List(this.data.page)
  },
  onReachBottom: function () {
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
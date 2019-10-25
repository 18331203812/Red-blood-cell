import HTTP from "../../../utils/request.js";
import utils from "../../../utils/util.js";
var _http = new HTTP();
var time = 0;
var touchDot = 0;//触摸时的原点
var interval = "";
var flag_hd = true;
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
    list:[]
  },
  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 2000);
  },
  // 触摸结束事件
  touchEnd: function (e) {
    var touchMove = e.changedTouches[0].pageX;
    console.log(touchMove)
    console.log(touchDot)
    // 向左滑动   
    if (touchMove - touchDot <= -80 && time < 10 && flag_hd == true) {
      flag_hd = false;
      console.log("向右滑动");
      this.Switch('right')
    }
    // 向右滑动   
    if (touchMove - touchDot >= 80 && time < 10 && flag_hd == true) {
      flag_hd = false;
      console.log("向左滑动");
      this.Switch('left')
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
    flag_hd = true;
  },
  /**
   * 切换tabBar
   */
  Switch(status) {
    let { ids } = this.data;
    if (status == 'left') {
      switch (Number(ids)) {
        case 3:
          this.setData({
            ids: 2,
            page: 1,
            list: [],
            isPage: false, //省缺页
            isShow:true
          })
          this.List(1)
          break;
        case 2:
          this.setData({
            ids: 1,
            page: 1,
            list: [],
            isPage: false, //省缺页
            isShow: true
          })
          this.List(1)
          break;
        default:
      }
    } else if (status == 'right') {

      switch (Number(ids)) {
        case 1:
          this.setData({
            ids: 2,
            page: 1,
            list: [],
            isPage: false, //省缺页
            isShow: true
          })
          this.List(1)
          break;
        case 2:
          this.setData({
            ids: 3,
            page: 1,
            list: [],
            isPage: false, //省缺页
            isShow: true
          })
          this.List(1)
          break;
        default:
      }
    }
  },
  //点击tabBar
  Category(e){
    this.setData({
      ids: e.currentTarget.dataset.id,
      page:1,
      list:[],
      isPage: false,
      isShow: true,
    })
    this.List(1);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.List(1);
  },
  //列表
  List(page){
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
        list:res.data.list
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
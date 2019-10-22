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
    list:[],
    ids:0,
    isShow:true,
    isPage:false,
    page:1,
    pagesize:10
  },
  List(page){
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
        list:this.data.list.concat(data)
      })
      if(data.length == 0){
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
      ids: e.currentTarget.dataset.id
    })
    this.setData({
      list:[],
      page:1,
      isShow: true,
      isPage: false,
    })
    this.List(1);
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
    this.setData({
      page: 1,
     
    })

    if (status == 'left') {
      switch (ids) {
        case 2:
          this.setData({
            ids: 1,
            list: [],
            isPage: false, //省缺页
          })
          this.List(1)
          break;
        case 1:
          this.setData({
            ids: 0,
            list: [],
            isPage: false, //省缺页
          })
          this.List(1)
          break;
        default:
      }
    } else if (status == 'right') {
      switch (ids) {
        case 0:
          this.setData({
            ids: 1,
            list: [],
            isPage: false, //省缺页
          })
          this.List(1)
          break;
        case 1:
          this.setData({
            ids: 2,
            list: [],
            isPage: false, //省缺页
          })
          this.List(1)
          break;
        default:
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
    this.setData({
      page: this.data.page + 1
    })
    this.List(this.data.page)
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
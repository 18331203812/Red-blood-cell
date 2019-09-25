const app = getApp();
import util from "../../../utils/util.js"
import HTTP from "../../../utils/request.js"
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navHeight: "", //导航高度
    tabbar: {},
    dataList: [{ "id": 6193654, "content": "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400", "cover": "http://pic.rmb.bdstatic.com/mvideo/cde67c41211d7a46c1fb87138935b912" }],
    _index:'6193654',
    list:[], //新闻
    pagesize: 10,
    page: 1,  
    type:1,  //社群 街道 市
    isMore:true, //加载动效
    video:[] , //视频
    status:false,
    text:"",
    community:""
  },
  Category(e){
    this.setData({
      type: Number(e.currentTarget.dataset.id),
      page:1,
      list:[]
    })
    this.List(1)
  },
  // // 点击cover播放，其它视频结束
  // videoPlay: function (e) {
  //   var _index = e.currentTarget.dataset.id
  //   this.setData({
  //     _index: _index
  //   })
  //   //停止正在播放的视频
  //   var videoContextPrev = wx.createVideoContext(_index + "")
  //   videoContextPrev.stop();

  //   setTimeout(function () {
  //     //将点击视频进行播放
  //     var videoContext = wx.createVideoContext(_index + "")
  //     videoContext.play();
  //   }, 500)
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    //导航高度
    this.Nav();
    this.List(1);
  },
  //计算导航高度
  Nav() {
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top,//胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;//导航高度
        console.log(statusBarHeight, navTop, navHeight)
        this.setData({
          navHeight: navHeight
        })
      },
      fail(err) {
        console.log(err);
      }
    })
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
  //列表
  List(page){
    _http.request({
      url:"/api/news/index",
      method:"GET",
      data:{
        page:page,
        pagesize: this.data.pagesize,
        type:this.data.type,
        community_id: this.data.community
      }
    }).then(res=>{
      console.log(res)
      if(res.data.list.length !== 0){
        this.setData({
          list: this.data.list.concat(res.data.list),
          video: res.data.video
        })
        if (res.data.list.length < 9){
          this.setData({
            isMore: false
          })
        }
      }else{
        this.setData({
          isMore:false
        })
      }
      
    })
  },
  //文章点赞
  Fabulous(e){
    let { id, zan} = e.currentTarget.dataset;
    if (zan == 1){
      util.showToast('您不能重复点赞','none')
      return;
    }
    _http.request({
      url:"/api/news/articleZanDo",
      method:"POST",
      data:{
        news_id:id
      }
    }).then(res=>{
      let { list }=this.data;
      for(let i in list ){
        if (list[i].id == id){
          list[i].is_zan = list[i].is_zan== 1 ? 0 : 1
          list[i].zan_count = list[i].is_zan == 1 ? list[i].zan_count + 1 : list[i].zan_count-1
          this.setData({
            status:true,
            text: "文章点赞+" + res.data.point +"积分"
          })
          setTimeout(()=>{
            this.setData({
              status: false,
            }) 
          },2000)
        }
      }
      this.setData({
        list:list,
      })
    })
  },
  //视频点赞
  FabulousV(e){
    let { id, zan } = e.currentTarget.dataset;
    if(zan==1){
      util.showToast('您不能重复点赞', 'none')
      return 
    }
    _http.request({
      url: "/api/video/articleZanDo",
      method: "POST",
      data: {
        video_id: id
      }
    }).then(res=>{
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let address = wx.getStorageSync('address') ? JSON.parse(wx.getStorageSync('address')) : '';
    console.log(address)
    if(address){
      if (this.data.community !== address.addressdata.id){
        this.setData({
          community: address.addressdata.id,
          page:1,
        })
        this.List(1)
        console.log("刷新")
      }else{
        console.log("不刷新")
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
      page:this.data.page+1
    })
    this.List(this.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
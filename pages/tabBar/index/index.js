const app = getApp();
import util from "../../../utils/util.js"
import HTTP from "../../../utils/request.js"
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
    community:"",
    keyword:"",
    isPage:false, //省缺页
    isShow:false,
  },
  Confirm(){
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
  Category(e){
    this.setData({
      type: Number(e.currentTarget.dataset.id),
      page:1,
      list:[],
      isPage: false, //省缺页
      keyword:""
    })
    this.List(1)
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
      this.Switch('right')
    }
    // 向右滑动   
    if (touchMove - touchDot >= 80 && time < 10 && flag_hd == true) {
      flag_hd = false;
      this.Switch('left')
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
    flag_hd = true;
  },
  /**
   * 切换tabBar
   */
  Switch(status){
    let { type }  = this.data;
    if(status == 'left'){
      switch (type) {
        case 3:
          this.setData({
            type: 2,
            page: 1,
            list: [],
            isPage: false, //省缺页
            keyword: ""
          })
          this.List(1)
          break;
        case 2:
          this.setData({
            type: 1,
            page: 1,
            list: [],
            isPage: false, //省缺页
            keyword: ""
          })
          this.List(1)
          break;
        default:
      }
    }else if(status == 'right'){
      switch (type) {
        case 1:
          this.setData({
            type:2,
            page: 1,
            list: [],
            isPage: false, //省缺页
            keyword: ""
          })
          this.List(1)
        break;
        case 2:
          this.setData({
            type:3,
            page: 1,
            list: [],
            isPage: false, //省缺页
            keyword: ""
          })
          this.List(1)
        break;
        default:
      }
    }
  },
  //获取个人信息
  User() {
    return new Promise((resj,sej)=>{
      let access_token = wx.getStorageSync('login').token || '';
      wx.request({
        url: "https://www.redxibao.com/api/user/profile",
        method: "GET",
        header: access_token ? {
          'content-type': 'application/x-www-form-urlencoded',
          "Authorization": `${access_token}`
        } : {
            'content-type': 'application/x-www-form-urlencoded',
          },
        success:res=>{
          console.log(res)
          if (res.data.code == 1003){
            // resj(false)
          }else if(res.data.code == 200){
            let isPhone = res.data.data.list.mobile ? true : false;
            resj(isPhone)
          }else{
            // resj(false)
          }
          
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    //导航高度
    this.Nav();
    
   
  },
  //计算导航高度
  Nav() {
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top,//胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;//导航高度
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
      console.log(res.data.list.length)
      if(res.data.list.length !== 0){
        this.setData({
          list: this.data.list.concat(res.data.list),
          video: res.data.video,
          isPage: false
        })
        if (res.data.list.length < 9){
          this.setData({
            isMore: false,
            isPage: false
          })
        }
        console.log('/')
      }else{
        this.setData({
          isMore:false,
          isPage:false
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
    let perfect = wx.getStorageSync('perfect');
    this.User().then(res => {
      console.log(res)
      if (!res) {
        if (!perfect) {
          this.setData({
            isShow: true
          })
          wx.setStorageSync('perfect', true);
        }
      }
    })
    
    flag_hd = true;    //重新进入页面之后，可以再次执行滑动切换页面代码
    clearInterval(interval); // 清除setInterval
    time = 0;
    this.setData({
      list: [], //新闻
      pagesize: 10,
      page: 1,
      isMore: true, //加载动效
      video: [], //视频
      status: false,
      keyword: "",
      isPage: false, //省缺页
    })
    this.List(1);
    let address = wx.getStorageSync('address') ? JSON.parse(wx.getStorageSync('address')) : '';
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
  //获取搜索文字
  Search(e){  
    this.setData({
      keyword: e.detail.value
    })
  },
  //点击搜索
  SearchSubmit(){
    let { keyword}=this.data;
    if (!keyword){
      return;
    }
    this.setData({
      list: [], //新闻
      video: [], //视频
    })
    _http.request({
      url:"/api/search/index",
      method:"GET",
      data:{
        type:1,
        keyword:keyword
      }
    }).then(res=>{
      console.log(res)
      if(res.data.list.length == 0){
        this.setData({
          isPage:true
        })
      }
      this.setData({
        list:res.data.list
      })
    })
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
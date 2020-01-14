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
    community:"",
    keyword:"",
    isPage:false, //省缺页
    isShow:false,
    iSPagesed:true,
    currentTab:0,
    height:0,
    ranlist:[],
    swiperList: [],
    iSswiperList:false
  },
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      // list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      // list[i].mLeft = i == 0 ? i - parseInt(list.length / 2):0

      if (i == 0) {
        list[i].zIndex = 2
        list[i].mLeft = 0
      } else if (i == 1) {
        list[i].zIndex = 1
        list[i].mLeft = -1
      } else if (i == 2) {
        list[i].zIndex = 1
        list[i].mLeft = 1
      }
      list[i].sort = i + 1
    }
    console.log(list)
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // 截获竖向滑动
  catchTouchMove: function (res) {
    return false
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX,
      iSswiperList:true
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list,
      })
      setTimeout(()=>{
        this.setData({
          iSswiperList: false,
        })
      },10000)
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list,
      })
      setTimeout(() => {
        this.setData({
          iSswiperList: false,
        })
      }, 10000)
    }
  },
  // 信息排行榜
  RankingList(){
    _http.request({
      url:"/api/news/rank",
      method:'get',
      data:{
        type:1
      }
    }).then(res=>{
      this.setData({
        swiperList: res.data.list.slice(0,3)
      })
      this.towerSwiper('swiperList');
    })
  },
  bindChange(e){
    console.log(e)
    if (e.detail.source == "touch" || e.detail.source == '') {
      if (this.data.iSPagesed) {
        this.setData({
          type: Number(e.detail.current) + 1,
          currentTab: Number(e.detail.current),
          page: 1,
          list: [],
          video: [],
          isPage: false, //省缺页
          keyword: "",
          isMore: true
        })
        let status = true
        this.List(1, status)
      } else {

      }
    }
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
      currentTab: Number(e.currentTarget.dataset.id)-1,
    })
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
    this.RankingList()
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
  List(page, status = false){
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
    this.setData({
      iSPagesed:false
    })
    _http.request({
      url:"/api/news/index",
      method:"GET",
      data:{
        page:page,
        pagesize: this.data.pagesize,
        type: this.data.type == '1' ? '2' : (this.data.type == '2' ? '1' : this.data.type),
        community_id: this.data.community
      }
    }).then(res=>{
      if(status){
        this.setData({
          list: [],
          video: [],
        })
      }
      this.setData({
        list: this.data.list.concat(res.data.list),
        video: res.data.video,
        isPage: false,
        iSPagesed:true
      })
        if (res.data.list.length < 9){
          this.setData({
            isMore: false,
            isPage: false
          })
        }
      if (this.data.list.length == 0 && this.data.video.length == 0){
        this.setData({
          isMore: false,
          isPage: true
        })
      }
    })
  },
  //文章点赞
  Fabulous(e){
    let { id, zan} = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/index/details/details?id='+id,
    })
    return
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
    wx.navigateTo({
      url: '/pages/video/details/details?id='+id,
    })
    return
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
    let address = wx.getStorageSync('address') ? JSON.parse(wx.getStorageSync('address')) : '';
    if(address){
      if (this.data.community !== address.addressdata.id){
        this.setData({
          community: address.addressdata.id,
          page:1,
          list: [], //新闻
          pagesize: 10,
          video: [], //视频
        })
        this.List(1)
        console.log("刷新")
        return
      }else{
        console.log("不刷新")
      }
    }
    let returns = wx.getStorageSync('returnsIndex')
    if (!returns) {
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
    } else {
      wx.setStorageSync("returnsIndex", false)
    }
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    let { fabulousStatus, fabulousid} = currPage.data;
    if (fabulousid){
      if (fabulousStatus == 'list'){
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
      } else if (fabulousStatus == 'video'){
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
  lower(){
    console.log('////')
    this.setData({
      page: this.data.page + 1
    })
    this.List(this.data.page)
  },
  onReachBottom: function () {
    // console.log('/')
    // this.setData({
    //   page:this.data.page+1
    // })
    // this.List(this.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
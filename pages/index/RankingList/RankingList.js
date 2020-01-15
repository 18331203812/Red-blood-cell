// pages/index/RankingList/RankingList.js
import HTTP from "../../../utils/request.js"
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ranlist: [],
    ids:"1",
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
    }],
    cardCur: 0,
    currentTab: 0,
    iSswiperList: false,
    isMore:true
  },
  // 信息排行榜
  RankingList() {
    _http.request({
      url: "/api/news/rank",
      method: 'get',
      data: {
        type: this.data.ids == 2 ? 3 :this.data.ids
      }
    }).then(res => {
      this.setData({
        swiperList:res.data.list.slice(0,3),
        ranlist: res.data.list,
        isMore:false
      })
      this.towerSwiper('swiperList');
    })
  },
  Category(e){
    this.setData({
      ids: e.currentTarget.dataset.id,
      ranlist:[],
      currentTab: e.currentTarget.dataset.id - 1,
      isMore:true
    })
    this.RankingList()
    this.towerSwiper('swiperList');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.RankingList()
    this.towerSwiper('swiperList');
  },
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      // list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      // list[i].mLeft = i == 0 ? i - parseInt(list.length / 2):0
      
      if(i == 0){
        list[i].zIndex =2
        list[i].mLeft = 0
      } else if (i == 1) {
        list[i].zIndex = 1
        list[i].mLeft = -1
      } else if (i == 2) {
        list[i].zIndex = 1
        list[i].mLeft = 1
      }
      list[i].sort = i+1
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
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
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
        swiperList: list
      })
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
        swiperList: list
      })
    }
  },
  bindChange(e) {
    console.log(e)
    if (e.detail.source == "touch" || e.detail.source == '') {
        this.setData({
          ids: Number(e.detail.current) + 1,
          currentTab: Number(e.detail.current),
          swiperList: [{
            id: 0,
            type: 'image',
            url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
          }, {
              id: 1,
              type: 'image',
              url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
            }, {
              id: 2,
              type: 'image',
              url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
            }, {
              id: 3,
              type: 'image',
              url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
            }, {
              id: 4,
              type: 'image',
              url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
            }],
          ranlist: [],
          isMore:true
        })
        this.RankingList()
      this.towerSwiper('swiperList');
    }
  },
  // 截获竖向滑动
  catchTouchMove: function (res) {
    return false
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
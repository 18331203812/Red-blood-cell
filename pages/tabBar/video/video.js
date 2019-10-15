
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
    _index: '-1',
    list:[],
    pagesize:10,
    page:1,
    isMore:true,
    status: false,
    text: "",
    keyword:"",
    isPage:false
  },
  // 点击cover播放，其它视频结束
  videoPlay: function (e) {
    var _index = e.currentTarget.dataset.id
    this.setData({
      _index: _index
    })
    //停止正在播放的视频
    var videoContextPrev = wx.createVideoContext(_index + "")
    videoContextPrev.stop();

    setTimeout(function () {
      //将点击视频进行播放
      var videoContext = wx.createVideoContext(_index + "")
      videoContext.play();
    }, 500)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.editTabbar();
    this.setData({
      page:1
    })
    this.List(1);
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
  List(page){
    _http.request({
      url:"/api/video/index",
      method:"GET",
      data:{
        page:page,
        pagesize:this.data.pagesize
      }
    }).then(res=>{
      let data = res.data.list;
      if(data.length < 10 ){
        this.setData({
          isMore:false
        })
      }
      
      this.setData({
        list:this.data.list.concat(res.data.list)
      })
      if (this.data.list.length == 0) {
        this.setData({
          isMore: false,
          isPage: true
        })
      }
    })
  },
  //获取搜索文字
  Search(e) {
    console.log(e)
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
    })
    _http.request({
      url: "/api/search/index",
      method: "GET",
      data: {
        type: 2,
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
   **/
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
   * 点赞
   */
  //视频点赞
  FabulousV(e) {
    let { id, zan } = e.currentTarget.dataset;
    console.log(id,zan)
    if (zan == 1) {
      util.showToast('您不能重复点赞', 'none')
      return;
    }
    _http.request({
      url: "/api/video/articleZanDo",
      method: "POST",
      data: {
        video_id: id
      }
    }).then(res => {
      let { list } = this.data;
      for (let i in list) {
        if (list[i].id == id) {
          list[i].is_zan = list[i].is_zan == 1 ? 0 : 1
          list[i].zan_count = list[i].is_zan == 1 ? list[i].zan_count + 1 : list[i].zan_count - 1
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
        list: list,
      })
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   **/
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    })
    this.List(this.data.page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
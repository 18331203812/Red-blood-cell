import HTTP from "../../../utils/request.js";
import utils from "../../../utils/util.js";
var _http = new HTTP();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    _index: '',
    details: {},
    inputValue: "", //评论内容
    messageList: {},
    isContent: false,
    status: false,
    text: '',
    isIphoneX: app.globalData.systemInfo.model == "iPhone X" ? true : false,
  },
  // 点击cover播放，其它视频结束
  videoPlay: function (e) {
    var _index = e.currentTarget.dataset.id
    console.log(_index)
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
  input(e) {
    this.setData({
      isShow: true,
    })

    const query = wx.createSelectorQuery()
    query.select('#main').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(height => {
      console.log(height)
      height[0].top       // #the-id节点的上边界坐标
      height[1].scrollTop // 显示区域的竖直滚动位置
      wx.pageScrollTo({
        scrollTop: height[0].height,
        duration: 300
      });
    })
  },
  inputs(){
    this.setData({
      isShow: false,
    })
  },
  //获取发送评论
  GetInputCon(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.Details(options.id)
    this.Message(options.id)
    this.setData({
      id: options.id
    })
  },
  Details(id) {
    _http.request({
      url: "/api/video/detail",
      method: "GET",
      data: {
        video_id: id
      }
    }).then(res => {
      console.log(res)
      let data = res.data.list;
      // data.content = data.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto"');
      this.setData({
        details: data,
        _index:data.id
      })
      if (data.is_give !== 1) {
        setTimeout(() => {
          this.setData({
            status: true,
            text: "浏览视频+" + res.data.point + "积分"
          })
          setTimeout(() => {
            this.setData({
              status: false,
            })
          }, 2000)
        }, 300000)
      }
    })
  },

  //发送评论
  Submit() {
    let { inputValue, messageList } = this.data;
    if (!inputValue) {
      return
    }
    _http.request({
      url: "/api/video/commentDo",
      data: {
        video_id: this.data.id,
        content: inputValue
      },
      method: "POST"
    }).then(res => {
      if (res.data.code == 5010) {
        utils.showToast('评论内容已经存在', 'none')
        return;
      }
      this.setData({
        isShow: false,
        inputValue: "",
      })
      if (messageList.is_first == 1) {
        this.setData({
          status: true,
          text: "浏览文章+" + res.data.point + "积分"
        })
        setTimeout(() => {
          this.setData({
            status: false,
          })
        }, 2000)
      }
      const query = wx.createSelectorQuery()
      query.select('#main').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(height => {
        console.log(height)
        height[0].top       // #the-id节点的上边界坐标
        height[1].scrollTop // 显示区域的竖直滚动位置
        wx.pageScrollTo({
          scrollTop: height[0].height,
          duration: 300
        });
      })
      this.Message(this.data.id)
    })
  },
  //获取所有评论
  Message(id) {
    _http.request({
      url: "/api/video/comment",
      method: "GET",
      data: {
        video_id: id,
        page: 1,
        pagesize: 10,
      }
    }).then(res => {
      if (res.data.comment.length == 0) {
        this.setData({
          isContent: true
        })
      }
      this.setData({
        messageList: res.data
      })
    })
  },
  //评论点赞
  Fabulous(e) {
    let { id, zan } = e.currentTarget.dataset, { messageList, details} = this.data;
    if (zan == 1) {
      utils.showToast('您不能重复点赞', 'none')
      return;
    }
    _http.request({
      url: "/api/video/articleZanDo",
      method: "POST",
      data: {
        video_id: id
      }
    }).then(res => {
      details.is_zan = details.is_zan == 1 ? 0 : 1;
      messageList.zan_count = details.is_zan == 1 ? messageList.zan_count + 1 : messageList.zan_count - 1;
      this.setData({
        details: details,
        messageList: messageList,
        status: true,
        text: "视频点赞+" + res.data.point + "积分"
      })
      setTimeout(() => {
        this.setData({
          status: false,
        })
      }, 2000)
    })
  },
  //评论点赞
  CommentFabulous(e) {
    let { commentid, newid, zan } = e.currentTarget.dataset, { comment } = this.data.messageList;
    if (zan == 1) {
      utils.showToast('您不能重复点赞', 'none')
      return;
    }
    _http.request({
      url: "/api/video/zanDo",
      method: "POST",
      data: {
        video_id: newid,
        comment_id: commentid
      }
    }).then(res => {
      if (res.code == 200) {
        for (let i in comment) {
          if (comment[i].comment_id == commentid) {
            comment[i].is_zan = comment[i].is_zan == 1 ? 0 : 1;
            comment[i].zan = comment[i].is_zan == 1 ? comment[i].zan + 1 : comment[i].zan - 1
          }
        }
        this.setData({
          [`messageList.comment`]: comment,
          status: true,
          text: "评论点赞+" + res.data.point + "积分"
        })
        setTimeout(() => {
          this.setData({
            status: false,
          })
        }, 2000)
      }
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
  Share(id) {
    _http.request({
      url: "/api/video/shareDo",
      method: "POST",
      data: {
        video_id: id
      }
    }).then(res => {
      if(res.data.code == 200){
        this.setData({
          [`messageList.share_count`]: this.data.messageList.share_count+1
        })
      } else if (res.data.code == 5017){
        wx.showToast({
          title: '当前视频已经分享过了',
          icon:"none"
        })
      }else{
        wx.showToast({
          title: res.data.message,
          icon: "none"
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

    console.log(res)
    if (res.from === 'button') {
      let id = res.target.dataset.id;
      this.Share(id);
    }
  }
})
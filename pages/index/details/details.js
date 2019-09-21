import HTTP from "../../../utils/request.js";
import utils from "../../../utils/util.js";
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:false,
    dataList: [{ "id": 6193654, "content": "http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400", "cover": "http://pic.rmb.bdstatic.com/mvideo/cde67c41211d7a46c1fb87138935b912" }],
    _index: '6193654',
    details:{},
    inputValue:"", //评论内容
    messageList:{},
    isContent:false,
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
  input(e){
    this.setData({
      isShow: true,
    })
  },
  //获取发送评论
  GetInputCon(e){
    this.setData({
      inputValue: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.Details(options.id)
    this.Message(options.id)
    this.setData({
      id: options.id
    })
  },
  Details(id){
    _http.request({
      url:"/api/news/detail",
      method:"GET",
      data:{
        news_id:id
      }
    }).then(res=>{
      let data = res.data.info;
      data.content = data.content.replace(/\<img/gi, '<img style="max-width:100%;height:auto"');
      this.setData({
        details:data
      })
    })
  },
  //发送评论
  Submit(){
    let { inputValue }=this.data;
    if (!inputValue){
      return
    }
    _http.request({
      url:"/api/news/commentDo",
      data:{
        news_id:this.data.id,
        content: inputValue
      },
      method:"POST"
    }).then(res=>{
      utils.showToast('评价成功','none')
      this.setData({
        isShow: false,
        inputValue:""
      })
      this.Message(this.data.id)
    })
  },
  //获取所有评论
  Message(id){
    _http.request({
      url:"/api/news/comment",
      method:"GET",
      data:{
        news_id:id,
        page:1,
        pagesize:10,
      }
    }).then(res=>{
      if (res.data.comment.length == 0){
        this.setData({
          isContent:true
        })
      }
      this.setData({
        messageList:res.data
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
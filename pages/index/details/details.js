import HTTP from "../../../utils/request.js";
import utils from "../../../utils/util.js";
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:false,
    details:{},
    inputValue:"", //评论内容
    messageList:{},
    isContent:false,
    status:false,
    text:''
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
        details:data,
      })
      if (data.is_give !==1){
        setTimeout(() => {
          this.setData({
            status: true,
            text: "浏览文章+" + res.data.point + "积分"
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
  Submit(){
    let { inputValue , messageList}=this.data;
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
      if (res.data.code == 5010){
        utils.showToast('评论内容已经存在', 'none')
        return;
      }
      this.setData({
        isShow: false,
        inputValue:"",
      })
      if (messageList.is_first == 1){
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
  //文章点赞
  Fabulous(e) {
    let {id, zan} = e.currentTarget.dataset, { messageList } =this.data;
    if(zan== 1){
      utils.showToast('您不能重复点赞', 'none')
      return;
    }
    _http.request({
      url: "/api/news/articleZanDo",
      method: "POST",
      data: {
        news_id: id
      }
    }).then(res => {
      messageList.is_zan = messageList.is_zan == 1 ? 0 : 1;
      messageList.zan_count = messageList.is_zan == 1 ? messageList.zan_count + 1 : messageList.zan_count - 1 ;
      this.setData({
        messageList: messageList,
        status: true,
        text: "文章点赞+" + res.data.point + "积分"
      })
      setTimeout(()=>{
        this.setData({
          status: false,
        })
      },2000)
    })
  },
  //评论点赞
  CommentFabulous(e){
    console.log(e)
    let { commentid, newid, zan} = e.currentTarget.dataset, { comment } = this.data.messageList ;
    console.log(zan)
    if(zan==1){
      utils.showToast('您不能重复点赞', 'none')
      return;
    }
    _http.request({
      url:"/api/news/zanDo",
      method:"POST",
      data:{
        news_id:newid,
        comment_id: commentid
      }
    }).then(res=>{
      if(res.code== 200){
        for(let i in comment){
          if (comment[i].comment_id == commentid){
            comment[i].is_zan = comment[i].is_zan == 1 ? 0 :1;
            comment[i].zan = comment[i].is_zan == 1 ? comment[i].zan + 1 : comment[i].zan-1
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
  Share(id){
    _http.request({
      url:"/api/news/shareDo",
      method:"POST",
      data:{
        news_id:id
      }
    }).then(res=>{
      console.log(res)
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    
    console.log(res)
    if (res.from === 'button'){
      let id = res.target.dataset.id;
      this.Share(id);
    }
  }
})
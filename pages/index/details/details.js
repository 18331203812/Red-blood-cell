import HTTP from "../../../utils/request.js";
import utils from "../../../utils/util.js";
var _http = new HTTP();
const app = getApp();
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
    text:'',
    isIphoneX: app.globalData.systemInfo.models  ? true : false,
    curtain: 'curtains',
    rpx: "",
    rpxheight: "",
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
    console.log(e.currentTarget.dataset.id)
    if (e.currentTarget.dataset.id != 1) {
      this.setData({
        isShow: true,
      })
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
  },
  inputs() {
    this.setData({
      isShow: false,
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
          text: "发表评论+" + res.data.point + "积分"
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
    let { id, zan } = e.currentTarget.dataset, { messageList, details} =this.data;
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
      details.is_zan = details.is_zan == 1 ? 0 : 1;
      messageList.zan_count = details.is_zan == 1 ? messageList.zan_count + 1 : messageList.zan_count - 1 ;
      this.setData({
        details: details,
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
  
  Shares() {
    this.setData({
      curtain: "curtain"
    })
    this.generate()
  },
  //退出海报
  Cur() {
    /* 该隐藏的隐藏 */
    this.setData({
      curtain: "curtains",
      imgshareBut: false
    })
  },
  //生成海报
  generate() {

    this.gener().then(res => {
      this.setData({ imgshare: res })
    })
  },
  gener() {

    //二维码
    return new Promise((reslove, sej) => {
      wx.showLoading({
        title: '正在加载中...',
        icon: 'none'
      })
      let that = this;
      let qrcode = new Promise((reslove, sej) => {
        // _http.request({
        //   url: "/api/qrcode",
        //   method: "GET",
        //   data: {
        //     id: that.data.ids
        //   }
        // }).then(res => {
        //   console.log(res)
        //   wx.getImageInfo({
        //     src: res.data.path,
        //     success(res) {

        //       reslove(res.path)
        //     },
        //     fail(err) {
        //       console.log(err);
        //     },
        //   });
        // })
        reslove('https://www.redxibao.com/activity/20191024/undefined.png')
      });
      //背景
      let avatar = new Promise((reslove, sej) => {
        console.log(that.data.details.avatar)
        wx.getImageInfo({
          src: that.data.details.avatar,
          success(res) {
            reslove(res.path)
          },
          fail(err) {
            console.log(err);
          },
        });
      });
      Promise.all([qrcode, avatar]).then((res) => {
        const ctx = wx.createCanvasContext('myCanvas');
        let rpx = that.data.rpx, heightrpx = that.data.rpxheight;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, 345 * rpx, 500 * heightrpx);
        ctx.drawImage(res[1], 0, 0, 345 * rpx, 200);
        ctx.drawImage(res[0], 30, 280, 70 * rpx, 70);
        ctx.setFontSize(18 * rpx);
        ctx.setFillStyle("#333");
        var text = that.data.details.title//这是要绘制的文本
        var chr = text.split("");//这个方法是将一个字符串分割成字符串数组
        var temp = "";
        var row = [];
        for (var a = 0; a < chr.length; a++) {
          if (ctx.measureText(temp).width < 250) {
            temp += chr[a];
          }
          else {
            a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
            row.push(temp);
            temp = "";
          }
        }
        row.push(temp);
        //如果数组长度大于2 则截取前两个
        if (row.length > 2) {
          var rowCut = row.slice(0, 2);
          var rowPart = rowCut[1];
          var test = "";
          var empty = [];
          for (var a = 0; a < rowPart.length; a++) {
            if (ctx.measureText(test).width < 220) {
              test += rowPart[a];
            }
            else {
              break;
            }
          }
          empty.push(test);
          var group = empty[0] + "..."//这里只显示两行，超出的用...表示
          rowCut.splice(1, 1, group);
          row = rowCut;
        }
        for (var b = 0; b < row.length; b++) {
          ctx.fillText(row[b], 30 * rpx, 230 + b * 20 * rpx);
        }

        ctx.setFontSize(14 * rpx);
        ctx.setFillStyle("#999");
        ctx.setFontSize(18 * rpx);
        ctx.setFillStyle("#d11515");
        ctx.setFontSize(16 * rpx);
        if (that.data.limit_text) {
          ctx.fillText(that.data.limit_text, 30 * rpx, 290 + b * 20 * rpx);
        }
        ctx.setFillStyle("#666666");
        ctx.fillText("报名期限：20", 110 * rpx, 270 + b * 20 * rpx);
        ctx.fillText("报名期限：20", 110 * rpx, 295 + b * 20 * rpx);
        that.setData({ imgshareBut: true })
        wx.hideLoading();
        ctx.draw(true, setTimeout(function () {     //为什么要延迟100毫秒？大家测试一下
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 612 * rpx,
            height: 687 * rpx,
            destWidth: 612 * rpx,
            destHeight: 687 * rpx,
            canvasId: 'myCanvas',
            success: res => {
              wx.hideLoading();
              reslove(res.tempFilePath)
            }
          }, that)
        }, 1000))
      })
    })
  },
  //下载海报
  saveImageToPhoto() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imgshare,
      success(res) {
        console.log(res)
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              /* 该隐藏的隐藏 */
              that.setData({
                curtain: "curtains"
              })
            }
          }, fail: function (res) {
            console.log(11111)
          }
        })
      },
      fail: res => {
        console.log(res)
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
    wx.getSystemInfo({
      success: res => {
        let rpx = res.windowWidth / 375;
        let rpxheight = res.windowHeight / 603
        this.setData({
          rpx: rpx,
          rpxheight: rpxheight
        })
      },
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

  },
  Share(id){
    _http.request({
      url:"/api/news/shareDo",
      method:"POST",
      data:{
        news_id:id
      }
    }).then(res=>{
      if (res.code == 200) {
        this.setData({
          [`messageList.share_count`]: this.data.messageList.share_count + 1
        })
      } else if (res.data.code == 5017) {
        wx.showToast({
          title: '当前视频已经分享过了',
          icon: "none",
          duration: 4000
        })
      } else {
        wx.showToast({
          title: res.data.message || "",
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
    if (res.from === 'button'){
      let id = res.target.dataset.id;
      this.Share(id);
    }
  }
})
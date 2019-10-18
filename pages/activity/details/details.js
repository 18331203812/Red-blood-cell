import HTTP from "../../../utils/request.js";
import utils from "../../../utils/util.js";
var _http = new HTTP();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curtain: 'curtains',
    rpx: "",
    rpxheight: "",
    details:{},
    isShow:false,
    status:"",
    text:"",
    ids:"",
    limit_text:"", //仅限那个社区
    imgshare:"", //生成海报链接
    status_title:"",//是否已结束
    isIphoneX: app.globalData.systemInfo.model == "iPhone X" ? true : false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.status){
      this.setData({
        limit_text: options.status,
        status_title: options.status_title
      })
    }
    
    this.Details(options.id)
  },
  Details(id){
    _http.request({
      url:"/api/activity/detail",
      method:"GET",
      data:{activity_id:id}
    }).then(res=>{
      this.setData({
        details:res.data.list,
        ids:id
      })
    })
  },
  //报名
  SignUp(e){
    let id = e.currentTarget.dataset.id;
    _http.request({
      url:"/api/activity/checkEnroll",
      method:"POST",
      data: { activity_id : id}
    }).then(res=>{
      if (res.data.code == 7005) {
        this.setData({
          isShow: true,
          status: "Enough"
        })
      } else if(res.data.code == 7004){
        this.setData({
          isShow:true,
          status:"NoOneself"
        })
      } else if (res.data.code == 7003){
        this.setData({
          isShow: true,
          status: "Personal",
          text:"才能参加活动呦"
        })
      }else if(res.data.code == 7002){
        utils.showToast('不需要重复报名','none')
      } else if (res.code == 200){
        wx.navigateTo({
          url: '/pages/activity/enterFor/enterFor?id=' + id + '&point=' + this.data.details.point,
        })
      }
    })
  },
  //删除弹框
  cancel(){
    this.setData({
      isShow:false
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
  Share() {
    this.setData({
      curtain: "curtain"
    })
    this.generate()
  },
  //退出海报
  Cur(){
    /* 该隐藏的隐藏 */
    this.setData({
      curtain: "curtains"
    })
  },
  //生成海报
  generate() {
   
    this.gener().then(res=>{
      console.log(res)
      this.setData({ imgshare: res })
    })
  },
  gener(){

    //二维码
    return new Promise((reslove, sej) => {
      wx.showLoading({
        title: '正在加载中...',
        icon: 'none'
      })
      let that = this;
      let qrcode = new Promise((reslove, sej) => {
        _http.request({
          url: "/api/qrcode",
          method: "GET",
          data: {
            id: that.data.ids
          }
        }).then(res => {
          console.log(res)
          wx.getImageInfo({
            src: res.data.path,
            success(res) {
            
              reslove(res.path)
            },
            fail(err) {
              console.log(err);
            },
          });
        })
      });
      //背景
      let avatar = new Promise((reslove, sej) => {
        console.log(that.data.details.cover)
        wx.getImageInfo({
          src: that.data.details.cover,
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
        ctx.drawImage(res[0], ((345 * rpx) - 110) / 2, 320, 110 * rpx, 110);
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
        ctx.fillText("长按识别或扫码查看活动详情", ((345 * rpx) - 230) / 2, 440 + b * 20 * rpx);
        ctx.setFontSize(14 * rpx);
        ctx.setFillStyle("#999");
        ctx.fillText("剩余名额：" + that.data.details.enroll + "人", 220 * rpx, 240 + b * 20 * rpx);
        ctx.setFontSize(18 * rpx);
        ctx.setFillStyle("#d11515");
        ctx.fillText(that.data.details.point + "积分", 30 * rpx, 240 + b * 20 * rpx);
        ctx.setFontSize(14 * rpx);
        if (that.data.limit_text) {
          ctx.fillText(that.data.limit_text, 30 * rpx, 290 + b * 20 * rpx);
        }
        ctx.setFillStyle("#666666");
        ctx.fillText("报名期限：" + that.data.details.ranage, 30 * rpx, 270 + b * 20 * rpx);
        ctx.fillText("此产品海报由【共益互助】小程序生成", ((345 * rpx) - 220) / 2, 465 + b * 20 * rpx);
        wx.hideLoading();
        ctx.draw(true, setTimeout(function () {     //为什么要延迟100毫秒？大家测试一下
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 646 * rpx,
            height: 966 * rpx,
            destWidth: 646 * rpx,
            destHeight: 966 * rpx,
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
  saveImageToPhoto(){
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
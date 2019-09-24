import HTTP from "../../../utils/request.js";
import utils from "../../../utils/util.js";
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curtain: 'curtains',
    rpx: "",
    rpxheight: "",
    details:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this.Details(options.id)
  },
  Details(id){
    _http.request({
      url:"/api/activity/detail",
      method:"GET",
      data:{activity_id:id}
    }).then(res=>{
      this.setData({
        details:res.data.list
      })
    })
  },
  //报名
  SignUp(e){
    let id = e.currentTarget.dataset.id;
    _http.request({
      url:"/api/activity/enrollDo",
      method:"POST",
      data: { activity_id : id}
    }).then(res=>{
      if(res.data.code == 7004){
        utils.showToast('您不是本小区居民，不能参加',"none")
      } else if (res.data.code == 7003){
        wx.showModal({
          title: '提示',
          content: '请先完善个人信息',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/me/personal/personal',
              })
            } else if (res.cancel) {
              
            }
          }
        })
      }else if(res.data.code == 7002){
        utils.showToast('不需要重复报名','none')
      } else if (res.data.code == 200){
        utils.showToast('报名成功', 'none')
        this.setData({
          [`details.is_enroll`]: 1
        })
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
  Share() {
    this.setData({
      curtain: "curtain"
    })
    this.generate()
  },
  //生成海报
  generate() {
    wx.showLoading({
      title: '正在加载中...',
      icon: 'none'
    })
    let that = this;
    
    //二维码
    let qrcode = new Promise((reslove, sej) => {
      reslove(`data:image/png;base64,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`)

    });
    //背景
    let avatar = new Promise((reslove, sej) => {
      wx.getImageInfo({
        src: "https://cn.bing.com/th?id=OHR.SunbeamsForest_ZH-CN5358008117_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp",
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
      var text ="还厉害厉害好厉害厉害厉害"//这是要绘制的文本
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
      ctx.fillText("长按识别或扫码查看产品详情", ((345 * rpx) - 230) / 2, 440 + b * 20 * rpx);
      ctx.setFontSize(14 * rpx);
      ctx.setFillStyle("#999");
      ctx.fillText("剩余名额：36人", 220 * rpx, 240 + b * 20 * rpx);
      ctx.setFontSize(18 * rpx);
      ctx.setFillStyle("#d11515");
      ctx.fillText("90积分", 30 * rpx, 240 + b * 20 * rpx);
      ctx.setFontSize(14 * rpx);
      ctx.fillText("活动仅限西西里社区居民参加", 30 * rpx, 290 + b * 20 * rpx);
      ctx.setFillStyle("#666666");
      ctx.fillText("报名期限：至2019年9月30日", 30 * rpx, 270 + b * 20 * rpx);
      ctx.fillText("此产品海报由【红细胞】小程序生成", ((345 * rpx) - 220) / 2, 465 + b * 20 * rpx);
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
            console.log(res.tempFilePath)
            that.setData({ imgshare: res.tempFilePath })
          }
        }, that)
      }, 1000))
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
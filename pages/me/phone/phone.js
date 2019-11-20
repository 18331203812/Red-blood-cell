import HTTP from "../../../utils/request.js";
import utils from "../../../utils/util.js";
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime: 60,
    disabled: false,
    time: "60重新获取",
    primaryPhone:"",
    phone:"",
    code:""
  },
  //发布验证码
  code() {
    let {phone}=this.data;
    if (! /^1\d{10}$/.test(phone)){
      utils.showToast("请输入正确的手机号",'none')
      return;
    };
    _http.request({
      url:"/api/user/send",
      data:{
        mobile:phone
      },
      method:"POST"
    }).then(res=>{
      console.log(res)
      if(res.code== 200){
        this.setData({
          disabled: true
        })
        // 设置发送验证码按钮样式
        let interval = null, _this = this;
        let currentTime = _this.data.currentTime;
        interval = setInterval(function () {
          currentTime--;
          _this.setData({
            time: currentTime + '重新获取',
          })
          if (currentTime <= 0) {
            clearInterval(interval)
            _this.setData({
              time: '60重新获取',
              currentTime: 60,
              disabled: false
            })
          }
        }, 1000)
      }else{
        utils.showToast(res.code,'none')
      }
    })
  },
  //完成
  Sumbit(){
    let { phone ,code} = this.data;
    if (! /^1\d{10}$/.test(phone)) {
      utils.showToast("请输入正确的手机号", 'none')
      return;
    };
    if(!code){
      utils.showToast("请输入验证码", 'none')
      return
    }
    if (code.length!==6) {
      utils.showToast("请输入正确的验证码", 'none')
      return
    }
    _http.request({
      url:"/api/user/bindphone",
      method:"POST",
      data:{
        mobile: phone,
        code:code
      }
    }).then(res=>{
      console.log(res)
      if(res.code==200){
        utils.showToast("修改成功",'none')
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          })
        },1000)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      primaryPhone: options.phone
    })
  },
  //手机号
  Phone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  //获取验证码
  Code(e){
    this.setData({
      code: e.detail.value
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
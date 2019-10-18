import util from "../../../utils/util.js"
import HTTP from "../../../utils/request.js"
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    listIndex:1,
    status:"Sign",
    isShow:false,
    text:"签到+5积分",
    remark:[], //积分说明
    integral:""
  },
  List() {
    _http.request({
      url: "/api/user/record",
      method: "GET",
      data: {
        page: 1,
        pagesize: 10
      }
    }).then(res => {
      this.setData({
        integral: res.data.integral
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.Interface();
    this.Sign();
    this.List();
  },
  //签到
  Sign(){
    _http.request({
      url:"/api/user/signinDo",
      method:"POST"
    }).then(res=>{
      if(res.code== 200){
        this.setData({
          isShow:true,
          text: "签到+" + res.data.point+'积分'
        })
        this.Interface();
      }else if(res.code==1011){
        console.log('今日已签到')
      }
    })
  },
  //删除弹框
  cancel() {
    this.setData({
      isShow: false
    })
  },
  //新建接口
  Interface(){
    _http.request({
      url:'/api/user/signin',
      method:"GET"
    }).then(res=>{
      let data=res.data.list;
      this.setData({
        remark: res.data.remark
      })
      if (data[6].is_sign == 1){
        this.setData({
          list: data.slice(7, 14),
          listIndex:8
        })
      }else{
        this.setData({
          list: data.slice(0, 7),
          listIndex: 1,
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
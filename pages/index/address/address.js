import HTTP from "../../../utils/request.js";
import utils from "../../../utils/util.js";
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime: 60,
    disabled: false,  //获取验证码倒计时
    time: "60秒后可重新获取",

    isShow_08: false,
    columnsData: [],    //选择省市区街道组件
    picker_08_data: [],
    index: [0, 0, 0, 0],

    addresstext: [], // 选择社区的
    addresindex: [0],
    isShowPicker: false,
    addressdata: [],

  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let address = wx.getStorageSync('address') ? JSON.parse(wx.getStorageSync('address')) : '';
    if(address){
      this.setData({
        picker_08_data: address.picker_08_data,
        addressdata: address.addressdata
      })
    }
  },
  Submit(){
    let { picker_08_data, addressdata }=this.data,data={};
    if (picker_08_data.length == 0){
      utils.showToast("请选择省/市/街道",'none')
      return;
    }
    if (!addressdata.community_name) {
      utils.showToast("请选择地址", 'none')
      return;
    }
    data.picker_08_data = picker_08_data
    data.addressdata = addressdata
    wx.setStorageSync('address', JSON.stringify(data))
    wx.navigateBack({
      delta: 1
    })
  },
 
  /**
   * 获取社区地址
   */
  Address(id) {
    _http.request({
      url: "/api/tag/getCommunity",
      method: "POST",
      data: {
        street_id: id
      }
    }).then(res => {
      let list = res.data.list;
      if (list.length == 0) {
        utils.showToast("本街道还未有社区", 'none')
        return;
      }
      this.setData({
        addresstext: list,
        isShowPicker: true
      })
    })
  },
  /**
   * 开始社区
   */
  AddressPicker() {
    let { picker_08_data } = this.data;
    let id = picker_08_data.length ? picker_08_data[3].id : null;
    if (!id) {
      utils.showToast("请先选择城市/区/街道", 'none')
      return
    }
    this.Address(id);
  },
  //确认
  sure() {
    let { addresstext, addresindex } = this.data;
    this.setData({
      isShowPicker: false,
      addressdata: addresstext[addresindex]
    })
  },
  //取消
  cancle() {
    this.setData({
      isShowPicker: false,
    })
  },
  //选择社区
  _bindChange(e) {
    this.setData({
      addresindex: e.detail.value,
      addressdata: this.data.addresstext[e.detail.value[0]]
    })
  },
  /**
   * 开启组件picker
   */
  showPicker: function (e) {
    this.setData({
      isShow_08: true,
      address: e.currentTarget.dataset.id
    })
  },
  /**
   * 确认组件picker
   */
  sureCallBack_08(e) {
    this.setData({
      isShow_08: false,
      picker_08_data: e.detail.choosedData,
      addressdata:{}
    })
  },
  /**
   * 取消picker
   */
  cancleCallBack_08(e) {
    this.setData({
      isShow_08: false,
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
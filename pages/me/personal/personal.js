import HTTP from "../../../utils/request.js";
import utils from "../../../utils/util.js";
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime:60,
    disabled:false,  //获取验证码倒计时
    time:"60秒后可重新获取",

    isShow_08: false,
    columnsData: [],    //选择省市区街道组件
    picker_08_data:[],
    index:[0,0,0,0],

    addresstext:[], // 选择社区的
    addresindex:[0],
    isShowPicker:false,
    addressdata:[],

    phone:"", //手机号码
    name:"" , //名字
    categoryList:[], //身份
    ids: "", //身份id
    checked:true, //同意
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.Identity()
  },
  //点击身份标题信息
  Category(e){
    this.setData({
      ids: e.currentTarget.dataset.id
    })
  },
  //获取身份标题信息
  Identity(){
    _http.request({
      url:"/api/tag/index",
      method:"GET"
    }).then(res=>{
      this.setData({
        categoryList:res.data.list
      })
    })
  },
  //发送验证码
  code(){
    this.setData({
      disabled: true
    })
    // 设置发送验证码按钮样式
    let interval = null , _this=this;
    let currentTime = _this.data.currentTime;
    interval = setInterval(function () {
      currentTime--;
      _this.setData({
        time: currentTime + '秒后可重新获取',
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        _this.setData({
          time: '60秒后可重新获取',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
    
  },
 /**
  * 获取社区地址
  */
  Address(id){
    _http.request({
      url:"/api/tag/getCommunity",
      method:"POST",
      data:{
        street_id:id
      }
    }).then(res=>{
      let list = res.data.list;
      if(list.length== 0){
        utils.showToast("本街道还未有社区", 'none')
        return;
      }
      this.setData({
        addresstext:list,
        isShowPicker: true
      })
    })
  },
  /**
   * 开始社区
   */
  AddressPicker(){
    let { picker_08_data } = this.data;
    let id = picker_08_data.length ? picker_08_data[3].id : null;
    if (!id) {
      utils.showToast("请先选择城市/区/街道", 'none')
      return
    }
    this.Address(id);
  },
  //确认
  sure(){
    let { addresstext, addresindex}=this.data;
    this.setData({
      isShowPicker:false,
      addressdata: addresstext[addresindex]
    })
  },
  //取消
  cancle(){
    this.setData({
      isShowPicker: false,
    })
  },
  //选择社区
  _bindChange(e){
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
  //获取姓名
  Name(e){
    this.setData({
      name: e.detail.value
    })
  },
  //获取手机号码
  Phone(e){
    this.setData({
      phone: e.detail.value
    })
  },


  /**
   * 提交
   */
  Submit(){
    let { name, phone, ids, picker_08_data, addressdata, checked}=this.data;
    if(!name){
      utils.showToast('请输入姓名', 'none');
      return;
    }
    if(!phone){
      utils.showToast('请输入手机号', 'none');
      return;
    }
    if (!utils.isPhoneAvailable(phone)){
      utils.showToast('请输入正确的手机号', 'none');
      return;
    }
    if (!ids){
      utils.showToast('请选择身份', 'none');
      return;
    }
    if (picker_08_data.length == 0){
      utils.showToast('请选择省份/城市/区/街道', 'none');
      return;
    }
    if (addressdata.length == 0){
      utils.showToast('请选择社区', 'none');
      return;
    }
    if (!checked){
      utils.showToast('请勾选用户服务协议、隐私协议', 'none');
      return;
    }
    _http.request({
      url:"/api/user/perfectInformation",
      method:"POST",
      data:{
        username:name,
        mobile: phone,
        identity_id:ids,
        province_id: picker_08_data[0].province_id,
        city_id: picker_08_data[1].city_id,
        district_id: picker_08_data[2].district_id,
        street_id: picker_08_data[3].id,
        community_id: addressdata.id
      }
    }).then(res=>{
      wx.showToast({
        title: '提交成功',
        icon:"none"
      })
      setTimeout(function(){
        wx.navigateBack({
          delta:2
        })
      },1000)
    })
  },
  //勾选框
  checkboxChange(e){
    this.setData({
      checked: this.data.checked ? false : true 
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
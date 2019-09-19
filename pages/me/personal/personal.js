import HTTP from "../../../utils/request.js";
import utils from "../../../utils/util.js";
var _http = new HTTP();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime:60,
    disabled:false,
    time:"60秒后可重新获取",
    isShow_08: false,
    listData_08: [
      {
        "province_name": "江苏省",
        "province_id": 320000,
        "children": [
          {
            "cityname": "苏州市",
            "city_id": 320500,
            "children": [
              {
                "district_name": "虎丘区",
                "district_id": 320505,
                "children": [
                  {
                    "id": 2,
                    "street_name": "狮山街道"
                  }
                ]
              },
              {
                "district_name": "姑苏区",
                "district_id": 320508,
                "children": [
                  {
                    "id": 3,
                    "street_name": "葑门街道"
                  },
                  {
                    "id": 4,
                    "street_name": "友新街道"
                  }
                ]
              },
              {
                "district_name": "工业园区",
                "district_id": 320587,
                "children": [
                  {
                    "id": 1,
                    "street_name": "斜塘街道"
                  },
                  {
                    "id": 5,
                    "street_name": "娄葑街道"
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    picker_08_data: '', //点击确认的数据
    defaultPickData_08: [
      { id: 110000 }, { id: 110100 }, { id: 110101 }
    ],// 选择显示所在
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.Province();
  },
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
  //获取省份的地址
  Province(){
    _http.request({
      url:"/api/tag/getStreet",
      method:"GET",
    }).then(res=>{
      console.log(res)
      this.setData({
        listData_08: res.data.list
      })
    })
  },
  /**
   * 开启picker
   */
  showPicker: function (e) {
    console.log(e)
    this.setData({
      isShow_08: true,
      address: e.currentTarget.dataset.id
    })
  },
  /**
   * 确认picker
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
  cancleCallBack_08() {
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
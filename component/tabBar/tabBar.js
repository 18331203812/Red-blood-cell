// tabBarComponent/tabBar.js
import HTTP from "../../utils/request.js";
import utils from "../../utils/util.js";
var _http = new HTTP();
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
        "backgroundColor": "#ffffff",
        "color": "#979795",
        "selectedColor": "#1c1c1b",
        "list": [
          {
            "pagePath": "/pages/tabBar/index/index",
            "text": "首页",
            "iconPath": "../../images/tabBar/index.png",
            "selectedIconPath": "../../images/tabBar/indexs.png"
          },
          {
            "pagePath": "/pages/tabBar/activity/activity",
            "text": "活动",
            "iconPath": "../../images/tabBar/activity.png",
            "selectedIconPath": "../../images/tabBar/activitys.png"
          },
          {
            "pagePath": "/pages/tabBar/integral/integral",
            "text": "兑换",
            "iconPath": "../../images/tabBar/integral.png",
            "selectedIconPath": "../../images/tabBar/integrals.png"
          },
          {
            "pagePath": "/pages/tabBar/me/me",
            "text": "我的",
            "iconPath": "../../images/tabBar/me.png",
            "selectedIconPath": "../../images/tabBar/mes.png"
          }
        ]
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.systemInfo.models ? true : false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    Nav(){
      _http.request({
        url: "/api/user/profile",
        method: "GET",
      }).then(res => {
        let data = res.data.list;
        if (data.city_name && data.mobile && data.username) {
          wx.switchTab({
            url: '/pages/tabBar/video/video'
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '您还没有完善个人信息不行观看视频！',
            confirmText: "去完善",
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/me/personal/personal',
                })
              } else if (res.cancel) {
                
              }
            }
          })
         
        }
      })
      // wx.navigateTo({
      //   url:"/pages/login/login/login"
      // })
    },
  }
})

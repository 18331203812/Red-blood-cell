// tabBarComponent/tabBar.js
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
    isIphoneX: app.globalData.systemInfo.model == "iPhone X" ? true : false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})

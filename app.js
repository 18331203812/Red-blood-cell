//app.js
App({
  onReady: function () {
    wx.hideTabBar({
      fail: function () {
        setTimeout(function () {
          wx.hideTabBar()
        }, 500)
      }
    });
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    this.getSystemInfo();
  },
  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;

    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);


    // if(pagePath.indexOf('/') != 0){
    //   pagePath = '/' + pagePath;
    // } 

    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        t.globalData.systemInfo = res;
      }
    });
  },
  globalData: {
    userInfo: null,
    systemInfo: null,//客户端设备信息
    tabBar: {
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
          "pagePath": "/pages/tabBar/video/video",
          "text": "视频",
          "iconPath": "/images/tabBar/video.png",
          "selectedIconPath": "/images/tabBar/videos.png"
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
})
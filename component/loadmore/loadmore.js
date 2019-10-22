// component/loadmore/loadmore.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  externalClasses: ['page', "page__bd", "weui-loadmore", "weui-loading", 'weui-loadmore__tips'],
  properties: {
    isShow: {
      type: Boolean,
      value: true
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

  }
})

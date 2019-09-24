// component/integral/integral.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text:{
      type:String,
      vlaue:"浏览文章+10积分"
    },
    status:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    status:true
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  pageLifetimes: {
    show: function () {
      // setTimeout(()=>{
      //   this.setData({
      //     status:false
      //   })
      // },2000)
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  }
})

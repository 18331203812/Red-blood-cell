// component/frame/frame.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status:{
      type:String,
      value:"NoOneself"
    },
    isShow:{
      type:Boolean,
      value:false
    },
    text:{
      type:String,
      value:"才能兑换商品呦"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //取消
    _cancel(){
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('_cancel', myEventDetail, myEventOption)
    }
  }
})

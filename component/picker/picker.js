// picker/picker.js
import { isString,isPlainObject } from './tool';
import HTTP from "../../utils/request.js";
import utils from "../../utils/util.js";
var _http = new HTTP();


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    scrollType:{
      type: String,
      value: "normal"//"link": scroll间联动  "normal": scroll相互独立
    },
    defaultPickData:{
      type: Array,
      value: [],
     
    },
    keyWordsOfShow:{
      type: String,
      value: "name"
    },
    isShowPicker:{
      type: Boolean,
      value: false,
      
    },
    titleText: {//标题文案
      type: String,
      value: ""
    },
    cancelText:{//取消按钮文案
      type: String,
      value: "取消"
    },
    sureText:{//确定按钮文案
      type: String,
      value: "确定"
    },
    pickerHeaderStyle: String,//标题栏样式 view
    sureStyle: String, //标题栏确定样式  text
    cancelStyle: String,//标题栏取消样式 text
    titleStyle: String,//标题栏标题样式  view
    maskStyle: String,//设置蒙层的样式（详见picker-view） view
    indicatorStyle: String,//设置选择器中间选中框的样式（详见picker-view） view
    chooseItemTextStyle: String//设置picker列表文案样式 text
  },

  /**
   * 组件的初始数据
   */
  data: {
    district:0,
    street:0,
    index:[0,0,0,0],
    listData:[]
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
      //获取省份的地址
        _http.request({
          url: "/api/tag/getStreet",
          method: "GET",
        }).then(res => {
          this.setData({
            listData: res.data.list
          })
        })
    },
    hide: function () { },
    resize: function () { },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _bindChange(e){
      this.setData({
        district: e.detail.value[1],
        street: e.detail.value[2],
        index: e.detail.value
      })
    },
    sure(){
      let { listData, index}=this.data;
      let array=[];
      array.push(
        {
          province_id: listData[index[0]].province_id,
          province_name: listData[index[0]].province_name
        },
        {
          city_id: listData[index[0]].city_list[index[1]].city_id,
          cityname: listData[index[0]].city_list[index[1]].cityname
        },
        {
          district_id: listData[index[0]].city_list[index[1]].district_list[index[2]].district_id,
          district_name: listData[index[0]].city_list[index[1]].district_list[index[2]].district_name,
        },
        {
          id: listData[index[0]].city_list[index[1]].district_list[index[2]].street_list[index[3]].id,
          street_name: listData[index[0]].city_list[index[1]].district_list[index[2]].street_list[index[3]].street_name,
        }
      )
      this.triggerEvent('sure', {
        choosedData: array,
      })
    },
    cancle(){
      this.triggerEvent('cancle', {
        
      })
    },
    _bindpickstart(){

    },
    _bindpickend(){
      
    }
  }
})

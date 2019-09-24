class HTTP {
  request(param) {
    let _this = this;
    let baseUrl = 'https://mininews.51asx.com';
    return new Promise((resolve, reject) => {
      let access_token = wx.getStorageSync('login').token || '';
      wx.request({
        method: param.method || 'get',
        url: baseUrl + param.url || '',
        data: param.data || null,
        header: access_token ? {
          'content-type': 'application/x-www-form-urlencoded',
          "Authorization": `${access_token}`
        } : {
            'content-type': 'application/x-www-form-urlencoded',
        },
        success: (res => {
          if (res.data.code === 200) {
            //200: 服务端业务处理正常结束
            resolve(res.data)
          } else if (res.data.code === 1003){
            //未登录
            wx.navigateTo({
              url: '/pages/login/login/login',
            })
          }else{
            //其它错误，提示用户错误信息

            /*** 
             * 需要根据接口文档改！！！
            */
            // reject(res)
            resolve(res)
          }
        }),
        fail: (err => {
          if (err.responseJSON) {
            // reject(err.responseJSON.message)
          } else {
            // reject(err);
          }
        })
      });
    });
  }
}

export default HTTP;
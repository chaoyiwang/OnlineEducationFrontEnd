import request from '@/utils/request'
export default {
  getBannerList() {
      //查询前两条Banner信息
    return request({
      url: `/educms/banner/getAllBanner`,
      method: 'get'
    })
  }
}
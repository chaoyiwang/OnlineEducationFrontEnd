import request from '@/utils/request'

export default {
  //生成统计数据
  createStatistics(day) {
    return request({
      url: `/staservice/statisticsDaily/registerCount/${day}`,
      method: 'post'
    })
  },
  //获取统计数据
  showChart(searchObj) {
    return request({
        url: `/staservice/statisticsDaily/showChart/${searchObj.begin}/${searchObj.end}/${searchObj.type}`,
        method: 'get'
    })
}
}
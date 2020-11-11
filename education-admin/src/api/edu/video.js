import request from '@/utils/request'

export default {

  addVideo(video) {
    return request({
      url: `/eduservice/video/addVideo`,
      method: 'post',
      data: video
    })
  },

  getVideInfoById(id) {
    return request({
      url: `/eduservice/video/videoInfo/${id}`,
      method: 'get'
    })
  },

  updateVideoInfoById(video) {
    return request({
      url: `/eduservice/video/updateVideoInfo/${video.id}`,
      method: 'put',
      data: video
    })
  },

  deleteVideoById(id) {
    return request({
      url: `/eduservice/video/${id}`,
      method: 'delete'
    })
  },
  //根据视频id删除阿里云视频
  removeAliyunVideoById(id) {
    return request({
      url: `//eduvod/video/removeAliyunVideo/${id}`,
      method: 'delete'
    })
  },
}
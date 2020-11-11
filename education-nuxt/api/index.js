import request from '@/utils/request'
export default {
  getTeacherAndCourseList() {
    return request({
      url: `/eduservice/index/index`,
      method: 'get'
    })
  }
}
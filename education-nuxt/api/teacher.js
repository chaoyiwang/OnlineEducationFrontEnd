import request from '@/utils/request'
export default {
  // 分页讲师查询方法
  getPageList(page, limit) {   
    return request({
      url: `/eduservice/teacher/getTeacherList/${page}/${limit}`,
      method: 'get'
    })
  },
  //2 讲师详情的方法
  getTeacherInfo(teacherId) {
    return request({
        url: `/eduservice/teacher/getTeacherInfo/${teacherId}`,
        method: 'get'
    })
}
}
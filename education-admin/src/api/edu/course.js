import request from '@/utils/request'

export default {
    //课程分类列表
    addCourseInfo(courseInfo) {
        return request({
            url: `/eduservice/course/addCourseInfo`,
            method: 'post',
            data: courseInfo
        })
    },
    //查询所有讲师
    getTeacherList() {
        return request({
            url: `/eduservice/teacher/findAll`,
            method: 'get'
        })
    },
    //根据课程id查询课程基本信息
    getCourseInfoById(courseId) {
        return request({
            url: `/eduservice/course/getCourseInfo/${courseId}`,
            method: 'get'
        })
    },
    //修改课程信息
    updateCourseInfo(courseInfo) {
        return request({
            url: `/eduservice/course/updateCourseInfo`,
            method: 'post',
            data: courseInfo
        })
    },
    //课程确认信息显示
    getCoursePublishInfo(id) {
        return request({
            url: `/eduservice/course/coursePublishInfo/${id}`,
            method: 'get'
        })
    },
    //课程最终发布，修改课程状态
    publishCourse(id) {
        return request({
          url: `/eduservice/course/publishCourse/${id}`,
          method: 'post'
        })
      },
      //课程列表 条件查询带分页
      getPageList(page, limit, courseQuery) {
        return request({
          url: `/eduservice/course/pagePageCondition/${page}/${limit}`,
          method: 'get',
          params: courseQuery
        })
      },
      //删除课程
      removeById(id) {
        return request({
            url: `/eduservice/course/${id}`,
            method: 'delete'
        })
    }
}
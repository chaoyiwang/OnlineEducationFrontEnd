import request from '@/utils/request'
export default {
    // 条件查询带分页查询课程
    getPageList(page, limit, searchObj) {
        return request({
            url: `/eduservice/course/getCourseList/${page}/${limit}`,
            method: 'post',
            data: searchObj
        })
    },
    // 查询所有分类方法
    getAllSubjects() {
        return request({
            url: `/eduservice/subject/getAllSubjects`,
            method: 'get'
        })
    },
    //根据课程id查询课程信息和讲师信息
    getBaseCourseInfoById(courseId) {
        return request({
            url: `/eduservice/course/getCourseInfo/${courseId}`,
            method: 'get'
        })
    }
}
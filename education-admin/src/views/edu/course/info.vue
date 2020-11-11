<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写" />
      </el-form-item>

      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
          @change="firstClassSubjectChanged"
        >
          <el-option
            v-for="subject in firstClassSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in secondClassSubjectList"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" />
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveData">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from "@/api/edu/course";
import subject from "@/api/edu/subject";
import Tinymce from "@/components/Tinymce"; //引入组件

const defaultForm = {
  title: "",
  subjectId: "", //二级课程分类id
  subjectParentId: "", //一级课程分类id
  teacherId: "",
  lessonNum: 0,
  description: "",
  cover: "/static/fandebiao.jpg",
  price: 0,
};

export default {
  //声明组件
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo: defaultForm,
      BASE_API: process.env.BASE_API, // 接口API地址
      teacherList: [], //封装所有讲师的数据
      firstClassSubjectList: [], //一级分类
      secondClassSubjectList: [], //二级分类
    };
  },

  watch: {
    $route(to, from) {
      this.init();
    },
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      //获取路由内的courseid值
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id;
        //根据课程id查询信息
        this.getInfoById();
      } else {
        //有值做修改没有值做添加
        //路径没有id，清空表单
        this.courseInfo = { ...defaultForm };
        //初始化所有讲师
        this.getTeacherList();
        //初始化一级分类
        this.getFirstClassSubjectList();
      }
    },
    //根据课程id查询信息
    getInfoById() {
      course.getCourseInfoById(this.courseId).then((response) => {
        //在courseinfo课程基本信息里包含了一级分类id和二级分类id
        this.courseInfo = response.data.courseInfoVo;
        //1 查询所有分类，包括一级和二级
        subject.getSubjectList().then((response) => {
          //2 获取所有一级分类
          this.firstClassSubjectList = response.data.list;
          //3 把所有一级分类数组进行遍历，比较当前courseInfo里面一级分类id和所有一级分类id是否一样
          for (var i = 0; i < this.firstClassSubjectList.length; i++) {
            //获取里面每一个一级分类
            var firstClassSubject = this.firstClassSubjectList[i];
            //比较当前courseInfo里面一级分类id和所有一级分类id是否一样
            if (this.courseInfo.subjectParentId == firstClassSubject.id) {
              //获取一级分类所有的二级分类
              this.secondClassSubjectList = firstClassSubject.children;
            }
          }
        });
        //初始化所有讲师
        this.getTeacherList();
      });
    },
    //上传封面成功调用的方法，得到地址并显示
    handleAvatarSuccess(response, file) {
      this.courseInfo.cover = response.data.url;
    },
    //上传之前调用的方法，指定传什么格式什么大小的文件，
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //点击某个一级分类，出发change事件，显示对应的二级分类
    firstClassSubjectChanged(value) {
      //value就是一级分类的id
      //遍历所有的分类，包括一级和二级
      for (let i = 0; i < this.firstClassSubjectList.length; i++) {
        //得到每个一级分类，判断所有一级分类id和点击一级分类id是否一样
        if (this.firstClassSubjectList[i].id === value) {
          //如果相同，从一级分类获取里面所有的二级分类
          this.secondClassSubjectList = this.firstClassSubjectList[i].children;
          //v-model双向绑定，把二级分类id值清空
          this.courseInfo.subjectId = "";
        }
      }
    },
    //查询所有的一级分类
    getFirstClassSubjectList() {
      subject.getSubjectList().then((response) => {
        this.firstClassSubjectList = response.data.list;
      });
    },
    //查询所有讲师
    getTeacherList() {
      course.getTeacherList().then((response) => {
        this.teacherList = response.data.Teachers;
      });
    },
    //添加课程
    addCourse() {
      course
        .addCourseInfo(this.courseInfo)
        .then((response) => {
          this.$message({
            type: "success",
            message: "保存成功!",
          });
          //跳转到第二步,添加之后会返回courseId
          this.$router.push({
            path: "/course/chapter/" + response.data.courseId,
          });
        })
        .catch((response) => {
          this.$message({
            type: "error",
            message: response.message,
          });
        });
    },
    //修改课程
    updateCourse() {
      course
        .updateCourseInfo(this.courseInfo)
        .then((response) => {
          this.$message({
            type: "success",
            message: "修改成功!",
          });
          //修改不会返回courseId，所以我们直接从路由中获取
          this.$router.push({
            path: "/course/chapter/" + this.courseId,
          });
        })
        .catch((response) => {
          this.$message({
            type: "error",
            message: "保存失败",
          });
        });
    },
    //保存并下一步调用的方法
    saveData() {
      //判断是添加还是修改，courseInfo有id值就是修改，没有id值就是添加
      if (!this.courseInfo.id) {
        //没有id值就是添加,调用addCourse方法
        this.addCourse();
      } else {
        //有id值就是修改,调用updateCourse方法
        this.updateCourse();
      }
    },
  },
};
</script>
<!-- tinymce组件样式,scoped只在当前页面有效-->
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
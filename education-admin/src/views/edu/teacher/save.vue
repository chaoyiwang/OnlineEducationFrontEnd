<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" :min="0" />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea" />
      </el-form-item>

      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar" />
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>

        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调-->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduoss/fileoss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from "@/api/edu/teacher";
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";

export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        name: "",
        sort: 1,
        level: 1,
        career: "",
        intro: "",
        avatar: "",
      },
      imagecropperShow: false, //上传弹框组件是否显示
      imagecropperKey: 0, //上传组件唯一标识key值
      BASE_API: process.env.BASE_API, //获取dev.env.js中的地址
      saveBtnDisabled: false, //保存按钮是否禁用
    };
  },

  watch: {
    $route(to, from) {
      //监听路由变化的方式，只有路由发生变化，方法就会执行
      this.init();
    },
  },

  created() {
    this.init();
  },

  methods: {
    close() {
      //关闭上传弹框
      this.imagecropperShow = false;
      //上传组件初始化
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    cropSuccess(data) {
      //上传成功之后接口返回图片地址controller中的url
      this.teacher.avatar = data.url;
      //关闭上传弹框
      this.imagecropperShow = false;
      //上传组件初始化
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    init() {
      //修改回显如果地址里有id才调用create方法
      //判断路径有id，修改
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id; //id和之前edit/:id名字对上就行了
        this.getInfo(id);
      } else {
        // 路径没有id，清空表单
        this.teacher = {};
      }
    },

    updateTeacher() {
      this.saveBtnDisabled = true;
      teacher
        .updateTeacherInfo(this.teacher)
        .then((response) => {
          return this.$message({
            type: "success",
            message: "修改成功!",
          });
        })
        .then((response) => {
          this.$router.push({ path: "/teacher/table" });
        })
        .catch((response) => {
          this.$message({
            type: "error",
            message: "保存失败",
          });
        });
    },

    getInfo(id) {
      teacher
        .getTeacherInfo(id)
        .then((response) => {
          this.teacher = response.data.teacher; //根据return R.ok().data("teacher", eduTeacher);引号里的teacher
        })
        .catch((response) => {
          this.$message({
            type: "error",
            message: "获取数据失败",
          });
        });
    },
    saveOrUpdate() {
      this.saveBtnDisabled = true;
      //判断是修改还是添加
      if (!this.teacher.id) {
        this.saveTeacher();
      } else {
        this.updateTeacher();
      }
    },

    // 添加讲师
    saveTeacher() {
      teacher
        .addTeacher(this.teacher)
        .then((response) => {
          //提示成功
          return this.$message({
            type: "success",
            message: "保存成功!",
          });
        })
        .then((resposne) => {
          //回到列表界面，路由跳转，重定向(地址来源inde.js)
          this.$router.push({ path: "/teacher/table" });
        })
        .catch((response) => {
          this.$message({
            type: "error",
            message: "保存失败",
          });
        });
    },
  },
};
</script>
<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-button type="text" @click="chapterDialog()">添加章节</el-button>

    <!-- 章节 -->
    <ul class="chapterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="openVideo(chapter.id)">添加课时</el-button>
            <el-button style type="text" @click="editChapter(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>

        <!-- 视频 -->
        <ul class="chapterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button type="text" @click="editVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>
    <!-- 添加和修改章节Chapter表单弹框 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加和修改课时Video表单弹框 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduvod/video/uploadAliyunVideo'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，
                <br />支持3GP、ASF、AVI、DAT、DV、FLV、F4V、
                <br />GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、
                <br />MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、
                <br />SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from "@/api/edu/chapter";
import video from "@/api/edu/video";
export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseId: "", // 所属课程
      chapterVideoList: [], // 章节嵌套课时列表
      dialogChapterFormVisible: false, //是否显示章节表单
      chapter: {
        // 章节对象
        title: "",
        sort: 0,
      },
      saveVideoBtnDisabled: false, // 课时按钮是否禁用
      dialogVideoFormVisible: false, // 是否显示课时表单
      chapterId: "", // 课时所在的章节id
      video: {
        // 课时对象
        title: "",
        sort: 0,
        free: 0,
        videoSourceId: "",
        videoOriginalName: "",
      },
      fileList: [], //上传文件列表
      BASE_API: process.env.BASE_API, // 接口API地址
    };
  },

  created() {
    //获取路由内的courseid值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id;
      //调用方法：根据课程id查询章节和小节
      this.getChapterVideo();
    }
  },

  methods: {
    //点击x调用的方法
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //点击确定调用的方法，调用接口的删除视频的方法
    handleVodRemove(file, fileList) {
      //根据视频id删除
      video.removeAliyunVideoById(this.video.videoSourceId).then((response) => {
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        //把文件列表清空
        this.fileList = [];
        //把sql里video视频id和视频名称清空
        this.video.videoSourceId = "";
        this.video.videoOriginalName = "";
      });
    },
    //上传视频成功调用方法
    handleVodUploadSuccess(response, file, fileList) {
      //上传视频id赋值到sql
      this.video.videoSourceId = response.data.videoId;
      //上传视频名称赋值到sql
      this.video.videoOriginalName = file.name;
    },
    //视图上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning("想要重新上传视频，请先删除已上传的视频");
    },
    updateVideoInfoById() {
      video.updateVideoInfoById(this.video).then((response) => {
        this.$message({
          type: "success",
          message: "修改成功!",
        });
        this.helpSaveVideo();
      });
    },
    editVideo(videoId) {
      this.dialogVideoFormVisible = true;
      video.getVideInfoById(videoId).then((response) => {
        this.video = response.data.video;
      });
    },
    removeVideo(videoId) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return video.deleteVideoById(videoId);
        })
        .then(() => {
          this.getChapterVideo(); // 刷新列表
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch((response) => {
          // 失败
          if (response === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          }
        });
    },
    helpSaveVideo() {
      this.dialogVideoFormVisible = false; // 如果保存成功则关闭对话框
      this.getChapterVideo(); // 刷新列表
      this.video.title = ""; // 重置章节标题
      this.video.sort = 0; // 重置章节标题
      this.video.videoSourceId = ""; // 重置视频资源id
      this.saveVideoBtnDisabled = false;
    },
    //添加小节
    addVideo() {
      video.addVideo(this.video).then((response) => {
        this.$message({
          type: "success",
          message: "保存成功!",
        });
        this.helpSaveVideo();
      });
    },
    saveOrUpdateVideo() {
      this.saveVideoBtnDisabled = false;
      if (!this.video.id) {
        this.addVideo();
      } else {
        this.updateVideoInfoById();
      }
    },
    //添加小节弹框的方法
    openVideo(chapterId) {
      //弹框
      this.dialogVideoFormVisible = true;
      //设置章节id
      this.video.chapterId = chapterId;
      //设置课程id
      this.video.courseId = this.courseId;
    },
    //删除章节
    removeChapter(chapterId) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return chapter.deleteChapter(chapterId);
        })
        .then(() => {
          this.getChapterVideo(); // 刷新列表
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch((response) => {
          // 失败
          if (response === "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          } else {
            this.$message({
              type: "error",
              message: response.message,
            });
          }
        });
    },
    //修改章节弹框数据回显
    editChapter(chapterId) {
      //弹框
      this.dialogChapterFormVisible = true;
      //调用接口
      chapter.getChapterInfoById(chapterId).then((response) => {
        this.chapter = response.data.chapter;
      });
    },
    //弹出添加章节页面
    chapterDialog() {
      //弹框
      this.dialogChapterFormVisible = true;
      //表单数据清空
      this.chapter.title = "";
      this.chapter.sort = 0;
    },

    //添加章节
    addChapter() {
      //设置课程id到chapter对象里面
      this.chapter.courseId = this.courseId;
      chapter
        .addChapter(this.chapter)
        .then((response) => {
          //关闭弹框
          this.dialogChapterFormVisible = false;
          //提示信息
          this.$message({
            type: "success",
            message: "保存成功!",
          });
          //刷新页面
          this.getChapterVideo();
        })
        .catch((response) => {
          this.$message({
            type: "error",
            message: response.message,
          });
        });
    },
    //修改章节的方法
    updateChapter() {
      chapter
        .updateChapter(this.chapter)
        .then((response) => {
          //关闭弹框
          this.dialogChapterFormVisible = false;
          //提示信息
          this.$message({
            type: "success",
            message: "保存成功!",
          });
          //刷新页面
          this.getChapterVideo();
        })
        .catch((response) => {
          this.$message({
            type: "error",
            message: response.message,
          });
        });
    },
    saveOrUpdate() {
      this.saveBtnDisabled = false;
      if (!this.chapter.id) {
        this.addChapter();
      } else {
        this.updateChapter();
      }
    },

    //根据课程id查询章节和小节
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId).then((response) => {
        this.chapterVideoList = response.data.allChapterVideo;
      });
    },

    previous() {
      //跳转到上一步
      this.$router.push({ path: "/course/info/" + this.courseId });
    },

    next() {
      //跳转到下一步
      this.$router.push({ path: "/course/publish/" + this.courseId });
    },
  },
};
</script>

<style scoped>
.chapterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chapterList li {
  position: relative;
}
.chapterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chapterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>
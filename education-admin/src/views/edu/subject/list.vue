<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <el-tree
      ref="subjectTree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />
  </div>
</template>

<script>
import subject from "@/api/edu/subject";
export default {
  data() {
    return {
      filterText: "",
      subjectList: [], //返回所有分类数据
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },

  watch: {
    filterText(val) {
      this.$refs.subjectTree.filter(val);
    },
  },

  created() {
    this.getAllSubjectList();
  },

  methods: {
    //得到所有课程分类集合
    getAllSubjectList() {
      subject.getSubjectList().then((response) => {
        if (response.success === true) {
          this.subjectList = response.data.list;
        }
      });
    },
    //优化搜索不再区分大小写
    filterNode(value, data) {
      if (!value) return true;
      return data.title.toLowerCase().indexOf(value) !== -1;
    },
  },
};
</script>
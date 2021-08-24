<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>开发者管理</el-breadcrumb-item>
      <el-breadcrumb-item>审核列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入搜索内容" v-model="queryInfo.keywords" clearable @clear="auditDeveloper">
              <el-button slot="append" icon="el-icon-search" @click="auditDeveloper"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>

      <!-- 列表表格 -->
      <el-table :data="auditListData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="user" label="用户" width="180"></el-table-column>
        <el-table-column prop="nickname" label="昵称" width="180"></el-table-column>
        <el-table-column prop="mobile" label="手机号码"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="name" label="真实姓名"></el-table-column>
        <el-table-column prop="create_time" label="注册时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | date }}
          </template>
        </el-table-column>
        <el-table-column prop="is_developer" label="状态">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.is_developer === '1'">审核中</el-tag>
            <el-tooltip placement="top" v-if="scope.row.is_developer === '3'">
              <div slot="content">原因：{{ scope.row.cause }}</div>
              <el-tag type="danger">已驳回</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" effect="dark" content="驳回" placement="top">
              <el-button type="danger" icon="el-icon-remove-outline" size="mini" @click="reject(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="审核" placement="top">
              <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="pass(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.current_page"
        :page-sizes="[25, 30, 40, 50]"
        :page-size="queryInfo.per_page"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryInfo.total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表格数据绑定
      auditListData: [],
      // 查询参数
      queryInfo: {
        //搜索关键字
        keywords: '',
        //当前页码
        current_page: 1,
        //每页显示多少条数据
        per_page: 25,
        // 总页数
        total: 0
      }
    };
  },
  created() {
    this.auditDeveloper();
    // 回车进行搜索
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        self.auditDeveloper();
      }
    };
  },
  methods: {
    /**
     * 获取列表数据
     */
    async auditDeveloper() {
      const { data: res } = await this.$http.get('developer/auditlist', { params: this.queryInfo });
      if (res.code !== 200) return this.$message.error(res.msg);
      this.queryInfo.total = res.data.total;
      this.auditListData = res.data.data;
    },

    /**
     * 驳回操作
     * @param {Object} id 用户ID
     */
    reject(id) {
      this.$prompt('请输入驳回原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async ({ value }) => {
          // 发起请求
          const { data: res } = await this.$http.put('developer/reject', { id: id, cause: value });
          if (res.code !== 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          // 刷新列表
          this.auditDeveloper();
        })
        .catch(() => {
          this.$message.info('已取消！');
        });
    },

    /**
     * 审核通过
     * @param {Object} id 用户ID
     */
    pass(id) {
      // 确认消息
      this.$confirm('确定审核通过?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发起请求
          const { data: res } = await this.$http.put('developer/pass', { id: id });
          if (res.code !== 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          // 刷新列表
          this.auditDeveloper();
        })
        .catch(() => {
          this.$message.info('已取消！');
          // 刷新列表
          this.auditDeveloper();
        });
    },

    /**
     * 每页显示多少条信息监听事件
     * @param {Object} val
     */
    handleSizeChange(val) {
      this.queryInfo.per_page = val;
      // 刷新列表
      this.auditDeveloper();
    },

    /**
     * 当前页监听事件
     * @param {Object} val
     */
    handleCurrentChange(val) {
      this.queryInfo.current_page = val;
      // 刷新列表
      this.auditDeveloper();
    }
  }
};
</script>

<style lang="less" scoped></style>

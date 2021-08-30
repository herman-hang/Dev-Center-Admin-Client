<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>授权管理</el-breadcrumb-item>
      <el-breadcrumb-item>盗版记录</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入搜索内容" v-model="queryInfo.keywords" clearable @clear="pirateList">
              <el-button slot="append" icon="el-icon-search" @click="pirateList"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>

      <!-- 列表表格 -->
      <el-table :data="pirateListData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="domain" label="域名"></el-table-column>
        <el-table-column prop="ip" label="IP地址"></el-table-column>
        <el-table-column prop="create_time" label="记录时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | date }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-tooltip :enterable="false" effect="dark" content="获取后台登录信息" placement="top">
              <el-button type="success" icon="el-icon-tickets" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="备份代码" placement="top">
              <el-button type="primary" icon="el-icon-document-copy" size="mini"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="执行删除" placement="top"><el-button type="danger" icon="el-icon-delete" size="mini"></el-button></el-tooltip>
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
      },
      // 列表表格数据绑定
      pirateListData: []
    };
  },
  created() {
    this.pirateList();
    // 回车进行搜索
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        self.pirateList();
      }
    };
  },
  methods: {
    /**
     * 获取列表数据
     */
    async pirateList() {
      const { data: res } = await this.$http.get('pirate/list', { params: this.queryInfo });
      this.queryInfo.total = res.data.total;
      this.pirateListData = res.data.data;
    },

    /**
     * 每页显示多少条信息监听事件
     * @param {Object} val
     */
    handleSizeChange(val) {
      this.queryInfo.per_page = val;
      // 刷新列表
      this.pirateList();
    },

    /**
     * 当前页监听事件
     * @param {Object} val
     */
    handleCurrentChange(val) {
      this.queryInfo.current_page = val;
      // 刷新列表
      this.pirateList();
    }
  }
};
</script>

<style lang="less" scoped></style>

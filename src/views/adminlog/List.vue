<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>日志信息</el-breadcrumb-item>
      <el-breadcrumb-item>日志记录</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入搜索内容" v-model="optQueryInfo.keywords" clearable @clear="log('2')" v-if="activeName === 'opt_log'">
              <el-button slot="append" icon="el-icon-search" @click="log('2')"></el-button>
            </el-input>
            <el-input placeholder="请输入搜索内容" v-model="loginQueryInfo.keywords" clearable @clear="log('1')" v-else>
              <el-button slot="append" icon="el-icon-search" @click="log('1')"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="操作日志" name="opt_log">
          <el-table :data="optData" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"></el-table-column>
            <el-table-column prop="user" label="管理员"></el-table-column>
            <el-table-column prop="content" label="日志内容"></el-table-column>
            <el-table-column prop="ip" label="记录IP"></el-table-column>
            <el-table-column prop="create_time" label="记录时间">
              <template slot-scope="scope">
                {{ scope.row.create_time | date }}
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            @size-change="optHandleSizeChange"
            @current-change="optHandleCurrentChange"
            :current-page="optQueryInfo.current_page"
            :page-sizes="[25, 30, 40, 50]"
            :page-size="optQueryInfo.per_page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="optQueryInfo.total"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="登录日志" name="login_log">
          <el-table :data="loginData" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"></el-table-column>
            <el-table-column prop="user" label="管理员"></el-table-column>
            <el-table-column prop="content" label="日志内容"></el-table-column>
            <el-table-column prop="ip" label="记录IP"></el-table-column>
            <el-table-column prop="create_time" label="记录时间">
              <template slot-scope="scope">
                {{ scope.row.create_time | date }}
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            @size-change="loginHandleSizeChange"
            @current-change="loginHandleCurrentChange"
            :current-page="loginQueryInfo.current_page"
            :page-sizes="[25, 30, 40, 50]"
            :page-size="loginQueryInfo.per_page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="loginQueryInfo.total"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 标签页默认选中
      activeName: 'opt_log',
      // 操作日志表单
      optData: [],
      // 登录日志表单
      loginData: [],
      // 操作日志查询参数
      optQueryInfo: {
        //搜索关键字
        keywords: '',
        //当前页码
        current_page: 1,
        //每页显示多少条数据
        per_page: 25,
        // 总页数
        total: 0,
        // 日志类型
        type: '2'
      },
      // 登录日志查询参数
      loginQueryInfo: {
        //搜索关键字
        keywords: '',
        //当前页码
        current_page: 1,
        //每页显示多少条数据
        per_page: 25,
        // 总页数
        total: 0,
        // 日志类型
        type: '1'
      }
    };
  },
  created() {
    this.log('2');
    // 回车进行搜索
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        if (self.activeName === 'opt_log') {
          self.log('2');
        } else {
          self.log('1');
        }
      }
    };
  },
  methods: {
    /**
     * 获取列表数据
     * @param {Object} type 日志类型（1为操作日志，2为登录日志）
     */
    async log(type) {
      if (type === '2') {
        const { data: res } = await this.$http.get('adminlog/list', { params: this.optQueryInfo });
        if (res.code !== 200) return this.$message.error(res.msg);
        this.optQueryInfo.total = res.data.total;
        this.optData = res.data.data;
      } else {
        const { data: res } = await this.$http.get('adminlog/list', { params: this.loginQueryInfo });
        this.loginQueryInfo.total = res.data.total;
        this.loginData = res.data.data;
      }
    },

    /**
     * 标签页切换触发事件
     */
    handleClick() {
      if (this.activeName === 'opt_log') {
        this.log('2');
      } else {
        this.log('1');
      }
    },

    /**
     * 操作日志每页显示多少条信息监听事件
     * @param {Object} val
     */
    optHandleSizeChange(val) {
      this.optQueryInfo.per_page = val;
      // 刷新列表
      this.log('2');
    },

    /**
     * 操作日志当前页监听事件
     * @param {Object} val
     */
    optHandleCurrentChange(val) {
      this.optQueryInfo.current_page = val;
      // 刷新列表
      this.log('2');
    },

    /**
     * 登录日志每页显示多少条信息监听事件
     * @param {Object} val
     */
    loginHandleSizeChange(val) {
      this.loginQueryInfo.per_page = val;
      // 刷新列表
      this.log('1');
    },

    /**
     * 登录日志当前页监听事件
     * @param {Object} val
     */
    loginHandleCurrentChange(val) {
      this.loginQueryInfo.current_page = val;
      // 刷新列表
      this.log('1');
    }
  }
};
</script>

<style lang="less" scoped></style>

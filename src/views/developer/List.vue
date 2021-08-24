<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>开发者管理</el-breadcrumb-item>
      <el-breadcrumb-item>开发者列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入搜索内容" v-model="queryInfo.keywords" clearable @clear="developer">
              <el-button slot="append" icon="el-icon-search" @click="developer"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <!-- 列表表格 -->
      <el-table :data="developerListData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="user" label="用户名"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="level" label="等级">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.level === '0'">铜牌</el-tag>
            <el-tag type="info" v-else-if="scope.row.level === '1'">银牌</el-tag>
            <el-tag type="warning" v-else>金牌</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="money" label="余额"></el-table-column>
        <el-table-column prop="brokerage" label="服务费(单位:%)"></el-table-column>
        <el-table-column prop="mobile" label="手机号码"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="qq" label="QQ"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" effect="dark" content="降为用户" placement="top">
              <el-button type="danger" icon="el-icon-remove-outline" size="mini" @click="demote(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.id)"></el-button>
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

      <!-- 编辑对话框 -->
      <el-dialog title="编辑开发者" :visible.sync="editDialogVisible" width="50%" @close="editFormClose">
        <!-- 主体 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="用户名" prop="type"><el-input v-model="editForm.user" :disabled="true"></el-input></el-form-item>
          <el-form-item label="支付宝账号" prop="alipay"><el-input placeholder="请输入支付宝账号" v-model="editForm.alipay"></el-input></el-form-item>
          <el-form-item label="真实姓名" prop="alipay_name"><el-input placeholder="请输入支付宝真实姓名" v-model="editForm.alipay_name"></el-input></el-form-item>
          <el-form-item label="微信账户" prop="wxpay"><el-input placeholder="请输入微信账户" v-model="editForm.wxpay"></el-input></el-form-item>
          <el-form-item label="真实姓名" prop="wxpay_name"><el-input placeholder="请输入微信真实姓名" v-model="editForm.wxpay_name"></el-input></el-form-item>
          <el-form-item label="QQ账户" prop="qqpay"><el-input placeholder="请输入QQ账户" v-model="editForm.qqpay"></el-input></el-form-item>
          <el-form-item label="QQ名称" prop="qqpay_name"><el-input placeholder="请输入QQ名称" v-model="editForm.qqpay_name"></el-input></el-form-item>
          <el-form-item label="等级" prop="level">
            <el-select v-model="editForm.level" placeholder="请选择等级">
              <el-option label="铜牌" value="0"></el-option>
              <el-option label="银牌" value="1"></el-option>
              <el-option label="金牌" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务费" prop="brokerage"><el-input type="number" placeholder="请输入提现服务费" v-model="editForm.brokerage"></el-input></el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEdit">确 定</el-button>
        </span>
      </el-dialog>
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
      developerListData: [],
      // 编辑对话框初始化
      editDialogVisible: false,
      // 编辑表单数据绑定对象
      editForm: {},
      // 编辑表单验证规则
      editFormRules: {
        brokerage: [{ required: true, message: '请填写服务费', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.developer();
    // 回车进行搜索
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        self.developer();
      }
    };
  },
  methods: {
    /**
     * 获取列表数据
     */
    async developer() {
      const { data: res } = await this.$http.get('developer/list', { params: this.queryInfo });
      if (res.code !== 200) return this.$message.error(res.msg);
      this.queryInfo.total = res.data.total;
      this.developerListData = res.data.data;
    },

    /**
     * 编辑对话框
     * @param {Object} id
     */
    async editDialog(id) {
      const { data: res } = await this.$http.get(`developer/query/${id}`);
      if (res.code !== 200) return this.$message.error(res.msg);
      this.editForm = res.data;
      // 显示对话框
      this.editDialogVisible = true;
    },

    /**
     * 编辑提交
     */
    submitEdit() {
      this.$refs.editFormRef.validate(async valid => {
        // 表单验证失败返回
        if (!valid) return;
        // 发起请求
        const { data: res } = await this.$http.put('developer/edit', this.editForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新列表
        this.developer();
      });
    },

    /**
     * 降为用户操作
     * @param {Object} id 开发者ID
     */
    demote(id) {
      this.$confirm('将该开发者降为用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发起请求
          const { data: res } = await this.$http.put('developer/demote', { id: id });
          if (res.code !== 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          // 刷新列表
          this.developer();
        })
        .catch(() => {
          this.$message.info('已取消！');
        });
    },

    /**
     * 编辑对话框关闭
     */
    editFormClose() {
      // 重置所有表单项
      this.$refs.editFormRef.resetFields();
    },

    /**
     * 每页显示多少条信息监听事件
     * @param {Object} val
     */
    handleSizeChange(val) {
      this.queryInfo.per_page = val;
      // 刷新列表
      this.developer();
    },

    /**
     * 当前页监听事件
     * @param {Object} val
     */
    handleCurrentChange(val) {
      this.queryInfo.current_page = val;
      // 刷新列表
      this.developer();
    }
  }
};
</script>

<style lang="less" scoped></style>

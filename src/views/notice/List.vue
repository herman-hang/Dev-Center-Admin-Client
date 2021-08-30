<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>通知公告</el-breadcrumb-item>
      <el-breadcrumb-item>公告列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入搜索内容" v-model="queryInfo.keywords" clearable @clear="noticeList">
              <el-button slot="append" icon="el-icon-search" @click="noticeList"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <!-- 发布删除按钮组 -->
      <el-row>
        <el-button type="primary" icon="el-icon-plus" @click="addDialog" size="mini">发布</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteClick()">删除</el-button>
      </el-row>
      <!-- 列表表格 -->
      <el-table :data="noticeListData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="content" label="内容" :formatter="statusFormatter"></el-table-column>
        <el-table-column prop="inscribe" label="落款"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === '1'">已发布</el-tag>
            <el-tag type="danger" v-else>已下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="发布时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.create_time | date }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" effect="dark" content="下架" placement="top" v-if="scope.row.status === '1'">
              <el-button type="danger" icon="el-icon-remove-outline" size="mini" @click="statusEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="发布" placement="top" v-else>
              <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="statusEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteClick(scope.row.id)"></el-button>
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

      <!-- 发布对话框 -->
      <el-dialog title="发布公告" :visible.sync="addDialogVisible" width="50%" @close="addFormClose">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="标题" prop="title"><el-input placeholder="请输入标题" v-model="addForm.title"></el-input></el-form-item>
          <el-form-item autosize label="内容" prop="content"><el-input placeholder="请输入公告内容" type="textarea" v-model="addForm.content"></el-input></el-form-item>
          <el-form-item label="落款" prop="inscribe"><el-input placeholder="请输入公告落款" v-model="addForm.inscribe"></el-input></el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="addForm.status" placeholder="请选择状态">
              <el-option label="已发布" value="1"></el-option>
              <el-option label="已下架" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑对话框 -->
      <el-dialog title="编辑公告" :visible.sync="editDialogVisible" width="50%" @close="editFormClose">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="标题" prop="title"><el-input placeholder="请输入标题" v-model="editForm.title"></el-input></el-form-item>
          <el-form-item autosize label="内容" prop="content"><el-input placeholder="请输入公告内容" type="textarea" v-model="editForm.content"></el-input></el-form-item>
          <el-form-item label="落款" prop="inscribe"><el-input placeholder="请输入公告落款" v-model="editForm.inscribe" maxlength="64"></el-input></el-form-item>
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
      // 列表数据绑定
      noticeListData: [],
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
      // 存储删除ID
      deleteId: '',
      // 发布公告对话框初始化
      addDialogVisible: false,
      // 发布表单绑定的数据对象
      addForm: {
        title: '',
        content: '',
        inscribe: '',
        status: ''
      },
      // 发布表单的验证规则
      addFormRules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }, { min: 0, max: 64, message: '标题长度只能在 0 到 64 个字符', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        inscribe: [{ required: true, message: '请输入落款', trigger: 'blur' }, { min: 0, max: 50, message: '落款长度只能在 0 到 64 个字符', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      // 编辑表单数据绑定对象
      editForm: {},
      // 编辑表单验证规则
      editFormRules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }, { min: 0, max: 64, message: '标题长度只能在 0 到 64 个字符', trigger: 'blur' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        inscribe: [{ required: true, message: '请输入落款', trigger: 'blur' }, { min: 0, max: 50, message: '落款长度只能在 0 到 64 个字符', trigger: 'blur' }]
      },
      // 编辑对话框初始化
      editDialogVisible: false
    };
  },
  created() {
    this.noticeList();
    // 回车进行搜索
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        self.noticeList();
      }
    };
  },
  methods: {
    /**
     * 获取列表数据
     */
    async noticeList() {
      const { data: res } = await this.$http.get('notice/list', { params: this.queryInfo });
      if (res.code !== 200) return this.$message.error(res.msg);
      this.queryInfo.total = res.data.total;
      this.noticeListData = res.data.data;
    },

    /**
     * 发布对话框
     */
    addDialog() {
      // 显示发布对话框
      this.addDialogVisible = true;
    },

    /**
     * 提交发布公告
     */
    submitAdd() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post('notice/add', this.addForm);
        if (res.code !== 201) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.noticeList();
        this.addDialogVisible = false;
      });
    },

    /**
     * 编辑对话框
     * @param {Object} id 编辑公告ID
     */
    async editDialog(id) {
      const { data: res } = await this.$http.get(`notice/query/${id}`);
      if (res.code !== 200) return this.$message.error(res.msg);
      this.editForm = res.data;
      // 显示编辑对话框
      this.editDialogVisible = true;
    },

    /**
     * 编辑对话框提交
     */
    submitEdit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put('notice/edit', this.editForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新列表
        this.noticeList();
      });
    },

    /**
     * 选中数据事件监听
     */
    handleSelectionChange(val) {
      // 定义临时数组
      var idArray = [];
      val.forEach(item => {
        idArray.push(item.id);
      });
      // 数组转字符串
      this.deleteId = idArray.join(',');
    },

    /**
     * 每页显示多少条信息监听事件
     * @param {Object} val
     */
    handleSizeChange(val) {
      this.queryInfo.per_page = val;
      // 刷新列表
      this.noticeList();
    },

    /**
     * 当前页监听事件
     * @param {Object} val
     */
    handleCurrentChange(val) {
      this.queryInfo.current_page = val;
      // 刷新列表
      this.noticeList();
    },

    /**
     * 添加对话框关闭
     */
    addFormClose() {
      // 重置所有表单项
      this.$refs.addFormRef.resetFields();
    },

    /**
     * 编辑对话框关闭
     */
    editFormClose() {
      // 重置所有表单项
      this.$refs.editFormRef.resetFields();
    },

    /**
     * 状态变更
     * @param {Object} row 变更数据
     */
    statusEdit(row) {
      // 确认消息
      this.$confirm('是否继续变更状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let status = '1';
          if (row.status === '1') {
            status = '0';
          }
          // 发起请求
          const { data: res } = await this.$http.put('notice/statusedit', { id: row.id, status: status });
          if (res.code !== 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          // 刷新列表
          this.noticeList();
        })
        .catch(() => {
          this.$message.info('已取消！');
          // 刷新列表
          this.noticeList();
        });
    },

    /**
     * 内容固定显示字数
     */
    statusFormatter(row, column, cellValue) {
      if (!cellValue) return '';
      if (cellValue.length > 30) {
        //最长固定显示10个字符
        return cellValue.slice(0, 30) + '...';
      }
      return cellValue;
    },

    /**
     * 删除
     */
    deleteClick(id = '') {
      if (id !== '') {
        this.deleteId = id;
      }
      if (this.deleteId === '' || this.deleteId === undefined || this.deleteId == null) {
        return this.$message.warning('请选中需要删除的数据！');
      }
      // 确认消息
      this.$confirm('是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发起请求
          const { data: res } = await this.$http.delete('notice/delete', { params: { id: this.deleteId } });
          if (res.code !== 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          // 刷新列表
          this.noticeList();
        })
        .catch(() => {
          this.$message.info('已取消！');
          // 刷新列表
          this.noticeList();
        });
    }
  }
};
</script>

<style lang="less" scoped></style>

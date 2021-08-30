<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>升级中心</el-breadcrumb-item>
      <el-breadcrumb-item>版本发布</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入搜索内容" v-model="queryInfo.keywords" clearable @clear="upgradeList">
              <el-button slot="append" icon="el-icon-search" @click="upgradeList"></el-button>
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
      <el-table :data="upgradeListData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="version" label="版本"></el-table-column>
        <el-table-column prop="type" label="升级包类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type === '1'">全量</span>
            <span v-else>增量</span>
          </template>
        </el-table-column>
        <el-table-column prop="way" label="升级方式">
          <template slot-scope="scope">
            <span v-if="scope.row.way === '0'">提示更新</span>
            <span v-else-if="scope.row.way === '1'">热更新</span>
            <span v-else>强制更新</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === '1'">已上线</el-tag>
            <el-tag type="danger" v-else>已下线</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="发布时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | date }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" effect="dark" content="下线" placement="top" v-if="scope.row.status === '1'">
              <el-button type="danger" icon="el-icon-remove-outline" size="mini" @click="statusEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="上线" placement="top" v-else>
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
      <el-dialog title="发布新版本" :visible.sync="addDialogVisible" width="50%" @close="addFormClose">
        <!-- 主体信息 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="标题" prop="title"><el-input placeholder="请输入版本标题" v-model="addForm.title"></el-input></el-form-item>
          <el-form-item label="版本号" prop="version"><el-input placeholder="请输入新版本号" v-model="addForm.version"></el-input></el-form-item>
          <el-form-item label="升级包类型" prop="type">
            <el-select v-model="addForm.type" placeholder="请选择升级包类型">
              <el-option label="全量" value="1"></el-option>
              <el-option label="增量" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="升级方式" prop="way">
            <el-select v-model="addForm.way" placeholder="请选择升级方式">
              <el-option label="强制更新" value="2"></el-option>
              <el-option label="热更新" value="1"></el-option>
              <el-option label="提示更新" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="升级包" prop="wgt_url">
            <!-- 升级包上传 -->
            <el-upload class="avatar-uploader" :action="updateUrl" :headers="headers" :show-file-list="false" :on-success="handleAvatarSuccessAddFile" name="file">
              <img v-if="addForm.wgt_url" src="../../assets/image/zip.png" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="addForm.status" placeholder="请选择状态">
              <el-option label="已上线" value="1"></el-option>
              <el-option label="已下线" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="升级内容" prop="content"><el-input :rows="5" type="textarea" placeholder="请输入升级内容" v-model="addForm.content"></el-input></el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑版本 -->
      <el-dialog title="编辑版本" :visible.sync="editDialogVisible" width="50%" @close="editFormClose">
        <!-- 主体信息 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="标题" prop="title"><el-input placeholder="请输入版本标题" v-model="editForm.title"></el-input></el-form-item>
          <el-form-item label="版本号" prop="version"><el-input placeholder="请输入新版本号" v-model="editForm.version"></el-input></el-form-item>
          <el-form-item label="升级包类型" prop="type">
            <el-select v-model="editForm.type" placeholder="请选择升级包类型">
              <el-option label="全量" value="1"></el-option>
              <el-option label="增量" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="升级方式" prop="way">
            <el-select v-model="editForm.way" placeholder="请选择升级方式">
              <el-option label="强制更新" value="2"></el-option>
              <el-option label="热更新" value="1"></el-option>
              <el-option label="提示更新" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="升级包" prop="wgt_url">
            <!-- 升级包上传 -->
            <el-upload class="avatar-uploader" :action="updateUrl" :headers="headers" :show-file-list="false" :on-success="handleAvatarSuccessEditFile" name="file">
              <img v-if="editForm.wgt_url" src="../../assets/image/zip.png" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="升级内容" prop="content"><el-input :rows="5" type="textarea" placeholder="请输入升级内容" v-model="editForm.content"></el-input></el-form-item>
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
      upgradeListData: [],
      // 存放删除ID
      deleteId: '',
      // 发布对话框初始化
      addDialogVisible: false,
      // 编辑对话框初始化
      editDialogVisible: false,
      // 上传图片URL
      updateUrl: window.serverConfig.BASE_API + 'base/upload',
      // 图片上传请求头
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 发布表单数据绑定
      addForm: {
        title: '',
        version: '',
        type: '',
        way: '',
        wgt_url: '',
        status: '',
        content: ''
      },
      // 发布表单验证规则
      addFormRules: {
        title: [{ required: true, message: '请输入新版本标题', trigger: 'blur' }],
        version: [{ required: true, message: '请输入新版本号', trigger: 'blur' }],
        type: [{ required: true, message: '请选择升级包类型', trigger: 'change' }],
        way: [{ required: true, message: '请选择升级方式', trigger: 'change' }],
        wgt_url: [{ required: true, message: '请上传升级包', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        content: [{ required: true, message: '请输入升级内容', trigger: 'blur' }]
      },
      // 编辑表单数据绑定
      editForm: {},
      // 编辑表单验证规则
      editFormRules: {
        title: [{ required: true, message: '请输入新版本标题', trigger: 'blur' }],
        version: [{ required: true, message: '请输入新版本号', trigger: 'blur' }],
        type: [{ required: true, message: '请选择升级包类型', trigger: 'change' }],
        way: [{ required: true, message: '请选择升级方式', trigger: 'change' }],
        wgt_url: [{ required: true, message: '请上传升级包', trigger: 'change' }],
        content: [{ required: true, message: '请输入升级内容', trigger: 'blur' }]
      }
    };
  },
  created() {
    // 回车进行搜索
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        self.upgradeList();
      }
    };
    this.upgradeList();
  },
  methods: {
    /**
     * 获取列表数据
     */
    async upgradeList() {
      const { data: res } = await this.$http.get('upgrade/list', { params: this.queryInfo });
      if (res.code !== 200) return this.$message.error(res.msg);
      this.queryInfo.total = res.data.total;
      this.upgradeListData = res.data.data;
    },

    /**
     * 发布对话框
     */
    addDialog() {
      // 显示发布对话框
      this.addDialogVisible = true;
    },

    /**
     * 发布提交
     */
    submitAdd() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post('upgrade/add', this.addForm);
        if (res.code !== 201) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 关闭发布对话框
        this.addDialogVisible = false;
        this.upgradeList();
      });
    },

    // 编辑对话框
    async editDialog(id) {
      const { data: res } = await this.$http.get(`upgrade/query/${id}`);
      if (res.code !== 200) return this.$message.error(res.msg);
      this.editForm = res.data;
      // 显示编辑对话框
      this.editDialogVisible = true;
    },

    /**
     * 编辑提交
     */
    submitEdit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put('upgrade/edit', this.editForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 关闭编辑对话框
        this.editDialogVisible = false;
        // 刷新列表
        this.upgradeList();
      });
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
          const { data: res } = await this.$http.delete('upgrade/delete', { params: { id: this.deleteId } });
          if (res.code !== 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          // 刷新列表
          this.upgradeList();
        })
        .catch(() => {
          this.$message.info('已取消！');
          // 刷新列表
          this.upgradeList();
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
      this.upgradeList();
    },

    /**
     * 当前页监听事件
     * @param {Object} val
     */
    handleCurrentChange(val) {
      this.queryInfo.current_page = val;
      // 刷新列表
      this.upgradeList();
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
          const { data: res } = await this.$http.put('upgrade/statusedit', { id: row.id, status: status });
          if (res.code !== 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          // 刷新列表
          this.upgradeList();
        })
        .catch(() => {
          this.$message.info('已取消！');
          // 刷新列表
          this.upgradeList();
        });
    },

    /**
     * 发布对话框关闭
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
     * 发布新版本升级包上传成功时的钩子
     * @param {Object} res 返回数据
     * @param {Object} file 文件对象
     */
    handleAvatarSuccessAddFile(res, file) {
      if (res.code !== 200) return this.$message.error(res.msg);
      this.addForm.wgt_url = res.data[0];
      this.$message.success(res.msg);
    },

    /**
     * 编辑版本升级包包上传成功时的钩子
     * @param {Object} res 返回数据
     * @param {Object} file 文件对象
     */
    handleAvatarSuccessEditFile(res, file) {
      if (res.code !== 200) return this.$message.error(res.msg);
      this.editForm.wgt_url = res.data[0];
      this.$message.success(res.msg);
    }
  }
};
</script>

<style lang="less" scoped></style>

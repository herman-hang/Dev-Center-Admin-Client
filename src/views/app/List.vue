<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>应用中心</el-breadcrumb-item>
      <el-breadcrumb-item>应用列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入内容" v-model="queryInfo.keywords" clearable @clear="app">
              <el-select class="select" v-model="queryInfo.type" slot="prepend" placeholder="请选择" @click="app">
                <el-option label="全部" value=""></el-option>
                <el-option label="插件" value="0"></el-option>
                <el-option label="模板" value="1"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="app"></el-button>
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
      <el-table :data="appListData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="应用名称"></el-table-column>
        <el-table-column prop="img" label="缩略图" width="100" height="100">
          <template slot-scope="scope">
            <img width="80" v-if="scope.row.img" :src="scope.row.img" alt="缩略图" />
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.type === '0'">插件</el-tag>
            <el-tag v-else>模板</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="developer_id" label="开发者ID">
          <template slot-scope="scope">
            <span v-if="scope.row.developer_id === 0">官方发布</span>
            <span v-else>{{ scope.row.developer_id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="is_pay" label="是否付费">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.is_pay === '0'">免费</el-tag>
            <el-tag type="danger" v-else>￥{{ scope.row.money }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="download" label="下载量(单位:次)"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === '2'">已发布</el-tag>
            <el-tag type="danger" v-else-if="scope.row.status === '0'">已下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="发布时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | date }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" effect="dark" content="下架" placement="top" v-if="scope.row.status === '2'">
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
      <el-dialog title="发布应用" :visible.sync="addDialogVisible" width="50%" @close="addFormClose">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="类型" prop="type">
            <el-select v-model="addForm.type" placeholder="请选择应用类型">
              <el-option label="插件" value="0"></el-option>
              <el-option label="模板" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应用名称" prop="name"><el-input placeholder="请输入应用名称" v-model="addForm.name"></el-input></el-form-item>
          <el-form-item label="缩略图" prop="img">
            <!-- 缩略图上传 -->
            <el-upload
              accept=".jpg,.jpeg,.png,.bmp"
              class="avatar-uploader"
              :action="updateUrl"
              :headers="headers"
              :show-file-list="false"
              :on-success="handleAvatarSuccessAddPhoto"
              :before-upload="beforeAvatarUpload"
              name="image"
            >
              <img v-if="addForm.img" :src="addForm.img" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="是否付费" prop="is_pay">
            <el-select v-model="addForm.is_pay" placeholder="请选择付费类型">
              <el-option label="免费" value="0"></el-option>
              <el-option label="付费" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="金额" prop="money" v-if="addForm.is_pay === '1'">
            <el-input type="number" placeholder="请输入应用付费金额" v-model="addForm.money"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author"><el-input placeholder="请输入应用作者" v-model="addForm.author"></el-input></el-form-item>
          <el-form-item label="应用包" prop="zip">
            <!-- 应用包上传 -->
            <el-upload class="avatar-uploader" :action="updateUrl" :headers="headers" :show-file-list="false" :on-success="handleAvatarSuccessAddFile" name="file">
              <img v-if="addForm.zip" src="../../assets/image/zip.png" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="addForm.status" placeholder="请选择状态">
              <el-option label="已下架" value="0"></el-option>
              <el-option label="已发布" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应用介绍" prop="introduce">
            <!-- 富文本编辑器 -->
            <mavon-editor @imgAdd="$imgAdd" ref="addEditorRef" v-model="addForm.introduce"></mavon-editor>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑对话框 -->
      <el-dialog title="编辑应用" :visible.sync="editDialogVisible" width="50%" @close="editFormClose">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="类型" prop="type">
            <el-select v-model="editForm.type" placeholder="请选择应用类型">
              <el-option label="插件" value="0"></el-option>
              <el-option label="模板" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应用名称" prop="name"><el-input placeholder="请输入应用名称" v-model="editForm.name"></el-input></el-form-item>
          <el-form-item label="缩略图" prop="img">
            <!-- 缩略图上传 -->
            <el-upload
              accept=".jpg,.jpeg,.png,.bmp"
              class="avatar-uploader"
              :action="updateUrl"
              :headers="headers"
              :show-file-list="false"
              :on-success="handleAvatarSuccessEditPhoto"
              :before-upload="beforeAvatarUpload"
              name="image"
            >
              <img v-if="editForm.img" :src="editForm.img" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="是否付费" prop="is_pay">
            <el-select v-model="editForm.is_pay" placeholder="请选择付费类型">
              <el-option label="免费" value="0"></el-option>
              <el-option label="付费" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="金额" prop="money" v-if="editForm.is_pay === '1'">
            <el-input type="number" placeholder="请输入应用付费金额" v-model="editForm.money"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author"><el-input placeholder="请输入应用作者" v-model="editForm.author"></el-input></el-form-item>
          <el-form-item label="应用包" prop="zip">
            <!-- 应用包上传 -->
            <el-upload class="avatar-uploader" :action="updateUrl" :headers="headers" :show-file-list="false" :on-success="handleAvatarSuccessEditFile" name="file">
              <img v-if="editForm.zip" src="../../assets/image/zip.png" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="应用介绍" prop="introduce">
            <!-- 富文本编辑器 -->
            <mavon-editor @imgAdd="$imgEdit" ref="EditEditorRef" v-model="editForm.introduce"></mavon-editor>
          </el-form-item>
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
        total: 0,
        // 应用类型(0为插件，1为模板)
        type: ''
      },
      // 列表表格数据绑定
      appListData: [],
      // 存放删除ID
      deleteId: '',
      // 发布对话框初始化
      addDialogVisible: false,
      // 编辑对话框初始化
      editDialogVisible: false,
      // 发布应用表单数据绑定
      addForm: {
        type: '',
        name: '',
        img: '',
        is_pay: '',
        zip: '',
        money: '',
        author: '',
        status: '',
        introduce: ''
      },
      // 编辑应用表单数据绑定
      editForm: {},
      // 发布应用表单验证规则
      addFormRules: {
        type: [{ required: true, message: '请选择应用类型', trigger: 'change' }],
        name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
        img: [{ required: true, message: '请上传应用缩略图', trigger: 'blur' }],
        is_pay: [{ required: true, message: '请选择付费类型', trigger: 'change' }],
        author: [{ required: true, message: '请输入应用作者', trigger: 'blur' }],
        zip: [{ required: true, message: '请上传应用包', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        introduce: [{ required: true, message: '请输入应用介绍', trigger: 'change' }]
      },
      // 编辑应用表单验证规则
      editFormRules: {
        type: [{ required: true, message: '请选择应用类型', trigger: 'change' }],
        name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }],
        img: [{ required: true, message: '请上传应用缩略图', trigger: 'blur' }],
        is_pay: [{ required: true, message: '请选择付费类型', trigger: 'change' }],
        author: [{ required: true, message: '请输入应用作者', trigger: 'blur' }],
        zip: [{ required: true, message: '请上传应用包', trigger: 'change' }],
        introduce: [{ required: true, message: '请输入应用介绍', trigger: 'change' }]
      },
      // 上传图片URL
      updateUrl: window.serverConfig.BASE_API + 'base/upload',
      // 图片上传请求头
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      }
    };
  },
  created() {
    // 调用获取数据
    this.app();
    // 回车进行搜索
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        self.app();
      }
    };
  },
  methods: {
    /**
     * 获取数据
     */
    async app() {
      const { data: res } = await this.$http.get('app/list', { params: this.queryInfo });
      if (res.code !== 200) return this.$message.error(res.msg);
      this.queryInfo.total = res.data.total;
      this.appListData = res.data.data;
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
        // 免费则重置付费金额为空
        if (this.addForm.is_pay === '0') {
          this.addForm.money = 0.0;
        }
        const { data: res } = await this.$http.post('app/add', this.addForm);
        if (res.code !== 201) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 关闭发布对话框
        this.addDialogVisible = false;
        this.app();
      });
    },

    /**
     * 编辑对话框
     * @param {Object} id 应用ID
     */
    async editDialog(id) {
      const { data: res } = await this.$http.get(`app/query/${id}`);
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
        // 免费则重置付费金额为空
        if (this.editForm.is_pay === '0') {
          this.editForm.money = 0.0;
        }
        const { data: res } = await this.$http.put('app/edit', this.editForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 关闭编辑对话框
        this.editDialogVisible = false;
        // 刷新列表
        this.app();
      });
    },

    /**
     * 每页显示多少条信息监听事件
     * @param {Object} val
     */
    handleSizeChange(val) {
      this.queryInfo.per_page = val;
      // 刷新列表
      this.app();
    },

    /**
     * 当前页监听事件
     * @param {Object} val
     */
    handleCurrentChange(val) {
      this.queryInfo.current_page = val;
      // 刷新列表
      this.app();
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
          const { data: res } = await this.$http.delete('app/delete', { params: { id: this.deleteId } });
          if (res.code !== 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          // 刷新列表
          this.app();
        })
        .catch(() => {
          this.$message.info('已取消！');
          // 刷新列表
          this.app();
        });
    },

    /**
     * 状态变更
     * @param {Object} id 应用ID
     */
    statusEdit(row) {
      // 确认消息
      this.$confirm('是否继续变更状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let status = '2';
          if (row.status === '2') {
            status = '0';
          }
          // 发起请求
          const { data: res } = await this.$http.put('app/statusedit', { id: row.id, status: status });
          if (res.code !== 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          // 刷新列表
          this.app();
        })
        .catch(() => {
          this.$message.info('已取消！');
          // 刷新列表
          this.app();
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
     * 发布应用缩略图上传成功时的钩子
     * @param {Object} res 返回数据
     * @param {Object} file 文件对象
     */
    handleAvatarSuccessAddPhoto(res, file) {
      if (res.code !== 200) return this.$message.error(res.msg);
      this.addForm.img = res.data[0];
      this.$message.success(res.msg);
    },

    /**
     * 发布应用应用包上传成功时的钩子
     * @param {Object} res 返回数据
     * @param {Object} file 文件对象
     */
    handleAvatarSuccessAddFile(res, file) {
      if (res.code !== 200) return this.$message.error(res.msg);
      this.addForm.zip = res.data[0];
      this.$message.success(res.msg);
    },

    /**
     * 编辑应用应用包上传成功时的钩子
     * @param {Object} res 返回数据
     * @param {Object} file 文件对象
     */
    handleAvatarSuccessEditFile(res, file) {
      if (res.code !== 200) return this.$message.error(res.msg);
      this.editForm.zip = res.data[0];
      this.$message.success(res.msg);
    },

    /**
     * 编辑应用缩略图上传成功时的钩子
     * @param {Object} res 返回数据
     * @param {Object} file 文件对象
     */
    handleAvatarSuccessEditPhoto(res, file) {
      if (res.code !== 200) return this.$message.error(res.msg);
      this.editForm.img = res.data[0];
      this.$message.success(res.msg);
    },

    /**
     * 上传缩略图之前的钩子
     * @param {Object} file 上传的文件
     */
    beforeAvatarUpload(file) {
      const isImage = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp';
      // 上传的图片最大不能超过10M
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isImage) {
        this.$message.error('上传的图片只能是 JPG JPEG PNG BMP格式!');
      }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!');
      }
      return isImage && isLt10M;
    },

    /**
     * 发布富文本编辑器上传图片到本地服务器
     * @param {Object} pos 上传的位置
     * @param {Object} $file 上传的图片
     */
    async $imgAdd(pos, $file) {
      var formdata = new FormData();
      formdata.append('image', $file);
      const { data: res } = await this.$http.post(this.updateUrl, formdata);
      if (res.code !== 200) return this.$message.error(res.msg);
      var $vm = this.$refs.addEditorRef;
      $vm.$img2Url(pos, res.data[0]);
    },

    /**
     * 编辑富文本编辑器上传图片到本地服务器
     * @param {Object} pos 上传的位置
     * @param {Object} $file 上传的图片
     */
    async $imgEdit(pos, $file) {
      var formdata = new FormData();
      formdata.append('image', $file);
      const { data: res } = await this.$http.post(this.updateUrl, formdata);
      if (res.code !== 200) return this.$message.error(res.msg);
      var $vm = this.$refs.EditEditorRef;
      $vm.$img2Url(pos, res.data[0]);
    }
  }
};
</script>

<style lang="less" scoped>
.select {
  width: 80px;
}
</style>

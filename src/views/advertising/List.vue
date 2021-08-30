<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>广告管理</el-breadcrumb-item>
      <el-breadcrumb-item>广告列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入搜索内容" v-model="queryInfo.keywords" clearable @clear="advertising">
              <el-button slot="append" icon="el-icon-search" @click="advertising"></el-button>
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
      <el-table :data="advertisingListData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="广告名称"></el-table-column>
        <el-table-column prop="type" label="广告类型">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.type === '1'">图片</el-tag>
            <el-tag v-else>文字</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === '0'">投放中</el-tag>
            <el-tag type="danger" v-else>已下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="投放时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.star_time | timestamp }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="过期时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.end_time | timestamp }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" effect="dark" content="下架" placement="top" v-if="scope.row.status === '0'">
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
      <el-dialog title="发布广告" :visible.sync="addDialogVisible" width="50%" @close="addFormClose">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="类型" prop="type">
            <el-select v-model="addForm.type" placeholder="请选择类型">
              <el-option label="文字" value="0"></el-option>
              <el-option label="图片" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="广告名称" prop="name"><el-input placeholder="请输入广告名称" v-model="addForm.name"></el-input></el-form-item>
          <el-form-item autosize label="广告文本" prop="text" v-if="addForm.type === '0'">
            <el-input placeholder="请输入广告文本内容" type="textarea" v-model="addForm.text"></el-input>
          </el-form-item>
          <el-form-item label="广告图片" prop="img" v-else>
            <!-- 头像上传 -->
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
          <el-form-item label="跳转链接" prop="url"><el-input placeholder="请输入跳转链接" v-model="addForm.url"></el-input></el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="addForm.status" placeholder="请选择状态">
              <el-option label="投放中" value="0"></el-option>
              <el-option label="已下架" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="投放时间" prop="star_time">
            <el-date-picker v-model="addForm.star_time" type="date" format="yyyy 年 MM 月 dd 日" value-format="timestamp" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="过期时间" prop="end_time">
            <el-date-picker v-model="addForm.end_time" type="date" format="yyyy 年 MM 月 dd 日" value-format="timestamp" placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑对话框 -->
      <el-dialog title="编辑广告" :visible.sync="editDialogVisible" width="50%" @close="editFormClose">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="类型" prop="type">
            <el-select v-model="editForm.type" placeholder="请选择类型">
              <el-option label="文字" value="0"></el-option>
              <el-option label="图片" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="广告名称" prop="name"><el-input placeholder="请输入广告名称" v-model="editForm.name"></el-input></el-form-item>
          <el-form-item autosize label="广告文本" prop="text" v-if="editForm.type === '0'">
            <el-input placeholder="请输入广告文本内容" type="textarea" v-model="editForm.text"></el-input>
          </el-form-item>
          <el-form-item label="广告图片" prop="img" v-else>
            <!-- 图片上传 -->
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
          <el-form-item label="跳转链接" prop="url"><el-input placeholder="请输入跳转链接" v-model="editForm.url"></el-input></el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="editForm.status" placeholder="请选择状态">
              <el-option label="投放中" value="0"></el-option>
              <el-option label="已下架" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="投放时间" prop="star_time">
            <el-date-picker v-model="editForm.star_time" type="date" format="yyyy 年 MM 月 dd 日" value-format="timestamp" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="过期时间" prop="end_time">
            <el-date-picker v-model="editForm.end_time" type="date" format="yyyy 年 MM 月 dd 日" value-format="timestamp" placeholder="选择日期"></el-date-picker>
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
        total: 0
      },
      // 发布广告表单数据绑定对象
      addForm: {
        type: '1',
        name: '',
        img: '',
        url: '',
        status: '',
        star_time: '',
        end_time: ''
      },
      // 发布广告表单验证规则
      addFormRules: {
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        name: [{ required: true, message: '请输入广告名称', trigger: 'bulr' }, { min: 0, max: 50, message: '广告名称只能在0 到 50 个字符之间', trigger: 'blur' }],
        text: [{ min: 0, max: 50, message: '广告文本只能在0 到 50 个字符之间', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        star_time: [{ required: true, message: '请投放时间', trigger: 'change' }],
        end_time: [{ required: true, message: '请过期时间', trigger: 'change' }]
      },
      // 列表绑定的数据
      advertisingListData: [],
      // 发布对话框初始化
      addDialogVisible: false,
      // 编辑对话框初始化
      editDialogVisible: false,
      // 编辑表单数据绑定对象
      editForm: {},
      // 表单验证规则
      editFormRules: {
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        name: [{ required: true, message: '请输入广告名称', trigger: 'bulr' }, { min: 0, max: 50, message: '广告名称只能在0 到 50 个字符之间', trigger: 'blur' }],
        text: [{ min: 0, max: 50, message: '广告文本只能在0 到 50 个字符之间', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        star_time: [{ required: true, message: '请投放时间', trigger: 'change' }],
        end_time: [{ required: true, message: '请过期时间', trigger: 'change' }]
      },
      // 存放删除数据的ID
      deleteId: '',
      // 上传图片URL
      updateUrl: window.serverConfig.BASE_API + 'base/upload',
      // 图片上传请求头
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      }
    };
  },
  created() {
    this.advertising();
    // 回车进行搜索
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        self.advertising();
      }
    };
  },
  methods: {
    /**
     * 获取广告数据
     */
    async advertising() {
      const { data: res } = await this.$http.get('advertising/list', { params: this.queryInfo });
      if (res.code !== 200) return this.$message.error(res.msg);
      this.queryInfo.total = res.data.total;
      this.advertisingListData = res.data.data;
    },
    /**
     * 发布对话框
     */
    addDialog() {
      // 显示发布对话框
      this.addDialogVisible = true;
    },

    /**
     * 发布广告提交
     */
    submitAdd() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post('advertising/add', this.addForm);
        if (res.code !== 201) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 关闭对话框
        this.addDialogVisible = false;
        // 刷新列表
        this.advertising();
      });
    },

    /**
     * 编辑对话框
     * @param {Object} id 编辑管理员的ID
     */
    async editDialog(id) {
      const { data: res } = await this.$http.get(`advertising/query/${id}`);
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
        if (this.editForm.type === '0') {
          this.editForm.img = null;
        } else {
          this.editForm.text = null;
        }
        const { data: res } = await this.$http.put('advertising/edit', this.editForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新列表
        this.advertising();
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
          const { data: res } = await this.$http.delete('advertising/delete', { params: { id: this.deleteId } });
          if (res.code !== 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          // 刷新列表
          this.advertising();
        })
        .catch(() => {
          this.$message.info('已取消！');
          // 刷新列表
          this.advertising();
        });
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
          const { data: res } = await this.$http.put('advertising/statusedit', { id: row.id, status: status });
          if (res.code !== 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          // 刷新列表
          this.advertising();
        })
        .catch(() => {
          this.$message.info('已取消！');
          // 刷新列表
          this.advertising();
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
      this.advertising();
    },

    /**
     * 当前页监听事件
     * @param {Object} val
     */
    handleCurrentChange(val) {
      this.queryInfo.current_page = val;
      // 刷新列表
      this.advertising();
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
     * 发布广告图片上传成功时的钩子
     * @param {Object} res 返回数据
     * @param {Object} file 文件对象
     */
    handleAvatarSuccessAddPhoto(res, file) {
      if (res.code !== 200) return this.$message.error(res.msg);
      this.addForm.img = res.data[0];
      this.$message.success(res.msg);
    },

    /**
     * 编辑广告图片上传成功时的钩子
     * @param {Object} res 返回数据
     * @param {Object} file 文件对象
     */
    handleAvatarSuccessEditPhoto(res, file) {
      if (res.code !== 200) return this.$message.error(res.msg);
      this.editForm.img = res.data[0];
      this.$message.success(res.msg);
    },

    /**
     * 上传文件之前的钩子
     * @param {Object} file 上传的文件
     */
    beforeAvatarUpload(file) {
      const isImage = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp';
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isImage) {
        this.$message.error('上传的图片只能是 JPG JPEG PNG BMP格式!');
      }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!');
      }
      return isImage && isLt10M;
    }
  }
};
</script>

<style lang="less" scoped></style>

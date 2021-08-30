<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入搜索内容" v-model="queryInfo.keywords" clearable @clear="adminList">
              <el-button slot="append" icon="el-icon-search" @click="adminList"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <!-- 添加删除按钮组 -->
      <el-row>
        <el-button type="primary" icon="el-icon-plus" @click="addDialog" size="mini">添加</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteClick()">删除</el-button>
      </el-row>
      <!-- 列表表格 -->
      <el-table :data="adminListData" border style="width: 100%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="user" label="账号" width="180"></el-table-column>
        <el-table-column prop="rolename" label="权限组" width="180"></el-table-column>
        <el-table-column prop="name" label="昵称"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="手机号码"></el-table-column>
        <el-table-column prop="create_time" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | date }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === '1'">已启用</el-tag>
            <el-tag type="danger" v-else>已停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" effect="dark" content="停用" placement="top" v-if="scope.row.status === '1'">
              <el-button type="danger" icon="el-icon-remove-outline" size="mini" @click="statusEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="启用" placement="top" v-else>
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

      <!-- 添加对话框 -->
      <el-dialog title="添加管理员" :visible.sync="addDialogVisible" width="50%" @close="addFormClose">
        <!-- 主体信息 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="账号" prop="user"><el-input placeholder="请输入账号" v-model="addForm.user"></el-input></el-form-item>
          <el-form-item label="密码" prop="password"><el-input placeholder="请输入密码" type="password" v-model="addForm.password"></el-input></el-form-item>
          <el-form-item label="确认密码" prop="passwords"><el-input placeholder="请输入确认密码" type="password" v-model="addForm.passwords"></el-input></el-form-item>
          <el-form-item label="头像" prop="photo">
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
              <img v-if="addForm.photo" :src="addForm.photo" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="真实姓名" prop="name"><el-input placeholder="请输入真实姓名" v-model="addForm.name"></el-input></el-form-item>
          <el-form-item label="身份证号码" prop="card"><el-input placeholder="请输入身份证号码" v-model="addForm.card"></el-input></el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="addForm.sex" placeholder="请选择性别">
              <el-option label="女" value="0"></el-option>
              <el-option label="男" value="1"></el-option>
              <el-option label="保密" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" prop="age"><el-input placeholder="请输入年龄" v-model.number="addForm.age"></el-input></el-form-item>
          <el-form-item label="住址" prop="region"><el-input placeholder="请输入住址" v-model="addForm.region"></el-input></el-form-item>
          <el-form-item label="手机号码" prop="mobile"><el-input placeholder="请输入手机号码" v-model="addForm.mobile"></el-input></el-form-item>
          <el-form-item label="邮箱" prop="email"><el-input placeholder="请输入邮箱" v-model="addForm.email"></el-input></el-form-item>
          <el-form-item label="简介" prop="introduction"><el-input placeholder="请输入简介" type="textarea" v-model="addForm.introduction"></el-input></el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="addForm.status" placeholder="请选择状态">
              <el-option label="启用" value="1"></el-option>
              <el-option label="停用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权限组" prop="role_id">
            <el-select v-model="addForm.role_id" placeholder="请选择权限组">
              <el-option :label="item.name" :value="item.id" v-for="(item, index) in role" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑对话框 -->
      <el-dialog title="编辑管理员" :visible.sync="editDialogVisible" width="50%" @close="editFormClose">
        <!-- 主体信息 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="账号" prop="user"><el-input placeholder="请输入账号" v-model="editForm.user"></el-input></el-form-item>
          <el-form-item label="密码" prop="password"><el-input placeholder="不修改则不填写" type="password" v-model="editForm.password"></el-input></el-form-item>
          <el-form-item label="头像" prop="photo">
            <!-- 头像上传 -->
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
              <img v-if="editForm.photo" :src="editForm.photo" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="真实姓名" prop="name"><el-input placeholder="请输入真实姓名" v-model="editForm.name"></el-input></el-form-item>
          <el-form-item label="身份证号码" prop="card"><el-input placeholder="请输入身份证号码" v-model="editForm.card"></el-input></el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="editForm.sex" placeholder="请选择性别">
              <el-option label="女" value="0"></el-option>
              <el-option label="男" value="1"></el-option>
              <el-option label="保密" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" prop="age"><el-input placeholder="请输入年龄" v-model.number="editForm.age"></el-input></el-form-item>
          <el-form-item label="住址" prop="region"><el-input placeholder="请输入住址" v-model="editForm.region"></el-input></el-form-item>
          <el-form-item label="手机号码" prop="mobile"><el-input placeholder="请输入手机号码" v-model="editForm.mobile"></el-input></el-form-item>
          <el-form-item label="邮箱" prop="email"><el-input placeholder="请输入邮箱" v-model="editForm.email"></el-input></el-form-item>
          <el-form-item label="简介" prop="introduction"><el-input placeholder="请输入简介" type="textarea" v-model="editForm.introduction"></el-input></el-form-item>
          <el-form-item label="权限组" prop="role_id">
            <el-select v-model="editForm.role_id" placeholder="请选择权限组">
              <el-option :label="item.name" :value="item.id" v-for="(item, index) in role" :key="index"></el-option>
            </el-select>
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
import { validatePhone, validEmail, validateIdNo } from '@/utils/validate';
export default {
  data() {
    // 自定义验证规则
    var validatePasswords = (rule, value, callback) => {
      if (value !== this.addForm.password) {
        callback(new Error('两次输入密码不一致！'));
      } else {
        callback();
      }
    };
    return {
      //查询的参数
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
      // 管理员列表数据
      adminListData: [],
      // 存储删除的ID
      deleteId: '',
      // 添加对话框初始化
      addDialogVisible: false,
      // 编辑对话框初始化
      editDialogVisible: false,
      // 添加表单
      addForm: {
        user: '',
        passwords: '',
        photo: '',
        password: '',
        name: '',
        card: '',
        sex: '',
        age: '',
        region: '',
        mobile: '',
        email: '',
        introduction: '',
        status: '',
        role_id: ''
      },
      // 所有权限组
      role: [],
      // 添加表单验证规则
      addFormRules: {
        user: [{ required: true, message: '请输入账号', trigger: 'blur' }, { min: 5, max: 15, message: '账号只能是5到15位之间', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 15, message: '密码只能是6到15位之间', trigger: 'blur' }],
        passwords: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, max: 15, message: '确认密码只能是6到15位之间', trigger: 'blur' },
          { validator: validatePasswords, trigger: 'blur' }
        ],
        card: [{ validator: validateIdNo, trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        age: [{ type: 'number', min: 0, max: 120, message: '年龄只能是0到120岁之间', trigger: 'blur' }],
        mobile: [{ validator: validatePhone, trigger: 'blur' }],
        email: [{ validator: validEmail, trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        role_id: [{ required: true, message: '请选择权限组', trigger: 'change' }]
      },
      // 上传图片URL
      updateUrl: window.serverConfig.BASE_API + 'base/upload',
      // 图片上传请求头
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 编辑表单
      editForm: {},
      // 编辑表单验证规则
      editFormRules: {
        user: [{ required: true, message: '请输入账号', trigger: 'blur' }, { min: 5, max: 15, message: '账号只能是5到15位之间', trigger: 'blur' }],
        password: [{ min: 6, max: 15, message: '密码只能是6到15位之间', trigger: 'blur' }],
        card: [{ validator: validateIdNo, trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        age: [{ type: 'number', min: 0, max: 120, message: '年龄只能是0到120岁之间', trigger: 'blur' }],
        mobile: [{ validator: validatePhone, trigger: 'blur' }],
        email: [{ validator: validEmail, trigger: 'blur' }],
        role_id: [{ required: true, message: '请选择权限组', trigger: 'change' }]
      }
    };
  },
  created() {
    this.adminList();
    // 回车进行搜索
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        self.adminList();
      }
    };
  },
  methods: {
    /**
     * 列表数据请求
     */
    async adminList() {
      const { data: res } = await this.$http.get('admin/list', { params: this.queryInfo });
      if (res.code !== 200) return this.$message.error(res.msg);
      this.queryInfo.total = res.data.total;
      this.adminListData = res.data.data;
    },

    /**
     * 添加对话框
     */
    async addDialog() {
      // 请求权限组所有数据
      const { data: res } = await this.$http.get('group/list');
      if (res.code !== 200) return this.$message.error(res.msg);
      this.role = res.data;
      // 显示对话框
      this.addDialogVisible = true;
    },

    /**
     * 添加提交
     */
    submitAdd() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post('admin/add', this.addForm);
        if (res.code !== 201) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 关闭对话框
        this.addDialogVisible = false;
        // 刷新列表
        this.adminList();
      });
    },

    /**
     * 编辑对话框
     * @param {Object} id 编辑管理员的ID
     */
    async editDialog(id) {
      // 请求权限组所有数据
      const { data: res } = await this.$http.get('group/list');
      if (res.code !== 200) {
        return this.$message.error(res.msg);
      } else {
        this.role = res.data;
        const { data: info } = await this.$http.get(`admin/query/${id}`);
        if (info.code !== 200) return this.$message.error(res.msg);
        this.editForm = info.data;
        this.editForm.password = '';
        // 显示对话框
        this.editDialogVisible = true;
      }
    },

    /**
     * 提交编辑
     */
    submitEdit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        // 发起修改请求
        const { data: res } = await this.$http.put('admin/edit', this.editForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新列表
        this.adminList();
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
          const { data: res } = await this.$http.delete('admin/delete', { params: { id: this.deleteId } });
          if (res.code !== 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          // 刷新列表
          this.adminList();
        })
        .catch(() => {
          this.$message.info('已取消！');
          // 刷新列表
          this.adminList();
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
          const { data: res } = await this.$http.put('admin/statusedit', { id: row.id, status: status });
          if (res.code !== 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          // 刷新列表
          this.adminList();
        })
        .catch(() => {
          this.$message.info('已取消！');
          // 刷新列表
          this.adminList();
        });
    },

    /**
     * 每页显示多少条信息监听事件
     * @param {Object} val
     */
    handleSizeChange(val) {
      this.queryInfo.per_page = val;
      // 刷新列表
      this.adminList();
    },

    /**
     * 当前页监听事件
     * @param {Object} val
     */
    handleCurrentChange(val) {
      this.queryInfo.current_page = val;
      // 刷新列表
      this.adminList();
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
     * 添加头像上传成功时的钩子
     * @param {Object} res 返回数据
     * @param {Object} file 文件对象
     */
    handleAvatarSuccessAddPhoto(res, file) {
      if (res.code !== 200) return this.$message.error(res.msg);
      this.addForm.photo = res.data[0];
      this.$message.success(res.msg);
    },

    /**
     * 编辑头像上传成功时的钩子
     * @param {Object} res 返回数据
     * @param {Object} file 文件对象
     */
    handleAvatarSuccessEditPhoto(res, file) {
      if (res.code !== 200) return this.$message.error(res.msg);
      this.editForm.photo = res.data[0];
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
    }
  }
};
</script>

<style lang="less" scoped></style>

<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>授权管理</el-breadcrumb-item>
      <el-breadcrumb-item>授权列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入搜索内容" v-model="queryInfo.keywords" clearable @clear="authorizationList">
              <el-button slot="append" icon="el-icon-search" @click="authorizationList"></el-button>
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
      <el-table :data="authorizationListData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="授权站名称"></el-table-column>
        <el-table-column prop="ip" label="授权IP地址" width="180"></el-table-column>
        <el-table-column prop="domain_one" label="授权域名1"></el-table-column>
        <el-table-column prop="domain_two" label="授权域名2"></el-table-column>
        <el-table-column prop="domain_tree" label="授权域名3"></el-table-column>
        <el-table-column prop="level" label="授权服务">
          <template slot-scope="scope">
            <span v-if="scope.row.level === '0'">铁牌</span>
            <span v-else-if="scope.row.level === '1'">铜牌</span>
            <span v-else-if="scope.row.level === '2'">银牌</span>
            <span v-else>金牌</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="授权时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | date }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === '1'">正常</el-tag>
            <el-tag type="danger" v-else>封禁</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" effect="dark" content="封禁" placement="top" v-if="scope.row.status === '1'">
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
      <el-dialog title="添加授权站" :visible.sync="addDialogVisible" width="50%" @close="addFormClose">
        <!-- 主体信息 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="授权站名称" prop="name"><el-input placeholder="请输入授权站名称" v-model="addForm.name"></el-input></el-form-item>
          <el-form-item label="授权IP地址" prop="ip"><el-input placeholder="请输入授权IP地址" v-model="addForm.ip"></el-input></el-form-item>
          <el-form-item label="授权域名1" prop="domain_one"><el-input placeholder="请输入授权域名1" v-model="addForm.domain_one"></el-input></el-form-item>
          <el-form-item label="授权域名2" prop="domain_two"><el-input placeholder="请输入授权域名2" v-model="addForm.domain_two"></el-input></el-form-item>
          <el-form-item label="授权域名3" prop="domain_tree"><el-input placeholder="请输入授权域名3" v-model="addForm.domain_tree"></el-input></el-form-item>
          <el-form-item label="用户ID" prop="user_id"><el-input placeholder="请输入绑定的用户ID" v-model="addForm.user_id"></el-input></el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="addForm.status" placeholder="请选择状态">
              <el-option label="正常" value="1"></el-option>
              <el-option label="封禁" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="授权服务" prop="level">
            <el-select v-model="addForm.level" placeholder="请选择授权服务">
              <el-option label="铁牌" value="0"></el-option>
              <el-option label="铜牌" value="1"></el-option>
              <el-option label="银牌" value="2"></el-option>
              <el-option label="金牌" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑对话框 -->
      <el-dialog title="编辑授权站" :visible.sync="editDialogVisible" width="50%" @close="editFormClose">
        <!-- 主体信息 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="授权站名称" prop="name"><el-input placeholder="请输入授权站名称" v-model="editForm.name"></el-input></el-form-item>
          <el-form-item label="授权IP地址" prop="ip"><el-input placeholder="请输入授权IP地址" v-model="editForm.ip"></el-input></el-form-item>
          <el-form-item label="授权域名1" prop="domain_one"><el-input placeholder="请输入授权域名1" v-model="editForm.domain_one"></el-input></el-form-item>
          <el-form-item label="授权域名2" prop="domain_two"><el-input placeholder="请输入授权域名2" v-model="editForm.domain_two"></el-input></el-form-item>
          <el-form-item label="授权域名3" prop="domain_tree"><el-input placeholder="请输入授权域名3" v-model="editForm.domain_tree"></el-input></el-form-item>
          <el-form-item label="用户ID" prop="user_id"><el-input placeholder="请输入绑定的用户ID" v-model="editForm.user_id"></el-input></el-form-item>
          <el-form-item label="授权服务" prop="level">
            <el-select v-model="editForm.level" placeholder="请选择授权服务">
              <el-option label="铁牌" value="0"></el-option>
              <el-option label="铜牌" value="1"></el-option>
              <el-option label="银牌" value="2"></el-option>
              <el-option label="金牌" value="3"></el-option>
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
import { validateIP } from '@/utils/validate.js';
export default {
  data() {
    return {
      // 列表表格数据绑定
      authorizationListData: [],
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
      // 存放删除数据的ID
      deleteId: '',
      // 添加对话框初始化
      addDialogVisible: false,
      // 编辑对话框初始化
      editDialogVisible: false,
      // 添加授权站点表单绑定数据对象
      addForm: {
        name: '',
        ip: '',
        domain_one: '',
        domain_two: '',
        domain_tree: '',
        status: '',
        level: ''
      },
      // 添加授权站点表单验证规则
      addFormRules: {
        name: [{ required: true, message: '请输入授权站名称', trigger: 'blur' }],
        ip: [{ required: true, message: '请输入授权IP地址', trigger: 'blur' }, { validator: validateIP, trigger: 'blur' }],
        domain_one: [{ required: true, message: '请输入授权域名1', trigger: 'blur' }],
        user_id: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }],
        level: [{ required: true, message: '请选择选择授权服务', trigger: 'change' }]
      },
      // 编辑授权站点表单数据绑定对象
      editForm: {},
      // 编辑授权站点表单验证规则
      editFormRules: {
        name: [{ required: true, message: '请输入授权站名称', trigger: 'blur' }],
        ip: [{ required: true, message: '请输入授权IP地址', trigger: 'blur' }, { validator: validateIP, trigger: 'blur' }],
        domain_one: [{ required: true, message: '请输入授权域名1', trigger: 'blur' }],
        user_id: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
        level: [{ required: true, message: '请选择选择授权服务', trigger: 'change' }]
      }
    };
  },
  created() {
    this.authorizationList();
    // 回车进行搜索
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        self.authorizationList();
      }
    };
  },
  methods: {
    /**
     * 获取列表数据
     */
    async authorizationList() {
      // 发起请求
      const { data: res } = await this.$http.get('authorization/list', { params: this.queryInfo });
      if (res.code !== 200) return this.$message.error(res.msg);
      this.queryInfo.total = res.data.total;
      this.authorizationListData = res.data.data;
    },

    /**
     * 添加对话框
     */
    addDialog() {
      // 显示添加对话框
      this.addDialogVisible = true;
    },

    /**
     * 添加提交
     */
    submitAdd() {
      this.$refs.addFormRef.validate(async valid => {
        // 验证失败返回
        if (!valid) return;
        // 发起添加请求
        const { data: res } = await this.$http.post('authorization/add', this.addForm);
        if (res.code !== 201) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 关闭添加对话框
        this.addDialogVisible = false;
        // 刷新列表
        this.authorizationList();
      });
    },

    /**
     * 编辑对话框
     * @param {Object} id 授权站点ID
     */
    async editDialog(id) {
      const { data: res } = await this.$http.get(`authorization/query/${id}`);
      if (res.code !== 200) return this.$message.error(res.msg);
      this.editForm = res.data;
      // 显示编辑对话框
      this.editDialogVisible = true;
    },

    /**
     * 编辑授权站点提交
     */
    submitEdit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put('authorization/edit', this.editForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.editDialogVisible = false;
        this.authorizationList();
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
          const { data: res } = await this.$http.delete('authorization/delete', { params: { id: this.deleteId } });
          if (res.code !== 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          // 刷新列表
          this.authorizationList();
        })
        .catch(() => {
          this.$message.info('已取消！');
          // 刷新列表
          this.authorizationList();
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
      this.authorizationList();
    },

    /**
     * 当前页监听事件
     * @param {Object} val
     */
    handleCurrentChange(val) {
      this.queryInfo.current_page = val;
      // 刷新列表
      this.authorizationList();
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
          const { data: res } = await this.$http.put('authorization/statusedit', { id: row.id, status: status });
          if (res.code !== 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          // 刷新列表
          this.authorizationList();
        })
        .catch(() => {
          this.$message.info('已取消！');
          // 刷新列表
          this.authorizationList();
        });
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

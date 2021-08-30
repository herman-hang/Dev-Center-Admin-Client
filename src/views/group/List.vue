<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限组列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入搜索内容" v-model="queryInfo.keywords" clearable @clear="groupList">
              <el-button slot="append" icon="el-icon-search" @click="groupList"></el-button>
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
      <el-table :data="groupListData" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="name" label="权限组名称" width="180"></el-table-column>
        <el-table-column prop="user" label="管理员" width="180"></el-table-column>
        <el-table-column prop="instruction" label="权限组描述"></el-table-column>
        <el-table-column prop="create_time" label="创建时间"></el-table-column>
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
      <el-dialog title="添加权限组" :visible.sync="addDialogVisible" @close="addFormClose" width="50%">
        <!-- 主体信息 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item label="权限组名称" prop="name"><el-input placeholder="请输入权限组名称" v-model="addForm.name"></el-input></el-form-item>
          <el-form-item label="权限组描述" prop="instruction"><el-input placeholder="请输入权限组描述" type="textarea" v-model="addForm.instruction"></el-input></el-form-item>
          <el-form-item label="选择状态" prop="status">
            <el-select v-model="addForm.status" placeholder="请选择状态">
              <el-option label="启用" value="1"></el-option>
              <el-option label="停用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择权限" prop="rules"><el-tree :data="addForm.children" ref="addTree" show-checkbox node-key="id" :props="addEditProps"></el-tree></el-form-item>
        </el-form>
        <!-- 底部按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAdd">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑对话框 -->
      <el-dialog title="编辑权限组" :visible.sync="editDialogVisible" @close="editFormClose" width="50%">
        <!-- 主体信息 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="权限组名称" prop="name"><el-input v-model="editForm.name"></el-input></el-form-item>
          <el-form-item label="权限组描述" prop="instruction"><el-input type="textarea" v-model="editForm.instruction"></el-input></el-form-item>
          <el-form-item label="选择权限" prop="children">
            <el-tree :data="editForm.children" ref="editTree" show-checkbox node-key="id" :props="addEditProps"></el-tree>
          </el-form-item>
        </el-form>
        <!-- 底部按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEdit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash';
export default {
  data() {
    return {
      // 编辑对话框
      editDialogVisible: false,
      // 添加对话框
      addDialogVisible: false,
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
      // 表单列表
      groupListData: [],
      // 存储删除的ID
      deleteId: '',
      // 属性组件属性配置
      addEditProps: {
        children: 'children',
        label: 'name'
      },
      // 编辑表单
      editForm: {},
      // 编辑验证规则
      editFormRules: {
        name: [{ required: true, message: '请输入权限组名称！', trigger: 'blur' }],
        rules: [{ required: true, message: '请选择权限！', trigger: 'change' }]
      },
      // 添加表单
      addForm: {
        name: '',
        instruction: '',
        status: '',
        rules: ''
      },
      // 添加表单验证规则
      addFormRules: {
        name: [{ required: true, message: '请输入权限组名称！', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态！', trigger: 'change' }],
        rules: [{ required: true, message: '请选择权限！', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.groupList();
    // 回车进行搜索
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        self.groupList();
      }
    };
  },
  methods: {
    /**
     * 获取表单列表数据
     */
    async groupList() {
      const { data: res } = await this.$http.get('group/list', { params: this.queryInfo });
      if (res.code !== 200) return this.$message.error(res.msg);
      this.queryInfo.total = res.data.total;
      res.data.data.forEach(item => {
        item.user = item.user.join('，');
        if (item.user === '') {
          item.user = '无';
        }
      });
      this.groupListData = res.data.data;
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
          const { data: res } = await this.$http.delete('group/delete', { params: { id: this.deleteId } });
          if (res.code !== 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          // 刷新列表
          this.groupList();
        })
        .catch(() => {
          this.$message.info('已取消！');
          // 刷新列表
          this.groupList();
        });
    },

    /**
     * 每页显示多少条信息监听事件
     * @param {Object} val
     */
    handleSizeChange(val) {
      this.queryInfo.per_page = val;
      // 刷新列表
      this.groupList();
    },

    /**
     * 当前页监听事件
     * @param {Object} val
     */
    handleCurrentChange(val) {
      this.queryInfo.current_page = val;
      // 刷新列表
      this.groupList();
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
          const { data: res } = await this.$http.put('group/statusedit', { id: row.id, status: status });
          if (res.code !== 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          // 刷新列表
          this.groupList();
        })
        .catch(() => {
          this.$message.info('已取消！');
          // 刷新列表
          this.groupList();
        });
    },

    /**
     * 编辑内容
     * @param {Object} id
     */
    async editDialog(id) {
      // 调用根据权限组ID查询数据方法
      const { data: res } = await this.$http.get(`group/query/id/${id}`);
      if (res.code !== 200) return this.$message.error(res.msg);
      this.editForm = res.data;
      // 勾选拥有的权限
      setTimeout(() => {
        this.$refs.editTree.setCheckedKeys(this.editForm.rules);
      }, 500);
      // 显示编辑对话框
      this.editDialogVisible = true;
    },

    /**
     * 提交编辑的数据
     */
    submitEdit() {
      this.$refs.editFormRef.validate(async valid => {
        // 数据验证失败
        if (!valid) return;
        // 进行深拷贝
        const form = _.cloneDeep(this.editForm);
        form.rules = this.$refs.editTree.getCheckedKeys().join(',');
        // 发起修改数据请求
        const { data: res } = await this.$http.put('group/edit', form);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 关闭编辑对话框
        this.editDialogVisible = false;
        // 刷新列表
        this.groupList();
      });
    },

    /**
     * 编辑表单关闭
     */
    editFormClose() {
      // 重置所有表单项
      this.$refs.editFormRef.resetFields();
    },

    /**
     * 添加表单关闭
     */
    addFormClose() {
      // 重置所有表单项
      this.$refs.addFormRef.resetFields();
    },

    /**
     * 添加
     */
    async addDialog() {
      const { data: res } = await this.$http.get('group/query');
      if (res.code !== 200) return this.$message.error(res.msg);
      this.addForm = res.data;
      // 显示添加对话框
      this.addDialogVisible = true;
    },

    /**
     * 添加提交
     */
    submitAdd() {
      // 发起添加请求
      this.addForm.rules = this.$refs.addTree.getCheckedKeys();
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        this.addForm.rules = this.$refs.addTree.getCheckedKeys().join(',');
        const { data: res } = await this.$http.post('group/add', this.addForm);
        if (res.code !== 201) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 关闭添加对话框
        this.addDialogVisible = false;
        // 刷新列表
        this.groupList();
      });
    }
  }
};
</script>

<style lang="less" scoped></style>

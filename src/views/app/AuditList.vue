<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>应用中心</el-breadcrumb-item>
      <el-breadcrumb-item>审核列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入内容" v-model="queryInfo.keywords" clearable @clear="appAuditList">
              <el-select class="select" v-model="queryInfo.type" slot="prepend" placeholder="请选择" @click="appAuditList">
                <el-option label="全部" value=""></el-option>
                <el-option label="插件" value="0"></el-option>
                <el-option label="模板" value="1"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="appAuditList"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>

      <!-- 列表表格 -->
      <el-table :data="auditListData" border style="width: 100%">
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
            <el-tag type="info" v-if="scope.row.status === '1'">审核中</el-tag>
            <el-tooltip placement="top" v-else-if="scope.row.status === '3'">
              <div slot="content">原因：{{ scope.row.cause }}</div>
              <el-tag type="danger">已驳回</el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="发布时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.create_time | date }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip :enterable="false" effect="dark" content="驳回" placement="top">
              <el-button type="danger" icon="el-icon-remove-outline" size="mini" @click="reject(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip :enterable="false" effect="dark" content="审核" placement="top">
              <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="pass(scope.row.id)"></el-button>
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

      <!-- 审核应用 -->
      <el-dialog title="审核应用" :visible.sync="auditDialogVisible" width="50%" @close="auditFormClose">
        <el-form :model="auditForm" :rules="auditFormRules" ref="auditFormRef" label-width="100px">
          <el-form-item label="类型" prop="type">
            <el-select v-model="auditForm.type" placeholder="请选择应用类型">
              <el-option label="插件" value="0"></el-option>
              <el-option label="模板" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应用名称" prop="name"><el-input placeholder="请输入应用名称" v-model="auditForm.name"></el-input></el-form-item>
          <el-form-item label="缩略图" prop="img">
            <!-- 缩略图上传 -->
            <el-upload
              accept=".jpg,.jpeg,.png,.bmp"
              class="avatar-uploader"
              :action="updateUrl"
              :headers="headers"
              :show-file-list="false"
              :on-success="handleAvatarSuccessAuditPhoto"
              :before-upload="beforeAvatarUpload"
              name="image"
            >
              <img v-if="auditForm.img" :src="auditForm.img" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="是否付费" prop="is_pay">
            <el-select v-model="auditForm.is_pay" placeholder="请选择付费类型">
              <el-option label="免费" value="0"></el-option>
              <el-option label="付费" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="金额" prop="money" v-if="auditForm.is_pay === '1'">
            <el-input type="number" placeholder="请输入应用付费金额" v-model="auditForm.money"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author"><el-input placeholder="请输入应用作者" v-model="auditForm.author"></el-input></el-form-item>
          <el-form-item label="应用包" prop="zip">
            <!-- 应用包上传 -->
            <el-upload class="avatar-uploader" :action="updateUrl" :headers="headers" :show-file-list="false" :on-success="handleAvatarSuccessAuditFile" name="file">
              <img v-if="auditForm.zip" src="../../assets/image/zip.png" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="应用介绍" prop="introduce">
            <!-- 富文本编辑器 -->
            <mavon-editor @imgAdd="$imgAudit" ref="auditEditorRef" v-model="auditForm.introduce"></mavon-editor>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="auditDialogVisible = false">取 消</el-button>
          <el-button v-loading.fullscreen.lock="fullscreenLoading" type="primary" @click="submitPass">通 过</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 审核应用通过加载图标初始化
      fullscreenLoading: false,
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
      // 表格列表数据绑定
      auditListData: [],
      // 审核应用初始化
      auditDialogVisible: false,
      // 审核应用表单数据绑定
      auditForm: {},
      // 审核应用表单验证规则
      auditFormRules: {
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
    this.appAuditList();
    // 回车进行搜索
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        self.appAuditList();
      }
    };
  },
  methods: {
    /**
     * 获取列表数据
     */
    async appAuditList() {
      const { data: res } = await this.$http.get('app/auditlist', { params: this.queryInfo });
      if (res.code !== 200) return this.$message.error(res.msg);
      this.queryInfo.total = res.data.total;
      this.auditListData = res.data.data;
    },

    /**
     * 当前页监听事件
     * @param {Object} val
     */
    handleCurrentChange(val) {
      this.queryInfo.current_page = val;
      // 刷新列表
      this.appAuditList();
    },

    /**
     * 每页显示多少条信息监听事件
     * @param {Object} val
     */
    handleSizeChange(val) {
      this.queryInfo.per_page = val;
      // 刷新列表
      this.appAuditList();
    },

    /**
     * 驳回操作
     * @param {Object} id 应用ID
     */
    reject(id) {
      this.$prompt('请输入驳回原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async ({ value }) => {
          // 发起请求
          const { data: res } = await this.$http.put('app/reject', { id: id, cause: value });
          if (res.code !== 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          // 刷新列表
          this.appAuditList();
        })
        .catch(() => {
          this.$message.info('已取消！');
        });
    },

    /**
     * 审核通过
     * @param {Object} id 用户ID
     */
    async pass(id) {
      const { data: res } = await this.$http.get(`app/query/${id}`);
      if (res.code !== 200) return this.$message.error(res.msg);
      this.auditForm = res.data;
      // 显示审核对话框
      this.auditDialogVisible = true;
    },

    /**
     * 审核通过提交
     */
    submitPass() {
      this.$refs.auditFormRef.validate(async valid => {
        if (!valid) return;
        // 免费则重置付费金额为空
        if (this.auditForm.is_pay === '0') {
          this.auditForm.money = 0.0;
        }
        // 关闭审核对话框
        this.auditDialogVisible = false;
        // 显示加载图标
        this.fullscreenLoading = true;
        // 修改请求
        await this.$http.put('app/edit', this.auditForm);
        // 审核通过请求
        const { data: result } = await this.$http.put('app/pass', { id: this.auditForm.id });
        // 关闭加载图标
        this.fullscreenLoading = false;
        if (result.code !== 200) return this.$message.error(result.msg);
        this.$message.success(result.msg);
        // 刷新列表
        this.appAuditList();
      });
    },

    /**
     * 审核应用缩略图上传成功时的钩子
     * @param {Object} res 返回数据
     * @param {Object} file 文件对象
     */
    handleAvatarSuccessAuditPhoto(res, file) {
      if (res.code !== 200) return this.$message.error(res.msg);
      this.auditForm.img = res.data[0];
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
     * 审核应用富文本编辑器上传图片到本地服务器
     * @param {Object} pos 上传的位置
     * @param {Object} $file 上传的图片
     */
    async $imgAudit(pos, $file) {
      var formdata = new FormData();
      formdata.append('image', $file);
      const { data: res } = await this.$http.post(this.updateUrl, formdata);
      if (res.code !== 200) return this.$message.error(res.msg);
      this.$refs.auditEditorRef.$img2Url(pos, res.data[0]);
    },

    /**
     * 审核应用应用包上传成功时的钩子
     * @param {Object} res 返回数据
     * @param {Object} file 文件对象
     */
    handleAvatarSuccessAuditFile(res, file) {
      if (res.code !== 200) return this.$message.error(res.msg);
      this.auditForm.zip = res.data[0];
      this.$message.success(res.msg);
    },

    /**
     * 审核应用对话框关闭
     */
    auditFormClose() {
      // 重置所有表单项
      this.$refs.auditFormRef.resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
.select {
  width: 80px;
}
</style>

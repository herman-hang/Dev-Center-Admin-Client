<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>开发者管理</el-breadcrumb-item>
      <el-breadcrumb-item>提现审核</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 -->
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入搜索内容" v-model="unauditedQueryInfo.keywords" clearable @clear="audit('1')" v-if="activeName === 'first'">
              <el-button slot="append" icon="el-icon-search" @click="audit('1')"></el-button>
            </el-input>
            <el-input placeholder="请输入搜索内容" v-model="auditQueryInfo.keywords" clearable @clear="audit('2')" v-else>
              <el-button slot="append" icon="el-icon-search" @click="audit('2')"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 待审核列表 -->
        <el-tab-pane label="待审核" name="first">
          <el-table :data="unauditedData" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"></el-table-column>
            <el-table-column prop="indent" label="订单号"></el-table-column>
            <el-table-column prop="developer_id" label="开发者ID"></el-table-column>
            <el-table-column prop="money" label="申请金额"></el-table-column>
            <el-table-column prop="withdraw_account" label="审核到账">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.withdraw_account === '0'">支付宝</el-tag>
                <el-tag type="success" v-else-if="scope.row.withdraw_account === '1'">微信</el-tag>
                <el-tag type="danger" v-else>QQ</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <el-tag type="info" v-if="scope.row.status === '0'">审核中</el-tag>
                <el-tooltip placement="top" v-if="scope.row.status === '2'">
                  <div slot="content">原因：{{ scope.row.cause }}</div>
                  <el-tag type="danger">已驳回</el-tag>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" label="申请时间">
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
                  <el-button type="success" icon="el-icon-circle-plus-outline" size="mini" @click="auditcheck(scope.row.id)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination
            @size-change="unauditedHandleSizeChange"
            @current-change="unauditedHandleCurrentChange"
            :current-page="unauditedQueryInfo.current_page"
            :page-sizes="[25, 30, 40, 50]"
            :page-size="unauditedQueryInfo.per_page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="unauditedQueryInfo.total"
          ></el-pagination>

          <!-- 审核对话框 -->
          <el-dialog title="审核订单" :visible.sync="auditDialogVisible" width="50%" @close="auditFormClose">
            <el-form :model="auditForm" ref="auditFormRef" label-width="120px">
              <el-form-item label="订单号:">
                <span>{{ auditForm.indent }}</span>
              </el-form-item>
              <el-form-item label="用户名:">
                <span>{{ auditForm.user }}</span>
              </el-form-item>
              <el-form-item label="申请时间:">
                <span>{{ auditForm.create_time | date }}</span>
              </el-form-item>
              <el-form-item label="申请金额:">
                <span>{{ auditForm.apply_money }}</span>
              </el-form-item>
              <el-form-item label="申请到账:">
                <span v-if="auditForm.withdraw_account === '0'">支付宝</span>
                <span v-else-if="auditForm.withdraw_account === '1'">微信</span>
                <span v-else>QQ</span>
              </el-form-item>
              <el-form-item label="状态:">
                <span v-if="auditForm.status === '0'">审核中</span>
                <span v-else-if="auditForm.status === '1'">已到账</span>
                <span v-else>已驳回</span>
              </el-form-item>
              <el-form-item label="钱包余额:">
                <span>{{ auditForm.money }}</span>
              </el-form-item>
              <el-form-item label="真实姓名:">
                <span>{{ auditForm.name }}</span>
              </el-form-item>
              <el-form-item label="等级:">
                <span v-if="auditForm.level === '0'">铜牌</span>
                <span v-else-if="auditForm.level === '1'">银牌</span>
                <span v-else>金牌</span>
              </el-form-item>
              <el-form-item label="服务费(%):">
                <span>{{ auditForm.brokerage }}</span>
              </el-form-item>
              <el-form-item label="手机号码:">
                <span>{{ auditForm.mobile }}</span>
              </el-form-item>
              <el-form-item label="邮箱:">
                <span>{{ auditForm.email }}</span>
              </el-form-item>
              <el-form-item label="支付宝账户:">
                <span>{{ auditForm.alipay }}</span>
              </el-form-item>
              <el-form-item label="支付宝真实姓名:">
                <span>{{ auditForm.alipay_name }}</span>
              </el-form-item>
              <el-form-item label="微信账户:">
                <span>{{ auditForm.wxpay }}</span>
              </el-form-item>
              <el-form-item label="微信真实姓名:">
                <span>{{ auditForm.wxpay_name }}</span>
              </el-form-item>
              <el-form-item label="QQ账户:">
                <span>{{ auditForm.qqpay }}</span>
              </el-form-item>
              <el-form-item label="QQ网名:">
                <span>{{ auditForm.qqpay_name }}</span>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="auditDialogVisible = false">取 消</el-button>
              <el-button v-loading.fullscreen.lock="fullscreenLoading" type="primary" @click="pass">通 过</el-button>
            </span>
          </el-dialog>
        </el-tab-pane>

        <!-- 已审核列表 -->
        <el-tab-pane label="已审核" name="second">
          <el-table :data="auditData" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"></el-table-column>
            <el-table-column prop="indent" label="订单号"></el-table-column>
            <el-table-column prop="developer_id" label="开发者ID"></el-table-column>
            <el-table-column prop="money" label="申请金额"></el-table-column>
            <el-table-column prop="withdraw_account" label="审核到账">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.withdraw_account === '0'">支付宝</el-tag>
                <el-tag type="success" v-else-if="scope.row.withdraw_account === '1'">微信</el-tag>
                <el-tag type="danger" v-else>QQ</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template>
                <el-tag type="success">已到账</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="create_time" label="申请时间">
              <template slot-scope="scope">
                {{ scope.row.create_time | date }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip :enterable="false" effect="dark" content="查看" placement="top">
                  <el-button type="success" icon="el-icon-zoom-in" size="mini" @click="checkInfo(scope.row.id)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination
            @size-change="auditHandleSizeChange"
            @current-change="auditHandleCurrentChange"
            :current-page="auditQueryInfo.current_page"
            :page-sizes="[25, 30, 40, 50]"
            :page-size="auditQueryInfo.per_page"
            layout="total, sizes, prev, pager, next, jumper"
            :total="auditQueryInfo.total"
          ></el-pagination>

          <!-- 查看订单对话框 -->
          <el-dialog title="查看订单" :visible.sync="checkInfoDialogVisible" width="50%" @close="checkInfoFormClose">
            <el-form :model="checkInfoForm" ref="checkInfoFormRef" label-width="120px">
              <el-form-item label="订单号:">
                <span>{{ checkInfoForm.indent }}</span>
              </el-form-item>
              <el-form-item label="用户名:">
                <span>{{ checkInfoForm.user }}</span>
              </el-form-item>
              <el-form-item label="申请时间:">
                <span>{{ checkInfoForm.create_time | date }}</span>
              </el-form-item>
              <el-form-item label="申请金额:">
                <span>{{ checkInfoForm.apply_money }}</span>
              </el-form-item>
              <el-form-item label="申请到账:">
                <span v-if="checkInfoForm.withdraw_account === '0'">支付宝</span>
                <span v-else-if="checkInfoForm.withdraw_account === '1'">微信</span>
                <span v-else>QQ</span>
              </el-form-item>
              <el-form-item label="状态:">
                <span v-if="checkInfoForm.status === '0'">审核中</span>
                <span v-else-if="checkInfoForm.status === '1'">已到账</span>
                <span v-else>已驳回</span>
              </el-form-item>
              <el-form-item label="钱包余额:">
                <span>{{ checkInfoForm.money }}</span>
              </el-form-item>
              <el-form-item label="真实姓名:">
                <span>{{ checkInfoForm.name }}</span>
              </el-form-item>
              <el-form-item label="等级:">
                <span v-if="checkInfoForm.level === '0'">铜牌</span>
                <span v-else-if="checkInfoForm.level === '1'">银牌</span>
                <span v-else>金牌</span>
              </el-form-item>
              <el-form-item label="服务费(%):">
                <span>{{ checkInfoForm.brokerage }}</span>
              </el-form-item>
              <el-form-item label="手机号码:">
                <span>{{ checkInfoForm.mobile }}</span>
              </el-form-item>
              <el-form-item label="邮箱:">
                <span>{{ checkInfoForm.email }}</span>
              </el-form-item>
              <el-form-item label="支付宝账户:">
                <span>{{ checkInfoForm.alipay }}</span>
              </el-form-item>
              <el-form-item label="支付宝真实姓名:">
                <span>{{ checkInfoForm.alipay_name }}</span>
              </el-form-item>
              <el-form-item label="微信账户:">
                <span>{{ checkInfoForm.wxpay }}</span>
              </el-form-item>
              <el-form-item label="微信真实姓名:">
                <span>{{ checkInfoForm.wxpay_name }}</span>
              </el-form-item>
              <el-form-item label="QQ账户:">
                <span>{{ checkInfoForm.qqpay }}</span>
              </el-form-item>
              <el-form-item label="QQ网名:">
                <span>{{ checkInfoForm.qqpay_name }}</span>
              </el-form-item>
            </el-form>
          </el-dialog>
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
      activeName: 'first',
      // 待审核查询参数
      unauditedQueryInfo: {
        //搜索关键字
        keywords: '',
        //当前页码
        current_page: 1,
        //每页显示多少条数据
        per_page: 25,
        // 总页数
        total: 0,
        // 待审核
        type: '1'
      },
      // 待审核列表数据绑定
      unauditedData: [],
      // 已审核查询参数
      auditQueryInfo: {
        //搜索关键字
        keywords: '',
        //当前页码
        current_page: 1,
        //每页显示多少条数据
        per_page: 25,
        // 总页数
        total: 0,
        // 已审核
        type: '2'
      },
      // 已审核列表数据绑定
      auditData: [],
      // 审核对话框初始化
      auditDialogVisible: false,
      // 审核对话框表单
      auditForm: {},
      // 加载图标
      fullscreenLoading: false,
      // 查看订单表单绑定对象
      checkInfoForm: {},
      // 查看对话框初始化
      checkInfoDialogVisible: false
    };
  },
  created() {
    this.audit('1');
    // 回车进行搜索
    var self = this;
    document.onkeydown = function(e) {
      var key = window.event.keyCode;
      if (key === 13) {
        if (self.activeName === 'first') {
          self.audit('1');
        } else {
          self.audit('2');
        }
      }
    };
  },
  methods: {
    /**
     * 获取列表数据
     * @param {Object} type 获取数据类型
     */
    async audit(type) {
      if (type === '1') {
        // 待审核
        const { data: res } = await this.$http.get('withdraw/list', { params: this.unauditedQueryInfo });
        if (res.code !== 200) return this.$message.error(res.msg);
        this.unauditedQueryInfo.total = res.data.total;
        this.unauditedData = res.data.data;
      } else {
        // 已审核
        const { data: res } = await this.$http.get('withdraw/list', { params: this.auditQueryInfo });
        if (res.code !== 200) return this.$message.error(res.msg);
        this.auditQueryInfo.total = res.data.total;
        this.auditData = res.data.data;
      }
    },
    /**
     * 标签页切换触发事件
     */
    handleClick() {
      if (this.activeName === 'first') {
        this.audit('1');
      } else {
        this.audit('2');
      }
    },

    /**
     * 审核操作
     * @param {Object} id 提现数据ID
     */
    async auditcheck(id) {
      const { data: res } = await this.$http.get(`withdraw/query/${id}`);
      if (res.code !== 200) return this.$message.error(res.msg);
      this.auditForm = res.data;
      // 显示审核对话框
      this.auditDialogVisible = true;
    },

    /**
     * 审核通过操作
     */
    async pass() {
      // 关闭审核对话框
      this.auditDialogVisible = false;
      // 显示加载图标
      this.fullscreenLoading = true;
      const { data: res } = await this.$http.put('withdraw/pass', { id: this.auditForm.id });
      // 关闭加载图标
      this.fullscreenLoading = false;
      if (res.code !== 200) return this.$message.error(res.msg);
      this.$message.success(res.msg);
      // 刷新列表
      this.audit('1');
    },

    /**
     * 驳回操作
     * @param {Object} id 提现数据ID
     */
    reject(id) {
      this.$prompt('请输入驳回原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async ({ value }) => {
          // 发起请求
          const { data: res } = await this.$http.put('withdraw/reject', { id: id, cause: value });
          if (res.code !== 200) return this.$message.error(res.msg);
          this.$message.success(res.msg);
          // 刷新列表
          this.audit('1');
        })
        .catch(() => {
          this.$message.info('已取消！');
        });
    },

    /**
     * 待审核每页显示多少条信息监听事件
     * @param {Object} val
     */
    unauditedHandleSizeChange(val) {
      this.unauditedQueryInfo.per_page = val;
      // 刷新列表
      this.audit('1');
    },

    /**
     * 待审核当前页监听事件
     * @param {Object} val
     */
    unauditedHandleCurrentChange(val) {
      this.unauditedQueryInfo.current_page = val;
      // 刷新列表
      this.audit('1');
    },

    /**
     * 已审核每页显示多少条信息监听事件
     * @param {Object} val
     */
    auditHandleSizeChange(val) {
      this.auditQueryInfo.per_page = val;
      // 刷新列表
      this.audit('2');
    },

    /**
     * 已审核当前页监听事件
     * @param {Object} val
     */
    auditHandleCurrentChange(val) {
      this.auditQueryInfo.current_page = val;
      // 刷新列表
      this.audit('2');
    },

    /**
     * 已审核查看订单
     * @param {Object} id 订单ID
     */
    async checkInfo(id) {
      const { data: res } = await this.$http.get(`withdraw/query/${id}`);
      if (res.code !== 200) return this.$message.error(res.msg);
      this.checkInfoForm = res.data;
      // 显示查看对话框
      this.checkInfoDialogVisible = true;
    },

    /**
     * 审核对话框关闭
     */
    auditFormClose() {
      // 重置所有表单项
      this.$refs.auditFormRef.resetFields();
    },

    /**
     * 查看订单对话框关闭
     */
    checkInfoFormClose() {
      // 重置所有表单项
      this.$refs.checkInfoFormRef.resetFields();
    }
  }
};
</script>

<style lang="less" scoped></style>

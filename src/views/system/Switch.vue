<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>开关管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix"><strong>开关管理</strong></div>
      <el-form :model="switchForm" :rules="switchFormRules" ref="switchFormRef" label-width="100px">
        <el-tabs v-model="activeName" tab-position="left">
          <el-tab-pane label="支付开关" name="pay_switch">
            <el-form-item label="微信支付" prop="wxpay_switch">
              <el-radio-group v-model="switchForm.wxpay_switch">
                <el-radio label="1">开启</el-radio>
                <el-radio label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="支付宝支付" prop="alipay_switch">
              <el-radio-group v-model="switchForm.alipay_switch">
                <el-radio label="1">开启</el-radio>
                <el-radio label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="QQ支付" prop="qqpay_switch">
              <el-radio-group v-model="switchForm.qqpay_switch">
                <el-radio label="1">开启</el-radio>
                <el-radio label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="易支付" prop="epay_switch">
              <el-radio-group v-model="switchForm.epay_switch">
                <el-radio label="1">开启</el-radio>
                <el-radio label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item><el-button type="primary" icon="el-icon-edit" @click="switchEdit">提交</el-button></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="登录开关" name="login_switch">
            <el-form-item label="QQ" prop="qqlogin_switch">
              <el-radio-group v-model="switchForm.qqlogin_switch">
                <el-radio label="1">开启</el-radio>
                <el-radio label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="微信" prop="weixinlogin_switch">
              <el-radio-group v-model="switchForm.weixinlogin_switch">
                <el-radio label="1">开启</el-radio>
                <el-radio label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="微博" prop="sinalogin_switch">
              <el-radio-group v-model="switchForm.sinalogin_switch">
                <el-radio label="1">开启</el-radio>
                <el-radio label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Gitee" prop="giteelogin_switch">
              <el-radio-group v-model="switchForm.giteelogin_switch">
                <el-radio label="1">开启</el-radio>
                <el-radio label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item><el-button type="primary" icon="el-icon-edit" @click="switchEdit">提交</el-button></el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 标签页默认选中
      activeName: 'pay_switch',
      // 表单绑定的数据对象
      switchForm: {},
      // 验证规则
      switchFormRules: {
        wxpay_switch: [{ required: true, message: '请选择微信支付开关！', trigger: 'change' }],
        alipay_switch: [{ required: true, message: '请选择支付宝支付开关！', trigger: 'change' }],
        qqpay_switch: [{ required: true, message: '请选择QQ支付开关！', trigger: 'change' }],
        epay_switch: [{ required: true, message: '请选择易支付支付开关！', trigger: 'change' }],
        qqlogin_switch: [{ required: true, message: '请选择QQ登录开关！', trigger: 'change' }],
        weixinlogin_switch: [{ required: true, message: '请选择微信登录开关！', trigger: 'change' }],
        sinalogin_switch: [{ required: true, message: '请选择微博登录开关！', trigger: 'change' }],
        giteelogin_switch: [{ required: true, message: '请选择Gitee登录开关！', trigger: 'change' }]
      }
    };
  },
  created() {
    this.switch();
  },
  methods: {
    /**
     * 获取表单数据
     */
    async switch() {
      // 发起请求
      const { data: res } = await this.$http.get('switch');
      if (res.code !== 200) return this.$message.error(res.msg);
      this.switchForm = res.data;
    },

    /**
     * 修改表单
     */
    switchEdit() {
      this.$refs.switchFormRef.validate(async valid => {
        if (!valid) return;
        // 发起请求
        const { data: res } = await this.$http.put('switchedit', this.switchForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 刷新数据
        this.switch();
      });
    }
  }
};
</script>

<style lang="less" scoped></style>

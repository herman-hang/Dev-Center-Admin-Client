<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>功能配置</el-breadcrumb-item>
      <el-breadcrumb-item>支付配置</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix"><strong>支付配置</strong></div>
      <el-form :model="payForm" :rules="payFormRules" ref="payFormRef" label-width="100px">
        <el-tabs v-model="activeName" tab-position="left">
          <el-tab-pane label="支付宝支付" name="alipay">
            <el-form-item label="支付宝AppID" prop="alipay_private_id"><el-input placeholder="请输入支付宝AppID" v-model="payForm.alipay_private_id"></el-input></el-form-item>
            <el-form-item label="支付宝私钥" prop="alipay_private_key"><el-input placeholder="请输入支付宝私钥" v-model="payForm.alipay_private_key"></el-input></el-form-item>
            <el-form-item label="支付宝公钥" prop="alipay_public_key"><el-input placeholder="请输入支付宝公钥" v-model="payForm.alipay_public_key"></el-input></el-form-item>
            <!-- 提交按钮 -->
            <el-form-item><el-button type="primary" icon="el-icon-edit" @click="submit">提交</el-button></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="当面付" name="alif2f">
            <el-form-item label="当面付AppID" prop="alipayf2f_private_id">
              <el-input placeholder="请输入当面付AppID" v-model="payForm.alipayf2f_private_id"></el-input>
            </el-form-item>
            <el-form-item label="当面付私钥" prop="alipayf2f_private_key">
              <el-input placeholder="请输入当面付私钥" v-model="payForm.alipayf2f_private_key"></el-input>
            </el-form-item>
            <el-form-item label="当面付公钥" prop="alipayf2f_public_key"><el-input placeholder="请输入当面付私钥" v-model="payForm.alipayf2f_public_key"></el-input></el-form-item>
            <!-- 提交按钮 -->
            <el-form-item><el-button type="primary" icon="el-icon-edit" @click="submit">提交</el-button></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="微信支付" name="wxpay">
            <el-form-item label="微信商户号" prop="wxpay_mchid"><el-input placeholder="请输入微信商户号" v-model="payForm.wxpay_mchid"></el-input></el-form-item>
            <el-form-item label="微信商户KEY" prop="wxpay_key"><el-input placeholder="请输入微信商户KEY" v-model="payForm.wxpay_key"></el-input></el-form-item>
            <el-form-item label="AppID" prop="wxpay_appid"><el-input placeholder="请输入公众号AppID" v-model="payForm.wxpay_appid"></el-input></el-form-item>
            <el-form-item label="AppSecret" prop="wxpay_secret"><el-input placeholder="请输入公众号AppSecret" v-model="payForm.wxpay_secret"></el-input></el-form-item>
            <!-- 提交按钮 -->
            <el-form-item><el-button type="primary" icon="el-icon-edit" @click="submit">提交</el-button></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="QQ钱包支付" name="qqpay">
            <el-form-item label="QQ商户号" prop="qqpay_mchid"><el-input placeholder="请输入QQ商户号" v-model="payForm.qqpay_mchid"></el-input></el-form-item>
            <el-form-item label="QQ商户KEY" prop="qqpay_key"><el-input placeholder="请输入QQ商户KEY" v-model="payForm.qqpay_key"></el-input></el-form-item>
            <!-- 提交按钮 -->
            <el-form-item><el-button type="primary" icon="el-icon-edit" @click="submit">提交</el-button></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="易支付" name="epay">
            <el-form-item label="易支付API" prop="epay_api"><el-input placeholder="请输入易支付API" v-model="payForm.epay_api"></el-input></el-form-item>
            <el-form-item label="易支付商户号" prop="epay_appid"><el-input placeholder="请输入易支付商户号" v-model="payForm.epay_appid"></el-input></el-form-item>
            <el-form-item label="易支付KEY" prop="epay_key"><el-input placeholder="请输入易支付KEY" v-model="payForm.epay_key"></el-input></el-form-item>
            <!-- 提交按钮 -->
            <el-form-item><el-button type="primary" icon="el-icon-edit" @click="submit">提交</el-button></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="支付宝接口" name="alipay_type">
            <el-form-item label="接口类型" prop="alipay_type">
              <el-radio-group v-model="payForm.alipay_type">
                <el-radio label="0">官方支付</el-radio>
                <el-radio label="1">当面付</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 提交按钮 -->
            <el-form-item><el-button type="primary" icon="el-icon-edit" @click="submit">提交</el-button></el-form-item>
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
      // 设置标签页默认选中
      activeName: 'alipay',
      // 表单验证规则
      payFormRules: {
        alipay_type: [{ required: true, message: '请选择支付宝支付类型', trigger: 'change' }]
      },
      // 表单数据绑定对象
      payForm: {}
    };
  },
  created() {
    this.pay();
  },
  methods: {
    /**
     * 获取支付配置信息
     */
    async pay() {
      const { data: res } = await this.$http.get('pay');
      if (res.code !== 200) return this.$message.error(res.msg);
      this.payForm = res.data;
    },

    /**
     * 提交
     */
    submit() {
      this.$refs.payFormRef.validate(async valid => {
        // 验证失败返回
        if (!valid) return;
        // 发起请求
        const { data: res } = await this.$http.put('payedit', this.payForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 刷新列表
        this.pay();
      });
    }
  }
};
</script>

<style lang="less" scoped></style>

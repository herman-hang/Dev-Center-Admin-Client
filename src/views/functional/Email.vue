<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>功能配置</el-breadcrumb-item>
      <el-breadcrumb-item>邮件配置</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix"><strong>邮件配置</strong></div>
      <el-form :model="emailForm" :rules="emailFormRules" ref="emailFormRef" label-width="100px">
        <el-form-item label="邮箱" prop="email"><el-input placeholder="请输入邮箱" v-model="emailForm.email"></el-input></el-form-item>
        <el-form-item label="SMTP服务器" prop="stmp"><el-input placeholder="请输入SMTP服务器" v-model="emailForm.stmp"></el-input></el-form-item>
        <el-form-item label="SMTP端口" prop="sll"><el-input placeholder="请输入SMTP端口" v-model="emailForm.sll"></el-input></el-form-item>
        <el-form-item label="邮箱KEY" prop="key"><el-input placeholder="请输入邮箱KEY" v-model="emailForm.key"></el-input></el-form-item>
        <el-form-item label="发送测试邮件" prop="test_email">
          <div class="test-send">
            <el-input placeholder="请输入测试的邮箱" v-model="emailForm.test_email"></el-input>
            <el-button size="small" @click="testSend()">发送测试</el-button>
          </div>
        </el-form-item>
        <!-- 提交按钮 -->
        <el-form-item><el-button type="primary" icon="el-icon-edit" @click="submit">提交</el-button></el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单数据绑定对象
      emailForm: {
        test_email: ''
      },
      // 表单验证规则
      emailFormRules: {}
    };
  },
  created() {
    this.email();
  },
  methods: {
    /**
     * 获取表单数据
     */
    async email() {
      const { data: res } = await this.$http.get('email');
      if (res.code !== 200) return this.$message.error(res.msg);
      this.emailForm = res.data;
    },

    /**
     * 提交
     */
    submit() {
      this.$refs.emailFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put('emailedit', this.emailForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.email();
      });
    },

    /**
     * 测试发送邮件
     */
    async testSend() {
      const { data: res } = await this.$http.post('testemail', this.emailForm);
      if (res.code !== 200) return this.$message.error(res.msg);
      this.$message.success(res.msg);
    }
  }
};
</script>

<style lang="less" scoped>
.test-send {
  display: flex;
  .el-input {
    width: 20%;
    margin-right: 10px;
  }
}
</style>

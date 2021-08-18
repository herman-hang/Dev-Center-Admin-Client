<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix"><strong>修改密码</strong></div>
      <el-form :model="passForm" :rules="passFormRules" ref="passFormRef" label-width="100px">
        <el-form-item label="账号" prop="user"><el-input v-model="passForm.user" disabled></el-input></el-form-item>
        <el-form-item label="原始密码" prop="mpassword"><el-input placeholder="请输入原始密码" type="password" v-model="passForm.mpassword"></el-input></el-form-item>
        <el-form-item label="新密码" prop="password"><el-input placeholder="请输入新密码" type="password" v-model="passForm.password"></el-input></el-form-item>
        <el-form-item label="确认密码" prop="passwords"><el-input placeholder="请输入确认密码" type="password" v-model="passForm.passwords"></el-input></el-form-item>
        <el-form-item><el-button type="primary" icon="el-icon-edit" @click="passEdit">提交</el-button></el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义验证规则
    var validatePasswords = (rule, value, callback) => {
      if (value !== this.passForm.password) {
        callback(new Error('两次输入密码不一致！'));
      } else {
        callback();
      }
    };
    return {
      // 表单绑定的数据对象
      passForm: {},
      // 验证规则
      passFormRules: {
        mpassword: [{ required: true, message: '请输入原始密码', trigger: 'blur' }],
        password: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 6, max: 15, message: '新密码只能是6到15位之间', trigger: 'blur' }],
        passwords: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, max: 15, message: '确认密码只能是6到15位之间', trigger: 'blur' },
          { validator: validatePasswords, trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.pass();
  },
  methods: {
    /**
     * 获取表单数据
     */
    async pass() {
      // 发起请求
      const { data: res } = await this.$http.get('pass');
      if (res.code !== 200) return this.$message.error(res.msg);
      this.passForm = res.data;
    },
    /**
     * 修改表单数据
     */
    passEdit() {
      this.$refs.passFormRef.validate(async valid => {
        if (!valid) return;
        // 发起请求
        const { data: res } = await this.$http.put('passedit', this.passForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 刷新数据
        this.pass();
      });
    }
  }
};
</script>

<style lang="less" scoped></style>

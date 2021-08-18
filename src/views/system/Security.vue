<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>安全配置</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix"><strong>安全配置</strong></div>
      <el-form :model="securityForm" :rules="securityFormRules" ref="securityFormRef" label-width="100px">
        <el-form-item label="允许登录错误" prop="max_logerror">
          <el-input placeholder="请输入允许后台登录错误的最大次数" v-model="securityForm.max_logerror">
            <template slot="append">
              次
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="指定IP地址访问后台" prop="ip"><el-input placeholder="多个ip地址用英文'|'分开" type="textarea" v-model="securityForm.ip"></el-input></el-form-item>
        <el-form-item label="文件存储区域" prop="file_storage">
          <el-radio v-model="securityForm.file_storage" label="0">本地</el-radio>
          <el-radio v-model="securityForm.file_storage" label="1">阿里云</el-radio>
          <el-radio v-model="securityForm.file_storage" label="2">腾讯云</el-radio>
          <el-radio v-model="securityForm.file_storage" label="3">七牛云</el-radio>
        </el-form-item>
        <el-form-item><el-button type="primary" icon="el-icon-edit" @click="securityEdit">提交</el-button></el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单绑定的数据对象
      securityForm: {},
      // 验证规则
      securityFormRules: {}
    };
  },
  created() {
    this.security();
  },
  methods: {
    // 获取表单数据
    async security() {
      const { data: res } = await this.$http.get('security');
      if (res.code !== 200) return this.$message.error(res.msg);
      this.securityForm = res.data;
    },
    // 修改表单数据提交
    securityEdit() {
      this.$refs.securityFormRef.validate(async valid => {
        if (!valid) return;
        // 发起请求
        const { data: res } = await this.$http.put('securityedit', this.securityForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 刷新数据
        this.security();
      });
    }
  }
};
</script>

<style lang="less" scoped></style>

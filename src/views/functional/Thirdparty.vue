<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>功能配置</el-breadcrumb-item>
      <el-breadcrumb-item>第三方登录配置</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix"><strong>第三方登录配置</strong></div>
      <el-form :model="thirdpartyForm" :rules="thirdpartyFormRules" ref="thirdpartyFormRef" label-width="100px">
        <el-tabs v-model="activeName" tab-position="left">
          <el-tab-pane label="QQ登录" name="qq">
            <el-form-item label="QQ appid" prop="qq_appid"><el-input placeholder="请输入QQ appid" v-model="thirdpartyForm.qq_appid"></el-input></el-form-item>
            <el-form-item label="QQ secret" prop="sign_id"><el-input placeholder="请输入QQ secret" v-model="thirdpartyForm.qq_secret"></el-input></el-form-item>
            <!-- 提交按钮 -->
            <el-form-item><el-button type="primary" icon="el-icon-edit" @click="submit">提交</el-button></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="微信登录" name="weixin">
            <el-form-item label="微信appid" prop="wx_appid"><el-input placeholder="请输入微信appid" v-model="thirdpartyForm.wx_appid"></el-input></el-form-item>
            <el-form-item label="微信secret" prop="wx_secret"><el-input placeholder="请输入微信secret" v-model="thirdpartyForm.wx_secret"></el-input></el-form-item>
            <!-- 提交按钮 -->
            <el-form-item><el-button type="primary" icon="el-icon-edit" @click="submit">提交</el-button></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="微博登录" name="weibo">
            <el-form-item label="微博appid" prop="weibo_appid"><el-input placeholder="请输入微博appid" v-model="thirdpartyForm.weibo_appid"></el-input></el-form-item>
            <el-form-item label="微博secret" prop="weibo_secret"><el-input placeholder="请输入微博secret" v-model="thirdpartyForm.weibo_secret"></el-input></el-form-item>
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
      // 标签页默认选中
      activeName: 'qq',
      // 表单绑定数据对象
      thirdpartyForm: {},
      // 表单验证规则
      thirdpartyFormRules: {}
    };
  },
  created() {
    this.thirdparty();
  },
  methods: {
    /**
     * 获取表单数据
     */
    async thirdparty() {
      const { data: res } = await this.$http.get('thirdparty');
      if (res.code !== 200) return this.$message.error(res.msg);
      this.thirdpartyForm = res.data;
    },

    /**
     * 提交
     */
    submit() {
      this.$refs.thirdpartyFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put('thirdpartyedit', this.thirdpartyForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.thirdparty();
      });
    }
  }
};
</script>

<style lang="less" scoped></style>

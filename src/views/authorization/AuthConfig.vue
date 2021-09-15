<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>授权管理</el-breadcrumb-item>
      <el-breadcrumb-item>授权配置</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix"><strong>授权配置</strong></div>
      <el-form :model="authConfigForm" :rules="authConfigRules" ref="authConfigRef" label-width="100px">
        <el-form-item label="铜牌授权费" prop="copper">
          <el-input type="number" placeholder="请输入铜牌授权费" v-model="authConfigForm.copper">
            <template slot="append">
              元
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="铜牌服务内容" prop="copper_server_content">
          <el-input :rows="5" type="textarea" placeholder="请输入铜牌享受的服务内容" v-model="authConfigForm.copper_server_content"></el-input>
        </el-form-item>
        <el-form-item label="银牌授权费" prop="silver">
          <el-input type="number" placeholder="请输入银牌授权费" v-model="authConfigForm.silver">
            <template slot="append">
              元
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="银牌服务内容" prop="silver_server_content">
          <el-input :rows="5" type="textarea" placeholder="请输入银牌享受的服务内容" v-model="authConfigForm.silver_server_content"></el-input>
        </el-form-item>
        <el-form-item label="金牌授权费" prop="gold">
          <el-input type="number" placeholder="请输入金牌授权费" v-model="authConfigForm.gold">
            <template slot="append">
              元
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="金牌服务内容" prop="gold_server_content">
          <el-input :rows="5" type="textarea" placeholder="请输入金牌享受的服务内容" v-model="authConfigForm.gold_server_content"></el-input>
        </el-form-item>
        <el-form-item label="铁牌升级铜牌" prop="iron_copper">
          <el-input type="number" placeholder="请输入铁牌升级铜牌费用" v-model="authConfigForm.iron_copper">
            <template slot="append">
              元
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="铁牌升级银牌" prop="iron_silver">
          <el-input type="number" placeholder="请输入铁牌升级银牌费用" v-model="authConfigForm.iron_silver">
            <template slot="append">
              元
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="铁牌升级金牌" prop="iron_gold">
          <el-input type="number" placeholder="请输入铁牌升级金牌" v-model="authConfigForm.iron_gold">
            <template slot="append">
              元
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="铜牌升级银牌" prop="copper_silver">
          <el-input type="number" placeholder="请输入铜牌升级银牌费用" v-model="authConfigForm.copper_silver">
            <template slot="append">
              元
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="铜牌升级金牌" prop="copper_gold">
          <el-input type="number" placeholder="请输入铜牌升级金牌费用" v-model="authConfigForm.copper_gold">
            <template slot="append">
              元
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="银牌升级金牌" prop="silver_gold">
          <el-input type="number" placeholder="请输入银牌升级金牌费用" v-model="authConfigForm.silver_gold">
            <template slot="append">
              元
            </template>
          </el-input>
        </el-form-item>
        <el-form-item><el-button type="primary" icon="el-icon-edit" @click="authConfigEdit">提交</el-button></el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单数据绑定对象
      authConfigForm: {},
      // 表单数据验证
      authConfigRules: {}
    };
  },
  created() {
    this.authConfig();
  },
  methods: {
    /**
     * 获取配置信息
     */
    async authConfig() {
      const { data: res } = await this.$http.get('authorization/authconfig');
      if (res.code !== 200) return this.$message.error(res.msg);
      this.authConfigForm = res.data;
    },
    /**
     * 配置信息提交
     */
    authConfigEdit() {
      this.$refs.authConfigRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put('authorization/authconfigedit', this.authConfigForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.authConfig();
      });
    }
  }
};
</script>

<style lang="less" scoped></style>

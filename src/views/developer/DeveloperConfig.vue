<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>开发者管理</el-breadcrumb-item>
      <el-breadcrumb-item>开发者配置</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix"><strong>开发者配置</strong></div>
      <el-form :model="developerConfigForm" :rules="developerConfigRules" ref="developerConfigRef" label-width="110px">
        <el-form-item label="申请条件" prop="condition">
          <el-input :rows="5" type="textarea" placeholder="请输入申请开发者条件" v-model="developerConfigForm.condition"></el-input>
        </el-form-item>
        <el-form-item label="铜牌服务费率" prop="copper">
          <el-input type="number" placeholder="请输入铜牌服务费率(单位:%)" v-model="developerConfigForm.copper"></el-input>
        </el-form-item>
        <el-form-item label="银牌服务费率" prop="silver">
          <el-input type="number" placeholder="请输入银牌服务费率(单位:%)" v-model="developerConfigForm.silver"></el-input>
        </el-form-item>
        <el-form-item label="金牌服务费率" prop="gold">
          <el-input type="number" placeholder="请输入金牌服务费率(单位:%)" v-model="developerConfigForm.gold"></el-input>
        </el-form-item>
        <el-form-item label="铜牌升级到银牌需要" prop="copper_silver">
          <el-input type="number" placeholder="请输入铜牌升级银牌需要发布几个应用" v-model="developerConfigForm.copper_silver">
            <template slot="append">
              个应用
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="银牌升级到金牌需要" prop="silver_gold">
          <el-input type="number" placeholder="请输入银牌升级到金牌需要发布几个应用" v-model="developerConfigForm.silver_gold">
            <template slot="append">
              个应用
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="升级方式" prop="is_audit">
          <el-radio-group v-model="developerConfigForm.is_audit">
            <el-radio label="0">手动升级</el-radio>
            <el-radio label="1">自动升级</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item><el-button type="primary" icon="el-icon-edit" @click="developerConfigEdit">提交</el-button></el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表单绑定数据对象
      developerConfigForm: {},
      // 表单验证规则
      developerConfigRules: {
        condition: [{ required: true, message: '请输入开发者申请条件', trigger: 'blur' }],
        copper: [{ required: true, message: '请输入铜牌服务费率', trigger: 'blur' }],
        silver: [{ required: true, message: '请输入银牌服务费率', trigger: 'blur' }],
        gold: [{ required: true, message: '请输入金牌服务费率', trigger: 'blur' }],
        copper_silver: [{ required: true, message: '请输入铜牌升级到银牌需要发布几个应用', trigger: 'blur' }],
        silver_gold: [{ required: true, message: '请输入银牌升级到金牌需要发布几个应用', trigger: 'blur' }],
        is_audit: [{ required: true, message: '请选择升级方式', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.developerConfig();
  },
  methods: {
    /**
     *获取数据
     */
    async developerConfig() {
      const { data: res } = await this.$http.get('developer/developerConfig');
      if (res.code !== 200) return this.$message.error(res.msg);
      this.developerConfigForm = res.data;
    },

    /**
     * 编辑提交
     */
    developerConfigEdit() {
      this.$refs.developerConfigRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put('developer/developerConfigEdit', this.developerConfigForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        this.developerConfig();
      });
    }
  }
};
</script>

<style lang="less" scoped></style>

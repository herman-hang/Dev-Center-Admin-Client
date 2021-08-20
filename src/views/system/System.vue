<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>系统设置</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix"><strong>系统设置</strong></div>
      <el-form :model="systemForm" :rules="systemRules" ref="systemRef" label-width="100px">
        <el-form-item label="网站名称" prop="name"><el-input placeholder="请输入网站名称,一般不超过20字符" v-model="systemForm.name"></el-input></el-form-item>
        <el-form-item label="网站标题" prop="title"><el-input placeholder="请输入网站标题,一般不超过50字符" v-model="systemForm.title"></el-input></el-form-item>
        <el-form-item label="网站描述" prop="description">
          <el-input placeholder="请输入网站描述,一般不超过200字符" type="textarea" v-model="systemForm.description"></el-input>
        </el-form-item>
        <el-form-item label="网站关键词" prop="keywords">
          <el-input placeholder="请输入网站关键词,一般不超过100字符" type="textarea" v-model="systemForm.keywords"></el-input>
        </el-form-item>
        <el-form-item label="网站LOGO" prop="logo">
          <!-- 网站LOGO上传 -->
          <el-upload
            accept=".jpg,.jpeg,.png,.bmp"
            class="avatar-uploader"
            :action="updateUrl"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccessLogo"
            :before-upload="beforeAvatarUpload"
            name="image"
          >
            <img v-if="systemForm.logo" :src="systemForm.logo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="网站ICO" prop="ico">
          <!-- 网站ICO上传 -->
          <el-upload
            accept=".jpg,.jpeg,.png,.bmp"
            class="avatar-uploader"
            :action="updateUrl"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccessIco"
            :before-upload="beforeAvatarUpload"
            name="image"
          >
            <img v-if="systemForm.ico" :src="systemForm.ico" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="网站公众号" prop="tuomaogz">
          <!-- 网站公众号上传 -->
          <el-upload
            accept=".jpg,.jpeg,.png,.bmp"
            class="avatar-uploader"
            :action="updateUrl"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleAvatarSuccessTuomaogz"
            :before-upload="beforeAvatarUpload"
            name="image"
          >
            <img v-if="systemForm.tuomaogz" :src="systemForm.tuomaogz" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="邮箱" prop="email"><el-input placeholder="请输入邮箱" v-model="systemForm.email"></el-input></el-form-item>
        <el-form-item label="QQ群号" prop="usergroup"><el-input placeholder="请输入QQ群号" v-model="systemForm.usergroup"></el-input></el-form-item>
        <el-form-item label="电话" prop="phone"><el-input placeholder="请输入电话" v-model="systemForm.phone"></el-input></el-form-item>
        <el-form-item label="网站开关" prop="is_website">
          <el-select v-model="systemForm.is_website" placeholder="网站开关">
            <el-option label="开启" value="1"></el-option>
            <el-option label="关闭" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备案号" prop="record"><el-input placeholder="请输入备案号" v-model="systemForm.record"></el-input></el-form-item>
        <el-form-item label="地址" prop="address"><el-input placeholder="请输入详细地址" v-model="systemForm.address"></el-input></el-form-item>
        <el-form-item label="底部版权声明" prop="copyright"><el-input placeholder="请输入底部版权声明" v-model="systemForm.copyright"></el-input></el-form-item>
        <el-form-item label="统计代码" prop="statistical"><el-input placeholder="请输入统计代码" type="textarea" v-model="systemForm.statistical"></el-input></el-form-item>
        <el-form-item><el-button type="primary" icon="el-icon-edit" @click="systemEdit">提交</el-button></el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 系统设置绑定的表单对象
      systemForm: {
        name: '',
        title: '',
        description: '',
        keywords: '',
        logo: '',
        ico: '',
        tuomaogz: '',
        email: '',
        usergroup: '',
        phone: '',
        is_website: '1',
        record: '',
        copyright: '',
        statistical: ''
      },
      // 表单验证规则
      systemRules: {
        is_website: [{ required: true, message: '请选择网站开关', trigger: 'blur' }]
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
    this.system();
  },
  methods: {
    /**
     * 获取系统设置数据
     */
    async system() {
      const { data: res } = await this.$http.get('system');
      if (res.code !== 200) return this.$message.error(res.msg);
      this.systemForm = res.data;
    },

    /**
     * 监听修改系统设置数据绑定事件
     */
    systemEdit() {
      this.$refs.systemRef.validate(async valid => {
        if (!valid) return;
        // 发起请求
        const { data: res } = await this.$http.put('systemedit', this.systemForm);
        if (res.code !== 200) return this.$message.error(res.msg);
        this.$message.success(res.msg);
        // 刷新数据
        this.system();
      });
    },

    /**
     * 网站LOGO上传成功时的钩子
     * @param {Object} res 返回数据
     * @param {Object} file 文件对象
     */
    handleAvatarSuccessLogo(res, file) {
      if (res.code !== 200) return this.$message.error(res.msg);
      this.systemForm.logo = res.data[0];
      this.$message.success(res.msg);
    },

    /**
     * 网站ICO上传成功时的钩子
     * @param {Object} res 返回数据
     * @param {Object} file 文件对象
     */
    handleAvatarSuccessIco(res, file) {
      if (res.code !== 200) return this.$message.error(res.msg);
      this.systemForm.ico = res.data[0];
      this.$message.success(res.msg);
    },

    /**
     * 网站公众号上传成功时的钩子
     * @param {Object} res 返回数据
     * @param {Object} file 文件对象
     */
    handleAvatarSuccessTuomaogz(res, file) {
      if (res.code !== 200) return this.$message.error(res.msg);
      this.systemForm.tuomaogz = res.data[0];
      this.$message.success(res.msg);
    },

    /**
     * 上传文件之前的钩子
     * @param {Object} file 上传的文件
     */
    beforeAvatarUpload(file) {
      const isImage = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp' || file.type === 'image/x-icon';
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isImage) {
        this.$message.error('上传的图片只能是 JPG JPEG PNG BMP格式!');
      }
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!');
      }
      return isImage && isLt10M;
    }
  }
};
</script>

<style lang="less" scoped></style>

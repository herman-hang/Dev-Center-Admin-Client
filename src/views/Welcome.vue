<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的桌面</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="top-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="grid-content bg-purple">
              <div class="card-body">
                <div class="icon money"><i class="iconfont icon-money"></i></div>
                <div class="data">
                  <p>
                    总收入:
                    <span>{{ headForm.money_total }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="grid-content bg-purple">
              <div class="card-body">
                <div class="icon developer"><i class="iconfont icon-kaifazheguanli"></i></div>
                <div class="data">
                  <p>
                    开发者:
                    <span>{{ headForm.developer }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="grid-content bg-purple">
              <div class="card-body">
                <div class="icon authorization"><i class="iconfont icon-shouquan"></i></div>
                <div class="data">
                  <p>
                    授权站:
                    <span>{{ headForm.authorization }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="card-body">
              <div class="icon order"><i class="iconfont icon-yonghu"></i></div>
              <div class="data">
                <p>
                  用户量:
                  <span>{{ headForm.user }}</span>
                </p>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="top-card">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card>
            <div slot="header" class="clearfix"><span>每周报表</span></div>
            <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
            <div id="main"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <div slot="header" class="clearfix"><span>我的状态</span></div>
            <div>
              <el-table :data="myStatusData" border style="width: 100%" :show-header="false">
                <el-table-column prop="key" label="key"></el-table-column>
                <el-table-column prop="value" label="value"></el-table-column>
              </el-table>
            </div>
          </el-card>
          <el-card>
            <div slot="header" class="clearfix">
              <span>作者心语</span>
              <el-button @click="blog" class="blog" type="text">个人博客</el-button>
            </div>
            <div class="words">
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;尊重是一种修养，知性而优雅，将人格魅力升华，大爱无声挥洒。尊重两个字看似轻于鸿毛，实则重于泰山。</span>
              <br />
              <span class="inscribe">—— 小航</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="top-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix"><span>消费排行榜</span></div>
            <div>
              <el-table :data="userExpenditureData" border style="width: 100%">
                <el-table-column type="index" label="名次" width="50"></el-table-column>
                <el-table-column prop="id" label="ID" width="50"></el-table-column>
                <el-table-column prop="user" label="用户名" :formatter="stateFormat"></el-table-column>
                <el-table-column prop="expenditure" label="总消费"></el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix"><span>开发者排行榜</span></div>
            <div>
              <el-table :data="developerAppData" border style="width: 100%">
                <el-table-column type="index" label="名次" width="50"></el-table-column>
                <el-table-column prop="id" label="ID" width="50"></el-table-column>
                <el-table-column prop="level" label="等级">
                  <template slot-scope="scope">
                    <span v-if="scope.row.level === '0'">铜牌</span>
                    <span v-else-if="scope.row.level === '1'">银牌</span>
                    <span v-else>金牌</span>
                  </template>
                </el-table-column>
                <el-table-column prop="app_count" label="发布应用"></el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix"><span>应用排行榜</span></div>
            <div>
              <el-table :data="appData" border style="width: 100%">
                <el-table-column type="index" label="名次" width="50"></el-table-column>
                <el-table-column prop="id" label="ID" width="50"></el-table-column>
                <el-table-column prop="name" label="应用名称" :formatter="stateFormat"></el-table-column>
                <el-table-column prop="download" label="下载量"></el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix"><span>新用户注册</span></div>
            <div>
              <el-table :data="newUserData" border style="width: 100%">
                <el-table-column type="index" label="名次" width="50"></el-table-column>
                <el-table-column prop="id" label="ID" width="50"></el-table-column>
                <el-table-column prop="user" label="用户名" width="100" :formatter="stateFormat"></el-table-column>
                <el-table-column prop="create_time" label="注册时间">
                  <template slot-scope="scope">
                    {{ scope.row.create_time | date }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 个人博客对话框 -->
    <el-dialog title="公众号" :visible.sync="blogDialogVisible" center width="20%">
      <div class="blog-body"><img src="../assets/image/blog.jpg" alt="个人博客" width="300" /></div>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import _ from 'lodash';
export default {
  data() {
    return {
      // 初始化个人博客对话框
      blogDialogVisible: false,
      // 我的状态数据绑定
      myStatusData: [],
      // 消费排行榜数据绑定
      userExpenditureData: [],
      // 开发者排行榜
      developerAppData: [],
      // 新用户注册数据绑定
      newUserData: [],
      // 应用排行榜数据绑定
      appData: [],
      // 顶部四大数据栏表单
      headForm: {},
      // 每周报表
      option: {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        }
      }
    };
  },
  created() {
    this.welcome();
  },
  mounted() {
    this.$nextTick(function() {
      this.echarts();
    });
  },
  methods: {
    /**
     * 获取报表数据
     */
    async echarts() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'));
      const { data: res } = await this.$http.get('welcome');
      if (res.code !== 200) return this.$message.error(res.msg);
      // 合并
      const result = _.merge(res.data.option, this.option);
      myChart.setOption(result);
    },

    /**
     * 除报表外的其他数据
     */
    async welcome() {
      const { data: res } = await this.$http.get('welcome');
      if (res.code !== 200) return this.$message.error(res.msg);
      console.log(res);
      // 时间戳转换
      res.data.status[3].value = this.$options.filters.date(res.data.status[3].value);
      // 我的状态数据
      this.myStatusData = res.data.status;
      // 顶部数据四大栏
      this.headForm = res.data.head;
      // 消费者排行榜
      this.userExpenditureData = res.data.buy_money;
      // 新用户注册
      this.newUserData = res.data.new_user;
      // 应用排行榜
      this.appData = res.data.app_download;
      // 开发者排行榜
      this.developerAppData = res.data.developer_data;
    },

    /**
     * 个人博客
     */
    blog() {
      // 显示个人博客对话框
      this.blogDialogVisible = true;
    },

    /**
     * 格式化表格消息内容
     * @param {Object} row
     * @param {Object} column
     * @param {Object} cellValue
     */
    stateFormat(row, column, cellValue) {
      if (!cellValue) return '';
      if (cellValue.length > 9) {
        //最长固定显示9个字符
        return cellValue.slice(0, 9) + '...';
      }
      return cellValue;
    }
  }
};
</script>

<style lang="less" scoped>
.top-card {
  margin-top: 10px;
}
.grid-content {
  width: 400px;
  height: 110px;
  background-color: #fff;
  box-shadow: 0 0 6px #ddd;
}
.card-body {
  display: flex;
  padding: 15px;
}

.icon {
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  position: relative;
  border-radius: 3px;
}
.iconfont {
  font-size: 40px;
}
.data {
  width: 70%;
  margin: 0 10px 0 10px;
  font-size: 20px;
  color: #999;
  p > span {
    font-size: 30px;
    height: 40px;
    color: #575962;
    font-weight: bold;
  }
}
.order {
  background-color: #716aca;
}
.developer {
  background-color: #177dff;
}
.authorization {
  background-color: #67c23a;
}
.money {
  background-color: #409eff;
}
#main {
  width: 1080px;
  height: 400px;
}
.clearfix {
  font-weight: bold;
}
.el-card__header {
  padding: 15px 15px !important;
}
.blog {
  float: right;
  padding: 3px 0;
}
.blog-body {
  text-align: center;
}
.words {
  font-size: 14px;
  color: #606266;
}
.inscribe {
  position: absolute;
  right: 40px;
}
</style>

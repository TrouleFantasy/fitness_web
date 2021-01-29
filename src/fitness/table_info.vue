<template>
  <el-container>
    <el-header>
      <div class="table_top">
        <h3>表数据结构</h3>

      </div>
    </el-header>
    <el-divider></el-divider>
    <el-container class="table_main">
      <el-tabs :tab-position="tabPosition" style="height: 100%;width: 100%;" @tab-click= "tableQuery">
        <!-- 简介页 -->
        <el-tab-pane label="简介" >
          <p>11111111111111</p>
          <p>22222222222222</p>
          <p>33333333333333</p>
          <p>44444444444444</p>
        </el-tab-pane>
        <!-- 表详情页 -->
        <el-tab-pane v-for="(item, i) in leftDataList" :key="i" :label="item" >
          <div v-if="flag" class="main_table_name">
            <h1 style="float:left">{{tableName}}</h1>
          </div>
          <el-table
             v-if="flag"
            :data="tableData"
            style="width: 100%"
            border
            stripe
            >
            <!-- 表详情列表 -->
            <el-table-column v-for="(value,key,index) in tableHeader" :prop="key" :label="value" :key="index"> </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </el-container>
</template>

<script>
  import axios from 'axios'
  export default {
      data() {
        return {
          //表详情列表
          tableData: [],
          //记录所有的表详情列表 key就是表名 value就是表详情列表 表详情列表就是tableData需要的东西
          listAll:{},
          //表标题
          tableName: '',
          //列名
          tableHeader: {},
          //表列表
          leftDataList: [],
          //标签页位置 top/right/bottom/left
          tabPosition: 'left',
          //是否展示此标签页
          flag: false
        }
      },
      created() {
        // this.tableQuery()
        this.mainListQuery()
      },
      methods: {
        mainListQuery() {
          let params = {
            "userCode":"fitnessAdmin"
          }
          axios({
            headers: {
              'token': 'eyJhbGciOiJTSEEyNTZIZXgiLCJ0eXAiOiJKV1QifQ==.eyJleHAiOiIzMjIzMjk4MDAzNjc2IiwiaWF0IjoiMTYxMTY0OTAwMTgzOSIsImp0aSI6ImUyN2QwNGNjYzkiLCJ1c2VyQ29kZSI6ImZpdG5lc3NBZG1pbiJ9.d343b9fce6238ebf874eab0c1889ddec3a3115d53f3e3daa87d866c82ed7bf7a'
            },
            method: 'post',
            url: '/fitnessServer' + '/admin/queryTableList',
            data: params
          }).then(res => {
            this.leftDataList = res.data.data
          })
        },
        tableQuery(item) {
              this.flag = true
              this.tableData = []
              this.tableName = ''
              let dataQuery = {
                "userCode":"fitnessAdmin",
                "keepsake":"王中王的火腿肠",
                // "keepsake": item.value,
                "tableName": item.label
              }
              //判断listAll是否有值,如果有值说明之前调用过,不需要再次调用获取数据,直接赋值给tableDta即可
              if(this.listAll[item.label] !== undefined){
                //赋值给tableData
                this.tableData = this.listAll[item.label]
                //赋值给tableName作为表填展示
                this.tableName = item.label
              }else{
                 axios({
                   headers: {
                     'token': 'eyJhbGciOiJTSEEyNTZIZXgiLCJ0eXAiOiJKV1QifQ==.eyJleHAiOiIzMjIzMjk4MDAzNjc2IiwiaWF0IjoiMTYxMTY0OTAwMTgzOSIsImp0aSI6ImUyN2QwNGNjYzkiLCJ1c2VyQ29kZSI6ImZpdG5lc3NBZG1pbiJ9.d343b9fce6238ebf874eab0c1889ddec3a3115d53f3e3daa87d866c82ed7bf7a'
                   },
                   method: 'post',
                   url: '/fitnessServer' + '/admin/getTableInfo',
                   data: dataQuery
                 }).then(res => {
                   if (res.data.data) {
                     this.tableData = res.data.data.tableBody
                     this.listAll[item.label] = res.data.data.tableBody
                     this.tableName = res.data.data.tableName
                     this.tableHeader= res.data.data.tableHead
                   }

                 }).catch(error => {
                   this.$message.error(error.message)
                 })
              }

        },
      }
   }
</script>

<style>
  #app {
    margin: 0;
    padding: 0;
  }
  .table_commot{
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  .table_commot .table_top {
    width: 100%;
    height: 5%;
    border-bottom: 1px solid #626262;
  }
  .table_commot .table_main {
    width: 100%;
    height: 95%;
    display: flex;
  }
  .table_main .table_main_left {
    width: 10%;
    height: 100%;
  }
  .table_main .table_main_left ul {
    list-style-type: none;
    width: 100%;
    height: 100%;
    line-height: normal;
    text-align: center;
    padding: 0;
    margin: 0;
    border-right: 1px solid #626262;
    cursor: pointer;
  }
  .table_main .table_main_left ul li{
    list-style-type: none;
    line-height: 50px;
    border-bottom: 1px solid #626262;
  }
  .table_main .table_main_right {
    flex: 1;
    width: 90%;
    height: 100%;
    margin-left: 25px;
  }
  .table_main_right .main_table_name {
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: left;
    font-size: 22px;
    margin: 0 0 10px 0;
  }
  .table_main_right .main_table_name h1{
    font-size: 22px;
  }
  .el-table__row:hover > td {
      background-color: #ffffff !important;
  }
  .el-table__row--striped:hover > td {
      background-color: #fafafa !important;
  }
  .el-tabs--left .el-tabs__item.is-left {
    text-align: right;
    height: 75px;
    line-height: 5;
  }
 /* .el-tabs--left .el-tabs__active-bar.is-left, .el-tabs--left .el-tabs__nav-wrap.is-left::after {
    height: 75px;
  } */
</style>

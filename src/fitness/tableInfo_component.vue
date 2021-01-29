<template>
  <div>
    <div class="main_table_name">
      <h1>{{tableName}}</h1>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      stripe
      >
      <el-table-column v-for="(value,key,index) in tableHeader" :prop="key" :label="value"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        tableData: [],
        tableName: '',
        tableHeader: {},
        headerlist: []
      }
    },
    created() {
      this.tableQuery()
      console.log(this.$route,'this.$route.params.name')
    },
    computed:{
      headerName: function () {
        return this.$route.query.tableName
      }
    },
    methods: {
      tableQuery() {
        this.tableData = []
        this.tableName = ''
        let dataQuery = {
          "userCode":"fitnessAdmin",
          "keepsake":"王中王的火腿肠",
          "tableName": this.headerName
        }
        axios({
          headers: {
            'token': 'eyJhbGciOiJTSEEyNTZIZXgiLCJ0eXAiOiJKV1QifQ==.eyJleHAiOiIzMjIzMjk4MDAzNjc2IiwiaWF0IjoiMTYxMTY0OTAwMTgzOSIsImp0aSI6ImUyN2QwNGNjYzkiLCJ1c2VyQ29kZSI6ImZpdG5lc3NBZG1pbiJ9.d343b9fce6238ebf874eab0c1889ddec3a3115d53f3e3daa87d866c82ed7bf7a'
          },
          method: 'post',
          url: '/fitnessServer' + '/admin/getTableInfo',
          data: dataQuery
        }).then(res => {
          this.tableData = res.data.data.tableBody
          if (res.data.data) {
            this.tableName = res.data.data.tableName
            this.tableHeader= res.data.data.tableHead
          }
        })
      },
    }
 }

</script>

<style>
</style>

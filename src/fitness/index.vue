<template>
  <div class="big">
    <div class="title">
      <div id="one">标题栏</div>
      <el-menu :default-active="activeIndex" background-color="" text-color="" active-text-color="chartreuse"
               class="el-menu-demo"
               mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">个人信息</el-menu-item>
        <el-menu-item index="2">训练系统</el-menu-item>
        <el-menu-item index="3">食物计算</el-menu-item>
        <el-menu-item index="4">食物管理</el-menu-item>
      </el-menu>
    </div>
   <div class="main">
     <!-- 菜单栏 -->
     <div v-if="activeIndex==1"><!-- 个人信息 -->
       个人信息
     </div>
     <div v-if="activeIndex==2"><!-- 训练系统 -->
       训练系统
     </div>
     <div v-if="activeIndex==3"><!-- 食物计算 -->
       <foodCalculation class="foodCalculation"></foodCalculation>
     </div>
     <div v-if="activeIndex==4"><!-- 食物管理 -->
       食物管理
     </div>
   </div>
  </div>
</template>

<script>
    import axios from 'axios'
    //导入食物计算页面
    import foodCalculation from './fitnessPage/foodCalculation.vue'
    export default {
      components:{foodCalculation},
        data() {
            return {
                activeIndex: '1',
            }
        },
        created() {

        },
        methods: {
            //在切换菜单时会调用此方法
            handleSelect(key, keyPath) {
                // console.log('nbnbnbnnb',key, keyPath);
                // console.log(this.activeIndex);
                this.activeIndex = key;
            }
        }
    }
</script>

<style lang="scss">
  #app {

    margin: 0px;
    padding: 0px;
  }
  #one {
    width: 100%;
    height: 35px;
    background: lightgreen;
  }
  .big{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
>.title{
  height: 100px;
}
    >.main{
      flex: 1;
      background: rgb(230, 255, 225);
      >div{
        width: 100%;
        height: 700px;
        >.foodCalculation{
          width: 100%;
.is-scrolling-none{
  overflow: auto;
  height: 600px;
}
        }
      }
    }

  }
</style>

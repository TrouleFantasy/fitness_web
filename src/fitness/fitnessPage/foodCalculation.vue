<template>
  <div id="two">
    <div id="two-1">
      <img id="tengtiaoLeft" src="../../assets/tengtiao.png">
      <img id="tengtiaoRight" src="../../assets/tengtiao.png">
      <div id="two-1-1">
        <el-input v-model="foodName" size="small" placeholder="请输入食物名"></el-input>
        <div style="width: 5px;"></div>
        <el-button v-on:click="queryFoodsByName()" size="small" round>查询</el-button>
      </div>
      <hr/>
      <div id="two-1-2">
        <ul id="food_ul">
          <li v-if="disableValue">
            未查找到“{{findValue}}”相关食物。
          </li>
          <li class="food_list" v-for="food in foods">
            <img src="../../assets/IMG_0244.jpg" class="food_list_img" alt="">
            <div>
              <div class="food_list_title">
                {{food.name}}
              </div>
              <div class="food_list_info">
                {{food.name}}
              </div>
            </div>
            <i class="el-icon-circle-plus food_list_icon" v-on:click="addFoodToList(food)"></i>
          </li>
        </ul>
      </div>
    </div>
    <div id="two-2">

<!--      <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">-->
<!--        <el-tab-pane-->
<!--            v-for="(item, index) in editableTabs"-->
<!--            :key="item.name"-->
<!--            :label="item.title"-->
<!--            :name="item.name"-->
<!--        >-->
          <el-table :data="foodCalcList"
                    show-summary
                    style="width: 100%;position: relative">
            <el-table-column prop="name" label="食物名">
            </el-table-column>
            <el-table-column prop="carbohydrate" label="碳水">
            </el-table-column>
            <el-table-column prop="protein" label="蛋白质">
            </el-table-column>
            <el-table-column prop="fat" label="脂肪">
            </el-table-column>
            <el-table-column label="克数">
              <template slot-scope="scope">
                <el-input-number size="mini" v-model="scope.row.weight" @change="weightChange(scope.row)" :min="1"
                                 :max="9999" label="描述文字"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="fiber" label="膳食纤维">
            </el-table-column>
            <el-table-column prop="sodium" label="钠">
            </el-table-column>
            <el-table-column prop="kcal" label="热量(kcal)">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="deleteFood(scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        <div v-if="btnShow"class="btn" style="position:absolute;bottom:160px;right:50px;" >
        <el-button @click="saveRecipes()">
          保存本餐
        </el-button>
        </div>
<!--        </el-tab-pane>-->
<!--      </el-tabs>-->


    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
      data() {
          return {
            btnShow:false,
            editableTabsValue: '2',
            editableTabs: [{
              title: 'Tab 1',
              name: '1',
              content: 'Tab 1 content'
            }, {
              title: 'Tab 2',
              name: '2',
              content: 'Tab 2 content'
            }],
            tabIndex: 2,
              isCollapsed: false,
              backstage: [],
              list: [],
              foods: [],
              foodCalcList: [],
              foodName: '',
              findValue: '',
              disableValue: false,
              foodWeight: 100
          }
      },
      created() {

      },
      methods: {
        saveRecipes(){
          // this.getExel("/fitnessServer/foods/downLoadExcel")
          //     .then(response => {
          //       let a = document.createElement('a');
          //       //ArrayBuffer 转为 Blob
          //       let blob = new Blob([response.data], {type: "application/vnd.ms-excel"});
          //       let objectUrl = URL.createObjectURL(blob);
          //       a.setAttribute("href",objectUrl);
          //       a.setAttribute("download", 'template.xls');
          //       a.click();
          //     });
          axios.post('/fitnessServer/foods/downLoadExcel', {
            'N餐': this.foodCalcList
          }).then((response) => {
            alert("下载成功！")
            let a = document.createElement('a');
                  //ArrayBuffer 转为 Blob
                  let blob = new Blob([response], {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8"});
                  let objectUrl = URL.createObjectURL(blob);
                  a.setAttribute("href",objectUrl);
                  a.setAttribute("download", 'template.xlsx');
                  a.click();
          }).catch((err) => {
            console.log(err);
          })
        },
        getSummaries(param) {
          console.log(param)
          const { columns, data } = param;
          const sums = [];
          columns.forEach((column, index) => {
            if (index === 0) {
              sums[index] = '总计';
              return;
            }
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
             sums[index]= sums[index].toFixed(2)
            } else {
              sums[index] = '';
            }
          });
          return sums;
        },
          queryFoodsByName() { //查询食物
              axios.post('/fitnessServer/foods/queryFoodsByName', {
                  name: this.foodName
              }).then((response) => {
                  this.disableValue = false
                  let foodList = response.data.data
                  if (foodList !== null && foodList !== undefined && foodList.length > 0) {
                      this.foods = foodList
                  } else {
                      this.foods = []
                      this.findValue = this.foodName
                      this.disableValue = true
                  }
              }).catch((err) => {
                  console.log(err);
              })
          },
          addFoodToList(sourceFood) { //将挑选好的食物添加到统计列表中
          this.btnShow=true
              let food = {}
              for (let key in sourceFood) {
                  food[key] = sourceFood[key]
              }
              food['weight'] = this.foodWeight
              this.foodCalcMethod(food)

              this.foodCalcList.push(food)

          },
          deleteFood(food, index) { //删除一行食物
              let sb = this.foodCalcList.findIndex(item => {
                  return item.name == food.name
              })
              if (sb !== -1) {
                  this.foodCalcList.splice(sb, 1)
              }
          },
          foodCalcMethod(food) { //食物数值计算方法
              let kcal = 0
              for (let key in food) {
                  if ('carbohydrate' !== key && key !== 'protein' && key !== 'fat' && key !== 'fiber' && key !== 'sodium') {
                      continue
                  }
                  let value = food[key]
                  if (value == null || value == undefined || value === '' || value === '--') {
                      food[key] = '--'
                  } else {
                      food[key] = (food['weight'] * food[key]).toFixed(2)
                      if (key === 'carbohydrate' || key === 'protein') {
                          kcal += food[key] * 4
                      } else if (key === 'fat') {
                          kcal += food[key] * 9
                      }
                  }
              }
              food['kcal'] = kcal.toFixed(2)
              food['kj']=(kcal*4.1).toFixed(2)
          },
          attributeToOne(food){//将当前对象所有成分设置为每一克
      let kcal = 0
      for (let key in food) {
          if ('carbohydrate' !== key && key !== 'protein' && key !== 'fat' && key !== 'fiber' && key !== 'sodium') {
              continue
          }
          let value = food[key]
          if (value == null || value == undefined || value === '' || value === '--') {

          } else {
              food[key] = food[key] / food['weight']
              if (key === 'carbohydrate' || key === 'protein') {
                  kcal += food[key] * 4
              } else if (key === 'fat') {
                  kcal += food[key] * 9
              }
          }
      }
      food['kcal'] = kcal
      food['kj']=kcal*4.1
      food['weight']=1
  },
          weightChange(listFood) { //一行食物克数的改变
              //获取对应食物模版对象
              let foodMdel = this.foods.find(item => {
                  return item.name == listFood.name
              })
              let food = JSON.parse(JSON.stringify(foodMdel))//深拷贝模版对象赋予food
              food.weight = listFood.weight
              this.foodCalcMethod(food)
              this.foodEQ(listFood,food)
              //找到foodCalcList中对应的对象
              // let index = this.foodCalcList.findIndex(item => {
              //     return item.name == food.name
              // })
              // this.foodCalcList[index] = food
              // console.log("foodMdel", foodMdel)
              // console.log("food", food)
              // console.log("foodCalcList", this.foodCalcList)

              // let food = this.foods[foodMdel]
              // // for (let key in this.foods[foodMdel]) {
              // //   food[key] =  this.foods[foodMdel][key]
              // // }
              // food['weight']=listFood['weight']
              // this.foodCalcMethod(food)
          },
          foodEQ(listFood,food){//将后者的值赋予前者
              listFood.protein=food.protein
              listFood.carbohydrate=food.carbohydrate
              listFood.fat=food.fat
              listFood.fiber=food.fiber
              listFood.sodium=food.sodium
              listFood.kcal=food.kcal
              listFood.kj=food.kj
          }

      }
  }
</script>

<style>
  #tengtiaoRight{
    width: 300px;
    /*border: 1px solid black;*/
    position: absolute;
    top: 160px;
  }
  #tengtiaoLeft{
    width: 300px;
    /*border: 1px solid black;*/
    position: absolute;
    top: 160px;
    left: 0px;
  }
  #food_ul {
    padding: 0px;
    margin: 0px;
  }

  #food_ul li:last-child {
    margin-bottom: 0px;

  }

  .food_list {
    display: flex;
    /* justify-content: center; */
    align-items: center;
    /* border: 1px solid  lightgreen; */
    border-radius: 5px;
    margin-bottom: 5px;
    background: rgba(255, 255, 225, 0.95);
    /*box-shadow: 5px 5px 5px #888888;*/
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    position: relative;
  }

  .food_list_img {
    width: 100px;
    margin-top: 1px;
    margin-left: 2px;
    margin-right: 2px;
    margin-bottom: 1px;
    border-radius: 5px;
  }

  .food_list_title {
    font-size: 15px;
    color: #626262;
  }

  .food_list_info {
    font-size: 1px;
    color: #888888;
  }

  .food_list_icon {
    /*flex: 1;*/
    text-align: right;
    color: #A5FF9B;
    cursor: pointer;
    position: absolute;
    right: 10px;
    /*border: 1px solid lightgreen;*/
  }




  #two {
    margin: 10px 0px 0px 0px;
    padding: 5px 5px 5px 5px;
    width: 99.5%;
    height: 100%;

    /* background: red; */
    display: flex;
  }

  #two-1 {
    width: 25%;
    height: 100%;
    /* background: palevioletred; */
  }

  #two-1-1 {
    /* border: 1px solid  lightgreen; */
    display: flex;
    /* padding-bottom: 7px; */
    /* border-bottom: 1px solid red; */
    /* box-shadow: 5px 15px 10px -15px #888888; */
  }

  #two-1-1 input {
    background: rgba(255, 255, 225, 0);
    box-shadow: 2px 1px 5px #888888;
    border-radius: 20px;
  }

  #two-1-1 button {
    background: rgba(255, 255, 225, 0);
    box-shadow: 2px 1px 5px #888888;
  }

  #two-1-2 {
    /* border: 1px solid  lightgreen; */
    border-radius: 5px;
    margin-top: 10px;
  }

  #two-2 {
    width: 75%;
    height: 100%;
    /* background: palevioletred; */
    margin-left: 10px;
  }

  #three {
    width: 99.5%;
    background: #42B983;
    padding: 5px 5px 5px 5px;
    margin: 10px 0px 0px 0px;
  }

  #three-1 {
    height: 30px;
    width: 100%;
    background: #DB7093;
  }

  #three-2 {
    height: 40px;
    width: 100%;
    background: skyblue;
  }

  #three-3 {
    height: 30px;
    width: 100%;
    background: yellow;

  }

  #three-3 p {
    height: 22px;
    line-height: 22px;

  }

  #three-3-1 {
    position: relative;
    left: 47%;
    top: 9%;
  }

  .table1 {
    table-layout: fixed;
    width: 100%;
    border: 100px;
    border-right: 10px;
  }

  .table1-tr2 {
    text-align: center;
    color: #42B983;
  }

  .input_control {
    -web-kit-appearance: none;
    -moz-appearance: none;
    font-size: 1em;
    text-align: center;
    height: 1em;
    border-radius: 10px;
    border: 1px solid #90EE90;
    color: #42B983;
    outline: 0;
  }

  .button_control {
    border-radius: 10px;
    color: #42B983;
    color: chartreuse;
    border: 1px solid #90EE90;
  }
</style>

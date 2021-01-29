import Vue from "vue"
import Router from "vue-router"
Vue.use(Router);
//引入一级路由
import home from "../App"
import homes from "../fitness/index"



export default new Router({
    routes: [
        {
            path: '/',
            name: 'homes',
            component: homes
        },

    ]
});
import Vue from 'vue'
import VueRouter from 'vue-router'
//Importar los Componentes
import store from '../store/index'
import Categorias from '../components/Categoria.vue';
import Login from '../components/Login.vue';
import HelloWorld from '../components/HelloWorld.vue';

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld,
    meta: {
      admin: true
    }
  },
  {
    path: '/categoria',
    name: 'Categoria',
    component: Categorias,
    meta: {
      admin: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      libre: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.libre)){
    next();
  }
  else if(store.state.token){
    if(to.matched.some(record => record.meta.admin)){
      next();
    }
  }
})

export default router

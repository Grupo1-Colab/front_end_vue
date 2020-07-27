import Vue from 'vue'
import VueRouter from 'vue-router'
//Importar los Componentes
//import Home from '../views/Home.vue';
import Categorias from '../components/Categoria.vue';
import Login from '../components/Login.vue';
import HelloWorld from '../components/HelloWorld.vue';

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld
  },
  {
    path: '/categoria',
    name: 'Categoria',
    component: Categorias
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

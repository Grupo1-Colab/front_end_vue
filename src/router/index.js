import Vue from 'vue'
import VueRouter from 'vue-router'
//Importar los Componentes
import Home from '../views/Home.vue';
import Categorias from '../components/Categoria.vue';
import Login from '../components/Login.vue';

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
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

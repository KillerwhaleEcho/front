


import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import loginin from '../views/loginin.vue';
import chat from '../views/chat.vue';
import own from '../views/own.vue';
import blacklist from '../views/blacklist.vue';
import settings from '../views/settings.vue';

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home, // 替换为你的主页组件
  },
  {
    path: '/',
    name: 'loginin',
    component: loginin, // 替换为你的登录/注册组件
  },
  {
    path: '/chat',
    name: 'chat',
    component: chat, // 替换为你的主页组件
    props: (route) => ({ roomId: route.query.roomId })
  },
  {
    path: '/own',
    name: 'own',
    component: own, // 替换为你的登录/注册组件
  },
  {
    path: '/own/blacklist',
    name: 'blacklist',
    component: blacklist, // 替换为你的登录/注册组件
  },
  {
    path: '/own/settings',
    name: 'settings',
    component: settings, // 替换为你的登录/注册组件
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

 export default router;
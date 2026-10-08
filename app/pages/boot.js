import { createApp } from "vue";
// 引入elementUI
import ElementUI from "element-plus";
import "element-plus/theme-chalk/index.css";

import "./assets/custom.css";

// 引入pinia
import pinia from "$store";

import { createRouter, createWebHashHistory } from "vue-router";

/**
 * vue页面主入口，用于启动vue
 * @params pageComponent vue入口组件
 * @params routes 路由列表
 * @params libs 页面依赖的第三方包
 */
export default (pageComponent, { routes, libs } = {}) => {
  const app = createApp(pageComponent);
  // 应用elementUI
  app.use(ElementUI);

  // 应用pinia
  app.use(pinia);

  // 引入第三方包
  if (libs && libs.length > 0) {
    for (let i = 0; i < libs.length; i++) {
      app.use(libs[i]);
    }
  }

  if (!routes) {
    app.mount("#root");
    return;
  }

  // 页面路由
  const router = createRouter({
    history: createWebHashHistory(), // 采用hash模式
    routes,
  });
  app.use(router);
  router.isReay().then(() => {
    app.mount("#root");
  });
};

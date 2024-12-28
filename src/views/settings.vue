<template>
    <div class="home5-container">
      <!-- 顶栏 -->
      <div class="topbar5">
        <div class="topbar5-content">
          <span class="topbar5-title">StarBBPark</span>
          <div class="topbar5-links">
            <a href="http://192.168.142.166:5173/home" class="topbar5-link">首页社区</a>
            <a href="http://192.168.142.166:5173/chat" class="topbar5-link">消息</a>
            <a href="http://192.168.142.166:5173/own" class="topbar5-link1">个人中心</a>
          </div>
        </div>
      </div>
  
      <!-- 页面主体内容 -->
      <div class="home5-content">
        <!-- 左侧边栏选择 -->
        <div class="func-choose5">
          <a href="http://192.168.142.166:5173/own" class="self-info5">个人信息</a>
          <hr>
          <a href="http://192.168.142.166:5173/own/blacklist" class="blacklist5">黑名单</a>
          <hr>
          <a href="http://192.168.142.166:5173/own/settings" class="setting5">设置</a>
        </div>

        <!-- 右侧设置容器 -->
         <div class="setting-container">
          <button>注销账号</button>
          <button>退出账号</button>
         </div>

      </div>
    </div>
  </template>
  
  <script setup>
  // 你可以在这里添加任何需要的 Vue 逻辑
  </script>
  
<style lang="scss">
  .home5-container {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #fbfcfc; /* 背景色保持一致 */
  }
  /* 顶栏样式 */
  .topbar5 {
    background-color: rgb(83, 135, 124); /* 与 card 颜色一致 */
    padding: 15px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between; /* 左右对齐 */
    align-items: center;
  }

  .topbar5-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .topbar5-title {
    font-size: 24px;
    color: white;
    font-weight: bold;
  }

  .topbar5-links {
    display: flex;
    gap: 20px;
  }

  .topbar5-link1 {
    font-size: 20 px;
    color: white;
    text-decoration: none;
    font-weight: normal;
    transition: color 0.3s;

    &:hover {
      color: #24d97f; /* 鼠标悬停时的颜色 */
    }
  }

  .topbar5-link {
    font-size: 16px;
    color: white;
    text-decoration: none;
    font-weight: normal;
    transition: color 0.3s;

    &:hover {
      color: #24d97f; /* 鼠标悬停时的颜色 */
    }
  }

  /* 页面主体内容 */
  .home5-content {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1; /* 让 content 填充剩余空间 */
    //padding: 20px;
    height: 100vh; /* 使页面高度填充视口 */
  }

  .func-choose5 {
    position: absolute;
    width: 250px; /* 设置左侧侧边栏的宽度 */
    background-color: #87aca2; /* 设置侧边栏背景颜色 */
    box-sizing: border-box; /* 包括内边距和边框 */
    display: flex;
    height: 100%;
    flex-direction: column; /* 垂直排列 */
    //gap: 15px; /* 设置每个项之间的间距 */
  }

  .setting5{
    font-size: 25px;
    text-align: right;
  }

  .func-choose5 a {
    justify-content: center;
    align-items: center;
    background-color: #d9ede0; /* 设置项的背景色 */
    padding: 12px;
    //font-size: 20px;
    text-decoration: none;
    color: white;
    font-weight: bold;
    cursor: pointer; /* 鼠标悬停时显示为指针 */
    transition: background-color 0.3s ease; /* 设置背景色过渡效果 */
  }

  .func-choose5 a:hover {
    background-color: #e0e0e0; /* 鼠标悬停时背景色变浅 */
  }

  .setting-container {
    position: absolute; /* 将容器设置为绝对定位，位置相对于最近的定位父元素或页面。 */
    display: flex; /* 使用 Flexbox 布局，便于子元素排列和对齐。 */
    flex-direction: column; /* 子元素排列方向为列（垂直方向）。 */
    border: 3px double #87aca2; /* 设置一个双线样式的边框，宽度为 3px，颜色为浅青绿色 (#87aca2)。 */
    padding: 20px; /* 设置容器内边距（padding），确保内容与边框有一定距离。 */
    background-color: #fbfcfc; /* 设置容器的背景色为浅灰白色 (#fbfcfc)。 */
    margin: 40px 50px 50px 300px; /* 设置外边距（margin），分别为上 40px、右 50px、下 50px、左 300px。 */
    float: right; /* 浮动布局，容器浮动到右侧（可能影响其他元素的布局）。 */
    border-radius: 8px; /* 设置边框圆角为 8px，容器更圆润。 */
    height: 70%; /* 容器的高度为父元素的 70%。 */
    width: 70%; /* 容器的宽度为父元素的 70%。 */
    gap:20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 添加一个阴影，偏移量为 4px（垂直）和 6px（模糊），颜色为半透明黑色。 */
  }


  .setting-container button{
    background-color: #87aca2;
    width: 100px;
    padding: 5px 10px;
    font-size: 14px;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
    font-size: 16px;
    }
  }


</style>
  
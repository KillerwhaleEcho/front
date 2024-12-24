<template>
    <div class="home4-container">
      <!-- 顶栏 -->
      <div class="topbar4">
        <div class="topbar4-content">
          <span class="topbar4-title">StarBBPark</span>
          <div class="topbar4-links">
            <a href="http://localhost:5173/home" class="topbar4-link">首页社区</a>
            <a href="http://localhost:5173/chat" class="topbar4-link">消息</a>
            <a href="http://localhost:5173/own" class="topbar4-link1">个人中心</a>
          </div>
        </div>
      </div>
  
      <!-- 页面主体内容 -->
      <div class="home4-content">
        <!-- 左侧边栏选择 -->
        <div class="func-choose4">
          <a href="http://localhost:5173/own" class="self-info4">个人信息</a>
          <hr>
          <a href="http://localhost:5173/own/blacklist" class="blacklist4">黑名单</a>
          <!-- <hr>
          <a href="http://localhost:5173/own/settings" class="setting4">设置</a> -->
        </div>

        <!-- 右侧黑名单列表 -->
         <div class="list-container">
          <div class="list-user1">
            <div class="blackusercontainer" v-for="(user, index) in blacklist" :key="index">
              <!-- 用户头像 -->
              <img :src="user.userAvater" alt="用户头像" class="blackuserAvatar">
              <div class="balck-userNameandbutton">
                  <div class="blackuserName">
                    <div class="w">{{ user.userName }}</div>
                    <div class="w"> {{ user.userId }}</div>
                  </div>
                  <button class="movebtn" @click="moveBlacklist(user)">移出黑名单</button>
              </div>
            </div>
          </div>
         </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { onMounted } from 'vue';

  // 你可以在这里添加任何需要的 Vue 逻辑
  const blacklist = ref([]);
  const currentUserId = ref(null);
  const token = ref(null);

  const moveBlacklist=async (user) => {
    try {
      const response =await axios.post(`https://9b5ce24c-fbae-47e3-bd54-f5b6e28c076e.mock.pstmn.io/moveBlacklist`,{
        headers: {
          'Authorization': `Bearer ${token}`
        },
        userId:user.userId
      });
      console.log("删除黑名单成员成功",response.data);
    } catch (error) {
      console.error('删除黑名单成员失败', error);
    }
  };

  onMounted(async () => {
  try {
    currentUserId.value = localStorage.getItem('currentUserId');
    token.value = localStorage.getItem('token');
    // 从后端获取用户数据
    const response = await axios.get('https://9b5ce24c-fbae-47e3-bd54-f5b6e28c076e.mock.pstmn.io/getBlacklist', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    blacklist.value = response.data.users;
    console.log("黑名单加载成功", response.data.users);
    }
    catch (error) {
      console.error('黑名单加载失败', error);
    }
});
  </script>
  
<style lang="scss">
  .home4-container {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #fbfcfc; /* 背景色保持一致 */
  }
  /* 顶栏样式 */
  .topbar4 {
    background-color: rgb(83, 135, 124); /* 与 card 颜色一致 */
    padding: 15px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between; /* 左右对齐 */
    align-items: center;
  }

  .topbar4-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .topbar4-title {
    font-size: 24px;
    color: white;
    font-weight: bold;
  }

  .topbar4-links {
    display: flex;
    gap: 20px;
  }

  .topbar4-link1 {
    font-size: 20 px;
    color: white;
    text-decoration: none;
    font-weight: normal;
    transition: color 0.3s;

    &:hover {
      color: #24d97f; /* 鼠标悬停时的颜色 */
    }
  }

  .topbar4-link {
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
  .home4-content {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1; /* 让 content 填充剩余空间 */
    //padding: 20px;
    height: 100vh; /* 使页面高度填充视口 */
  }

  .func-choose4 {
    position: absolute;
    width: 250px; /* 设置左侧侧边栏的宽度 */
    background-color: #87aca2; /* 设置侧边栏背景颜色 */
    box-sizing: border-box; /* 包括内边距和边框 */
    display: flex;
    height: 100%;
    flex-direction: column; /* 垂直排列 */
    //gap: 15px; /* 设置每个项之间的间距 */
  }

  .blacklist4{
    font-size: 25px;
    text-align: right;
  }

  .func-choose4 a {
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

  .func-choose4 a:hover {
    background-color: #e0e0e0; /* 鼠标悬停时背景色变浅 */
  }

  .list-container {
    position: absolute;
    border: 3px double #87aca2;
    padding: 20px;
    background-color: #fbfcfc;
    margin: 40px 50px 50px 300px;
    float: right;
    //border-radius: 8px;
    height: 85%;
    width: 70%;
    box-shadow: 0 4px 6px rgba(18, 12, 12, 0.1);
  }

  .blackusercontainer{
    width: 100%;
    height: 80px;
    border-radius: 8px;
    background-color: rgb(249, 250, 250);
    padding: 10px;
    text-align: center;
    display: flex;
    flex-direction:row ;
    gap:20px;
  }

  .blackuserAvatar{
    width: 60px;
    height: 60px;
  }
  
  .balck-userNameandbutton{
    width: 940px;
    display: flex;
    justify-content: space-between;
  }

  .blackuserName{
    margin-bottom: 5px;
    display: flex;
    flex-direction: column;
    gap:10px;
  }
  .w{
    font-weight: bold;
    font-size: 16px;
  }

  .movebtn{
    background-color: white;
    width: 100px;
    padding: 5px 10px;
    font-size: 14px;
    color: #87aca2;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover{
      background-color: #ededed;
    }
  }


</style>
  
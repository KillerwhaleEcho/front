<template>
    <div class="home4-container">
      <!-- 顶栏 -->
      <div class="topbar4">
        <div class="topbar4-content">
          <span class="topbar4-title">StarBBPark</span>
          <div class="topbar4-links">
            <router-link to="/home" class="topbar4-link">首页社区</router-link>
            <router-link to="/chat" class="topbar4-link">消息</router-link>
            <router-link to="/own" class="topbar4-link1">个人中心</router-link>              
          </div>
        </div>
      </div>
  
      <!-- 页面主体内容 -->
      <div class="home4-content">
        <div class="func-choose4">
          <router-link to="/own" class="self-info4">个人信息</router-link>
          <hr>
          <router-link to="/own/blacklist" class="blacklist4">黑名单</router-link>
        </div>

        <!-- 右侧黑名单列表 -->
         <div class="list-container">
          <div class="list-user1">
            <div class="blackusercontainer" v-for="(user, index) in blacklist" :key="index">
              <img :src="user.other.avatar" alt="用户头像" class="blackuserAvatar">
              <div class="black-userNameandbutton">
                  <div class="blackuserName">
                    <div class="w">{{ user.other.username }}</div>
                    <div class="w"> {{ user.other.userid }}</div>
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

  const blacklist = ref([]);

  const moveBlacklist=async (user) => {
    try {
      const token = localStorage.getItem('token'); 
      const response =await axios.post(`http://192.168.142.166:8084/api/users/removeblacklist`,{
      "userId":user.other.userid},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log("删除黑名单成员成功",response.data);
      alert('移出黑名单成功');
      window.location.reload();
    } catch (error) {
      console.error('删除黑名单成员失败', error);
      alert('移出黑名单失败');
    }
  };

  onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    // 从后端获取用户数据
    const response = await axios.get('http://192.168.142.166:8084/api/users/getblacklist', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    blacklist.value = response.data.data;
    console.log("黑名单加载成功", response.data);
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
    background-color: #fbfcfc; 
  }
  .topbar4 {
    background-color: rgb(83, 135, 124); 
    padding: 15px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between; 
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
      color: #24d97f;
    }
  }

  .topbar4-link {
    font-size: 16px;
    color: white;
    text-decoration: none;
    font-weight: normal;
    transition: color 0.3s;

    &:hover {
      color: #24d97f;
    }
  }

  /* 页面主体内容 */
  .home4-content {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1; 
    //padding: 20px;
    height: 100vh; 
  }

  .func-choose4 {
    position: absolute;
    width: 250px;
    background-color: #87aca2; 
    box-sizing: border-box; 
    display: flex;
    height: 100%;
    flex-direction: column;
  }

  .blacklist4{
    font-size: 25px;
    text-align: right;
  }

  .func-choose4 a {
    justify-content: center;
    align-items: center;
    background-color: #d9ede0; 
    padding: 12px;
    //font-size: 20px;
    text-decoration: none;
    color: white;
    font-weight: bold;
    cursor: pointer; 
    transition: background-color 0.3s ease; 
  }

  .func-choose4 a:hover {
    background-color: #e0e0e0; 
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
  
  .black-userNameandbutton{
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
  
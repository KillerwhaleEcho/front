<template>
  <div class="login-container">
      <!-- 顶栏 -->
      <div class="topbar">
          <div class="topbar-content">
              <span class="topbar-title">StarBBPark</span>
          </div>
      </div>

      <!-- 登录注册成功/失败提示 -->
    <div v-if="message" class="message-box">
      <div :class="message.type">{{ message.text }}</div>
    </div>

      <div class="slider">
      <!-- 登录表单 -->
      <div :class="active == 1 ? 'form' : 'form hidden'">
        <div class="title">欢迎 <b>回来</b></div>
        <div class="subtitle">登录你的账户</div>
        <div class="inputf">
          <input type="text" v-model="loginuserName" placeholder="账号" />
          <span class="label">帐号</span>
        </div>
        <div class="inputf">
          <input type="password" v-model="loginPassword" placeholder="密码" />
          <span class="label">密码</span>
        </div>
        <button @click="login">登录</button>

      </div>

      <!-- 注册表单 -->
      <div :class="active == 2 ? 'form' : 'form hidden'">
        <div class="title">开始 </div>
        <div class="subtitle">注册你的账户</div>
        <div class="inputf">
          <input type="text" v-model="inputUsername" placeholder="用户名" />
          <span class="label">用户名</span>
        </div>
        <!-- <div class="inputf">
          <input type="text" v-model="inputId" placeholder="账号" />
          <span class="label">帐号</span>
        </div> -->
        <div class="inputf">
          <input type="password" v-model="inputPassword" placeholder="密码" />
          <span class="label">密码</span>
        </div>
        <button @click="register">注册</button>
      </div>

      <!-- 其他内容 -->
      <div :class="active == 1 ? 'card' : 'card active'">
        <div class="head">
          <div class="name">StarBBPark</div>
        </div>
        <div class="desc">
          根据你的兴趣标签，快速加入专属房间，遇见志同道合的朋友。
          这里，每个房间都是一个小世界，找到与你灵魂契合的人，分享话题、交流心得，拓展你的人际圈，开启更有趣的社交旅程！
        </div>
        <div class="btn">
          <button @click="toggleForm">{{ active == 1 ? '去注册' : '去登陆' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 
import axios from 'axios';
const router = useRouter();


const active = ref(1); // 控制表单的切换
const inputUsername = ref(""); 
const inputId = ref(null); 
const inputPassword = ref(""); 
const loginuserName = ref(null); 
const loginPassword = ref(""); 

const message = ref(null); 


// 切换表单显示
const toggleForm = () => {
active.value = active.value == 1 ? 2 : 1;
};


const showMessage = (text, type) => {
  message.value = { text, type };
  setTimeout(() => {
    message.value = null;
  }, 2000);
};

const register = async () => {
  try {
    const response = await axios.post('http://localhost:8084/api/users/register', {
      username: inputUsername.value,
      password: inputPassword.value,
    });
    console.log('注册成功:', response.data);
    showMessage("注册成功", "success");
    // 改为切换到登录卡片，即将active设置为1
    active.value = 1;;
    inputUsername.value = "";
    inputId.value = "";
    inputPassword.value = "";
  } 
  catch (error) {
    console.log('注册失败');
    showMessage("注册失败", "error");
  }
};

// 登录请求
const login = async () => {
  try {
    const response = await axios.post('http://localhost:8084/api/users/login', {
      username: loginuserName.value,
      password: loginPassword.value,
    });
    console.log('登录成功:', response.data);
    showMessage("登录成功", "success");
    localStorage.setItem('token', response.data.data);
    console.log("token", response.data.data);
    console.log("登录用户名：",loginuserName.value);
    loginuserName.value = "";
    loginPassword.value = "";
    router.push('/home');

  } 
  catch (error) {
    console.log('登录失败:', error.response ? error.response.data : error.message);
    showMessage("登录失败", "error");
  }
};
</script>


<style lang="scss">
.login-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #62A89B;

.topbar {
  background-color: rgba(78, 124, 114, 0.75); 
  padding: 15px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-start;
  align-items:center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}

.topbar-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.topbar-title {
  font-size: 24px;
  color: white;
  font-weight: bold;
}

.message-box {
    position: fixed;
    top: 60px; 
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    z-index: 999;
    .success {
      background-color: #4CAF50;
      color: white;
      text-align: center;
      padding: 10px;
      border-radius: 5px;
      font-weight: bold;
    }
    .error {
      background-color: #F44336;
      color: white;
      text-align: center;
      padding: 10px;
      border-radius: 5px;
      font-weight: bold;
    }
  }


  .slider{
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      .form{
      width: 400px;
          height: 500px;
          background: rgba($color: #4E7C72, $alpha: 0.75);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, $alpha: 0.15);
          padding: 40px 60px;
          box-shadow: rgba(50, 50, 93, $alpha: 0.25) 50px 50px 100px -20px,
              rgba(0, 0, 0, $alpha: 0.5) 30px 30px 60px -30px,
              rgba(212, 217, 222, $alpha: 0.35) 2px -2px 6px 0px inset;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: flex-start;
          margin: 0 10px;
          z-index: 3;
          transition: 0.5s ease-in-out;

          &.hidden{
              height: 395px;
              box-shadow: none;
              z-index: 1;
          }
      
          .title {
              font-size: 18px;
              color: rgb(246, 240, 255);
              letter-spacing: 1px;
              font-weight: 300;
          }
      
          .subtitle {
              font-size: 11px;
              color: rgb(246, 240, 255);
              letter-spacing: 1px;
              margin-bottom: 35px;
          }
      
          .inputf {
              width: 100%;
              position: relative;
              margin-bottom: 35px;
      
              input {
                  width: 100%;
                  height: 35px;
                  border: none;
                  outline: 1.5px solid rgb(200, 200, 220);
                  background: transparent;
                  border-radius: 8px;
                  font-size: 12px;
                  padding: 0 15px;
                  color: rgb(246, 249, 255);
      
                  &::placeholder {
                      color: rgb(175, 180, 190)
                  }
      
                  &:focus {
                      outline: 1.5px solid rgb(224, 229, 240);
      
                      &::placeholder {
                          opacity: 0;
                      }
      
                      &+.label {
                          opacity: 1;
                          top: -20px;
                      }
                  }
      
                  &:not(:placeholder-shown)+.label {
                      opacity: 1;
                      top: -20px;
                  }
              }
      
              .label {
                  position: absolute;
                  top: 0;
                  left: 0;
                  color: rgb(246, 249, 255);
                  font-size: 11px;
                  font-weight: bold;
                  transition: 0.25 ease-out;
                  opacity: 0;
              }
          }
      
          button {
              width: 100%;
              height: 35px;
              background: rgb(36, 217, 127);
              color: #ffffff;
              border: none;
              outline: none;
              border-radius: 5px;
              font-weight: bold;
              font-size: 12px;
              cursor: pointer;

              &:hover{
                font-size:14px;
              }
          }
      }
      
      .card {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translate(0, -50%);
          width: 430px;
          height: 400px;
          background-color: #ffffff;
          background-size: contain;
          padding: 40px;
          border-radius: 0 10px 10px 0;
          transition:0.5s ease-in-out ;
          z-index: 2;
          &.active{
              right: calc(100% - 440px);
              border-radius: 10px 0 0 10px;
          }
          .head{
              font-size: 35px;
              margin-bottom: 35px;
              .name{
                  font-weight: 300;
                  span{
                      color:rgb(36,217,127);
                      font-weight: bold;
                  }
              }
          }
          .desc{
              font-size: 14px;
              text-align: justify;
              margin-bottom: 35px;
          }
          .btn{
              font-size: 14px;
              button{
                  background: rgb(36, 217, 127);
                  font-size:14px;
                  padding: 5px 15px;
                  border:none;
                  outline: none;
                  border-radius: 5px;
                  cursor: pointer;
                  margin-left: 10px;
              }

              &:hover{
                font-size:14px;
              }
          }

          .success-message {
            margin-top: 10px;
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            font-weight: bold;
            text-align: center;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            font-size: 14px;
            z-index: 1000; 
          }
      }
  }
}

</style>
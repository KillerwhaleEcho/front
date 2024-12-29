<template>
  <div class="home3-container">
    <!-- 顶栏 -->
    <div class="topbar3">
      <div class="topbar3-content">
        <span class="topbar3-title">StarBBPark</span>
        <div class="topbar3-links">
          <router-link to="/home" class="topbar3-link">首页社区</router-link>
          <router-link to="/chat" class="topbar3-link">消息</router-link>
          <router-link to="/own" class="topbar3-link1">个人中心</router-link>
        </div>
      </div>
    </div>

    <!-- 页面主体内容 -->
    <div class="home3-content">
      <!-- 左侧边栏选择 -->
      <div class="func-choose">
        <router-link to="/own" class="self-info">个人信息</router-link>
        <hr>
        <router-link to="/own/blacklist" class="blacklist">黑名单</router-link>
      </div>

      <!-- 右边主体内容 -->
      <div class="profile-box">
        <div class="locate">
          <div class="avatar-section">
            <img :src="currentUserAvatar" alt="头像" class="avatar">
            <button class="edit-avatar" @click="showEditAvatarModal = true">修改头像</button>
          </div>
          <div class="user-info">
            <div class="userNameArea">
              <strong>用户名：</strong>
              <span>{{ currentUserName }}</span>
              <button class="edit-avatar" @click="showEditUsernameModal = true">修改用户名</button>
            </div>
            <br>
            <div>
              <strong>用户id：</strong>
              <span>{{ currentUserId }}</span>
            </div>
            <br>
            <div>
              <strong>密码</strong>
              <button class="edit-avatar" @click="showEditPasswordModal = true">修改密码</button>
            </div>
            <div class="setting-count">
              <!-- <button class="edit-avatar" @click="showdeleteModal=true">注销账号</button> -->
              <button class="edit-avatar" @click="showsignoutModal=true">退出账号</button>
            </div>
          </div>
        </div>
        <!-- 修改头像弹窗 -->
        <div v-if="showEditAvatarModal" class="modal-overlay999">
          <div class="modal-content999">
            <h3>修改头像</h3>
            <!-- 房间头像 -->
            <div class="avatar-section">
              <img v-if="tempAvatar" :src="tempAvatar" alt="头像" class="avatar999">
              <img v-else :src="currentUserAvatar" alt="头像" class="avatar999">
            </div>
            <button class="btn" @click="showPictureModal=true">选择头像</button>
            <!-- 按钮 -->
            <div class="modal-buttons999">
              <button class="edit-avatar" @click="uploadAvatar">确认</button>
              <button class="edit-avatar" @click="showEditAvatarModal = false">取消</button>
            </div>
          </div>
        </div>
        <!-- 修改用户名弹窗 -->
        <div v-if="showEditUsernameModal" class="modal-overlay999">
          <div class="modal-content999">
            <h3>修改用户名</h3>
            <input type="text" v-model="newUsername" placeholder="请输入新用户名" />
            <button class="edit-avatar" @click="saveNewUsername">确认</button>
            <button class="edit-avatar" @click="showEditUsernameModal = false">取消</button>
          </div>
        </div>
        <!-- 修改密码弹窗 -->
        <div v-if="showEditPasswordModal" class="modal-overlay999">
          <div class="modal-content999">
            <h3>修改密码</h3>
            <input type="password" v-model="newPassword" placeholder="请输入新密码" />
            <input type="password" v-model="confirmPassword" placeholder="请确认新密码" />
            <button class="edit-avatar" @click="saveNewPassword">确认</button>
            <button class="edit-avatar" @click="showEditPasswordModal = false">取消</button>
          </div>
        </div>
        <!-- 消息确认弹窗 -->
        <div v-if="showdeleteModal" class="modal-overlay999">
          <div class="modal-content999">
            <div class="makesure">
              <h3>确定要注销账号吗？</h3>
              <div class="makesure-btn">
                <button class="edit-avatar" @click="deleteAccount">确认</button>
                <button class="edit-avatar" @click="showdeleteModal = false">取消</button>
              </div>
            </div>
          </div>
        </div> 
        <div v-if="showsignoutModal" class="modal-overlay999">
          <div class="modal-content999">
            <div class="makesure">
              <h3>确定要退出账号吗？</h3>
              <div class="makesure-btn">
                <button class="edit-avatar" @click="signoutAccount">确认</button>
                <button class="edit-avatar" @click="showsignoutModal = false">取消</button>
              </div>
            </div>
          </div>
        </div> 
        <!-- 图片选择弹窗 -->
      <div v-if="showPictureModal" class="modal-overlay4">
        <div class="modal-content4">
          <h3>选择头像</h3>
          <div class="picture-container">
            <div class="picture-choose" v-for="(pic, index) in Avatar" :key="index">
              <img :src="pic" alt="用户头像" class="avatarchoose" @click="chooseAvatar(pic)">
            </div>
          </div>
          <button class="modal-close" @click="showPictureModal = false">关闭</button>
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
import { useRouter } from 'vue-router';


const router = useRouter();
const currentUserAvatar = ref('');
const currentUserName = ref('');
const currentUserId = ref('');
const currentRoomId= ref('');
const password = ref('');
const showEditAvatarModal = ref(false);
const showEditUsernameModal = ref(false);
const showEditPasswordModal = ref(false);
const showdeleteModal = ref(false);
const showsignoutModal = ref(false);
const showPictureModal=ref(false);
const newUsername = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const token=ref(null);
const tempAvatar =ref(null);
const defaultAvatar = "/images/ENFP-竞选者.png";
const Avatar = [
  "/images/ENFJ-执政官.png",
  "/images/ENFJ-主人公.png",
  "/images/ENFP-竞选者.png",
  "/images/ENTJ-指挥官.png",
  "/images/ENTP-辩论家.png",
  "/images/ESFP-表演者.png",
  "/images/ESTJ-总经理.png",
  "/images/ESTP-企业家.png",
  "/images/INFJ-提倡者.png",
  "/images/INFP-调停者.png",
  "/images/INTJ-建筑师.png",
  "/images/INTP-逻辑学家.png",
  "/images/ISFJ-守卫者.png",
  "/images/ISFP-探险家.png",
  "/images/ISTJ-物流师.png",
  "/images/ISTP-鉴赏家.png"
]

onMounted(async () => {
  try {
    currentRoomId.value = localStorage.getItem('currentRoomId');
    currentUserId.value = localStorage.getItem('currentUserId');
    const token = localStorage.getItem('token');  
    const response = await axios.post('http://192.168.142.166:8084/api/users/own', {
    }, {  
        headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if(response.data.data.avatar==null){
      currentUserAvatar.value =defaultAvatar;
      console.log("加载默认头像",defaultAvatar);
    }else{
      currentUserAvatar.value = response.data.data.avatar;
    }
    currentUserName.value = response.data.data.username;
    currentUserId.value = response.data.data.userid;
    }
    catch (error) {
      console.error('获取own信息失败', error);
    }

});

const chooseAvatar=async(pic)=>{
  showPictureModal.value=false;
  tempAvatar.value=pic;
}

const uploadAvatar = async() => {
  try {
    const token = localStorage.getItem('token');  
      const response = await axios.post('http://192.168.142.166:8084/api/users/upload-avatar', {
        avatar:tempAvatar.value
      }, {  
        headers: {
        'Authorization': `Bearer ${token}`
      }
      });
      if (response.status === 200) {
        currentUserAvatar.value = tempAvatar.value;
        console.log(response.data);
        console.log('头像上传成功');
        showEditAvatarModal.value = false;
        tempAvatar.value="";
      }
    } catch (error) {
      console.error('头像上传失败', error);
    }
}

// 保存新用户名
const saveNewUsername = async () => {
  if (newUsername.value) {
    console.log("尝试保存的用户名:", newUsername.value);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://192.168.142.166:8084/api/users/upload-username', {
        username: newUsername.value,
      }, {  
        headers: {
        'Authorization': `Bearer ${token}`
      }
      });
      if (response.status === 200) {
        currentUserName.value = newUsername.value;
        console.log("name", currentUserName.value);
        console.log(response.data);
        console.log('用户名修改成功');
        showEditUsernameModal.value = false;
        router.push('/');
      }
    } catch (error) {
      console.error('用户名修改失败', error);
    }
    newUsername.value = '';
  }
};

// 保存新密码
const saveNewPassword = async () => {
  if (newPassword.value && newPassword.value === confirmPassword.value) {
    try {
      const token = localStorage.getItem('token');  
      const response = await axios.post('http://192.168.142.166:8084/api/users/update-password', {
        password: newPassword.value,
      }, {  
        headers: {
        'Authorization': `Bearer ${token}`
      }
      });
      if (response.status === 200) {
        password.value = newPassword.value;
        console.log(response.data);
        console.log('密码修改成功',password.value);
        showEditPasswordModal.value = false;
      }
    } catch (error) {
      console.error('密码修改失败', error);
    }
    newPassword.value = '';
    confirmPassword.value = '';
  } else {
    console.log('两次输入的密码不一致，请重新输入');
  }
};

const deleteAccount = async() => {
  try {
    const token = localStorage.getItem('token'); 
    const response = await axios.post('http://192.168.142.166:8084/api/users/deleteAccount', {
    }, {  
        headers: {
        'Authorization': `Bearer ${token}`
      }
      });
    console.log("注销账号成功！",response.data);
    currentUserId.value='';
    token.value='';
    router.push('/');
  } catch (error) {
    console.error('注销账号失败', error);
  }
}
const signoutAccount = async() => {
  try {
    currentUserId.value='';
    localStorage.setItem('currentRoomId', '');
    token.value='';
    console.log("退出账号成功！");
    router.push('/');
  } catch (error) {
    console.error('退出账号失败', error);
  }
}

</script>


<style lang="scss">
.home3-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fbfcfc;
}

/* 顶栏样式 */
.topbar3 {
  background-color: rgb(83, 135, 124);
  padding: 15px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  /* 左右对齐 */
  align-items: center;
}

.topbar3-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.topbar3-title {
  font-size: 24px;
  color: white;
  font-weight: bold;
}

.topbar3-links {
  display: flex;
  gap: 20px;
}

.topbar3-link1 {
  font-size: 20 px;
  color: white;
  text-decoration: none;
  font-weight: normal;
  transition: color 0.3s;

  &:hover {
    color: #24d97f;
  }
}

.topbar3-link {
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
.home3-content {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
}

.func-choose {
  position: absolute;
  width: 250px;
  background-color: #87aca2;
  box-sizing: border-box;
  display: flex;
  height: 100%;
  flex-direction: column;
}

.self-info {
  font-size: 25px;
  text-align: right;
}

.func-choose a {
  justify-content: center;
  align-items: center;
  background-color: #d9ede0;
  padding: 12px;
  text-decoration: none;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.func-choose a:hover {
  background-color: #e0e0e0;
}

/* 个人信息容器样式 */
.profile-box {
  position: absolute;
  border: 3px double #87aca2;
  padding: 20px;
  background-color: #fbfcfc;
  margin: 40px 50px 50px 300px;
  justify-content: center;
  border-radius: 8px;
  height: 70%;
  width: 70%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.locate {
  display: flex;
  flex-direction: column;
}

/* 头像部分样式 */
.avatar-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 30px;
  margin-left: 50px;
  margin-right: 20px;
  border: 2px solid #ddd;
}

.avatar999 {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 20px;
  border: 2px solid #ddd;
}

.edit-avatar {
  background-color: #87aca2;
  padding: 5px 10px;
  font-size: 14px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 20px;
}

.edit-avatar:hover {
  background-color: #607c75;
}

/* 用户信息样式 */
.user-info {
  background-color: #fbfcfc;
  margin-left: 50px;
  font-size: 16px;
  line-height: 1.6;
}

.user-info strong {
  color: #87aca2;
}

.modal-overlay999 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content999 {
  background-color: white;
  color: #87aca2;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-overlay999 h3 {
  margin-bottom: 20px;
  color: #87aca2;
}

.modal-overlay999 input[type="file"] {
  margin-bottom: 15px;
}

.setting-count{
  margin-top: 30px;
  display: flex;
  flex-direction: row;
}

.makesure{
  display: flex;
  flex-direction: column;
  align-items: center;    
}

.makesure-btn{
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.modal-overlay4 {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
}

/* 弹窗内容 */
.modal-content4 {
  background-color: white;
  color: #87aca2;
  padding: 20px;
  border-radius: 8px;
  width: 800px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.picture-container {
  height: 450px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  overflow-y: auto;
}
.picture-choose{
  display: flex;
  flex-direction: column;
  width: 130px;
  height: 130px;
  gap:10px;
  background-color: #f2f2f2;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  &:hover{
    background-color: #d5d5d5;
  }

  .avatarchoose{
    width: 80%;
  }
}
</style>
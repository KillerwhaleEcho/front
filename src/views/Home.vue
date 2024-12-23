<template>
  <div class="home-container">
    <!-- 顶栏 -->
    <div class="topbar">
      <div class="topbar-content">
        <span class="topbar-title">StarBBPark</span>
        <div class="topbar-links">
          <a href="http://localhost:5173/home" class="topbar-link3">首页社区</a>
          <a href="http://localhost:5173/chat" class="topbar-link">消息</a>
          <a href="http://localhost:5173/own" class="topbar-link">个人中心</a>
        </div>
      </div>
    </div>

    <hr>

    <div class="main-container">
      <!-- 搜索弹窗 -->
      <div v-if="showSearchModal" class="modal-overlay777">
          <div class="modal-content777">
            <input type="text" v-model="searchInput" class="search-input" placeholder="请输入标签名/房间ID/用户ID" />
            <button class="edit-avatar" @click="searchTag">搜索标签</button>
            <button class="edit-avatar" @click="searchRoomId">搜索房间ID</button>
            <button class="edit-avatar" @click="searchUserId">搜索用户ID</button>
            <button class="edit-avatar" @click="showSearchModal = false">取消</button>
          </div>
        </div>

      <!-- 全部标签弹窗 -->
      <!-- 在弹窗中动态渲染标签按钮 -->
      <div v-if="showTagModal" class="modal-overlay2">
        <div class="modal-content2">
          <h3>全部标签</h3>
          <div class="tags-container">
            <button class="tag-btn" v-for="(tag, index) in tags" :key="index" :style="{ backgroundColor: getRandomColor() }"
              @click="handleTagClick(tag)">
              {{ tag }}
            </button>
          </div>
          <button class="modal-close" @click="showTagModal = false">关闭</button>
        </div>
      </div>

      <!-- 标签房间弹窗 -->
      <div v-if="showTagRoomModal" class="modal-overlay3">
        <div class="modal-content3">
          <h3>{{ currentTag }}</h3>
          <div class="tagRooms">
            <div class="group_sug2" v-for="(room, index) in tagRoomsData" :key="index" @click="group_sug1Click(room)">
              <!-- 房间头像 -->
              <!-- <div class="grp2_img"> -->
              <img :src="room.roomAvater || defaultAvatar" alt="房间头像" class="room-avatar2">
              <!-- </div> -->
              <div class="NCMT">
                <div class="NC">
                  <!-- 房间名称 -->
                  <div class="room-name2">{{ room.roomName }}</div>
                  <!-- 在线人数 -->
                  <div class="room-online2">{{ room.roomPeopleCount }} </div>
                </div>
                <div class="MT">
                  <div class="room-lastMsg">{{ room.latestMsg }}</div>
                  <div class="lastMsgTime">{{ room.latestMsgTime }}</div>
                </div>
              </div>
            </div>
          </div>
          <button class="modal-close" @click="showTagRoomModal = false">关闭</button>
        </div>
      </div>

      <!-- 用户搜索弹窗 -->
      <div v-if="showUserModal" class="modal-overlay3">
        <div class="modal-content3">
          <h3>搜索用户</h3>
          <div class="tagRooms">
            <div class="group_sug2" v-for="(user, index) in UserData" :key="index">
              <!-- 用户头像 -->
              <img :src="user.userAvater" alt="用户头像" class="room-avatar2">
              <div class="search-userNameandbutton">
                  <!-- 房间名称 -->
                  <div class="room-name2">{{ user.userName }}</div>
                  <button class="startchatting" @click="startchattingRoom(user)">发起聊天</button>
              </div>
            </div>
          </div>
          <button class="modal-close" @click="showUserModal = false">关闭</button>
        </div>
      </div>

      <!-- 图片选择弹窗 -->
      <div v-if="showPictureModal" class="modal-overlay4">
        <div class="modal-content4">
          <h3>选择头像</h3>
          <div class="picture-container">
            <div class="picture-choose" v-for="(pic, index) in Avatar" :key="index">
              <!-- 用户头像 -->
              <img :src="pic" alt="用户头像" class="avatarchoose" @click="chooseAvatar(pic)">
            </div>
          </div>
          <button class="modal-close" @click="showPictureModal = false">关闭</button>
        </div>
      </div>

      <!-- 创建房间弹窗 -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h3>创建房间</h3>
          <!-- 房间头像 -->
          <div class="avatar-section2">
            <img :src="avatar2Url || defaultAvatar" alt="头像" class="avatar2">
            <!-- <input type="file" @change="uploadAvatar" /> -->
             <button class="btn" @click="showPictureModal=true">选择头像</button>

          </div>
          <form @submit.prevent="createRoom">
            <!-- 房间号 -->
            <!-- <div>
              <label>房间号：</label>
              <span>{{ roomId }}</span>
            </div> -->

            <!-- 房间名 -->
            <div>
              <label>房间名：</label>
              <input type="text" v-model="roomName" required />
            </div>

            <!-- 标签 -->
            <div>
              <label>标签：</label>
              <input type="text" v-model="roomTag" />
            </div>

            <!-- 属性选择 -->
            <div>
              <label>属性：</label>
              <label>
                <input type="radio" value="public" v-model="roomType" /> 公开
              </label>
              <label>
                <input type="radio" value="private" v-model="roomType" /> 私密
              </label>
            </div>

            <!-- 按钮 -->
            <div class="modal-buttons">
              <button type="submit">确认</button>
              <button type="button" @click="closeModal">取消</button>
            </div>
          </form>
        </div>
      </div>

      <div class="lefttwo">
        <!-- 页面主体内容 -->
        <div class="home-content">
          <div class="container">
            <div class="top-container1">
              <!-- 根据后台标签数实时查询，将房间数最多的10个标签，设置为按钮 -->
              <!-- 10个大小不一的彩色按钮 -->
              <button class="random-btn" style="top: 20px; left: 230px; background-color:red;"></button>
              <button class="random-btn" style="top: 50px; left: 750px; background-color:#E4080A" ></button>
              <button class="random-btn" style="top: 100px; left: 380px;  background-color:#FFDE59"></button>
              <button class="random-btn" style="top: 120px; left: 1100px;  background-color:#CC6CE7"></button>
              <button class="random-btn" style="top: 170px; left: 500px;  background-color:royalblue"></button>
              <button class="random-btn" style="top: 280px; left: 800px;  background-color:greenyellow"></button>
              <button class="random-btn" style="top: 240px; left: 150px;  background-color:hotpink"></button>
              <button class="random-btn" style="top: 150px; left: 750px;  background-color:paleturquoise"></button>
              <button class="random-btn" style="top: 480px; left: 780px;  background-color:salmon"></button>
              <button class="random-btn" style="top: 80px; left: 600;  background-color:cadetblue"></button>
            </div>
            <div class="top-container2">
              <!-- 复制按钮，使得循环更加无缝 -->
              <button class="random-btn" style="top: 20px; left: 230px;  background-color:#E4080A; background-color:red;"></button>
              <button class="random-btn" style="top: 50px; left: 950px;  background-color:#E4080A; background-color:#E4080A;"></button>
              <button class="random-btn" style="top: 100px; left: 380px;  background-color:#E4080A; background-color:#FFDE59;"></button>
              <button class="random-btn" style="top: 220px; left: 1100px;  background-color:#E4080A; background-color:#CC6CE7;"></button>
              <button class="random-btn" style="top: 170px; left: 500px;  background-color:#E4080A; background-color:royalblue;"></button>
              <button class="random-btn" style="top: 280px; left: 300px;  background-color:#E4080A; background-color:greenyellow;"></button>
              <button class="random-btn" style="top: 440px; left: 650px;  background-color:#E4080A; background-color:hotpink;"></button>
              <button class="random-btn" style="top: 150px; left: 750px;  background-color:#E4080A; background-color:paleturquoise;"></button>
              <button class="random-btn" style="top: 480px; left: 780px;  background-color:#E4080A; background-color:salmon;"></button>
              <button class="random-btn" style="top: 80px; left: 600;  background-color:#E4080A; background-color:cadetblue;"></button>
            </div>
          </div>
        </div>
        <div class="bottom-container">
          <!-- 新添加的图片容器 -->
          <div class="image-container">
            <img :src="'/images/ENFP-竞选者.png'" alt="Image" class="image-content">
          </div>

          <div class="group_sug1" v-for="(room, index) in rooms" :key="index" @click="group_sug1Click(room)">
            <!-- 房间头像 -->
            <div class="grp1_img">
              <img :src="room.avatarUrl || defaultAvatar" alt="房间头像" class="room-avatar">
            </div>

            <!-- 房间名称 -->
            <div class="room-name">{{ room.roomName }}</div>

            <!-- 房间标签 -->
            <div class="room-tag">{{ room.roomTag }}</div>

            <!-- 在线人数 -->
            <div class="room-online">{{ room.onlineCount }} 在线</div>
          </div>
        </div>
      </div>
      <!-- 右侧边栏 -->
      <div class="secondbar">
        <!-- 搜索输入框和按钮 -->
        <div class="search-container">
          <!-- <input type="text" class="search-input" placeholder="请输入搜索内容"> -->
          <button class="secondbar-link3" @click="showSearchModal = true">搜索</button>
        </div>

        <button class="secondbar-link" @click="showModal = true">创建房间</button>
        <button class="secondbar-link" @click="showTagModal = true">标签分类</button>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
  // 你可以在这里添加任何需要的 Vue 逻辑
  import { ref } from 'vue';
  import { useRouter } from 'vue-router'; // 引入 useRouter
  import axios from 'axios';
  import { onMounted } from 'vue';


  const router = useRouter(); // 初始化路由实例
  // 表单数据
  const roomId = ref(''); // 自动生成房间号
  const roomName = ref('');
  const roomTag = ref(''); 
  const roomType = ref('public');
  const avatar2 = ref(null);
  const avatar2Url = ref(defaultAvatar); // 上传头像的预览URL
  const rooms = ref([]); // 用于存储从后端获取的房间数据
  // 弹窗控制
  const showModal = ref(false);
  const showTagModal = ref(false);
  const showTagRoomModal = ref(false);
  const showSearchModal = ref(false);
  const showUserModal=ref(false);
  const showPictureModal=ref(false);
  const searchInput = ref('');
  const tags = ref([]);
  const sugTags = ref([]);
  // 新增：用于存储标签房间弹窗中要展示的房间数据（根据点击的标签动态变化）
  const tagRoomsData = ref([]);
  // 新增：用于标识当前点击的标签（方便向后端请求对应标签的房间数据）
  const currentTag = ref('');
  const token = ref('');
  const UserData=ref([]);
  const currentRoomId = ref('');
  const currentUserId = ref('');
  const currentUserAvatar = ref('');
  const currentUserName = ref('');
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
  const defaultAvatar = "/images/ENFP-竞选者.png";
  

  const group_sug1Click = async (room) => {
  localStorage.setItem('currentRoomId', room.roomId);
  console.log("点击推荐房间",room.roomId);
  currentRoomId.value = room.roomId;
  try {
    const token = localStorage.getItem('token');  // 确保是从 localStorage 获取的字符串
    console.log("token", token);
        // 加入房间
        const addRoomResponse = await axios.post(`http://localhost:8084/api/rooms/join`, {
          roomId: currentRoomId.value,
        },{  
        headers: {
        'Authorization': `Bearer ${token}`
      }
      });
        console.log("房间加入成功", addRoomResponse);
    }
    catch (error) {
      console.error('房间加入失败', error);
    }
  router.push('/chat' ); 
  };

  // 点击标签按钮（random-btn和tag-btn通用的点击处理函数）
const handleTagClick = async (tagName) => {
  currentTag.value = tagName;
  showTagRoomModal.value = true;
  try {
    const token = localStorage.getItem('token');  // 确保是从 localStorage 获取的字符串
    console.log("token", token);
    // 向后端发送GET请求，查询包含当前点击标签的房间数据，这里的API地址需根据实际后端接口调整
    const response = await axios.get(`http://localhost:8084/api/rooms/getRoomsByTag/${tagName}`,{ 
        headers: {
           'Authorization': `Bearer ${token}`
        }
        });
    tagRoomsData.value = response.data.data;
    console.log("获取标签对应房间数据成功", response.data);
  } catch (error) {
    console.error('获取标签对应房间数据失败', error);
  }
};
const startchattingRoom = async (user) =>{
  console.log("私聊对象id", user.id);
  try {
    const token = localStorage.getItem('token');  // 确保是从 localStorage 获取的字符串
    console.log("token", token);
      const response = await axios.post('http://localhost:8084/api/rooms/create', {
        "receiverUid":user.id,
        "roomType":"private",
        "roomAvatar":user.userAvatar,
      },{ 
        headers: {
           'Authorization': `Bearer ${token}`
        }
        });
      roomId.value=response.data.roomId;
      console.log('发起聊天成功', response.data);
      localStorage.setItem("currentRoomId",roomId.value);
      router.push('/chat');
      showUserModal.value = false; // 关闭弹窗
    } catch (error) {
      console.error('发起聊天失败', error);
    }
}

// 随机生成颜色的方法
const getRandomColor=()=> {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

  // 关闭弹窗
  const closeModal = () => {
    showModal.value = false;
    resetForm();
  };

  const resetForm = () => {
  roomName.value = ''; 
  roomTag.value = ''; 
  roomType.value = 'public'; 
  avatar2.value = null; 
  avatar2Url.value = defaultAvatar;
};

  // 创建房间
  const createRoom = async () => {
    const formData = new FormData();
    formData.append('roomId', roomId.value);
    formData.append('roomName', roomName.value);
    formData.append('roomTag', roomTag.value);
    formData.append('roomType', roomType.value);
    if (avatar2.value) {
      formData.append('avatar', avatar2.value); // 上传头像文件
    }
     // 将 roomTag 转换为标签数组，支持中英文逗号分隔标签
    const tagsArray = roomTag.value.split(/[，,]/).map(tag => tag.trim()); // 去除每个标签的前后空格

     console.log("tagsArray", tagsArray);

    try {
      const token = localStorage.getItem('token');  // 确保是从 localStorage 获取的字符串
      console.log("token", token);
      const response = await axios.post('http://localhost:8084/api/rooms/create', {
        "roomName":roomName.value,
        "tags": tagsArray,
        "roomType":roomType.value,
        "roomAvatar":avatar2.value
      }, {  
        headers: {
           'Authorization': `Bearer ${token}`
        }
        });
      roomId.value=response.data.data.roomId;
      console.log('房间创建成功', response.data);
      localStorage.setItem("currentRoomId",roomId.value);
      console.log('成功', currentRoomId);
      router.push('/chat');
      showModal.value = false; // 关闭弹窗
      resetForm();
    } catch (error) {
      console.error('创建房间失败', error);
    }
  };

// 上传头像
const uploadAvatar = (event) => {
  const file = event.target.files[0];
  if (file) {
    avatar2.value = file;
    const reader = new FileReader();
    reader.onload = () => {
      avatar2Url.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

//搜索标签
const searchTag = async () => {
  if (searchInput.value) {
    try {
      const token = localStorage.getItem('token');  // 确保是从 localStorage 获取的字符串
    console.log("token", token);
    // 向后端发送GET请求，查询包含当前点击标签的房间数据，这里的API地址需根据实际后端接口调整
    const response = await axios.get(`http://localhost:8084/api/rooms/getRoomsByTag/${searchInput.value}`,{ 
        headers: {
           'Authorization': `Bearer ${token}`
        }
        });
      tagRoomsData.value=response.data.data;
      showSearchModal.value=false;
      showTagRoomModal.value=true;
    } catch (error) {
      console.error('搜索标签失败', error);
    }
    searchInput.value = '';
  }
};

//搜索房间ID
const searchRoomId = async () => {
  if (searchInput.value) {
    try {
      const token = localStorage.getItem('token');  // 确保是从 localStorage 获取的字符串
      console.log("token", token);
      const response = await axios.get(`http://localhost:8084/api/rooms/getRoomsByRoomId/${searchInput.value}`, {
        headers: {
           'Authorization': `Bearer ${token}`
        }
        });
      tagRoomsData.value=response.data.data;
      showSearchModal.value=false;
      showTagRoomModal.value=true;
    } catch (error) {
      console.error('搜索房间ID失败', error);
    }
    searchInput.value = '';
  }
  else{
    
  }
};

//搜索用户ID
const searchUserId = async () => {
  if (searchInput.value) {
    try {
      const token = localStorage.getItem('token');  // 确保是从 localStorage 获取的字符串
      console.log("token", token);
      const response = await axios.get('http://localhost:8084/api/users/getUserByUserId', {
        UserId: searchInput.value
      },{ 
        headers: {
           'Authorization': `Bearer ${token}`
        }
        });
      UserData.value=response.data.users;
      console.log("搜索到的用户信息为：",UserData.value);
      showSearchModal.value=false;
      showUserModal.value=true;
    } catch (error) {
      console.error('搜索用户ID失败', error);
    }
    searchInput.value = '';
  }
};

//选择头像
const chooseAvatar = async(pic) =>{
  showPictureModal.value=false;
  avatar2Url.value=pic;
  avatar2.value=pic;

}

// 页面加载时请求房间数据
onMounted(async () => {
  try {
    currentUserId.value = localStorage.getItem('currentUserId');
    const token = localStorage.getItem('token');  // 确保是从 localStorage 获取的字符串
    console.log("token", token);
    // 从后端获取用户数据
    const response = await axios.post('http://localhost:8084/api/users/own', {
    }, {  
        headers: {
        'Authorization': `Bearer ${token}`
      }
    });
     
    if(response.data.data.avatar==null){
      currentUserAvatar.value =defaultAvatar;
      console.log("加载默认头像",defaultAvatar);
    }
    currentUserName.value = response.data.data.username;
    currentUserId.value = response.data.data.userid;
    console.log("own2加载成功", response.data);
    console.log("toux2加载成功", currentUserAvatar.value);
    console.log("name2加载成功", currentUserName.value);
    }
    catch (error) {
      console.error('获取own2信息失败', error);
    }
  try {
    const token = localStorage.getItem('token');  // 确保是从 localStorage 获取的字符串
    console.log("token", token);
    // 从后端获取用户数据
    const response = await axios.post('http://localhost:8084/api/users/own', {
    }, {  
        headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    currentUserId.value = response.data.data.userid;
    localStorage.setItem('currentUserId', currentUserId.value);
    console.log("userId获取成功", currentUserId.value);
    }
    catch (error) {
      console.error('userId获取失败', error);
    }
  try {
      const token = localStorage.getItem('token');  // 确保是从 localStorage 获取的字符串
      console.log("token", token);
      const response = await axios.get('http://localhost:8084/api/rooms/get6rooms', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }); 

    rooms.value = response.data.data; // 假设 API 返回的数据结构是 { rooms: [...] }、
    console.log("六个房间加载成功",response.data);
  } catch (error) {
    console.error('获取房间数据失败', error);
  }
  try {
    const token = localStorage.getItem('token');  // 确保是从 localStorage 获取的字符串
      console.log("token", token);
    const response = await axios.get('http://localhost:8084/api/rooms/tags', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
     // 获取标签数据
    tags.value = response.data.data; // 假设返回的格式是 [{ name: 'Kpop', color: '#6A5ACD' }, ...]
    console.log("标签加载成功",tags.value);
  } catch (error) {
    console.error('获取标签数据失败', error);
  }

  try {
    const token = localStorage.getItem('token');  // 确保是从 localStorage 获取的字符串
      console.log("token", token);
    const response = await axios.get('http://localhost:8084/api/rooms/sugTags', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }); 
     // 获取标签数据
    sugTags.value = response.data.data; // 假设返回的格式是 [{ name: 'Kpop', color: '#6A5ACD' }, ...]
    console.log("滚动标签加载成功",response.data.data);
  } catch (error) {
    console.error('获取标签数据失败', error);
  }

  // 获取页面中所有的random-btn按钮元素
  const randomBtns = document.querySelectorAll('.random-btn');
  // 遍历标签数据，将标签值和颜色等属性赋值给按钮
  sugTags.value.forEach((sugTag, index) => {
    if (index < randomBtns.length) {
      const btn = randomBtns[index];
      btn.textContent = sugTag.tag;

      // 为每个按钮添加点击事件监听器
      btn.addEventListener('click', () => {
        handleTagClick(sugTag.tag);
      });
    }
  });
});
  </script>
  
  <style lang="scss">
  .home-container {
    width: 100%;
    min-height: 100vh;
    padding: 0;
    display: flex;
    flex-direction: column;
    background-color: #62A89B;
    /* 背景色保持一致 */

    /* 顶栏样式 */
    .topbar {
      background-color: rgba(78, 124, 114, 0.75);
      /* 与 card 颜色一致 */
      padding: 15px;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      /* 左右对齐 */
      align-items: center;
    }

    .topbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .topbar-title {
      font-size: 24px;
      color: white;
      font-weight: bold;
    }

    .topbar-links {
      display: flex;
      gap: 20px;
    }

    .topbar-link3 {
      font-size: 20 px;
      color: white;
      text-decoration: none;
      font-weight: normal;
      transition: color 0.3s;

      &:hover {
        color: #24d97f;
        /* 鼠标悬停时的颜色 */
      }
    }

    .topbar-link {
      font-size: 16px;
      color: white;
      text-decoration: none;
      font-weight: normal;
      transition: color 0.3s;

      &:hover {
        color: #24d97f;
        /* 鼠标悬停时的颜色 */
      }
    }

    .main-container{
      width: 100%;
      height: 100%; 
      flex-grow: 1; 
      display: flex;
      /* 使用 Flexbox 布局 */
      flex-direction: row;
      /* 设置 Flex 容器的子元素按垂直方向排列 */
      padding: 0px;
      /* 给容器添加内边距，防止内容紧贴容器边缘 */

    }

    .lefttwo{
      width: 85%;
      height: 100%;
      display: flex;
      /* 使用 Flexbox 布局 */
      flex-direction: column;
      /* 设置 Flex 容器的子元素按垂直方向排列 */
    }

    //副栏样式
    .secondbar {
      width: 15%;
      //height: 200%;
      background-color: rgba(78, 124, 114, 0.75);
      flex: 1;
      margin-right: 0%;
      border-left: 1px solid #ccc;
      flex-direction: column;
    }

    /* 创建房间和标签分类按钮样式 */
    .secondbar-link {
      width: 100%;
      height: 40px;
      background: rgb(249, 250, 250);
      color: #5da877;
      border: none;
      outline: none;
      flex-direction: column;
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        font-size: 18px;
      }
    }

    /* 搜索容器 */
    .search-container {
      display: flex;
      width: 100%;
      justify-content: space-between;
      /* 输入框和按钮之间的间距 */
    }

    .search-input {
      width: 40%;
      height: 40px;
      margin: 5px;
      padding: 0 10px;
      border-radius: 5px;
      border: none;
      font-size: 14px;
      outline: none;
    }

    .secondbar-link3 {
      width: 100%;
      height: 40px;
      background: rgb(249, 250, 250);
      color: #5da877;
      border: none;
      outline: none;
      border-radius: 5px;
      flex-direction: column;
      margin: 5px;
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      &:hover {
        font-size: 18px;
      }
    }

    //横线样式
    hr {
      border: 0;
      /* 去掉默认的边框 */
      height: 2px;
      /* 设置线条的高度 */
      background-color: #fff;
      /* 设置背景颜色为黑色 */
      //margin: 20px 0;       /* 设置上下的间距 */
    }

    /* 页面整体样式 */
    .home-content {
      width: 100%;
      height: 425px;
      font-family: Arial, sans-serif;
      /* 设置字体为 Arial 或 sans-serif 字体 */
      background-color: white;
      /* 设置背景颜色为浅灰色 */
      padding: 20px;
      /* 为容器添加内边距，防止内容紧贴边缘 */
    }

    /* 圆角容器 */
    .container {
      position: relative;
      /* 设置容器为相对定位，便于子元素绝对定位 */
      background-image: url('/images/INFP调停者-04.png');
      /* 设置背景图片，图片链接待替换 */
      background-size: cover;
      /* 让背景图片覆盖整个容器，保持比例填充 */
      border-radius: 15px;
      /* 设置容器圆角半径为15px，产生圆角效果 */
      padding: 30px;
      /* 为容器添加40px的内边距，避免内容贴近边缘 */
      margin-top: 3px;
      min-height: 380px;
      /* 设置容器的最小高度为300px，确保足够展示内容 */
      overflow: hidden;
      /* 隐藏溢出容器的部分 */

    }

    /* 定义滚动动画 */
    @keyframes scrollLeftToRight1 {
      0% {
        transform: translateX(100%);
        /* 从右侧外部开始 */
      }

      100% {
        transform: translateX(-100%);
        /* 滚动到左侧外部 */
      }
    }

    /* 定义滚动动画 */
    @keyframes scrollLeftToRight2 {
      0% {
        visibility: visible;
        transform: translateX(100%);
        /* 从右侧外部开始 */
      }

      100% {
        transform: translateX(-100%);
        /* 滚动到左侧外部 */
      }
    }

    .top-container1 {
      display: flex;
      position: absolute;
      white-space: pre-wrap;
      /* 防止按钮换行 */
      animation: scrollLeftToRight1 20s linear infinite;
      /* 定义动画 */
      animation-delay: 0s;
      width: 100%;
      /* 设置宽度为父容器的100%，占满可用空间 */
      height: 200px;
      /* 设置高度为200px，控制按钮区域的高度 */
    }

    .top-container2 {
      //display: flex;
      //position: absolute;
      white-space: pre-wrap;
      /* 防止按钮换行 */
      //opacity: 0;                /* 默认透明 */
      visibility: hidden;
      /* 默认隐藏 */
      animation: scrollLeftToRight2 20s linear infinite;
      /* 定义动画 */
      animation-delay: 10s;
      width: 100%;
      /* 设置宽度为父容器的100%，占满可用空间 */
      height: 200px;
      /* 设置高度为200px，控制按钮区域的高度 */
    }

    /* 随机按钮样式 */
    .random-btn {
      position: absolute;
      /* 设置按钮为绝对定位，确保其位置根据top和left调整 */
      padding: 10px 20px;
      /* 设置按钮内边距，增加点击区域 */
      border-radius: 8px;
      /* 设置按钮的圆角半径为8px */
      border: none;
      /* 去掉按钮的边框 */
      color: white;
      /* 设置按钮文字颜色为白色 */
      font-size: 16px;
      /* 设置按钮文字大小为16px */
      cursor: pointer;
      /* 设置鼠标悬停时显示为指针，表示可点击 */
      margin-right: 50px;
      /* 按钮之间的间隔 */
    }


    /* 下半部分按钮 */
    .bottom-container {
      display: flex;
      width: 100%;
      justify-content: space-around;
      /* 左对齐 */
      align-items: center;
      /* 垂直居中对齐 */
      margin-top: 30px;
      //gap: 20px;
      /* 添加间距 */
    }


    .image-container {
      width: 200px;
      /* 宽度设置为100px */
      height: 200px;
      /* 高度设置为100px，确保它是方形的 */
      overflow: hidden;
      /* 隐藏超出部分 */
    }

    .image-content {
      width: 100%;
      /* 图片宽度占满容器 */
      height: 100%;
      /* 图片高度占满容器 */
      object-fit: cover;
      /* 保持图片比例并填满容器 */
    }

    .group_sug1 {
      width: 160px;
      height: 190px;
      border-radius: 8px;
      background-color: rgb(249, 250, 250);
      padding: 10px;
      text-align: center;
    }

    .grp1_img {
      width: 80px;
      height: 80px;
      margin-left: 25px;
      overflow: hidden;
    }

    .room-avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .room-name {
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 5px;
    }

    .room-tag {
      font-size: 14px;
      color: #777;
      margin-bottom: 5px;
    }

    .room-online {
      font-size: 12px;
      color: #24d97f;
    }

    .tagRooms {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    overflow-y: auto;
    max-height: 400px;
  }

    .group_sug2 {
      width: 100%;
      height: 80px;
      border-radius: 8px;
      background-color: rgb(249, 250, 250);
      padding: 10px;
      text-align: center;
      display: flex;
      flex-direction:row ;
      gap:20px;
      //justify-content: center;   /* 水平居中 */
      //align-items: center;
    }

    .room-avatar2 {
      width: 60px;
      height: 60px;
    }

    .search-userNameandbutton{
      width: 660px;
      display: flex;
      justify-content: space-between;
    }

    .startchatting{
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

    .NCMT{
      display: flex;
      flex-direction: column;
      width: 740px;
      gap:15px;
    }

    .NC{
      display: flex;
      flex-direction: row;
      gap:20px;
    }

    .MT{
      display: flex;
      justify-content: space-between;  /* 水平布局：将子元素分散排列，左边一个，右边一个 */
      align-items: flex-end; 
      font-size: 14px;
      color:#777;
      //gap:570px;
    }

    .lastMsgTime{
      font-size: 12px;
    }

    .room-online2 {
      font-size: 18px;
      color: #24d97f;
    }

    /* 弹窗遮罩层 */
    .modal-overlay {
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

    /* 弹窗内容 */
    .modal-content {
      background-color: white;
      color: #87aca2;
      padding: 20px;
      border-radius: 8px;
      width: 400px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    /* 头像部分样式 */
    .avatar-section2 {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    .avatar2 {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 20px;
      border: 2px solid #ddd;
    }

    .modal-content h3 {
      margin-bottom: 20px;
    }

    .modal-content form div {
      margin-bottom: 15px;
    }

    .modal-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }

    .modal-buttons button {
      background-color: #87aca2;
      width: 100px;
      padding: 5px 10px;
      font-size: 14px;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .modal-overlay2 {
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

  /* 弹窗内容 */
  .modal-content2 {
    background-color: white;
    color: #87aca2;
    padding: 20px;
    border-radius: 8px;
    width: 800px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    overflow-y: auto;
    max-height: 300px;
  }

  .tag-btn {
    padding: 10px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 110px;
    height: 40px;
    color: rgb(255, 255, 255);
    font-size: 16px;
    cursor: pointer;
    border: none;
    transition: background-color 0.3s ease;
    
  }

  .tag-btn:hover {
    opacity: 0.8;
    background-color: #ddd;
  }

  .modal-close {
    background-color: #87aca2;
    width: 80px;
    height: 30px;
    font-size: 14px;
    color: white;
    border: none;
    border-radius: 4px;
    text-align: center;
    margin-left: 630px;
    margin-top: 10px;
    cursor: pointer;

    &:hover{
      font-size: 16px;
    }
  }

  .modal-overlay3 {
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

  /* 弹窗内容 */
  .modal-content3 {
    background-color: white;
    color: #87aca2;
    padding: 20px;
    border-radius: 8px;
    width: 800px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .modal-overlay777 {
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

.modal-content777 {
  background-color: white;
  color: #87aca2;
  padding: 20px;
  border-radius: 8px;
  width: 700px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
  
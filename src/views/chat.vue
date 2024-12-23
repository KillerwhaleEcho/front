<template>
  <div class="home2-container">
    <!-- 顶栏 -->
    <div class="topbar2">
      <div class="topbar2-content">
        <span class="topbar2-title">StarBBPark</span>
        <div class="topbar2-links">
          <a href="http://localhost:5173/home" class="topbar2-link">首页社区</a>
          <a href="http://localhost:5173/chat" class="topbar2-link2">消息</a>
          <a href="http://localhost:5173/own" class="topbar2-link">个人中心</a>
        </div>
      </div>
    </div>

    <!-- 页面主体内容 -->
    <div class="home2-content">

      <!-- 房间设置弹窗 -->
      <div v-if="showRoomSettingModal" class="modal-overlay888">
        <div class="modal-content888">
          <h3>房间设置</h3>
          <div class="users-container">
            <div class="showRoomUser" v-for="(roomUser, index) in currentRoomUsers" :key="index"
              @click="clickUser(roomUser)">
              <!-- 用户头像 -->
              <img :src="roomUser.head" alt="用户头像" class="roomUserAvatar">
              <!--用户名 -->
              <div class="roomUserName">{{ roomUser.username }}</div>
              <!-- 房间标签 -->
              <div class="roomUserId">{{ roomUser.userId }}</div>
            </div>
          </div>
          <div class="roomInfom">
            <div>房间名：{{ roomName }}</div>
            <div>id:{{ currentRoomId }}</div>
            <div>标签：{{ roomTags }}</div>
          </div>
          <div class="button-area">
            <button class="modal-close2" @click="leaveRoom">退出房间</button>
            <button class="modal-close2" @click="showRoomSettingModal = false">关闭</button>
          </div>
        </div>
      </div>

      <!-- 用户管理弹窗 -->
      <div v-if="showfriendInfoModal" class="modal-overlay666">
        <div class="modal-content666">
          <img :src="friendAvatar" alt="用户头像" class="friendAvatar">
          <div class="friendName">用户名：{{ friendName }}</div>
          <div class="friendName">用户id：{{ friendId }}</div>
          <div class="button-area">
            <button class="friend-btn1" @click="startchattingRoom2">发起聊天</button>
            <button class="friend-btn2" @click="addBlacklist">加入黑名单</button>
            <button class="friend-btn3" @click="showfriendInfoModal = false">关闭</button>
          </div>
        </div>
      </div>

      <!-- 左侧聊天选择 -->
      <div class="chat_choose">
        <div class="chat_search">
          <input type="text" class="search2-input" v-model="searchExist" placeholder="请输入搜索内容">
          <button class="secondbar2-link" @click="searchExistRoom">搜索</button>
        </div>
        <div class="roomshow">
          <!-- 动态生成房间列表项 -->
          <div class="roomlist" v-for="(room, index) in rooms" :key="index" @click="clickRoom(room)">
            <div class="roomwindow">
              <!-- 房间头像 -->
              <div class="roomAvater2">
                <img :src="room.roomAvatar" alt="房间头像" class="room-avatar2">
              </div>
              <div class="expAvater">
                <div class="expNewmsg">
                  <!-- 房间名 -->
                  <div class="room-name2">{{ room.roomName }}</div>
                  <!-- 房间标签 -->
                  <div class="room-tag2">{{ room.roomTag }}</div>
                  <!-- 房间人数 -->
                  <div class="room-people-count2">{{ room.roomPeopleCount }}</div>
                </div>
                <!-- 最新消息 -->
                <div class="room-latest-message2">{{' '}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧聊天区域 -->
      <div class="chat_area">
        <!-- 上侧信息展示 -->
        <div class="chat-info">
          <div class="room-header">
            <img :src="roomAvatar"  alt="Room Avater" class="room-avatar" />
            <div class="room-name">{{roomName}}</div>
            <img :src="'public/images/再加三个点(More Three Dots)_爱给网_aigei_com.png'" class="settingimg"
              @click="showRoomSettingModal=true">
          </div>
        </div>
        <!-- 聊天内容区域 -->
        <div class="chat-container">
          <div v-for="msg in currentRoomMsg" :key="msg.id">
            <div
              :class="{ 'left': msg.userName !== currentUserName, 'right': msg.userName === currentUserName}">
              <div class="msgThreePart">
                <img class="msgAvater" :src="msg.userAvatar" @click="manageRel(msg)">
                <div class="nameAndBubble">
                  <div class="msgName">{{ msg.userName }}</div>
                  <div class="message-bubble">
                    {{ msg.content.text}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 输入框和发送按钮 -->
        <div class="chat-input-container">
          <!-- 功能按钮区 -->
          <div class="func-logo">

            <!-- 点击表情按钮，切换表情面板显示与隐藏 -->
            <img src="/images/emoji/slightly-smiling-face.png" class="emoji" @click="clickEmoji">
            <!-- 表情面板 -->
            <div class="emoji-content">
              <Emoji v-show="showEmoji" @sendEmoji="sendEmoji" @closeEmoji="clickEmoji"></Emoji>
            </div>
          </div>

          <!-- 消息发送区 -->
          <div class="send_area">
            <textarea type="text" class="chat-input" placeholder="请输入消息..." />
            <button class="send-button" @click="sendMessage">发送</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import axios from 'axios';
import { onMounted } from 'vue';
import Emoji from "../components/Emoji.vue";
import FileCard from "../components/FileCard.vue";

const socket = ref(null); // WebSocket连接对象
const currentUserId = ref(null);
// 定义响应式数据rooms，初始值先设为空数组，后续在onMounted中重新赋值
const rooms = ref([]);
// 定义响应式数据currentRoomId，初始值先设为null，后续在onMounted中根据情况赋值
const currentRoomId = ref(null);
const token = ref(null);
const roomAvatar = ref(null);  // 存储房间头像
const roomName = ref(null);  // 存储房间名字
const currentRoomMsg = ref([]);
const currentRoomUsers = ref([]);
const currentUserName=ref('');
const currentUserAvatar=ref('');
const roomTags = ref([]);
const roomType=ref('');
const showRoomSettingModal=ref(false);
const showfriendInfoModal = ref(false);
const friendId=ref('');
const friendAvatar=ref('');
const friendName=ref('');
const showEmoji = ref(false);
// const fileInput = ref(null);
// const selectedFile = ref(null);
// const fileType = ref(0); 
const tokenValue = ref(null);
const searchExist=ref('');
const defaultAvatar = "/images/ENFP-竞选者.png";

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
    }else{
      currentUserAvatar.value = response.data.data.avatar;
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
    currentUserId.value = localStorage.getItem('currentUserId');
    console.log("获取当前用户id成功", currentUserId.value);
    const token = localStorage.getItem('token');  // 确保是从 localStorage 获取的字符串
    console.log("获取token", token);
    // 将 token 存储在响应式变量中，便于后续使用
    tokenValue.value = token;

    // WebSocket连接地址
    const websocketUrl = `ws://localhost:8084/ws/chat/${currentRoomId.value}/${currentUserId.value}`;

    // 创建 WebSocket 连接
    socket.value = new WebSocket(websocketUrl);

    // WebSocket 连接打开时
    socket.value.onopen = () => {
      console.log('WebSocket连接已打开999');
    };

    // WebSocket 接收到消息时
    socket.value.onmessage = (event) => {
    console.log('接收到的原始消息:', event.data);
    try {
      const message = JSON.parse(event.data);
      console.log('解析后的消息:', message);
      currentRoomMsg.value.push(message);
      // 继续处理消息
      } catch (error) {
        console.error('JSON 解析失败:', error);
        console.error('接收到的原始消息:', event.data);
      }
    };

    // WebSocket 连接出错时
    socket.value.onerror = (error) => {
      console.error('WebSocket连接出错', error);
    };

    // WebSocket 连接关闭时
    socket.value.onclose = () => {
      console.log('WebSocket连接已关闭');
    };

    // 从后端获取房间数据
    const response = await axios.get('http://localhost:8084/api/rooms/room-choose', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
  });
    const data = response.data.data;
    // 将获取到的房间数据赋值给rooms响应式数据
    rooms.value = data;
    console.log("聊天室加载成功", response.data.data);
    currentRoomId.value = localStorage.getItem("currentRoomId");
    console.log("跳转传递roomid：", currentRoomId.value);
    // 判断获取到的rooms数组是否有元素，如果有则将currentRoomId设为第一个房间的roomId
    if (rooms.value.length > 0 && (currentRoomId.value == null || currentRoomId.value == 'undefined')) {
      currentRoomId.value = rooms.value[0].roomId;
      console.log("列表第一个房间：", currentRoomId);
      // 设置 localStorage 中的 currentRoomId，保持房间 ID 状态
      localStorage.setItem("currentRoomId", currentRoomId.value);
    }
  }
  catch (error) {
    console.error('聊天室加载失败', error);
  }
});


// 在页面加载时或房间ID变化时获取房间信息
watch(currentRoomId, async (newRoomId) => {
  if (newRoomId) {
    console.log("newroomid:",newRoomId);
    try {
    // 使用保存的 token
    const token = tokenValue.value; // 这里从响应式变量中获取 token

    // 使用房间ID获取房间信息
    const response1 = await axios.get(`http://localhost:8084/api/rooms/${newRoomId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const roomData = response1.data.data;

    if (roomData.roomType === 'public') {
      roomAvatar.value =response1.data.data.roomAvatar;
      roomName.value=response1.data.data.roomName;
      roomTags.value=response1.data.data.tags;
    }

    if (roomData.roomType === 'private') {
      // 私密房间：找出当前用户之外的那个用户
      const otherUser = roomData.members.find(user => user.id !== currentUserId.value);

      if (otherUser) {
        // 设置房间名称为另一个用户的用户名
        roomName.value = otherUser.username;
        // 设置房间头像为另一个用户的头像
        roomAvatar.value = otherUser.head;
      } else {
        console.error("未找到房间中除当前用户外的其他成员");
      }
    }
    currentRoomUsers.value=response1.data.data.members;
    console.log("更新获取房间header信息成功", response1.data);
  } catch (error) {
    console.error('更新获取房间header信息失败', error);
  }
    try {
      // 使用保存的 token
      const token = tokenValue.value; // 这里从响应式变量中获取 token
      const responseMsg = await axios.get(`http://localhost:8084/api/messages/sync?roomId=${currentRoomId.value}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log("获取房间历史消息成功",responseMsg.data);
      currentRoomMsg.value = responseMsg.data.data;
    } catch (error) {
      console.error('noclick获取房间初始聊天记录失败', error);
    }

    if (socket.value) {
      socket.value.close(); // 关闭旧的连接
    }

    // 重新建立 WebSocket 连接
    const websocketUrl = `ws://localhost:8084/ws/chat/${newRoomId}/${currentUserId.value}`;
    socket.value = new WebSocket(websocketUrl);

    socket.value.onopen = () => {
      console.log('WebSocket连接已打开888');
    };

    socket.value.onmessage = (event) => {
      const message = JSON.parse(event.data);
      currentRoomMsg.value.push(message);
    };
    console.log("currentUserId=",currentUserId.value);
  }
});

const searchExistRoom = async () => {
  if (searchExist.value) {
    try {
      const token = localStorage.getItem('token');  // 确保是从 localStorage 获取的字符串
      console.log("token", token);
      const response = await axios.post('http://localhost:8084/api/rooms/myroom-search', {
        "query": searchExist.value
        }, {  
        headers: { 'Authorization': `Bearer ${token}`}
      });
      console.log('搜索房间名字成功', response.data);
         // 确保 data 是一个数组，并且存在至少一个房间
         if (response.data && response.data.data && response.data.data.length > 0) {
        currentRoomId.value = response.data.data[0].roomId;  // 获取第一个房间的 roomId
        console.log('房间ID:', currentRoomId.value);
      } else {
        console.log('未找到相关房间');
      }

    } catch (error) {
      console.error('搜索房间名字失败', error);
    }
    
    searchExist.value = '';
  }
};
// 切换表情面板显示
const clickEmoji = () => {
  showEmoji.value = !showEmoji.value;
  console.log("click使showEmoji更改为", showEmoji.value);
};

// 处理发送表情的事件
const sendEmoji = (item) => {
  console.log("发送表情:", item.value);
  //下面会实现点击表情后直接sendmessage发送出去
   
};

const clickRoom = (room) => {
  currentRoomId.value=room.roomId.toString();
  console.log("click使房间号更改",currentRoomId.value);
};

const leaveRoom = async () => {
  try {
    // 使用保存的 token
    const token = tokenValue.value; // 这里从响应式变量中获取 token
    const response = await axios.post(`http://localhost:8084/api/rooms/${currentRoomId.value}/leave`, {}, {  
     headers: {
    'Authorization': `Bearer ${token}`
      }
      });
    currentRoomId.value=" ";
    showRoomSettingModal.value=false;
    console.log('退出房间成功:', response.data);
  }
  catch (error) {
    console.log('退出房间失败');
  }
}

const manageRel = async (msg)=>{
  friendId.value=msg.uid;
  friendAvatar.value=msg.userAvatar;
  friendName.value=msg.userName;
  showfriendInfoModal.value=true;
}

const startchattingRoom2 = async () =>{
  try {
      const response = await axios.post('https://9b5ce24c-fbae-47e3-bd54-f5b6e28c076e.mock.pstmn.io/createRoom', {
        headers: {
           'Authorization': `Bearer ${token}`
        },
        "roomId":roomId.value,
        "roomName":" ",
        "roomType":"private",
        "roomAvatar":" "
      });
      console.log('发起聊天成功', response.data);
      localStorage.setItem("currentRoomId",roomId.value);
      router.push('/chat');
      showUserModal.value = false; // 关闭弹窗
    } catch (error) {
      console.error('发起聊天失败', error);
    }
}

const addBlacklist = async() =>{
  try {
    const response = await axios.post('https://localhost:8084/api/users/blacklist', {
      headers: {
          'Authorization': `Bearer ${token}`
      },
      "userId":friendId.value
    });
    console.log('加入黑名单成功', friendId.value);
    showfriendIonfoModal.value = false; // 关闭弹窗
  } catch (error) {
    console.error('加入黑名单失败', error);
  }
}

const sendMessage = async () => {
  const content = document.querySelector('.chat-input').value;
  if (content) {
    // 构建消息对象
    const message = {
      uid: currentUserId.value,
      roomId: currentRoomId.value,
      type:"TEXT",
      content: {
        text:content
      },
      userName: currentUserName.value, // 你可以根据实际情况替换
      userAvatar: currentUserAvatar.value, // 同上
    };

    // WebSocket连接地址
    //const websocketUrl = `ws://localhost:8084/ws/chat/${currentRoomId.value}/${currentUserId.value}`;

    // 创建 WebSocket 连接
    //socket.value = new WebSocket(websocketUrl);

    if (socket.value && socket.value.readyState === WebSocket.OPEN) {   
      socket.value.send(JSON.stringify(message)); 
      console.log("向websocket发送消息成功",JSON.stringify(message));
    } else { 
      console.log("向websocket发送消息失败",JSON.stringify(message));
      setTimeout(() => sendMessage(message), 1000); // 1秒后重试 
    }

    // 检查 currentRoomMsg.value 是否是数组，若不是则初始化它为一个数组
    if (!Array.isArray(currentRoomMsg.value)) {
      currentRoomMsg.value = [];
    }
    // 将消息立即显示在聊天界面中
     // currentRoomMsg.value.push(message);

    // 清空输入框
    document.querySelector('.chat-input').value = '';
  }
};
//}

</script>

  <style lang="scss">
  .home2-container {
    height: 100vh;
    /* 使容器的高度等于视口的高度 */
    width: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    background-color: #62A89B;
    /* 背景色保持一致 */

    /* 顶栏样式 */
    .topbar2 {
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

    .topbar2-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .topbar2-title {
      font-size: 24px;
      color: white;
      font-weight: bold;
    }

    .topbar2-links {
      display: flex;
      gap: 20px;
    }

    .topbar2-link2 {
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

    .topbar2-link {
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

    /* 页面主体内容 */
    .home2-content {
      display: flex;
      height: 90%;
      /* 使用 Flexbox 布局 */
      flex-direction: row;
      /* 设置 Flex 容器的子元素按垂直方向排列 */
      flex: 1;
      /* 让 content 填充剩余的空间 */
      color: white;
      /* 设置字体颜色为白色 */
      padding: 0px;
      /* 给容器添加内边距，防止内容紧贴容器边缘 */
    }

    .chat_search {
      display: flex;
      justify-content: space-between;
      /* 输入框和按钮之间的间距 */
    }

    .search2-input {
      width: 80%;
      height: 30px;
      padding: 0 10px;
      border-radius: 5px;
      border: none;
      font-size: 14px;
      outline: none;
    }

    //搜索按钮
    .secondbar2-link {
      width: 30%;
      /* 每个按钮占 30% 宽度，保证它们均匀分布 */
      height: 30px;
      background: rgb(249, 250, 250);
      color: #5da877;
      border: none;
      outline: none;
      border-radius: 5px;
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        font-size: 18px;
      }
    }

    .chat_choose {
      width: 350px;
      /* 设置侧边栏的宽度 */
      background-color: #87aca2;
      border-right: 1px solid #ddd;
      /* 给侧边栏加一个右边框 */
      padding: 20px;
      box-sizing: border-box;
      height: 100%;
    }

    .roomshow {
      //background-color: #777;
      list-style: none;
      max-height: 80vh;
      /* 设置最大高度为视口高度的 80% */
      overflow-y: auto;
      /* 启用垂直滚动条，超出内容时可滚动 */
    }

    .roomlist {
      list-style: none;
      max-height: 80vh;
      /* 设置最大高度为视口高度的 80% */
      overflow-y: auto;
      /* 启用垂直滚动条，超出内容时可滚动 */
      padding: 0;
      /* 去掉ul的内边距 */
      margin-top: 15px;
      /* 去掉ul的外边距 */
      list-style-type: none;
      /* 去掉默认的列表样式 */
    }

    .roomwindow {
      flex: 1;
      padding: 10px;
      /* 设置每个列表项内边距为 10px，增加点击区域，增强用户体验 */
      background-color: #d9ede0;
      border-radius: 40px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      /* 设置背景颜色变化的过渡效果，持续 0.3 秒，呈现平滑的变化 */
      display: flex;
      align-items: center;
      gap: 10px;

      // 房间头像样式
      .room-avatar2 {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
      }

      .expAvater {
        display: flex;
        /* 使用 Flexbox 布局 */
        flex-direction: column;
        /* 设置 Flex 容器的子元素按垂直方向排列 */
        gap: 10px;
      }

      .expNewmsg {
        display: flex;
        /* 使用 Flexbox 布局 */
        flex-direction: row;
        /* 设置 Flex 容器的子元素按垂直方向排列 */
        gap: 20px;
      }

      // 房间名样式
      .room-name2 {
        font-weight: bold;
        flex: 1;
      }

      .room-tag2 {
        font-size: 16px;
      }

      // 房间人数样式
      .room-people-count2 {
        font-size: 14px;
        color: #777;
      }

      // 最新消息样式
      .room-latest-message2 {
        color: #555;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }


    .roomwindow:hover {
      background-color: #e0e0e0;
    }

    .chat_area {
      //右侧一整个
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 10px;
      color: #000;
      background-color: #87aca2;
      height: 100%;
      width: 100%;
    }

    .chat-info {
      padding: 15px;
      background-color: #ffffff;
      border-radius: 40px 40px 0 0; /* 上两个角设置圆角，下两个角不设置圆角 */
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .room-header {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .room-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .room-name {
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }

    .settingimg{
      width: 30px;
      margin-left: 950px;
    }

    .chat-container {
      //消息展示区
      flex: 1;
      padding: 10px;
      overflow-y: auto;
      background-color: #ffffff;
      flex-direction: column;
      /* 垂直排列子元素 */
      //gap: 10px; /* 设置竖直间隔 */
      display: flex;
    }

    .msgThreePart {
      display: flex;
      width: 100%;
    }

    .left .msgThreePart {
      display: flex;
      flex-direction: row;
    }

    .right .msgThreePart {
      display: flex;
      flex-direction: row-reverse; // 反转水平方向布局，使元素从右到左排列
      float: right;
    }

    .msgAvater {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 10px;
    }

    .nameAndBubble {
      display: flex;
      flex-direction: column;
    }

    .right .nameAndBubble {
      display: flex;
      flex-direction: column;
      text-align: right;
    }

    .msgName {
      font-weight: bold;
      margin-bottom: 5px;
    }

    .message-bubble {
      width: auto;
      /* 设置元素的最大宽度为其父元素宽度的60%，这样可以限制消息气泡在不同屏幕宽度下不会过宽，保持合适的显示效果，避免内容撑得太开。*/
      //max-width: 90%;
      /* 给元素内部添加内边距，上下左右均为12px，内边距可以让消息内容在气泡内部有一定的空间，避免文字等内容紧贴着边框，提升视觉效果。*/
      padding: 12px;
      /* 在元素的底部设置外边距为12px，使得每个消息气泡之间在垂直方向上有一定的间隔，增强页面的层次感和可读性。*/
      margin-bottom: 12px;
      /* 设置元素的四个角为圆角，圆角半径为18px，让消息气泡的角看起来是圆润的，而不是直角，使整体外观更加柔和、美观。*/
      border-radius: 18px;
      /* 定义元素内文字的字体大小为16px，确定文字显示的基本大小，以保证文字在合适的视觉尺度上呈现，便于阅读。*/
      font-size: 16px;
      /* 设置行高为1.5倍字体大小，合适的行高有助于提升文字的可读性，让多行文字之间有适当的间距，不会显得过于拥挤。*/
      line-height: 1.5;
      /* 将元素以行内块级元素的形式进行显示，这样它既具有块级元素可以设置宽高、内外边距等特性，又能像行内元素一样在一行内排列（如果空间允许），常用于布局类似聊天消息这样需要灵活排列的元素。*/
      display: inline-block;
      /* 当元素内的文字等内容超出元素宽度时，自动进行换行，确保内容不会溢出元素边界，保证消息内容能完整显示。*/
      word-wrap: break-word;
    }

    .left .message-bubble {
      background-color: #bfbfbf;
      color: #000;
      margin-left: 10px;
      margin-right: auto;
    }

    .right .message-bubble {
      background-color: #9fdab8;
      color: rgb(8, 8, 8);
      margin-right: 10px;
      margin-left: auto;
      justify-content: flex-end;
      /* 新增：设置右浮动，确保与左消息交错 */
      float: right;
    }

    .chat-input-container {
      display: flex;
      flex-direction: column;
      height: 180px;
      background-color: #ffffff;
      box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
      border-radius: 0 0 40px 40px ; /* 上两个角设置圆角，下两个角不设置圆角 */
    }

    .func-logo {
      position: relative;
      display: flex;
      /* 使用 flex 布局，使子元素水平排列 */
      gap: 20px;
      /* 设置子元素之间的间距为 20px */
      //justify-content: center; /* 在水平方向上居中对齐子元素 */
      align-items: center;
      /* 在垂直方向上居中对齐子元素 */
      width: 100%;
      /* 设置容器的宽度为父元素的 100%，确保容器宽度自适应 */
      height: 30px;
      /* 设置容器的高度为 30px */
      background-color: #ffffff;
      /* 设置容器的背景色为 #87aca2（绿色调） */
    }


    .func-logo>div {
      padding: 2px;
      /* 给每个子元素添加一些内边距，提升点击区域 */
      font-size: 15px;
      color: #797979;
      background-color: #ffffff;
      /* 背景颜色 */
      //border-radius: 8px; /* 设置圆角 */
      cursor: pointer;
      /* 鼠标悬停时显示为指针 */
    }

    .func-logo>div:hover {
      background-color: #e0e0e0;
      /* 鼠标悬停时改变背景颜色 */
    }

    .send_area{
      height: 100%;
    }

    .chat-input {
      flex: 1;
      /* 让输入框占据父容器中剩余的空间 */
      height: 80%;
      /* 设置输入框的高度为 40px */
      width: 90%;
      padding: 2px 15px 5px 10px;
      /* 设置左右内边距为 15px，使输入框内容不贴边 */
      border: 1px solid #ffffff;
      /* 设置边框为 1px 宽，颜色为浅灰色（#ddd） */
      font-size: 16px;
      /* 设置输入框字体大小为 16px */
      outline: none;
      /* 移除输入框聚焦时的默认轮廓（边框阴影） */
      transition: border-color 0.3s ease;
      /* 设置边框颜色的平滑过渡效果 */
      white-space: pre-wrap;
      /* 保证换行符被正确显示 */
      word-wrap: break-word;
      /* 使超出宽度的内容自动换行 */
      line-height: 1.5;
      /* 设置行高，以改善文本显示 */
      border-radius: 0 0 0 40px;
    }

    .send-button {
      background-color: rgb(249, 250, 250);
      /* 设置按钮的背景颜色为蓝色 (#0084FF) */
      color: #5da877;
      /* 设置按钮文字颜色为白色 */
      font-size: 16px;
      /* 设置按钮文字大小为 16px */
      padding: 10px 20px;
      /* 设置按钮的内边距，上下 10px，左右 20px */
      border: none;
      /* 去掉按钮的边框 */
      border-radius: 20px;
      /* 设置按钮的圆角为 20px，使按钮边缘圆滑 */
      cursor: pointer;
      /* 设置鼠标悬停时，按钮显示为指针，表示可以点击 */
      margin-right: 10px;
      /* 设置按钮与输入框之间的左外边距为 10px，提供一些间隔 */
      margin-bottom: 10px;
      transition: background-color 0.3s ease;
      /* 设置按钮背景颜色的平滑过渡效果 */
    }

    .send-button:hover {
      background-color: #e0e0e0;
      /* 鼠标悬停时，按钮背景颜色变为深蓝色 (#005bb5) */
    }

    .emoji {
    position: relative;  /* 使得它成为定位上下文 */
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 1000; /* 确保它在其他元素之上 */
}
  }
  .modal-overlay888 {
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
  .modal-content888 {
    display: flex;
    flex-direction: column;
    background-color: rgb(255, 255, 255);
    color: #87aca2;
    padding: 20px;
    gap: 20px;
    border-radius: 8px;
    width: 600px;
    height: 600px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .users-container {
    height: 450px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    overflow-y: auto;
  }

  .showRoomUser{
    display: flex;
    flex-direction: column;
    width: 100px;
    height: 120px;
    gap:10px;
    border-radius: 10px;
    background-color: #f2f2f2;
    font-size: 16px;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
  }

  .roomUserAvatar{
    width: 40px;
  }

  .button-area{
    display: flex;
    flex-direction: row;
    justify-content: space-between;  /* 水平布局：将子元素分散排列，左边一个，右边一个 */
    align-items: flex-end;
    .modal-close2 {
    background-color: #87aca2;
    width: 80px;
    height: 30px;
    font-size: 14px;
    color: white;
    border: none;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;

    &:hover{
      font-size: 16px;
    }
  }
  }

  .roomInfom{
    gap: 20px;
  }

  .modal-overlay666 {
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
  .modal-content666 {
    display: flex;
    flex-direction: column;
    background-color: rgb(255, 255, 255);
    color: #000000;
    padding: 20px;
    gap: 20px;
    border-radius: 8px;
    width: 300px;
    height: 250px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .friendAvatar{
    width: 80px;
  }

  .friend-btn1{
    background-color: white;
    width: 80px;
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
  .friend-btn2{
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
  .friend-btn3{
    background-color: white;
    width: 50px;
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

  .friendName{
    font-weight: bold;
    font-size: 16px;
  }
</style>
  
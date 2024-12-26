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
              <img :src="roomUser.head" alt="用户头像" class="roomUserAvatar">
              <div class="roomUserName">{{ roomUser.username }}</div>
              <div class="roomUserId">{{ roomUser.userId }}</div>
            </div>
          </div>
          <div class="roomInfom">
            <div>房间名：{{ roomName }}</div>
            <div>id:{{ currentRoomId }}</div>
            <div>标签：{{ roomTags.join(', ') }}</div>
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
          <input type="text" class="search2-input" v-model="searchExist" placeholder="请输入房间名">
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
                  <div class="room-name2">{{ room.roomName }}</div>
                  <div v-if="room.roomType==='public'" class="room-people-count2">{{ room.roomPeopleCount }}</div>
                </div>
                <div class="room-tag2">{{ room.tags.join(', ') }}</div>
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
            <img :src="roomAvatar||'/images/微信图片_20241226230237.png'"  alt="Room Avater" class="room-avatar" />
            <div class="room-name">{{roomName}}</div>
          </div>
          <img :src="'public/images/再加三个点(More Three Dots)_爱给网_aigei_com.png'" class="settingimg"
              @click="showRoomSettingModal=true">
        </div>
        <!-- 聊天内容区域 -->
        <div class="chat-container">
          <div v-for="msg in currentRoomMsg" :key="msg.id">
            <div
              :class="{ 'left': msg.uid.toString() !== currentUserId, 'right': msg.uid.toString()=== currentUserId}">
              <div class="msgThreePart">
                <img class="msgAvater" :src="msg.userAvatar|| '/images/emoji/lips.png'"   @click="manageRel(msg)">
                <div class="nameAndBubble">
                  <div class="msgName">{{ msg.userName }}</div>
                    <template v-if="msg.type === 'TEXT'">
                      <div class="message-bubble">
                      {{ msg.content.text }}
                      </div>
                    </template>
                    <template v-else-if="msg.type === 'EMOJI'">
                      <img :src="msg.content.url" alt="emoji" class="emoji-image" />
                    </template>
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
            <textarea type="text" class="chat-input" placeholder="请输入消息..." @keyup.enter="sendMessage"/>
            <button class="send-button" @click="sendMessage" >发送</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { onMounted } from 'vue';
import Emoji from "../components/Emoji.vue";

const socket = ref(null); // WebSocket连接对象
const currentUserId = ref(null);
const rooms = ref([]);
const currentRoomId = ref(null);
const token = ref(null);
const roomAvatar = ref(null);  
const roomName = ref(null); 
const currentRoomMsg = ref([]);
const currentRoomUsers = ref([]);
const currentUserName=ref('');
const currentUserAvatar=ref('');
const roomTags = ref([]);
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
const userAvatars = ref({});  
const userNames = ref({});  
const defaultAvatar = "/images/ENFP-竞选者.png";

onMounted(async () => {
  try {
    currentUserId.value = localStorage.getItem('currentUserId');
    const token = localStorage.getItem('token'); 
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
    }
    catch (error) {
      console.error('获取own2信息失败', error);
    }
  try {
    currentUserId.value = localStorage.getItem('currentUserId');
    console.log("获取当前用户id成功", currentUserId.value);
    const token = localStorage.getItem('token'); 
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
    rooms.value = data;
    rooms.value.forEach(room => {
      if (room.roomType === 'private') {
        const otherUser =room.members.filter(member => member.uid !== currentUserId)[0];
        room.roomAvatar=otherUser.head;
        room.roomName=otherUser.username;
      }
    });
    console.log("聊天室加载成功", response.data.data);
    currentRoomId.value = localStorage.getItem("currentRoomId");
    console.log("跳转传递roomid：", currentRoomId.value);
    // 判断获取到的rooms数组是否有元素，如果有则将currentRoomId设为第一个房间的roomId
    if (rooms.value.length > 0 && (currentRoomId.value == null || currentRoomId.value == 'undefined')) {
      currentRoomId.value = rooms.value[0].roomId;
      console.log("列表第一个房间：", currentRoomId);
      localStorage.setItem("currentRoomId", currentRoomId.value);
    }
    }
    catch (error) {
      console.error('聊天室加载失败', error);
    }

    //fetchMessages();
});


// 监视目前房间Id
watch(currentRoomId, async (newRoomId) => {
  if (newRoomId) {
    console.log("newroomid:",newRoomId);
    try {
    const token = tokenValue.value; 

    const response1 = await axios.get(`http://localhost:8084/api/rooms/${newRoomId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const roomData = response1.data.data;
    currentRoomUsers.value=response1.data.data.members;
    if (roomData.roomType === 'public') {
      roomAvatar.value =response1.data.data.roomAvatar;
      roomName.value=response1.data.data.roomName;
      roomTags.value=response1.data.data.tags;
    }
    if (roomData.roomType === 'private') {
      const otherUser =response1.data.data.members.filter(member => member.uid !== currentUserId)[0];
      roomAvatar.value =otherUser.head;
      roomName.value=otherUser.username;
      if (otherUser) {
        console.log("找到私聊成员",roomName.value);
      } else {
        console.error("未找到房间中除当前用户外的其他成员");
      }
    }
    console.log("更新获取房间header信息成功", response1.data);
  } catch (error) {
    console.error('更新获取房间header信息失败', error);
  }
    try {
      const token = tokenValue.value; 
      const responseMsg = await axios.get(`http://localhost:8084/api/messages/sync?roomId=${currentRoomId.value}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log("获取房间历史消息成功",responseMsg.data);
      currentRoomMsg.value = responseMsg.data.data;
      await loadAvatars();  // 加载头像
      await loadNames();
    } catch (error) {
      console.error('noclick获取房间初始聊天记录失败', error);
    }

    if (socket.value) {
      socket.value.close(); 
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
      const token = localStorage.getItem('token'); 
      const response = await axios.post('http://localhost:8084/api/rooms/myroom-search', {
        "query": searchExist.value
        }, {  
        headers: { 'Authorization': `Bearer ${token}`}
      });
      console.log('搜索房间名字成功', response.data);
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
// 获取用户头像的缓存逻辑
const avatarCache = async (uid) => {
  // 如果头像已经缓存，直接返回
  if (userAvatars.value[uid]) {
    return userAvatars.value[uid];
  }

  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:8084/api/users/getInfo/${uid}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    const avatar = response.data.data.avatar;
    console.log("获取用户头像成功", avatar);
    userAvatars.value[uid] = avatar;  // 缓存头像
    return avatar;
  } catch (error) {
    console.error('获取头像失败:', error);
    return '/images/emoji/lips.png';  // 如果失败，返回默认头像
  }
};

// 加载消息的头像
const loadAvatars = async () => {
  // 遍历消息，获取每个用户的头像
  for (const msg of currentRoomMsg.value) {
    msg.userAvatar = await avatarCache(msg.uid);
  }
};

// 获取用户名字的缓存逻辑
const nameCache = async (uid) => {
  // 如果头像已经缓存，直接返回
  if (userNames.value[uid]) {
    return userNames.value[uid];
  }

  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:8084/api/users/getInfo/${uid}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    const name = response.data.data.username;
    console.log("获取用户名字成功", name);
    userNames.value[uid] = name;  // 缓存头像
    return name;
  } catch (error) {
    console.error('获取名字失败:', error);
    return ' ';  // 如果失败，返回默认头像
  }
};

// 加载消息的头像
const loadNames = async () => {
  // 遍历消息，获取每个用户的头像
  for (const msg of currentRoomMsg.value) {
    msg.userName = await nameCache(msg.uid);
  }
};

// 处理发送表情的事件
const sendEmoji = (item) => {
  console.log("发送表情:", item);
  const message = {
    uid: currentUserId.value,
    roomId: currentRoomId.value,
    type:"EMOJI",
    content: {
      url:item
    },
    userName: currentUserName.value, 
    userAvatar: currentUserAvatar.value, 
  };

  if (socket.value && socket.value.readyState === WebSocket.OPEN) {   
    socket.value.send(JSON.stringify(message)); 
    console.log("向websocket发送消息成功",JSON.stringify(message));
  } else { 
    console.log("向websocket发送消息失败",JSON.stringify(message));
    setTimeout(() => sendMessage(message), 1000); // 1秒后重试 
  }
};

const clickRoom = (room) => {
  currentRoomId.value=room.roomId.toString();
  console.log("click使房间号更改",currentRoomId.value);
};

const leaveRoom = async () => {
  try {
    const token = tokenValue.value; 
    const response = await axios.post(`http://localhost:8084/api/rooms/${currentRoomId.value}/leave`, {}, {  
     headers: {
    'Authorization': `Bearer ${token}`
      }
      });
    // 从后端获取房间数据
    const response2 = await axios.get('http://localhost:8084/api/rooms/room-choose', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = response2.data.data;
    rooms.value = data;
    localStorage.setItem('currentRoomId', '');
    showRoomSettingModal.value=false;
    window.location.reload();
    console.log('退出房间成功:', response.data);
  }
  catch (error) {
    console.log('退出房间失败');
  }
}
const  clear_data =()=> { localStorage.clear(); } 
const manageRel = async (msg)=>{
  friendId.value=msg.uid;
  friendAvatar.value=msg.userAvatar;
  friendName.value=msg.userName;
  showfriendInfoModal.value=true;
}
const clickUser = async (roomUser)=>{
  friendId.value=roomUser.userId;
  friendAvatar.value=roomUser.head;
  friendName.value=roomUser.username;
  showfriendInfoModal.value=true;
}

const startchattingRoom2 = async () =>{
  console.log("私聊对象id", friendId.value);
  try {
    const token = localStorage.getItem('token'); 
      const response = await axios.post('http://localhost:8084/api/rooms/create', {
        "receiverUid":friendId.value,
        "roomType":"private",
      },{ 
        headers: {
           'Authorization': `Bearer ${token}`
        }
        });
      //currentRoomId.value=response.data.data.roomId;
      console.log('发起聊天成功', response.data);
      showfriendInfoModal.value =false; 
      showRoomSettingModal.value=false;
    } catch (error) {
      console.error('发起聊天失败', error);
    }
}

const addBlacklist = async() =>{
  try {
    const token = localStorage.getItem('token'); 
    const response = await axios.post('http://localhost:8084/api/users/addblacklist', {
      "userId":friendId.value
    },{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      },
    );
    console.log('加入黑名单成功', response.data);
    showfriendInfoModal.value = false; 
  } catch (error) {
    console.error('加入黑名单失败', error);
  }
}
const sendMessage = async () => {
  const content = document.querySelector('.chat-input').value;
  if (content) {
    const message = {
      uid: currentUserId.value,
      roomId: currentRoomId.value,
      type:"TEXT",
      content: {
        text:content
      },
      userName: currentUserName.value, 
      userAvatar: currentUserAvatar.value, 
    };

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
      }
    }

    /* 页面主体内容 */
    .home2-content {
      display: flex;
      height: 90%;
      flex-direction: row;
      flex: 1;
      color: white;
      padding: 0px;
    }

    .chat_search {
      display: flex;
      justify-content: space-between;
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
      background-color: #87aca2;
      border-right: 1px solid #ddd;
      padding: 20px;
      box-sizing: border-box;
      height: 100%;
    }

    .roomshow {
      list-style: none;
      max-height: 80vh;
      overflow-y: auto;
    }

    .roomlist {
      list-style: none;
      max-height: 80vh;
      overflow-y: auto;
      padding: 0;
      margin-top: 15px;
      list-style-type: none;
    }

    .roomwindow {
      flex: 1;
      padding: 10px;
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
        flex-direction: column;
        gap: 10px;
      }

      .expNewmsg {
        display: flex;
        width: 210px;
        flex-direction: row;
        justify-content: space-between;
        gap: 20px;
      }

      // 房间名样式
      .room-name2 {
        font-size: 24px;
        font-weight: bold;
        flex: 1;
      }

      .room-tag2 {
        font-weight: bold;
        font-size: 12px;
      }

      // 房间人数样式
      .room-people-count2 {
        font-size: 14px;
        color: #777;
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
      border-radius: 40px 40px 0 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
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
      float: right;
      width: 30px;
    }

    .chat-container {
      //消息展示区
      flex: 1;
      padding: 10px;
      overflow-y: auto;
      background-color: #ffffff;
      flex-direction: column;
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
      padding: 12px;
      margin-bottom: 12px;
      border-radius: 18px;
      font-size: 16px;
      line-height: 1.5;
      display: inline-block;
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
      float: right;
    }

    .chat-input-container {
      display: flex;
      flex-direction: column;
      height: 180px;
      gap: 10px;
      background-color: #ffffff;
      box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.1);
      border-radius: 0 0 40px 40px ; 
    }

    .func-logo {
      position: relative;
      display: flex;
      gap: 20px;
      align-items: center;
      width: 100%;
      height: 30px;
      background-color: #ffffff;
    }


    .func-logo>div {
      padding: 2px;
      font-size: 15px;
      color: #797979;
      background-color: #ffffff;
      cursor: pointer;
    }

    .func-logo>div:hover {
      background-color: #e0e0e0;
    }

    .send_area{
      height: 100%;
    }

    .chat-input {
      flex: 1;
      height: 80%;
      width: 90%;
      padding: 2px 15px 5px 10px;
      border: 1px solid #ffffff;
      font-size: 16px;
      outline: none;
      transition: border-color 0.3s ease;
      white-space: pre-wrap;
      /* 保证换行符被正确显示 */
      word-wrap: break-word;
      /* 使超出宽度的内容自动换行 */
      line-height: 1.5;
      border-radius: 0 0 0 40px;
    }

    .send-button {
      background-color: rgb(249, 250, 250);
      color: #5da877;
      font-size: 16px;
      padding: 10px 20px;
      border: none;
      border-radius: 20px;
      cursor: pointer;
      margin-right: 10px;
      margin-bottom: 10px;
      transition: background-color 0.3s ease;
    }

    .send-button:hover {
      background-color: #e0e0e0;
    }

    .emoji {
    position: relative;  /* 使得它成为定位上下文 */
    width: 30px;
    height: 30px;
    margin-left: 10px;
    margin-top: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 1000;
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
    justify-content: center; 
    align-items: center; 
  }

  .roomUserAvatar{
    width: 40px;
  }

  .button-area{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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

  .emoji-image{
    width: 50px;
  }
</style>
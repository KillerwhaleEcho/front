import { createStore } from 'vuex';

const store = createStore({
  state: {
    currentUserId: null,
    currentRoomId: null // 添加 currentRoomId 变量，初始值设为 null
  },
  mutations: {
    setCurrentUserId(state, userId) {
      state.currentUserId = userId;
    },
    setCurrentRoomId(state, roomId) {
      state.currentRoomId = roomId;
    } // 添加设置 currentRoomId 的 mutation
  },
  actions: {
    // 可以在这里定义一些异步操作，比如从后端获取用户信息并设置用户id等
    // 例如以下是一个模拟从后端获取用户信息并设置用户id的异步操作示例
    // async fetchAndSetUserId({ commit }) {
    //   try {
    //     // 这里假设通过axios发送请求到后端获取用户id，实际需替换为真实接口
    //     const response = await axios.get('https://example.com/api/user'); 
    //     const userId = response.data.userId;
    //     commit('setCurrentUserId', userId);
    //   } catch (error) {
    //     console.error('获取用户ID失败', error);
    //   }
    // },
    // async fetchAndSetRoomId({ commit }, roomId) {
    //   try {
    //     // 可以在这里添加额外的逻辑，比如先验证房间id是否合法等
    //     commit('setCurrentRoomId', roomId);
    //   } catch (error) {
    //     console.error('设置当前房间ID失败', error);
    //   }
    // }
  },
  getters: {
    getCurrentUserId(state) {
      return state.currentUserId;
    },
    getCurrentRoomId(state) {
      return state.currentRoomId;
    } // 添加获取 currentRoomId 的 getter
  }
});

export default store;
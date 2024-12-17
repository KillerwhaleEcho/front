<template>
  <div class="emoji-content">
    <div class="emoji">
      <div class="emoji-wrapper">
        <ul class="emoji-list">
          <li
            class="emoji-item"
            v-for="(item, index) in emojiList"
            :key="index"
            @click="sendEmoji(item)"
          >
            <img :src="item" alt="" />
          </li>
        </ul>
      </div>
    </div>
    <div class="mask" @click="closeEmoji"></div>
  </div>
</template>


<script>

export default {
  data() {
    return {
      emojiList: [
        "/images/emoji/slightly-smiling-face.png",
        "/images/emoji/smiling-face.png",
        "/images/emoji/smiling-face-with-heart-eyes.png",
        "/images/emoji/smiling-face-with-sunglasses.png",
        "/images/emoji/thinking-face.png",
        "/images/emoji/tired-face.png",
        "/images/emoji/money-mouth-face.png",
        "/images/emoji/loudly-crying-face.png",
        "/images/emoji/pouting-face.png",
        "/images/emoji/face-screaming-in-fear.png",
        "/images/emoji/face-vomiting.png",
        "/images/emoji/face-without-mouth.png",
        "/images/emoji/face-with-tongue.png",
        "/images/emoji/clown-face.png",
        "/images/emoji/new-moon-face.png",
        "/images/emoji/ghost.png",
        "/images/emoji/jack-o-lantern.png",
        "/images/emoji/money-bag.png",
        "/images/emoji/pile-of-poo.png",
        "/images/emoji/shamrock.png",
        "/images/emoji/hibiscus.png",
        "/images/emoji/lips.png",
        "/images/emoji/sparkles.png",
        "/images/emoji/star.png",
        "/images/emoji/two-hearts.png",
        "/images/emoji/rainbow.png",
        "/images/emoji/thought-balloon.png",
      ],
    };
  },
  methods: {
    sendEmoji(item) {
      this.$emit("sendEmoji", item);
    },
    closeEmoji() {
      this.$emit("closeEmoji");
    }
  },
};
</script>

<style lang="scss" scoped>
.emoji-content {
  .emoji {
  width: 360px;
  height: 200px;
  background-color: rgba(216, 216, 216, 0.897);
  position: absolute;
  top: -200px;
  left: 10px;
  border-radius: 10px;
  transition: 0.3s;
  z-index: 3;

  // &::after {
  //   content: "";
  //   display: block;
  //   width: 0;
  //   height: 0;
  //   border-top: 10px solid rgb(216, 216, 216, 0.897);
  //   border-right: 10px solid transparent;
  //   border-left: 10px solid transparent;
  //   position: absolute;
  //   bottom: -8px;
  //   left: 15px;
  //   z-index: 100;
  // }
  .emoji-wrapper {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(127, 179, 177, 0.1);
      background: rgb(115, 117, 122);
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 5px rgba(167, 183, 185, 0.1);
      border-radius: 10px;
      background: rgb(39, 42, 55);
    }
    .emoji-list {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin-left: 10px;
      .emoji-item {
        list-style: none;
        width: 50px;
        height: 50px;
        border-radius: 10px;
        margin: 5px;
        position: relative;
        cursor: pointer;
        &:hover {
          background-color: rgb(50, 54, 68);
        }
        img {
          width: 35px;
          height: 35px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }

}
.mask {
    width: 100%;
    height: 100%;
    position: fixed;
    background: transparent;
    left: 0;
    top: 0;
    z-index: 1;
  }
}

</style>
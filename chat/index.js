const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const utils = require('./utils');

app.use(express.static(path.join(__dirname, './view')));

http.listen(3000, () => {
  console.log('listening on *:3000');
});
// 在线用户
const onlineUsers = {
  default: [],
};
// 聊天室集合
const rooms = [
  {
    id: 0,
    name: 'default',
    users: [],
  }
];
io.on('connection', socket => {
  let interRoom;
  let userInfo;
  // 用户事件-加入房间
  socket.on('joinRoom', (data, fn) => {
    const {
      roomName,
      user,
    } = data;
    
    let room;
    for (let r of rooms) {
      if (r && r.name === roomName) {
        room = r;
        break;
      }
    }

    // 如果聊天室存在
    if (room) {
      if (user.id) {
        let ifExist = false;

        // 遍历用户列表，查看是否已存在
        for (let u of room.users) {
          if (u.id === user.id) {
            ifExist = true;
            return false;
          }
        }

        // 如果该用户还未在该聊天室中
        if (!ifExist) {

          // 推送到记录中
          room.users.push(user);
          interRoom = room;
          userInfo = user;
          // 加入房间
          socket.join(room.id);
          // 通知房间内的人员
          io.to(room.id).emit('room-change-users', room.users);
        }
      }
    }
  });

  // 房间消息
  socket.on('room-msg', (msg, fn) => {
    if (interRoom) {
      if (msg.content) {
        msg.content = msg.content
                        .replace(/&/g,'&amp;')
                        .replace(/\'/g,'&#x27;')
                        .replace(/\"/g,'&quot;')
                        .replace(/</g,'&lt;')
                        .replace(/>/g,'&gt;')
                        .replace(/ /g,'&nbsp;')
                        .replace(/·/g,'&#x60;')
                        .replace(/\n/g,'</br>');
      }
      io.to(interRoom.id).emit('room-new-msg', msg);
    }
  });
  
  // 监听用户退出
  socket.on('disconnect', () => {
    // 如果已经进入过聊天室
    if (interRoom && userInfo) {
      // 清除记录
      const index = interRoom.users.indexOf(userInfo);
      if (index != -1) {
        interRoom.users.splice(index, 1);
      }
      
      // 离开房间
      socket.leave(interRoom.id);
      // 通知房间内的人员
      io.to(interRoom.id).emit('room-change-users', interRoom.users);
    }
  });
  
});

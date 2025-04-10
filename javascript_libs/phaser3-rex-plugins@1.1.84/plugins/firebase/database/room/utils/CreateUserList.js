import OnlineUserList from '../../onlineuserlist/OnlineUserList.js';

var CreateUserList = function (config) {
    var userList = new OnlineUserList({
        eventEmitter: this.getEventEmitter(),
        eventNames: {
            join: 'userlist.join', // Any user join
            leave: 'userlist.leave', // Any user leave
            update: 'userlist.update', // Update user list
            change: 'userlist.change', // Any user(name) change
            init: 'userlist.init',
            changename: 'userlist.changename'
        },

        userID: this.userInfo
    });
    userList
        .on('userlist.leave', function (user) {
            if (user.userID === this.userID) {
                OnLeftRoom.call(this);  // Current user is left or kicked
            }
        }, this)

    this
        .on('room.join', function () {
            userList
                .startUpdate()
        })
        .on('room.leave', function () {
            userList
                .stopUpdate()
                .clear()
        })

    return userList;
}

var OnLeftRoom = function () {
    this.emit('room.leave');

    // Clear room info later
    var self = this;
    setTimeout(function () {
        self.roomID = undefined;
        self.roomName = undefined;
        self.doorState = undefined;
        self.leftRoomFlag = false;
    }, 0);
}

export default CreateUserList;
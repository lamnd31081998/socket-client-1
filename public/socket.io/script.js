let socket = io('http://localhost:3000');

let form = document.getElementById('form');
let input = document.getElementById('input');
let message_container = document.getElementById('messages');
let buttonOpenOnlineUserModal = document.getElementById('openUserOnlineModal');

/* Bắt đầu vào phòng chat */
let name = prompt('Your name?');
/* Thông báo gia nhập phòng chat*/
appendMessage('You joined chat room');
/* Gửi lên server yêu cầu thông báo cho
các người dùng khác trong phòng chat biết mình đã vào phòng chat*/
socket.emit('new-user-connected', name);

/* Thông báo khi ai đó vừa vào phòng chat */
socket.on('new-user-connected', (name) => {
    appendMessage(`${name} joined chat room`)
})

/* Thông báo khi ai đó vừa rời phòng chat */
socket.on('user-disconnect', (name) => {
    appendMessage(`${name} outed chat room`)
})

/* Lấy thông tin người dùng đang trong phòng chat */
socket.on('get-user-online', (data) => {
    $('#user-online-container').empty();
    let i = 1;
    Object.keys(data.users).forEach(index => {
        let userOnlineItem = document.createElement('p');
        if (index === data.user_id) {
            userOnlineItem.textContent = `${i}. ${data.users[index].name} (You)`;
        }
        else {
            userOnlineItem.textContent = `${i}. ${data.users[index].name}`;
        }
        $('#user-online-container').append(userOnlineItem);
        i++;
    })
})

/* Hiển thị tin nhắn mới của người dùng trong phòng chat */
socket.on('send-message', (data) => {
    appendMessage(`${data.name}: ${data.msg}`)
})

/* Thông báo khi người dùng nào đó trong phòng chat đang nhập */
socket.on('user-on-typing', (name) => {
    $('#typing').css('display', 'inline');
    $('#typing').text(`${name} is typing ...`);
})

/* Thông báo khi người dùng nào đó trong phòng chat ngừng nhập */
socket.on('user-not-typing', () => {
    $('#typing').css('display', 'none');
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    /* Hiển thị tin nhắn bạn vừa gửi */
    appendMessage('You: ' + input.value);
    /* Gửi lên server yêu cầu hiển thị tin nhắn
    bạn vừa gửi cho những người khác trong phòng chat*/
    socket.emit('send-message', input.value);
    input.value = '';
})

buttonOpenOnlineUserModal.addEventListener('click', (e) => {
    /* Gửi lên server yêu cầu lấy danh sách người dùng
    đang trong phòng chat */
    socket.emit('get-user-online');
    $('#userOnlineModal').modal('show');
})

input.addEventListener('input', (e) => {
    if (input.value === '') {
        /* Gửi lên server yêu cầu hiển thị rằng bạn đã ngừng nhập
        cho những người trong phòng chat biết */
        socket.emit('user-not-typing');
    }
    else {
        /* Gửi lên server yêu cầu hiển thị rằng bạn đang nhập
        cho những người trong phòng chat biết */
        socket.emit('user-on-typing');
    }
})

input.addEventListener('blur', (e) => {
    /* Gửi lên server yêu cầu hiển thị rằng bạn đã ngừng nhập
    cho những người trong phòng chat biết */
    socket.emit('user-not-typing');
})

/* Chức năng thêm tin nhắn vào màn hình client */
function appendMessage(msg) {
    let message_item = document.createElement('li');
    message_item.textContent = msg;
    message_container.appendChild(message_item);
}
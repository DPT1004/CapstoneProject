const timeWaitToNextQuestion = 3000 //ms
const BASE_URL = "http://192.168.1.5:3000/api"
const arrTime = [10, 20, 30, 60, 90]
const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        // Generate random number
        let j = Math.floor(Math.random() * (i + 1));

        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

export {
    timeWaitToNextQuestion,
    BASE_URL,
    arrTime,
    shuffleArray
}
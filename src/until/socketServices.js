import io from 'socket.io-client'
import { SOCKET_URL } from '../common/shareVarible'
import { Alert } from 'react-native'
var socketId = ""

class SocketService {
    initializeSocket = async () => {
        try {

            this.socket = io(SOCKET_URL, {
                transports: ['websocket']
            })
            console.log("initializing socket")

            this.socket.on('connect', () => {
                socketId = this.socket.id
                console.log("=== socket connected ====")
            })

            this.socket.on('disconnect', () => {
                Alert.alert(
                    "OOPS !!!",
                    "socket disconnected to server, check your network connection",
                    [
                        {
                            text: "Ok",
                        }
                    ],
                )
                console.log("=== socket disconnected ====")
            })

            this.socket.on('error', (error) => {
                ToastAndroid.show("socket error " + error, ToastAndroid.SHORT)
                console.log("socket error", error)
            })

        } catch (error) {
            console.log("socket is not inialized", error)
        }
    }

    emit(event, data = {}) {
        this.socket.emit(event, data)
    }

    on(event, cb) {
        this.socket.on(event, cb)
    }

    removeListener(listenerName) {
        this.socket.removeListener(listenerName)
    }

}

const socketServcies = new SocketService()

export { socketId }
export default socketServcies
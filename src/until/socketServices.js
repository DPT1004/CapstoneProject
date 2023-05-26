import io from 'socket.io-client'
import { SOCKET_URL } from '../common/shareVarible'
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
                console.log("=== socket disconnected ====")
            })

            this.socket.on('error', (data) => {
                console.log("socket error", data)
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
import React from "react"
import { COLORS, SIZES } from '../../common/theme'
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from "react-native"
import ChooseFileBTN from '../../components/ChooseFileBTN'
import { WebView } from 'react-native-webview'
import YoutubePlayer from "react-native-youtube-iframe"
const Test4 = () => {
    const playerRef = React.useRef();
    const [timeStart, setTimeStart] = React.useState(0)
    const [timeEnd, setTimeEnd] = React.useState(0)
    const [duration, setDuration] = React.useState(0)
    const [fileUri, setFileUri] = React.useState({
        type: "image",
        path: ""
    })
    const handleValueChange = React.useCallback((low, high) => {
        setTimeStart(low);
        timeEnd(high);
    }, [])

    return (
        <View style={styles.container}>
            {/* Image/Video/Youtube for Question upload */}
            {/* <ChooseFileBTN setFileUri={setFileUri} fileUri={fileUri} /> */}
            {/* {
                fileUri.path !== "" &&
                <View style={{ width: "100%", height: 180 }}>

                    <WebView source={{ uri: fileUri.path }} />
                </View>
            } */}
            {
                fileUri.path !== "" &&
                <View style={{ width: "100%", height: 200 }} pointerEvents="none">
                    <YoutubePlayer
                        height={200}
                        ref={playerRef}
                        initialPlayerParams={{ start: timeStart, end: timeEnd, iv_load_policy: 3, controls: false, showInfo: false }}
                        play={true}
                        // videoId={fileUri.path}
                        playList={[fileUri.path]}
                        onReady={() => {
                            playerRef.current.seekTo(timeStart, true)
                            playerRef.current?.getDuration().then(
                                getDuration => setDuration(getDuration)
                            )
                        }}
                    />

                </View>
            }
            <TextInput
                placeholder="Url"
                onChangeText={(txt) => setFileUri({
                    type: "youtube",
                    path: txt
                })}
                value={fileUri.path}
                style={{ width: "90%", height: 40, borderWidth: 2, borderColor: COLORS.gray, alignSelf: "center", marginVertical: 5 }}
            />
            {/* <TextInput
                placeholder="Start time"
                onChangeText={(txt) => setTimeStart(txt)}
                value={timeStart}
                style={{ width: "90%", height: 40, borderWidth: 2, borderColor: COLORS.gray, alignSelf: "center", marginVertical: 5 }}
            />
            <TextInput
                placeholder="End time"
                onChangeText={(txt) => setTimeEnd(txt)}
                value={timeEnd}
                style={{ width: "90%", height: 40, borderWidth: 2, borderColor: COLORS.gray, alignSelf: "center", marginVertical: 5 }}
            /> */}
            {/* <Button
                title="Apply url"
                onPress={() => setFileUri({
                    type: "video",
                    path: "https://firebasestorage.googleapis.com/v0/b/capstoneproject-754a4.appspot.com/o/VID20230602181217.mp4?alt=media&token=be8ffbf7-7afa-475a-ab1d-046b0e28d0e8"
                })}
            /> */}
            <Button
                title="Reset url"
                onPress={() => setFileUri({
                    type: "image",
                    path: ""
                })}
            />
        </View>
    )
}

export default Test4

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    btnSetting: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        position: "absolute",
        top: 19,
        left: 10
    },

});
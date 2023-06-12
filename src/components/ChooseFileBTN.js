import React from 'react'
import { Text, TextInput, StyleSheet, TouchableOpacity, Image, ToastAndroid, LayoutAnimation, View } from 'react-native'
import { COLORS } from '../common/theme'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { useSelector } from 'react-redux'
import FormButton from "./FormButton"
import ImagePicker from 'react-native-image-crop-picker'
import YoutubePlayer from "react-native-youtube-iframe"
import VideoPlayer from 'react-native-video-controls'
import Video from 'react-native-video'
import Icon from 'react-native-vector-icons/FontAwesome'


const ChooseFileBTN = ({ setFileUri, fileUri }) => {

    const internet = useSelector((state) => state.internet)

    const lastTap = React.useRef(0)
    const bottomSheetModalRef = React.useRef(null)
    const snapPoints = React.useMemo(() => ["60%", "60%"], [])
    const [showInputUrlYoutube, setShowInputUrlYoutube] = React.useState(false)
    const [urlYoutube, setUrlYoutube] = React.useState("")

    React.useEffect(() => {
        if (fileUri.path != "") {
            setUrlYoutube(fileUri.path)
        }
    }, [fileUri])

    const checkValidTypeFile = (file) => {
        var path
        if (file.type === "image") {
            path = file.path
            if (path.includes(".png") || path.includes(".jpg") || path.includes(".jpeg")) {
                return true
            }
            return false
        } else if (file.type === "video") {
            path = file.path
            if (path.includes(".mp3") || path.includes(".mp4")) {
                return true
            }
            return false
        }
    }

    const takeIdInUrlYoutube = (url) => {
        var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
        var match = url.match(regExp)
        if (match && match[2].length === 11) {
            return match[2]
        }
        return false
    }

    const selectImage = async () => {
        try {
            await ImagePicker.openPicker({
                cropping: false,
                mediaType: "photo",
            }).then(file => {
                var newFile = {
                    type: "image",
                    path: file.path
                }

                if (checkValidTypeFile(newFile)) {
                    setFileUri(newFile)
                } else {
                    ToastAndroid.show("Incorrect image file format ", ToastAndroid.SHORT)
                }
                bottomSheetModalRef.current?.close()
            })
        } catch (error) {
            if (error.code === 'E_PICKER_CANCELLED') {
                return false;
            }
        }
    }

    const selectVideo = async () => {
        try {
            await ImagePicker.openPicker({
                mediaType: 'video',
            }).then(file => {
                var newFile = {
                    type: "video",
                    path: file.path
                }

                if (checkValidTypeFile(newFile)) {
                    setFileUri(newFile)
                } else {
                    ToastAndroid.show("Incorrect video file format ", ToastAndroid.SHORT)
                }
                bottomSheetModalRef.current?.close()
            });
        } catch (error) {
            if (error.code === 'E_PICKER_CANCELLED') {
                return false;
            }
        }
    }

    const renderFile = () => {
        if (fileUri == undefined) {
            return (<></>)
        }
        else if (fileUri.type == "image") {
            return (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{ paddingVertical: 30 }}
                    onPress={() => {
                        const now = Date.now()
                        const DELAY = 400

                        // detect if a double tap
                        if (lastTap.current && now - lastTap.current < DELAY) {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
                            setFileUri({
                                type: "image",
                                path: ""
                            })
                        } else {
                            lastTap.current = now
                        }
                    }}
                    onLongPress={() => selectImage()}>
                    <Image
                        source={{ uri: fileUri.path }}
                        resizeMode={"stretch"}
                        style={styles.img}
                    />
                </TouchableOpacity>

            )
        } else if (fileUri.type == "video") {
            return (
                <View style={styles.video}>
                    <VideoPlayer
                        disableBack={true}
                        disableFullscreen={true}
                        style={{ flex: 1, alignSelf: "center" }}
                        source={{ uri: fileUri.path }}
                        onError={error => ToastAndroid.show(String(error), ToastAndroid.SHORT)}
                        paused={true}
                        resizeMode={"stretch"}
                    />
                    {/* <Video
                        source={{ uri: fileUri.path }}
                        controls={true}
                        style={{ flex: 1 }}
                        resizeMode={"stretch"}
                        onLoad={({ naturalSize }) => {
                            console.log(naturalSize.width, naturalSize.height);
                        }}
                    /> */}
                    <View style={styles.containerBtnVideo}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[styles.btnVideo, { marginRight: 1 }]}
                            onPress={() => {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
                                setFileUri({
                                    type: "video",
                                    path: ""
                                })
                            }}
                        >
                            <Text style={styles.txtVideo}>Delete Video</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.btnVideo}
                            onPress={() => {
                                selectVideo()
                            }}
                        >
                            <Text style={styles.txtVideo}>Change Video</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            )
        } else if (fileUri.type == "youtube") {
            return (
                <>
                    <YoutubePlayer
                        play={true}
                        videoId={urlYoutube}
                        webViewStyle={{ flex: 1, aspectRatio: 16 / 9 }}
                        allowWebViewZoom={true}
                        onError={error => ToastAndroid.show(String(error), ToastAndroid.SHORT)}
                    />
                    <View style={styles.containerBtnVideo}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[styles.btnVideo, { marginRight: 1 }]}
                            onPress={() => {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
                                setFileUri({
                                    type: "youtube",
                                    path: ""
                                })
                            }}
                        >
                            <Text style={styles.txtVideo}>Delete Video</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.btnVideo}
                            onPress={() => {
                                LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
                                setShowInputUrlYoutube(true)
                            }}
                        >
                            <Text style={styles.txtVideo}>Change Video</Text>
                        </TouchableOpacity>

                    </View>
                </>
            )
        }
    }

    return (

        <>
            {
                showInputUrlYoutube ?
                    <>
                        {/** TextInput to type Youtube URL */}
                        <View style={{ flexDirection: "row", fontSize: 15 }}>
                            <TextInput
                                value={urlYoutube}
                                placeholder='Paste Youtube Url here'
                                selectionColor={COLORS.primary}
                                onChangeText={(txt) => setUrlYoutube(txt)}
                                style={{ flex: 1 }}
                            />
                            {
                                urlYoutube !== "" &&
                                <TouchableOpacity
                                    onPress={() => setUrlYoutube("")}
                                    style={styles.btnRemoveTxtInTxtInput}
                                >
                                    <Icon
                                        size={20}
                                        color={COLORS.black}
                                        name={"remove"}
                                    />
                                </TouchableOpacity>
                            }
                        </View>

                        {/**Button to Apply or Cancel Video */}
                        <View style={{ flexDirection: "row" }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={[styles.btnVideo, { marginRight: 1 }]}
                                onPress={() => {
                                    if (internet.isOnlineStatus) {
                                        if (takeIdInUrlYoutube(urlYoutube) !== false) {
                                            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
                                            var idUrlYoutube = takeIdInUrlYoutube(urlYoutube)

                                            setFileUri({
                                                type: "youtube",
                                                path: idUrlYoutube
                                            })
                                            setUrlYoutube(idUrlYoutube)

                                            setShowInputUrlYoutube(false)
                                        } else {
                                            ToastAndroid.show("Incorrect Youtube Url", ToastAndroid.SHORT)
                                        }
                                    } else {
                                        ToastAndroid.show('No network connection', ToastAndroid.SHORT)
                                    }
                                }}
                            >
                                <Text style={styles.txtVideo}>Apply Video</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.btnVideo}
                                onPress={() => {
                                    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
                                    setUrlYoutube("")
                                    setShowInputUrlYoutube(false)
                                }}
                            >
                                <Text style={styles.txtVideo}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                    :
                    fileUri.path == '' ?
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.btnChooseIMG}
                            onPress={() => bottomSheetModalRef.current?.present()}>
                            <Text style={styles.txtChooseIMG}>
                                + choose file
                            </Text>
                        </TouchableOpacity>
                        :
                        renderFile()

            }

            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
            >
                <View style={styles.contentContainer}>

                    <FormButton
                        labelText="Choose Image"
                        isPrimary={true}
                        style={{ marginBottom: 20 }}
                        children={
                            <View style={styles.viewIcon}>
                                <Icon
                                    name={"file-picture-o"}
                                    size={24}
                                    color={COLORS.white}
                                />
                            </View>
                        }
                        handleOnPress={() => {
                            selectImage()
                        }}
                    />

                    <FormButton
                        labelText="Choose Video"
                        isPrimary={true}
                        style={{ marginBottom: 20 }}
                        children={
                            <View style={styles.viewIcon}>
                                <Icon
                                    name={"file-video-o"}
                                    size={24}
                                    color={COLORS.white}
                                />
                            </View>
                        }
                        handleOnPress={() => {
                            selectVideo()
                        }}
                    />

                    <FormButton
                        labelText="YouTube Url"
                        isPrimary={true}
                        style={{ marginBottom: 20 }}
                        children={
                            <View style={styles.viewIcon}>
                                <Icon
                                    name={"youtube"}
                                    size={24}
                                    color={COLORS.white}
                                />
                            </View>
                        }
                        handleOnPress={() => {
                            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
                            setShowInputUrlYoutube(true)
                            bottomSheetModalRef.current?.close()
                        }}
                    />

                    <FormButton
                        labelText="Cancel"
                        isPrimary={false}
                        style={{ marginBottom: 20 }}
                        handleOnPress={() => bottomSheetModalRef.current?.close()}
                    />
                </View>

            </BottomSheetModal>
        </>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    containerBtnVideo: {
        flexDirection: "row",
        width: "100%"
    },
    viewIcon: {
        position: 'absolute',
        top: 0,
        left: 5,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    video: {
        height: 220,
        width: "100%"
    },
    txtChooseIMG: {
        opacity: 0.5,
        color: COLORS.primary
    },
    txtVideo: {
        fontSize: 15,
        color: COLORS.white
    },
    btnRemoveTxtInTxtInput: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10
    },
    btnVideo: {
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    btnChooseIMG: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        backgroundColor: COLORS.primary + '20',
    },
    img: {
        width: '100%',
        height: 200,
        borderRadius: 5,
    }
})

export default React.memo(ChooseFileBTN)


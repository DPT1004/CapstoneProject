import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    ToastAndroid,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';
import { COLORS } from '../../../constants/theme';
import FormInputCheckBox from '../../../components/FormInputCheckBox';
import FormButton from '../../../components/FormButton';
import FormInput from '../../../components/FormInput'
import { createQuestion } from '../../../utils/database';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import { screenName } from '../../../navigator/screens-name';

const CheckBox = ({ navigation, route }) => {
    const [currentQuizId, setCurrentQuizId] = useState(
        route.params.currentQuizId,
    );
    const [currentQuizTitle, setCurrentQuizTitle] = useState(
        route.params.currentQuizTitle,
    );

    const [question, setQuestion] = useState('');
    const [imageUri, setImageUri] = useState('');

    const [optionOne, setOptionOne] = useState({
        choosen: false,
        txt: ""
    });
    const [optionTwo, setOptionTwo] = useState({
        choosen: false,
        txt: ""
    });
    const [optionThree, setOptionThree] = useState({
        choosen: false,
        txt: ""
    });
    const [optionFour, setOptionFour] = useState({
        choosen: false,
        txt: ""
    });

    const handleQuestionSave = async () => {
        if (
            question == '' ||
            correctAnswer == '' ||
            optionTwo == '' ||
            optionThree == '' ||
            optionFour == ''
        ) {
            return;
        }

        let currentQuestionId = Math.floor(
            100000 + Math.random() * 9000,
        ).toString();

        // Upload Image
        let imageUrl = '';

        if (imageUri != '') {
            const reference = storage().ref(
                `/images/questions/${currentQuizId}_${currentQuestionId}`,
            );
            await reference.putFile(imageUri).then(() => {
                console.log('Image Uploaded');
            });
            imageUrl = await reference.getDownloadURL();
        }

        const arrOption = [optionOne, optionTwo, optionThree, optionFour]
        const correctAnswer = []
        const incorrectAnswer = []
        arrOption.forEach(element => {
            element.choosen ? correctAnswer.push(element.txt) : incorrectAnswer.push(element.txt)

        });

        // Add question to db
        await createQuestion(currentQuizId, currentQuestionId, {
            question: question,
            correct_answer: correctAnswer,
            incorrect_answers: incorrectAnswer,
            imageUrl: imageUrl,
        });
        ToastAndroid.show('Question saved', ToastAndroid.SHORT);

        // Reset
        setQuestion({
            choosen: false,
            txt: ""
        });
        setOptionOne({
            choosen: false,
            txt: ""
        });
        setOptionTwo({
            choosen: false,
            txt: ""
        });
        setOptionThree({
            choosen: false,
            txt: ""
        });
        setOptionFour({
            choosen: false,
            txt: ""
        });
        setImageUri("");
    };

    const selectImage = async () => {
        await ImagePicker.openPicker({
            cropping: false
        }).then(image => {
            setImageUri(image.path)
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}>
                <Text
                    style={styles.txtTypeQuestion}>
                    CheckBox Question
                </Text>
                <Text style={styles.txtNameQuiz}>
                    For {currentQuizTitle}
                </Text>
                <FormInput
                    labelText="Question"
                    placeholderText="enter question"
                    onChangeText={val => setQuestion(val)}
                    value={question}
                />

                {/* Image upload */}
                {imageUri == '' ? (
                    <TouchableOpacity
                        style={styles.btnChooseIMG}
                        onPress={selectImage}>
                        <Text style={styles.txtChooseIMG}>
                            + choose image
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <Image
                        source={{ uri: imageUri }}
                        resizeMode={'cover'}
                        style={styles.img}
                    />
                )}

                {/* Options */}
                <View style={styles.viewOptionAndAnswer}>
                    <FormInputCheckBox
                        labelText="Option 1"
                        onChangeText={val => setOptionOne({
                            choosen: optionOne.choosen,
                            txt: val
                        })}
                        onPress={() => setOptionOne({
                            choosen: !optionOne.choosen,
                            txt: optionOne.txt
                        })
                        }
                        showCharCount={true}
                        maxLength={255}
                        value={optionOne}
                    />
                    <FormInputCheckBox
                        labelText="Option 2"
                        onChangeText={val => setOptionTwo({
                            choosen: optionTwo.choosen,
                            txt: val
                        })}
                        onPress={() => setOptionTwo({
                            choosen: !optionTwo.choosen,
                            txt: optionTwo.txt
                        })}
                        showCharCount={true}
                        maxLength={255}
                        value={optionTwo}
                    />
                    <FormInputCheckBox
                        labelText="Option 3"
                        onChangeText={val => setOptionThree({
                            choosen: optionThree.choosen,
                            txt: val
                        })}
                        onPress={() => setOptionThree({
                            choosen: !optionThree.choosen,
                            txt: optionThree.txt
                        })}
                        showCharCount={true}
                        maxLength={255}
                        value={optionThree}
                    />
                    <FormInputCheckBox
                        labelText="Option 4"
                        onChangeText={val => setOptionFour({
                            choosen: optionFour.choosen,
                            txt: val
                        })}
                        onPress={() => setOptionFour({
                            choosen: !optionFour.choosen,
                            txt: optionFour.txt
                        })}
                        showCharCount={true}
                        maxLength={255}
                        value={optionFour}
                    />
                </View>
                <FormButton
                    labelText="Save Question"
                    handleOnPress={handleQuestionSave}
                />
                <FormButton
                    labelText="Done & Go CreateQuiz"
                    isPrimary={false}
                    handleOnPress={() => {
                        setCurrentQuizId('');
                        navigation.navigate(screenName.CreateQuiz);
                    }}
                    style={{
                        marginVertical: 20,
                    }}
                />
            </ScrollView>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollView: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingHorizontal: 20
    },
    viewOptionAndAnswer: {
        marginVertical: 30
    },
    txtTypeQuestion: {
        fontSize: 20,
        textAlign: 'center',
        color: COLORS.black
    },
    txtNameQuiz: {
        textAlign: 'center',
        marginBottom: 20
    },
    txtChooseIMG: {
        opacity: 0.5,
        color: COLORS.primary
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

export default CheckBox;

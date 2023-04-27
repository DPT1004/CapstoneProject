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
import FormInput from '../../../components/FormInput';
import FormButton from '../../../components/FormButton';
import { createQuestion } from '../../../utils/database';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import { screenName } from '../../../navigator/screens-name';

const MultipleChoice = ({ navigation, route }) => {
    const [currentQuizId, setCurrentQuizId] = useState(
        route.params.currentQuizId,
    );
    const [currentQuizTitle, setCurrentQuizTitle] = useState(
        route.params.currentQuizTitle,
    );

    const [question, setQuestion] = useState('');
    const [imageUri, setImageUri] = useState('');

    const [correctAnswer, setCorrectAnswer] = useState('');
    const [optionTwo, setOptionTwo] = useState('');
    const [optionThree, setOptionThree] = useState('');
    const [optionFour, setOptionFour] = useState('');

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

        // Add question to db
        await createQuestion(currentQuizId, currentQuestionId, {
            question: question,
            correct_answer: correctAnswer,
            incorrect_answers: [optionTwo, optionThree, optionFour],
            imageUrl: imageUrl,
        });
        ToastAndroid.show('Question saved', ToastAndroid.SHORT);

        // Reset
        setQuestion('');
        setCorrectAnswer('');
        setOptionTwo('');
        setOptionThree('');
        setOptionFour('');
        setImageUri('');
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
                <Text style={styles.txtTypeQuestion}> Multiple Choice Question</Text>
                <Text style={styles.txtNameQuiz}>For {currentQuizTitle}</Text>
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
                    <TouchableOpacity
                        onPress={selectImage}>
                        <Image
                            source={{ uri: imageUri }}
                            resizeMode={'cover'}
                            style={styles.img}
                        />
                    </TouchableOpacity>
                )}

                {/* Options */}
                <View style={styles.viewOptionAndAnswer}>
                    <FormInput
                        labelText="Correct Answer"
                        onChangeText={val => setCorrectAnswer(val)}
                        value={correctAnswer}
                        showCharCount={true}
                        maxLength={255}
                    />
                    <FormInput
                        labelText="Option 2"
                        onChangeText={val => setOptionTwo(val)}
                        value={optionTwo}
                        showCharCount={true}
                        maxLength={255}
                    />
                    <FormInput
                        labelText="Option 3"
                        onChangeText={val => setOptionThree(val)}
                        value={optionThree}
                        showCharCount={true}
                        maxLength={255}
                    />
                    <FormInput
                        labelText="Option 4"
                        onChangeText={val => setOptionFour(val)}
                        value={optionFour}
                        showCharCount={true}
                        maxLength={255}
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

export default MultipleChoice;

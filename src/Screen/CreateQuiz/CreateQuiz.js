import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid, ScrollView, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native'
import { useNavigation } from "@react-navigation/native"
import { screenName } from '../../navigator/screens-name'
import { COLORS } from '../../common/theme'
import { BASE_URL } from '../../common/shareVarible'
import { img } from '../../assets/index'
import FormInput from '../../components/FormInput'
import FormButton from '../../components/FormButton'
import Icon from "react-native-vector-icons/FontAwesome"
import Icon1 from "react-native-vector-icons/Octicons"
import { useDispatch } from 'react-redux'
import { addNewQuiz } from '../../redux/Slice/newQuizSlice'

const maxChooseCategory = 3

const CreateQuiz = () => {

  const navigation = useNavigation()
  const dispatch = useDispatch()

  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [categories, setCategories] = React.useState([])
  const [chooseCategory, setChooseCategory] = React.useState([])
  const [display, setDisplay] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(false)


  const GET_AllCategory = async () => {
    setIsLoading(true)
    var url = BASE_URL + "/category"
    try {
      await fetch(url, {
        method: "GET"
      })
        .then(response => {
          if (response.ok) {
            if (response.status == 200) {
              Promise.resolve(response.json())
                .then((data) => {
                  setCategories(data)
                })
            }
          }
        }).finally(() => setIsLoading(false))
    } catch (error) {
      ToastAndroid.show("error: " + error, ToastAndroid.SHORT)
    }
  }

  const getOptionBgColor = (item) => {
    if (chooseCategory.includes(item)) {
      return COLORS.primary
    } else {
      return COLORS.gray
    }
  }

  const getOptionTxtCategory = (item) => {
    if (chooseCategory.includes(item)) {
      return COLORS.white
    } else {
      return COLORS.black
    }
  }

  const handleContinue = () => {
    if (title == "") {
      ToastAndroid.show("Empty Title", ToastAndroid.SHORT)
    }
    else if (title.length < 3) {
      ToastAndroid.show("Type at least 3 char for Title", ToastAndroid.SHORT)
    } else if (chooseCategory.length == 0) {
      ToastAndroid.show("Please choose Category", ToastAndroid.SHORT)
    } else {
      dispatch(addNewQuiz({
        name: title,
        description: description,
        backgroundImage: "",
        isPublic: display,
        categories: chooseCategory,
        questionList: [{
          questionType: "MultipleChoice",
          question: "Toi la ai trong em ??",
          time: 10,
          backgroundImage: "https://firebasestorage.googleapis.com/v0/b/capstoneproject-754a4.appspot.com/o/IMG_20230417_152346.jpg?alt=media&token=6c9fd59e-5ecf-408c-9d99-7f5530c11ceb",
          answerList: [
            {
              answer: "Toi",
              isCorrect: false,
              img: ""
            },
            {
              answer: "Em",
              isCorrect: true,
              img: ""
            },
            {
              answer: "Em & Toi",
              isCorrect: false,
              img: ""
            },
            {
              answer: "Nobody",
              isCorrect: false,
              img: ""
            },
          ],
          tempId: 0
        },
        {
          questionType: "CheckBox",
          question: "B ??",
          time: 10,
          backgroundImage: "",
          answerList: [
            {
              answer: "",
              isCorrect: true,
              img: "https://firebasestorage.googleapis.com/v0/b/capstoneproject-754a4.appspot.com/o/IMG_20230417_152346.jpg?alt=media&token=6c9fd59e-5ecf-408c-9d99-7f5530c11ceb"
            },
            {
              answer: "",
              isCorrect: true,
              img: "https://firebasestorage.googleapis.com/v0/b/capstoneproject-754a4.appspot.com/o/IMG_20230417_152346.jpg?alt=media&token=6c9fd59e-5ecf-408c-9d99-7f5530c11ceb"
            },
            {
              answer: "C",
              isCorrect: false,
              img: ""
            },
            {
              answer: "D",
              isCorrect: false,
              img: ""
            },
          ],
          tempId: 1
        }]
      }))
      navigation.navigate(screenName.ManageQuestion)
    }
  }

  React.useEffect(() => {
    GET_AllCategory()
  }, [])

  return (
    <TouchableWithoutFeedback
      onPress={() => { Keyboard.dismiss() }}
      accessible={false}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>

          <Text style={styles.title}>Create Quiz</Text>
          <FormInput
            labelText="Title"
            placeholderText='Type at least 3 char'
            onChangeText={val => setTitle(val)}
            value={title}
            showCharCount={true}
          />
          <FormInput
            labelText="Description"
            onChangeText={val => setDescription(val)}
            value={description}
            showCharCount={true}
          />

          <Text style={styles.txt}>Display</Text>
          <View>
            <View style={styles.viewCheckBox}>
              <TouchableOpacity
                style={[styles.checkBoxDisplay, { borderColor: display == false ? COLORS.success : COLORS.gray }]}
                onPress={() => setDisplay(false)}
              >
                {
                  display == false ?
                    <Icon
                      name={"check-circle"}
                      size={15}
                      color={COLORS.success}
                    />
                    :
                    <></>
                }
              </TouchableOpacity>
              <Text style={styles.txtCategory}>Private, only you can see it</Text>
            </View>
            <View style={styles.viewCheckBox}>
              <TouchableOpacity
                style={[styles.checkBoxDisplay, { borderColor: display == true ? COLORS.success : COLORS.gray }]}
                onPress={() => setDisplay(true)}
              >
                {
                  display == true ?
                    <Icon
                      name={"check-circle"}
                      size={15}
                      color={COLORS.success}
                    />
                    :
                    <></>
                }
              </TouchableOpacity>
              <Text style={styles.txtCategory}>Public, everyone can see it</Text>
            </View>
          </View>

          <Text style={styles.txt}>Choose category is relate</Text>
          <View style={styles.containerCategory}>

            <Text style={styles.txtAlert}>
              <Icon1
                name={"alert"}
                size={18}
                color={COLORS.error} /> Choose at least 1 category and max {maxChooseCategory} category
            </Text>
            {
              isLoading ?
                <ActivityIndicator size={20} color={COLORS.primary} />
                :
                categories.map((item, index) => (
                  <TouchableOpacity
                    key={item._id}
                    style={[styles.btnCategory, { backgroundColor: getOptionBgColor(item.name) }]}
                    onPress={() => {
                      var newChooseCategory = [...chooseCategory]
                      if (chooseCategory.length < maxChooseCategory) {
                        if (!newChooseCategory.includes(item.name)) {
                          newChooseCategory.push(item.name);
                        }
                        else {
                          newChooseCategory.splice(newChooseCategory.indexOf(item.name), 1);
                        }
                      } else {
                        newChooseCategory.splice(newChooseCategory.indexOf(item.name), 1);
                      }
                      setChooseCategory(newChooseCategory)
                    }}>
                    <Text style={[styles.txtCategory, { color: getOptionTxtCategory(item.name) }]}>{item.name}</Text>
                  </TouchableOpacity>))
            }
          </View>
          <FormButton
            labelText="Continue"
            style={{
              marginVertical: 20,
            }}
            handleOnPress={handleContinue}
          />
          <FormButton
            labelText="Cancel"
            isPrimary={false}
            style={{
              marginBottom: 20,
            }}
            handleOnPress={() => {
              navigation.navigate(screenName.ManageQuiz);
            }}
          />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  containerCategory: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
  scrollView: {
    width: "100%",
    flex: 1,
    backgroundColor: COLORS.white
  },
  viewCheckBox: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: 'center'
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  txtCategory: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.black
  },
  txtAlert: {
    color: "red",
    marginBottom: 10
  },
  txt: {
    marginTop: 20,
    fontSize: 15,
    marginBottom: 10
  },
  btnCategory: {
    backgroundColor: COLORS.gray,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    margin: 5,
    flexWrap: "wrap"
  },
  checkBoxDisplay: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: COLORS.gray,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10
  }
})

export default CreateQuiz;

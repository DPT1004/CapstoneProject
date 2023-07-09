import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid, ScrollView, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native'
import { useNavigation } from "@react-navigation/native"
import { screenName } from '../../navigator/screens-name'
import { COLORS } from '../../common/theme'
import { img } from '../../assets/index'
import { BASE_URL, firebaseHeaderUrl } from '../../common/shareVarible'
import { useDispatch, useSelector } from 'react-redux'
import { addNewQuiz } from '../../redux/Slice/newQuizSlice'
import storage from '@react-native-firebase/storage'
import FormInput from '../../components/FormInput'
import FormButton from '../../components/FormButton'
import ChooseImgBTN from '../../components/ChooseImgBTN'
import Icon from "react-native-vector-icons/FontAwesome"
import Icon1 from "react-native-vector-icons/Octicons"
import Lottie from "lottie-react-native"

const maxChooseCategory = 1

const CreateQuiz = () => {

  const navigation = useNavigation()
  const dispatch = useDispatch()
  const internet = useSelector((state) => state.internet)

  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [imageUri, setImageUri] = React.useState('')
  const [categories, setCategories] = React.useState([])
  const [chooseCategory, setChooseCategory] = React.useState([])
  const [display, setDisplay] = React.useState(true)
  const [isLoadingCateogries, setIsLoadingCateogries] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const GET_AllCategory = async () => {
    setIsLoadingCateogries(true)
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
        }).finally(() => setIsLoadingCateogries(false))
    } catch (error) {
      ToastAndroid.show(String(error), ToastAndroid.SHORT)
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

  const handleContinue = async () => {
    if (title.trim().length == 0) {
      ToastAndroid.show("Empty Title", ToastAndroid.SHORT)
    }
    else if (title.length < 3) {
      ToastAndroid.show("Type at least 3 char for Title", ToastAndroid.SHORT)
    } else if (chooseCategory.length == 0) {
      ToastAndroid.show("Please choose Category", ToastAndroid.SHORT)
    } else {

      if (internet.isOnlineStatus) {
        // Upload Image and get UrlImage for Quiz
        var imageUrl = ''
        if (imageUri != '' && imageUri.includes(firebaseHeaderUrl) == false) {
          setIsLoading(true)
          const reference = storage().ref(imageUri.slice(imageUri.lastIndexOf("/") + 1, imageUri.length));
          await reference.putFile(imageUri).catch(error => {
            setIsLoading(false)
            ToastAndroid.show(String(error), ToastAndroid.SHORT)
          })

          //Get url of image was upload on Firebase
          imageUrl = await reference.getDownloadURL().catch(error => {
            setIsLoading(false)
            ToastAndroid.show(String(error), ToastAndroid.SHORT)
          })
          setIsLoading(false)
        }

        dispatch(addNewQuiz({
          name: title,
          description: description,
          backgroundImage: imageUrl,
          isPublic: display,
          categories: chooseCategory,
          numberOfQuestions: 0,
          questionList: []
        }))

        navigation.navigate(screenName.ManageQuestion)
      } else {
        ToastAndroid.show('No network connection', ToastAndroid.SHORT)
      }
    }
  }

  React.useEffect(() => {
    if (internet.isOnlineStatus == false) {
      if (isLoading) {
        setIsLoading(false)
        ToastAndroid.show('Network connection suddenly lost', ToastAndroid.SHORT)
      }
    }
  }, [internet])

  React.useEffect(() => {
    GET_AllCategory()
  }, [])

  return (
    <TouchableWithoutFeedback
      onPress={() => { Keyboard.dismiss() }}
      accessible={false}>
      {
        isLoading ?
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.white }}>
            <Lottie
              source={img.loadingPrimary}
              autoPlay
              style={{ flex: 1 }} />
          </View>
          :
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
                maxLength={30}
                showCharCount={true}
              />

              {/* Image upload */}
              <ChooseImgBTN setImageUri={setImageUri} imageUri={imageUri} />

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
                  isLoadingCateogries ?
                    <ActivityIndicator size={20} color={COLORS.primary} />
                    :
                    categories.map((item, index) => (
                      <TouchableOpacity
                        key={item._id}
                        style={[styles.btnCategory, { backgroundColor: getOptionBgColor(item.name) }]}
                        onPress={() => {
                          var newChooseCategory = [...chooseCategory]
                          if (!newChooseCategory.includes(item.name)) {
                            if (chooseCategory.length < maxChooseCategory) {
                              newChooseCategory.push(item.name)
                            }
                            else {
                              newChooseCategory[newChooseCategory.length - 1] = item.name
                            }
                          }
                          else {
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
      }
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
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.gray,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    margin: 5,
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

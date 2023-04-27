import React from "react"
import { BackHandler, Text } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBTN from '../components/CustomTabBTN'
import { screenName } from './screens-name'
import SignIn from '../Screen/SignIn/SignIn'
import SignUp from '../Screen/SignUp/SignUp'
import Home from '../Screen/Home/Home'
import CreateQuiz from "../Screen/CreateQuiz/CreateQuiz";
import PlayQuiz from '../Screen/PlayQuiz/PlayQuiz'
import MultipleChoice from '../Screen/Question/MultipleChoice/MultipleChoice'
import CheckBox from '../Screen/Question/CheckBox/CheckBox'
import AnswerMultiChoice from '../Screen/Answer/AnswerMultiChoice/AnswerMultiChoice'
import AnswerCheckBox from "../Screen/Answer/AnswerCheckBox/AnswerCheckBox";
import Test4 from '../Screen/Test/Test4'
import { store } from '../redux/store'
import { Provider } from 'react-redux'


const arrTab = [
  { icon: "heart", label: "Sign In", activeColorBG: "green", inActiveColorBG: "white", activeColorIcon: "white", inActiveColorIcon: "gray", screen: screenName.SignIn, component: SignIn },
  { icon: "forward", label: "Sign Up", activeColorBG: "green", inActiveColorBG: "white", activeColorIcon: "white", inActiveColorIcon: "gray", screen: screenName.SignUp, component: SignUp },
  { icon: "home", label: "Home", activeColorBG: "green", inActiveColorBG: "white", activeColorIcon: "white", inActiveColorIcon: "gray", screen: screenName.Home, component: Home },
  { icon: "pluscircle", label: "Create Quiz", activeColorBG: "green", inActiveColorBG: "white", activeColorIcon: "white", inActiveColorIcon: "gray", screen: screenName.CreateQuiz, component: CreateQuiz },
]

const Tab = createBottomTabNavigator();

function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          position: "absolute",
          bottom: 16,
          left: 15,
          right: 15,
          borderRadius: 30
        }
      }}
    >
      {
        arrTab.map((item, index) => {
          return (
            <Tab.Screen key={index} name={item.screen} component={item.component}
              options={{
                tabBarButton: (props) => <CustomTabBTN {...props} tabItem={item} />
              }} />
          )
        })
      }
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator()

const MainStack = () => {
  return (

    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <Stack.Screen name={screenName.Test} component={Test4} /> */}
      <Stack.Screen name={screenName.BottomTab} component={BottomTab} />
      <Stack.Screen name={screenName.MultipleChoice} component={MultipleChoice} />
      <Stack.Screen name={screenName.CheckBox} component={CheckBox} />
      <Stack.Screen name={screenName.PlayQuiz} component={PlayQuiz} />
      <Stack.Screen name={screenName.AnswerCheckBox} component={AnswerCheckBox} />
      <Stack.Screen name={screenName.AnswerMultiChoice} component={AnswerMultiChoice} />
    </Stack.Navigator>

  )
}

const MainNavigator = () => {

  React.useEffect(() => {
    const backAction = () => {
      return true
    }
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [])

  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </Provider>
  )
}

export default MainNavigator


import React from "react"
import { BackHandler } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { store } from '../redux/store'
import { Provider } from 'react-redux'
import { screenName } from './screens-name'
import { COLORS } from '../common/theme'
import CustomTabBTN from '../components/CustomTabBTN'
import SignIn from '../Screen/SignIn/SignIn'
import SignUp from '../Screen/SignUp/SignUp'
import Home from '../Screen/Home/Home'
import ManageQuiz from '../Screen/ManageQuiz/ManageQuiz'
import ManageQuestion from '../Screen/CreateQuiz/components/ManageQuestion/ManageQuestion'
import CreateQuiz from "../Screen/CreateQuiz/CreateQuiz"
import PlayQuiz from '../Screen/PlayQuiz/PlayQuiz'
import MultipleChoice from '../Screen/Question/MultipleChoice/MultipleChoice'
import CheckBox from '../Screen/Question/CheckBox/CheckBox'
import AnswerMultiChoice from '../Screen/Answer/AnswerMultiChoice/AnswerMultiChoice'
import AnswerCheckBox from "../Screen/Answer/AnswerCheckBox/AnswerCheckBox"
import Test4 from '../Screen/Test/Test4'


const arrTab = [
  { icon: "save", label: "Manage Quiz", activeColorBG: COLORS.primary, inActiveColorBG: "transparent", activeColorIcon: "white", inActiveColorIcon: COLORS.primary, screen: screenName.ManageQuiz, component: ManageQuiz },
  { icon: "home", label: "Home", activeColorBG: COLORS.primary, inActiveColorBG: "transparent", activeColorIcon: "white", inActiveColorIcon: COLORS.primary, screen: screenName.Home, component: Home },
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
          borderRadius: 30,
          backgroundColor: "transparent",
          elevation: 1
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
      <Stack.Screen name={screenName.SignIn} component={SignIn} />
      <Stack.Screen name={screenName.SignUp} component={SignUp} />
      <Stack.Screen name={screenName.BottomTab} component={BottomTab} />
      <Stack.Screen name={screenName.PlayQuiz} component={PlayQuiz} />
      <Stack.Screen name={screenName.CreateQuiz} component={CreateQuiz} />
      <Stack.Screen name={screenName.ManageQuestion} component={ManageQuestion} />
      <Stack.Screen name={screenName.MultipleChoice} component={MultipleChoice} />
      <Stack.Screen name={screenName.CheckBox} component={CheckBox} />
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


import React from "react"
import { BackHandler } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { store } from '../redux/store'
import { Provider } from 'react-redux'
import { screenName } from './screens-name'
import { COLORS } from '../common/theme'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import socketServcies from '../until/socketServices'
import CustomTabBTN from '../components/CustomTabBTN'
import SignIn from '../Screen/SignIn/SignIn'
import SignUp from '../Screen/SignUp/SignUp'
import Home from '../Screen/Home/Home'
import WaitingRoom from '../Screen/Game/WaitingRoom/WaitingRoom'
import ManageQuiz from '../Screen/ManageQuiz/ManageQuiz'
import ManageQuestion from '../Screen/CreateQuiz/components/ManageQuestion/ManageQuestion'
import ListQuestion from '../Screen/EditQuiz/components/ListQuestion/ListQuestion'
import CreateQuiz from "../Screen/CreateQuiz/CreateQuiz"
import EditQuiz from '../Screen/EditQuiz/EditQuiz'
import PlayQuiz from '../Screen/Game/PlayQuiz/PlayQuiz'
import MultipleChoice from '../Screen/Question/MultipleChoice/MultipleChoice'
import CheckBox from '../Screen/Question/CheckBox/CheckBox'
import AnswerMultiChoice from '../Screen/Answer/AnswerMultiChoice/AnswerMultiChoice'
import AnswerCheckBox from "../Screen/Answer/AnswerCheckBox/AnswerCheckBox"
import Test1 from '../Screen/Test/Test1'


const arrTab = [
  { icon: "save", label: "Manage Quiz", activeColorBG: COLORS.primary, inActiveColorBG: "transparent", activeColorIcon: "white", inActiveColorIcon: COLORS.primary, screen: screenName.ManageQuiz, component: ManageQuiz },
  { icon: "home", label: "Home", activeColorBG: COLORS.primary, inActiveColorBG: "transparent", activeColorIcon: "white", inActiveColorIcon: COLORS.primary, screen: screenName.Home, component: Home },
]

const Tab = createBottomTabNavigator();

function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          position: "absolute",
          bottom: 10,
          left: 15,
          right: 15,
          borderRadius: 30,
          backgroundColor: COLORS.white,
          elevation: 1
        }
      }}
    >
      {
        arrTab.map((item, index) => {
          return (
            <Tab.Screen
              key={index}
              name={item.screen}
              component={item.component}
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
      {/* <Stack.Screen name={screenName.Test} component={Test1} /> */}
      <Stack.Screen name={screenName.SignIn} component={SignIn} />
      <Stack.Screen name={screenName.SignUp} component={SignUp} />
      <Stack.Screen name={screenName.BottomTab} component={BottomTab} />
      <Stack.Screen name={screenName.PlayQuiz} component={PlayQuiz} />
      <Stack.Screen name={screenName.WaitingRoom} component={WaitingRoom} />
      <Stack.Screen name={screenName.CreateQuiz} component={CreateQuiz} />
      <Stack.Screen name={screenName.EditQuiz} component={EditQuiz} />
      <Stack.Screen name={screenName.ListQuestion} component={ListQuestion} />
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

  // Initial socket connect with server
  React.useEffect(() => {
    socketServcies.initializeSocket()
  }, [])

  return (
    <Provider store={store}>
      <NavigationContainer>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <MainStack />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </NavigationContainer>
    </Provider>
  )
}

export default MainNavigator


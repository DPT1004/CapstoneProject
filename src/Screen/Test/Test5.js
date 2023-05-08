import React from 'react'
import { Text, View, Button, TouchableOpacity, StyleSheet, TextInput, Animated, ScrollView } from 'react-native'
import DraggableFlatList, {
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const NUM_ITEMS = 10;


const Test5 = () => {
    const [arr, setArr] = React.useState([{
        id: 1,
        name: "Rare Wind",
        backgroundColor: "yellow"
    },
    {
        id: 2,
        name: "Saint Petersburg",
        backgroundColor: "blue"
    },
    {
        id: 3,
        name: "Deep Blue",
        backgroundColor: "orange"
    },
    {
        id: 4,
        name: "Ripe Malinka",
        backgroundColor: "black"
    },
    {
        id: 5,
        name: "Near Moon",
        backgroundColor: "green"
    },
    {
        id: 6,
        name: "Wild Apple",
        backgroundColor: "lightblue"
    }])
    const [reRender, setReRender] = React.useState(Math.random())


    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
            // Generate random number
            let j = Math.floor(Math.random() * (i + 1));

            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };

    const renderItem = ({ item, drag, isActive }) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    activeOpacity={1}
                    onPressIn={drag}
                    disabled={isActive}
                    style={[
                        styles.rowItem,
                        { backgroundColor: isActive ? "red" : item.backgroundColor },
                    ]}
                >
                    <Text style={styles.text}>{item.name}</Text>
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };


    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'white' }}>
            <DraggableFlatList
                data={arr}
                onDragEnd={({ data }) => setArr(data)}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
            <Button
                title='Shuffle'
                onPress={() => {
                    setReRender(Math.random())
                    setArr(shuffleArray(arr))
                }}
            />
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    rowItem: {
        height: 100,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20
    },
    text: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },

})

export default Test5;
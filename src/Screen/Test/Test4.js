// "use_strict"
import React from 'react';
import { View, Button, Text, Animated, LayoutAnimation } from 'react-native';


const Test4 = () => {
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


    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1, flexWrap: "wrap" }}>
                {
                    arr.map((item, index) => (
                        <View key={index} style={{ height: 80, width: 80, backgroundColor: "pink", margin: 10, alignItems: "center", justifyContent: "center" }}>
                            <Text>{item.name}</Text>
                        </View>
                    )
                    )
                }
            </View>
            <Button
                title='Shuffle'
                onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
                    setReRender(Math.random())
                    setArr(shuffleArray(arr))
                }}
            />
        </View>
    );
}

export default Test4
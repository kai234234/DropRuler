import react from "react";
import { View } from "react-native";
import Constants from "../Constants";
import { Image } from "expo-image";



export default function Ruler({ position }) {
    //console.log(`x: ${position[0]}, y: ${position[1]}`);
    return (
        <View
            style={{
                width: '8%',
                aspectRatio: '76 / 402',
                backgroundColor: "yellow",
                position: "absolute",
                left: position[0],
                top: position[1],
            }}>
            <Image
                style={{
                    flex: 1,
                    width: '100%',
                }}
                source={require("../assets/Ruler.png")} />
        </View>
    )
} 

// GrapHand.js
import react from "react";
import { View } from "react-native";
import Constants from "../Constants";
import { Image } from "expo-image";


export default function GrapHand({ status }) {

    //console.log(`x: ${position[0]}, y: ${position[1]}`);
    return (
        <View
            style={{
                width: '65%',
                aspectRatio: '1 / 1',
                // backgroundColor: "yellow",
                position: "absolute",
                left: Constants.MAX_WIDTH / 2,
                top: Constants.MAX_HEIGHT / 2,
                transform: [
                    { translateX: (Constants.MAX_WIDTH * 0.75) / -2 },
                    { translateY: (Constants.MAX_HEIGHT * 0.5) / -2 }
                ]
            }}>
            <Image
                style={{
                    flex: 1,
                    width: '100%',
                }}
                source={status == "open" ? require("../assets/openhand.png") : require("../assets/closehand.png")} />
        </View>
    )
} 

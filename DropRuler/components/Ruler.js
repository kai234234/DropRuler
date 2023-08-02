import react from "react";
import { View } from "react-native";
import Constants from "../Constants";


export default function Ruler({ position }) {
    //console.log(`x: ${position[0]}, y: ${position[1]}`);
    return (
        <View
            style={{
                width: Constants.CELL_SIZE,
                height: Constants.CELL_SIZE * 5,
                backgroundColor: "yellow",
                position: "absolute",
                left: position[0],
                top: position[1],
            }}
        />
    )
} 

import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';

const Level = (props) => {

    return (
        <View style={styles.LevelPosition}>
            <Text style={styles.LevelCaption}>Level.{String(props.level)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    LevelPosition: {
        position: 'absolute',
        top: 60,
        right: 30
    },
    LevelCaption: {
        color: 'white'
    }
});

export default Level;

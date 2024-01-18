import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Score = ({ sec, onDurationTimeChange, moveRuler, onMoveRulerChange } = props) => {

    useEffect(() => {
        onMoveRulerChange(moveRuler);
    }, [moveRuler, onMoveRulerChange]);

    useEffect(() => {
        onDurationTimeChange();
    }, sec, onDurationTimeChange);

    // 現在の時刻を取得
    const ms = new Date();

    return (
        <View style={styles.ScorePosition}>
            <Text style={styles.ScoreCaption}>Time.{(moveRuler ? String(sec / 1000) : 'Stop') + '秒'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    ScorePosition: {
        position: 'absolute',
        top: 60,
        left: 30
    },
    ScoreCaption: {
        color: 'white'
    }
});


export default Score;
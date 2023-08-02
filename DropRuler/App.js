import { StatusBar } from 'expo-status-bar';
import { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Constants from './Constants';
import Ruler from './components/Ruler';
import GameLoop from './components/systems/GameLoop';

export default function App() {

  const BoardSize = Constants.GRID_SIZE * Constants.CELL_SIZE;
  const engine = useRef(null);

  // gemeの進行ステータス
  const [isGamerunning, setIsGamerunning] = useState(true);

  // ゲームの状態をリセットする関数
  const resetGame = () => {
    engine.current.swap({
      ruler: {
        dropCounter: Math.floor(Math.random() * 13 + 2) * 60,
        position: [(Constants.CELL_SIZE * Constants.GRID_SIZE) / 2 - (Constants.CELL_SIZE / 2), 0],
        dropspeed: 1,
        gravity: 0.1,
        timeCounter: 0,
        renderer: <Ruler />
      }
    });
    setIsGamerunning(true);
  }

  // 定規の落下を止める関数
  const grapRuler = () => {
    // イベントを発行
    engine.current.dispatch('grap');
  }

  return (
    <View style={styles.container}>
      <GameEngine
        ref={engine}
        style={{
          width: BoardSize,
          height: BoardSize,
          flex: null,
          backgroundColor: "blue",
        }}
        entities={{
          ruler: {
            dropCounter: Math.floor(Math.random() * 13 + 2) * 60,
            position: [
              (Constants.CELL_SIZE * Constants.GRID_SIZE) / 2 - (Constants.CELL_SIZE / 2),
              0
            ],
            dropspeed: 1,
            gravity: 0.1,
            timeCounter: 0,
            renderer: <Ruler />
          }
        }}
        systems={[GameLoop]}
        running={isGamerunning}
        onEvent={(e) => {
          switch (e) {
            case 'gameover':
              alert('GameOver');
              setIsGamerunning(false);
              break;
          }
        }}
      />
      {isGamerunning && <View>
        <TouchableOpacity
          onPress={() => grapRuler()}>
          <Text style={{
            padding: 20,
            backgroundColor: 'yellow'
          }}> GRAP </Text>
        </TouchableOpacity>
      </View>}

      {!isGamerunning && <View>
        <TouchableOpacity
          onPress={() => resetGame()}>
          <Text style={{
            padding: 20,
            backgroundColor: 'red'
          }}> RESET </Text>
        </TouchableOpacity>
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

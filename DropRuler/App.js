// App.js
import { StatusBar } from 'expo-status-bar';
import { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Constants from './Constants';
import Ruler from './components/Ruler';
//import GameLoop from './components/systems/GameLoop';
import Score from './components/interface/Score';
import Level from './components/interface/Level';
import GrapHand from './components/GrapHand';
import Dialog from "react-native-dialog";

export default function App() {

  const engine = useRef(null);

  // gemeの進行ステータス
  const [isGamerunning, setIsGamerunning] = useState(true);
  const [moveRuler, setmoveRuler] = useState(false);
  const [level, setlevel] = useState(1);
  const [startTime, setStartTime] = useState(0);
  const [durationTime, setDurationTime] = useState(0);
  const [visible, setVisible] = useState(false);

  const handlerMoveRulerChange = (newMoveRuler) => { };
  const handlerDurationTime = () => { };

  // ゲームの状態をリセットする関数
  const resetGame = () => {
    engine.current.swap({
      ruler: {
        dropCounter: Math.floor(Math.random() * 6 + 1) * 30,
        position: [Constants.MAX_WIDTH / 2 - (60 / 2), 23],
        dropspeed: 1,
        gravity: 0.5 + (level - 1) * 0.05,
        timeCounter: 0,
        renderer: <Ruler />
      },
      GrapHand: {
        status: "open",
        renderer: <GrapHand />
      },
      /*Score: {
        sec: time,
        moveRuler: moveRuler,
        onMoveRulerChange: handlerMoveRulerChange,
        renderer: <Score />
      }*/
    });
    setIsGamerunning(true);
  }

  // 定規の落下を止める関数
  const grapRuler = () => {
    // イベントを発行
    engine.current.dispatch('grap');
  }

  const GameLoop = function (entities, { events, dispatch }) {
    // entityを取得
    const ruler = entities.ruler;
    const GrapHand = entities.GrapHand;

    // 時間を更新
    if (isGamerunning) {
      const ms = new Date();
      setDurationTime(ms.getTime() - startTime);
      if (moveRuler && durationTime >= 3000) {
        // GAME OVER  
        dispatch('GameOver');
      }
    }


    // イベントを処理
    if (events.length) {
      events.forEach(e => {
        switch (e) {
          case 'grap':
            // ruler.dropspeed = 0;
            // ruler.gravity = 0;
            let sec = parseFloat((ruler.timeCounter * (1000 / 30) / 1000).toFixed(3));
            console.log(`TimeCounter: ${sec}秒`);
            console.log(`Length: ${(Constants.MAX_HEIGHT - (ruler.position[1] + 60 * 5))}`);
            console.log(`重力加速: ${ruler.gravity}mm/秒`);

            // 手を閉じる
            GrapHand.status = "close";
            // ものさしの値
            const ruler_y = ruler.position[1];
            const ruler_height = (Constants.MAX_WIDTH * 0.08) / 76 * 402;

            // 手の値
            const hand_y = Constants.MAX_HEIGHT / 2 + Constants.MAX_HEIGHT * 0.5 / -2;
            const hand_height = Constants.MAX_WIDTH * 0.65;


            if (ruler_y + ruler_height > hand_y + (hand_height * 0.32) && ruler_y < hand_y + hand_height - (hand_height * 0.25)) {
              // かぶっている 
              // LEVEL UP
              dispatch('levelclear');
            } else {
              // かぶっていない
              // GAME OVER    
              dispatch('GameOver');
            }

            break;
        }
      });
    }


    // 落下フラグを確認
    if (ruler.dropCounter <= 0) {

      if (ruler.dropCounter == 0 && ruler.timeCounter == 0) {
        const ms = new Date();
        setStartTime(ms.getTime());
        setDurationTime(0);
        dispatch('dropStart');
      }

      // 落下を開始したらカウントを行う
      ruler.timeCounter += 1;

      // 重力加速
      ruler.dropspeed += ruler.gravity;
      // 座標を更新
      ruler.position[1] += ruler.dropspeed;
      // 座標が画面外なら
      if (ruler.position[1] > Constants.MAX_HEIGHT) {
        // ゲームオーバーイベントを発行
        dispatch('gameover');
      }
    } else {
      ruler.dropCounter -= 1;
    }

    return entities;
  }

  return (
    <View style={styles.container}>
      <GameEngine
        ref={engine}
        style={{
          width: Constants.MAX_WIDTH,
          height: Constants.MAX_HEIGHT,
          flex: null,
          backgroundColor: '#FA5FE4',
        }}
        entities={{
          ruler: {
            dropCounter: Math.floor(Math.random() * 6 + 1) * 30,
            position: [Constants.MAX_WIDTH / 2 - (60 / 2), 23],
            dropspeed: 1,
            gravity: 0.5 + (level - 1) * 0.05,
            timeCounter: 0,
            renderer: <Ruler />
          },
          GrapHand: {
            status: "open",
            grapTop: (Constants.MAX_HEIGHT / 2 - ((Constants.MAX_HEIGHT * 0.65) / 2)) + 412 * ((Constants.MAX_HEIGHT * 0.5) / 1200),
            grapBottom: (Constants.MAX_HEIGHT / 2 - ((Constants.MAX_HEIGHT * 0.65) / 2)) + 840 * ((Constants.MAX_HEIGHT * 0.5) / 1200),
            renderer: <GrapHand />
          },
          /*Score: {
            sec: time,
            moveRuler: moveRuler,
            onMoveRulerChange: handlerMoveRulerChange,
            renderer: <Score />
          }*/
        }}
        systems={[GameLoop]}
        running={isGamerunning}
        onEvent={(e) => {
          switch (e) {
            case 'levelclear':
              // ScoreTime: tkimecounter - dropCounter
              // alert('GameClear  Next Game? ');
              // setlevel(level + 1);
              // resetGame();
              setIsGamerunning(false);
              setVisible(true);
              break;
            case 'GameOver':
              alert('GameOver');
              setlevel(1);
              // resetGame();
              setIsGamerunning(false);
              break;

            // 定規の落下開始イベント
            case 'dropStart':
              {
                const ms = new Date();
                setStartTime(ms.getTime());
                setDurationTime(0);
                // 定規の落下中
                setmoveRuler(true);
              }
              break;
            // grapイベントの開始
            case 'grap':
              {
                const ms = new Date();
                setDurationTime(ms.getTime() - startTime);
              }
              break;
          }
        }}
      />

      {/* Score */}
      <Score
        sec={durationTime}
        onDurationTimeChange={handlerDurationTime}
        moveRuler={moveRuler}
        onMoveRulerChange={handlerMoveRulerChange} />


      {/* Level */}

      <Level level={level} />


      {/* Grap Button */}
      {isGamerunning && <View style={{
        position: 'absolute',
        bottom: 180,
        right: 30,
        zIndex: 100,
      }}>
        <TouchableOpacity
          onPress={() => grapRuler()}>
          <Text style={{
            fontSize: 20,
            padding: 20,
            backgroundColor: 'yellow'
          }}> GRAP </Text>
        </TouchableOpacity>
      </View>}

      {!isGamerunning && <View style={{
        position: 'absolute',
        bottom: 180,
        left: 30,
        zIndex: 100,
      }}>

        <TouchableOpacity
          onPress={() => resetGame()}>
          <Text style={{
            fontSize: 20,
            padding: 20,
            backgroundColor: 'red'
          }}> RESET </Text>
        </TouchableOpacity>

      </View>}
      <View>
        <Dialog.Container visible={visible}>
          <Dialog.Title>SUCCESS!!</Dialog.Title>
          <Dialog.Description>
            <View style={{ flexDirection: 'column' }}>
              <Text>Clear Time : {String(durationTime / 1000)} sec.</Text>
              <Text>Next  Level : {String(level + 1)}</Text>
            </View>
          </Dialog.Description>
          <Dialog.Button label="RETIRE" color='red' onPress={() => {
            // ダイアログを非表示に戻す
            setVisible(false);
            setlevel(1);
            // 定規の落下停止状態
            setmoveRuler(false);
          }} />
          <Dialog.Button label="GO" onPress={() => {
            // ダイアログを非表示に戻す
            setVisible(false);
            // レベルを上げる
            setlevel(level + 1);
            // 定規の落下停止状態
            setmoveRuler(false);
            // ゲームを再開させる
            setIsGamerunning(false);
            resetGame();
          }} />

        </Dialog.Container>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

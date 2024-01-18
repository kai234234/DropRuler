// GameLoop.js

import Constants from "../../Constants";

export default function (entities, { events, dispatch }) {
    // entityを取得
    const ruler = entities.ruler;
    const GrapHand = entities.GrapHand;

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

                    if (sec < 2) {

                        if (ruler_y + ruler_height > hand_y + (hand_height * 0.32) && ruler_y < hand_y + hand_height - (hand_height * 0.25)) {
                            // かぶっている 
                            // LEVEL UP
                            dispatch('levelclear');


                        } else {
                            // かぶっていない
                            // GAME OVER    
                            dispatch('GameOver');

                        }
                    } else {
                        // GAME OVER  
                        dispatch('GameOver');

                    }

                    break;
            }
        });
    }


    // 落下フラグを確認
    if (ruler.dropCounter <= 0) {

        if (ruler.dropCounter == 0 && ruler.timeCounter == 0) dispatch('dropStart');

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
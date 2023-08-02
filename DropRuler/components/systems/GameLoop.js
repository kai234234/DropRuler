import Constants from "../../Constants";

export default function (entities, { events, dispatch }) {
    // entityを取得
    const ruler = entities.ruler;

    // イベントを処理
    if (events.length) {
        events.forEach(e => {
            switch (e) {
                case 'grap':
                    ruler.dropspeed = 0;
                    ruler.gravity = 0;
                    let sec = parseFloat((ruler.timeCounter * (1000 / 30) / 1000).toFixed(3));
                    console.log(`TimeCounter: ${sec}秒`);
                    console.log(`Length: ${(Constants.CELL_SIZE * Constants.GRID_SIZE - (ruler.position[1] + Constants.CELL_SIZE * 5))}`);
                    break;
            }
        });
    }

    // 落下フラグを確認
    if (ruler.dropCounter <= 0) {
        // 落下を開始したらカウントを行う
        ruler.timeCounter += 1;

        // 重力加速
        ruler.dropspeed += ruler.gravity;
        // 座標を更新
        ruler.position[1] += ruler.dropspeed;
        // 座標が画面外なら
        if (ruler.position[1] > Constants.GRID_SIZE * Constants.CELL_SIZE) {
            // ゲームオーバーイベントを発行
            dispatch('gameover');
        }
    } else {
        ruler.dropCounter -= 1;
    }
    return entities;
}
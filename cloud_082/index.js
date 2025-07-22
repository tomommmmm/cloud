const leftMargin = 20; // canvasの左右を20ピクセルあける。とくに意味はない

// 画像の幅と高さ
const imageWidth = 300;
const imageHeight = 300;

const $canvas = document.getElementById('canvas');
const ctx = $canvas.getContext('2d');

// スタートボタンとストップボタン
const $start = document.getElementById('start');
const $stop = document.getElementById('stop');

// 効果音
const startSound = new Audio('./sounds/bgm.mp3');
const stopedSound = new Audio('./sounds/end.mp3');

// イメージを格納する配列
const images = [];

// ルーレットが回転する速度
let speed = 0;
const MAX_SPEED = 16;
const MIN_SPEED = 4;

// ルーレットは停止しているかどうか？
let stoped = true;

window.onload = () => {
    $canvas.height = imageHeight;
    $canvas.width = leftMargin + imageWidth + leftMargin;
    // canvasの幅を画像の幅より広くしているが特に意味は無い

    // 画像ファイルを読み込んでイメージを配列のなかに格納する
    for(let i = 0; i < 6; i++){
        const image = new Image();
        image.src = `./images/${i}.png`;
        images.push(image);
    }

    // 1番はじめの画像が読み込まれるのを待ってから、それを描画する
    images[0].onload = () => {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, $canvas.width, $canvas.height);
        ctx.drawImage(images[0], leftMargin, 0);
    }

    $stop.style.display = 'none';
}

async function start(){
    // 効果音の再生
    startSound.currentTime = 0;
    startSound.play();

    // フラグのクリア
    stoped = false;

    // スタートボタンの非表示とストップボタンの表示
    $start.style.display = 'none';
    $stop.style.display = 'block';

    // 回転速度を最大に
    speed = MAX_SPEED;

    // 回転総量を0で初期化する
    let y = 0;

    // ルーレットが回転しているあいだは0.01秒おきに描画処理をおこなう
    const id = setInterval(() => {
        // 回転総量をimageHeightで割り整数部分を取り出せば、どの画像を描画すればよいかがわかる
        // この数を配列の要素数より小さくするためにimages.lengthの剰余をとる
        const imageIndex = Math.floor(y / imageHeight) % images.length;

        // 回転総量をimageHeightで割ったときの剰余がcanvasの一番上からどれだけズレているかがわかる
        let sy = y % imageHeight;

        // canvas上部にできる空白には次のイメージを描画する
        const nextIndex = (imageIndex + 1) % images.length;

        // ルーレットの回転速度が最低速度まで下がり、ズレが最低速度より小さい場合はルーレットを止める
        // この場合、イメージはcanvas上部から描画する
        if(speed <= MIN_SPEED && y % imageHeight < MIN_SPEED){

            // 0.01秒おきにおこなわれていた描画処理を停止する
            stoped = true;
            sy = 0;
            clearInterval(id);

            // スタートボタンの再表示
            $start.style.display = 'block';

            // ルーレット回転時のBGMの停止
            startSound.pause();

            setTimeout(() => {
                // ルーレット停止時の効果音の再生
                // 0.25秒待機しているが特に意味はない
                stopedSound.currentTime = 0;
                stopedSound.play();
            }, 250);
        }

        // 描画処理
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, $canvas.width, $canvas.height);

        ctx.drawImage(images[imageIndex], leftMargin, sy);
        ctx.drawImage(images[nextIndex], leftMargin, sy - imageHeight);

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#777';

        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo($canvas.width, sy);
        ctx.stroke();
        y += speed;
    }, 10);
}

function stop(){
    $stop.style.display = 'none';

    speed /= 2;
    const id = setInterval(() => {
        if(speed > MIN_SPEED)
            speed--;
        if(stoped)
            clearInterval(id);
    }, 500);
}
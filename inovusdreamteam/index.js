const app = new PIXI.Application({
    backgroundColor: 0x2980b9
});
document.querySelector('#yo').appendChild(app.view);

const backImgPath = './01_front.webp'
const textureImgPath = './01_back.webp'

const radius = 100;

// The blur amount
const blurSize = 32;

PIXI.Assets.add('textureImg', textureImgPath)
PIXI.Assets.add('backImg', backImgPath)

    //
PIXI.Assets.load(['textureImg', 'backImg']).then(({ textureImg, backImg }) => {
    const background = new PIXI.Sprite(textureImg);
    const testBack = new PIXI.Sprite(backImg);

    app.stage.addChild(testBack);
    app.stage.addChild(background);

    testBack.width = app.screen.width;
    testBack.height = app.screen.height;

    background.width = app.screen.width;
    background.height = app.screen.height;

    const circle = new PIXI.Graphics()
        .beginFill(0xFF0000)
        .drawCircle(radius + blurSize, radius + blurSize, radius)
        .endFill();
    circle.filters = [new PIXI.filters.BlurFilter(blurSize)];

    const bounds = new PIXI.Rectangle(0, 0, (radius + blurSize) * 2, (radius + blurSize) * 2);
    const texture = app.renderer.generateTexture(circle, PIXI.SCALE_MODES.NEAREST, 1, bounds);
    const focus = new PIXI.Sprite(texture);

    app.stage.addChild(focus);
    background.mask = focus;

    app.stage.interactive = true;
    app.stage.hitArea = app.screen;
    app.stage.on('pointermove', (event) => {
        focus.position.x = event.global.x - focus.width / 2;
        focus.position.y = event.global.y - focus.height / 2;
    });
});

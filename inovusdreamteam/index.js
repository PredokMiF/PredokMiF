const app = new PIXI.Application({
    antialias: true,
});
const paddingRight = 48
document.body.style.paddingRight = `${paddingRight}px`
document.body.appendChild(app.view);

const h1 = document.createElement('h1');
h1.innerText = 'Ткни на фото и поводи по нему';
document.body.appendChild(h1);

const backgroundImage = './01_front.webp'
const foregroundImage = './01_back.webp'

const radius = 100;

// The blur amount
const blurSize = 20;

PIXI.Assets.add('backgroundImage', backgroundImage)
PIXI.Assets.add('foregroundImage', foregroundImage)

PIXI.Assets.load(['backgroundImage', 'foregroundImage']).then(({ backgroundImage, foregroundImage }) => {
    const background = new PIXI.Sprite(backgroundImage);
    const foreground = new PIXI.Sprite(foregroundImage);

    app.renderer.resize(window.innerWidth - paddingRight, window.innerHeight)

    const resize = () => {
        const ratio = Math.max((window.innerWidth - paddingRight) / backgroundImage.width, window.innerHeight / backgroundImage.height)

        foreground.scale.set(ratio)
        background.scale.set(ratio)

        app.renderer.resize((window.innerWidth - paddingRight), background.height)
    }

    resize()
    window.onresize = resize

    app.stage.addChild(background);

    const circle = new PIXI.Graphics()
        .beginFill(0xFF0000)
        .drawCircle(radius + blurSize, radius + blurSize, radius)
        .endFill();

    circle.filters = [new PIXI.filters.BlurFilter(blurSize)];

    const bounds = new PIXI.Rectangle(0, 0, (radius + blurSize) * 2, (radius + blurSize) * 2);
    // const bounds = new PIXI.Circle(100, 100, 300);
    // const texture = app.renderer.generateTexture(circle, PIXI.SCALE_MODES.NEAREST, 1, bounds);
    const texture = app.renderer.generateTexture(circle, {
        scaleMode: PIXI.SCALE_MODES.NEAREST,
        region: bounds,
    });
    const focus = new PIXI.Sprite(texture);

    function addForeground() {
        app.stage.addChild(foreground);
        app.stage.addChild(focus);
        foreground.mask = focus;

        app.stage.off('pointerdown', addForeground)
        app.stage.off('mouseenter', addForeground)
        app.view.style.cursor = 'none'
    }

    app.stage.on('pointerdown', addForeground)
    app.stage.on('mouseenter', addForeground)


    app.stage.interactive = true;
    app.stage.hitArea = app.screen;

    const move = (event) => {
        focus.position.x = (event.global.x - 50) - focus.width / 2;
        focus.position.y = (event.global.y - 50) - focus.height / 2;
    }

    app.stage.on('pointerdown', move);
    app.stage.on('pointermove', move);
});

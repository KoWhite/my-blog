当你在用egret开发游戏是要改变图片的默认颜色的时候，可以使用这个封装方法

两个参数：
 
*1、图片*  

*2、16位颜色*   

``` typescript
public setImageColor(image: eui.Image, color: number) {
    // 将16进制颜色分割成rgb值
    let spliceColor = (color) => {
        let result = {r: -1, g: -1, b: -1};
        result.b = color % 256;
        result.g = Math.floor((color / 256)) % 256;
        result.r = Math.floor((color / 256) / 256);
        return result;
    }
    let result = spliceColor(color);
    let colorMatrix = [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0
    ];
    colorMatrix[0] = result.r / 255;
    colorMatrix[6] = result.g / 255;
    colorMatrix[12] = result.b / 255;
    let colorFilter = new egret.ColorMatrixFilter(colorMatrix);

    image.filters = [colorFilter];
}
```
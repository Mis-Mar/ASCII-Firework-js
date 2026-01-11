//====== Color Management =====
(function (global) {
  // Color 类定义
  class Color {
    constructor(r, g, b, a) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }
    shiftGradient(factor) {
      this.r = this.r * factor > 255 ? 255 : this.r * factor;
      this.g = this.g * factor > 255 ? 255 : this.g * factor;
      this.b = this.b * factor > 255 ? 255 : this.b * factor;
    }
  }

  // 预设颜色组 (0-7)
  const presetColors = [
    // 0: 粉紫活力系
    [new Color(235, 39, 155, 1), new Color(250, 216, 68, 1), new Color(242, 52, 72, 1), new Color(63, 52, 200, 1), new Color(255, 139, 57, 1)],
    // 1: 蓝灰
    [new Color(152, 186, 227, 1), new Color(89, 129, 177, 1), new Color(54, 84, 117, 1), new Color(240, 244, 254, 1)],
    // 2: 粉蓝
    [new Color(205, 180, 219, 1), new Color(255, 200, 221, 1), new Color(255, 175, 204, 1), new Color(189, 224, 254, 1), new Color(162, 210, 255, 1)],
    // 3: 深红
    [new Color(79, 0, 11, 1), new Color(114, 0, 38, 1), new Color(206, 66, 87, 1), new Color(255, 127, 81, 1), new Color(255, 155, 84, 1)],
    // 4: 金色
    [new Color(0, 29, 61, 1), new Color(0, 53, 102, 1), new Color(255, 195, 0, 1), new Color(255, 214, 10, 1)],
    // 5: 黄绿
    [new Color(255, 255, 100, 1), new Color(200, 255, 100, 1), new Color(150, 255, 150, 1), new Color(100, 200, 100, 1)],
    // 6: 青蓝
    [new Color(6, 55, 63, 1), new Color(24, 90, 96, 1), new Color(47, 123, 119, 1), new Color(92, 174, 166, 1), new Color(200, 255, 255, 1)],
    // 7: 橙金
    [new Color(255, 200, 100, 1), new Color(255, 150, 50, 1), new Color(255, 220, 180, 1)],
  ];

  // 自定义颜色组 (8-10，每组6个颜色)
  const customColors = [
    // 8: 自定义颜色组1 (默认为红色调)
    [new Color(255, 0, 0, 1), new Color(255, 85, 85, 1), new Color(255, 170, 170, 1), new Color(200, 0, 0, 1), new Color(150, 0, 0, 1), new Color(255, 128, 128, 1)],
    // 9: 自定义颜色组2 (默认为绿色调)
    [new Color(0, 255, 0, 1), new Color(85, 255, 85, 1), new Color(170, 255, 170, 1), new Color(0, 200, 0, 1), new Color(0, 150, 0, 1), new Color(128, 255, 128, 1)],
    // 10: 自定义颜色组3 (默认为蓝色调)
    [new Color(0, 0, 255, 1), new Color(85, 85, 255, 1), new Color(170, 170, 255, 1), new Color(0, 0, 200, 1), new Color(0, 0, 150, 1), new Color(128, 128, 255, 1)],
  ];

  // 合并颜色组
  const colors = [...presetColors, ...customColors];

  // 颜色组数量
  const COLOR_GROUP_COUNT = colors.length;

  // 各烟花类型可用的颜色组 (true = 可用)
  // 索引对应 colors 数组的索引 (0-7: 预设, 8-10: 自定义)
  const colorAvailability = {
    //                        0      1      2      3      4      5      6      7      8      9     10
    classic:        /* 经典 */ [true,  true,  true,  true,  true,  true,  true,  true,  true,  true, true],
    classicLaunch:  /* 发射 */ [true,  true,  true,  true,  true,  false, false, false, false, false, false],
    fountain:       /* 喷泉 */ [true,  true,  true,  true,  true,  true,  true,  true,  true,  true, true],
    vortex:         /* 漩涡 */ [false, false, false, false, false, false, true,  false, true,  true, true],
    fountainArray:  /* 喷泉阵 */[false, false, false, false, false, true,  false, false, false, true, true],
    crossFire:      /* 交叉 */ [false, false, false, false, false, false, false, true,  false, false, true],
    grandFinale:    /* 压轴 */ [true,  true,  true,  true,  true,  true,  false, false, true,  true, true],
  };

  // 根据烟花类型获取可用的颜色组索引列表
  function getAvailableColorGroups(fireworkType) {
    const availability = colorAvailability[fireworkType];
    if (!availability) return [0]; // 默认返回第一组
    const groups = [];
    for (let i = 0; i < availability.length; i++) {
      if (availability[i]) groups.push(i);
    }
    return groups.length > 0 ? groups : [0];
  }

  // 根据烟花类型随机获取一个颜色主题
  function getColorTheme(fireworkType) {
    const groups = getAvailableColorGroups(fireworkType);
    const groupIndex = groups[Math.floor(Math.random() * groups.length)];
    return colors[groupIndex];
  }

  // 从颜色主题中随机获取一个颜色
  function getRandomColor(colorTheme) {
    return colorTheme[Math.floor(Math.random() * colorTheme.length)];
  }

  // 设置自定义颜色组 (customGroupIndex: 0-2 对应 colors 中的 8-10)
  // colorArray: Color 对象数组
  function setCustomColorGroup(customGroupIndex, colorArray) {
    if (customGroupIndex < 0 || customGroupIndex > 2) {
      console.error('自定义颜色组索引必须在 0-2 之间');
      return false;
    }
    
    const colorIndex = 8 + customGroupIndex;
    if (!colors[colorIndex]) {
      console.error('颜色组索引无效');
      return false;
    }

    // 清空现有颜色
    colors[colorIndex].length = 0;

    // 添加新颜色（验证是否为Color对象）
    for (let i = 0; i < colorArray.length; i++) {
      const color = colorArray[i];
      if (color && typeof color === 'object' && 'r' in color && 'g' in color && 'b' in color && 'a' in color) {
        colors[colorIndex].push(color);
      }
    }

    // 确保至少有一个颜色
    if (colors[colorIndex].length === 0) {
      colors[colorIndex].push(new Color(255, 255, 255, 1));
    }

    return true;
  }

  // 导出到全局 FireworkLib
  global.ColorLib = {
    Color,
    colors,
    colorAvailability,
    COLOR_GROUP_COUNT,
    getAvailableColorGroups,
    getColorTheme,
    getRandomColor,
    setCustomColorGroup,
  };
})(window);

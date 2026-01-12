//====== Render helpers =====
(function (global) {
  const { explosion_gradient } = global.FireworkLib;

  // 预定义字符集，避免每次都创建字符串
  const charSets = {
    veryBright: ["`'. ", "/\\|()1{}[]?", "oahkbdpqwmZO0QLCJUYXzcvunxrjft*", "$@B%8&WM#"],
    bright: ["` '. ", '-_ +~<> i!lI;:,"^', "/\\| ()1{}[ ]?", "xrjft*"],
    dim: [".  ,`.    ^,' . ", ' /\\| ( )  1{} [  ]?i !l I;: ,"^ '],
  };

  function clearGrid(grid) {
    for (let r = 0; r < grid.length; r++) {
      grid[r].fill(false);
    }
  }

  function getRandomChar(chars) {
    return chars.charAt(Math.floor(Math.random() * chars.length));
  }

  function getChar(lifetimePercent, trailPercent) {
    let charArray;
    if (lifetimePercent < 0.35) {
      charArray = charSets.veryBright;
      if (trailPercent < 0.3) return getRandomChar(charArray[0]);
      if (trailPercent < 0.5) return getRandomChar(charArray[1]);
      if (trailPercent < 0.7) return getRandomChar(charArray[2]);
      return getRandomChar(charArray[3]);
    }
    if (lifetimePercent < 0.6) {
      charArray = charSets.bright;
      if (trailPercent < 0.2) return getRandomChar(charArray[0]);
      if (trailPercent < 0.6) return getRandomChar(charArray[1]);
      if (trailPercent < 0.85) return getRandomChar(charArray[2]);
      return getRandomChar(charArray[3]);
    }
    if (trailPercent < 0.7) return getRandomChar(charSets.dim[0]);
    return getRandomChar(charSets.dim[1]);
  }

  // ====== 批量渲染优化 ======
  const drawBatches = new Map(); // colorKey -> [{x, y, char}, ...]
  
  // 颜色字符串缓存
  const colorStringCache = new Map();
  function getColorString(r, g, b, a) {
    // 量化 alpha 到 0.05 精度，提高缓存命中率
    const quantizedAlpha = Math.round(a * 20) / 20;
    const key = (r << 24) | (g << 16) | (b << 8) | (quantizedAlpha * 255);
    let colorStr = colorStringCache.get(key);
    if (!colorStr) {
      colorStr = `rgba(${r},${g},${b},${quantizedAlpha.toFixed(2)})`;
      if (colorStringCache.size < 2000) {
        colorStringCache.set(key, colorStr);
      }
    }
    return { key, colorStr };
  }

  function render(fireworks, ctx, state) {
    if (state.fontSizeChanged) {
      ctx.font = state.font_size * 2 + "px/" + state.font_size * 4 + "px FiraCode";
      state.width = Math.floor(ctx.canvas.width / state.font_size);
      // 使用 Math.floor 确保所有行都完整在屏幕内，避免"半行"问题
      state.height = Math.floor(ctx.canvas.height / (state.font_size * 2));
      state.grid = Array.from({ length: state.height }, () => Array(state.width).fill(false));
      state.fontSizeChanged = false;
    }

    clearGrid(state.grid);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // 如果有背景色，填充背景
    if (state.backgroundColor) {
      ctx.fillStyle = state.backgroundColor;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    const font_size = state.font_size;
    const gridWidth = state.width;
    const gridHeight = state.height;
    const grid = state.grid;

    // 清空批次
    drawBatches.clear();

    // 按颜色分组
    for (let i = fireworks.length - 1; i >= 0; i--) {
      const firework = fireworks[i];
      const particles = firework.particles;
      
      for (let j = particles.length - 1; j >= 0; j--) {
        const particle = particles[j];
        if (!particle.color || !particle.trail) continue;
        
        const lifetimePercent = particle.timeElapsed / particle.lifeTime;
        // 使用粒子自定义的渐变函数，否则使用默认的
        const gradientFunc = particle.gradientFunc || explosion_gradient;
        const alphaGradient = gradientFunc(lifetimePercent);
        const alpha = particle.color.a * alphaGradient;
        const { key: colorKey, colorStr } = getColorString(
          particle.color.r | 0,
          particle.color.g | 0,
          particle.color.b | 0,
          alpha
        );

        const trail = particle.trail;
        const trailLen = trail.length;

        for (let k = trailLen - 1; k >= 1; k--) {
          const p1 = trail[k];
          const p2 = trail[k - 1];
          const trailPercent = k / particle.trailLength;

          const x0 = Math.round(p1.x * 2);
          const y0 = Math.round(p1.y);
          const x1 = Math.round(p2.x * 2);
          const y1 = Math.round(p2.y);
          
          const dx = Math.abs(x1 - x0);
          const dy = Math.abs(y1 - y0);
          const sx = x0 < x1 ? 1 : -1;
          const sy = y0 < y1 ? 1 : -1;
          let err = dx - dy;
          let x = x0;
          let y = y0;
          
          while (true) {
            if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight && !grid[y][x]) {
              grid[y][x] = true;
              
              // 添加到对应颜色的批次
              let batch = drawBatches.get(colorKey);
              if (!batch) {
                batch = { colorStr, items: [] };
                drawBatches.set(colorKey, batch);
              }
              // 原始代码: t.x*font_size, t.y*2*font_size+2*font_size
              batch.items.push({
                char: getChar(lifetimePercent, trailPercent),
                px: x * font_size,
                py: y * 2 * font_size + 2 * font_size
              });
            }
            if (x === x1 && y === y1) break;
            const e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x += sx; }
            if (e2 < dx) { err += dx; y += sy; }
          }
        }
      }
    }

    // 按颜色批量绘制
    for (const batch of drawBatches.values()) {
      ctx.fillStyle = batch.colorStr;
      const items = batch.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        ctx.fillText(item.char, item.px, item.py, font_size);
      }
    }
  }

  global.RenderLib = {
    render,
  };
})(window);

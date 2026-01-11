//====== Runtime configuration =====
let font_size = 6;
let fontSizeChanged = false;
let fps = 30;
let gravity = 7.5;
let drag = 0.18;
let lifetime_offset = 0.3;
let button_offset = 4;
let background_color = "0 0 0"; // RGB format (0-1)

// 自定义颜色组 1 (6个颜色)
let custom_color_1_1 = "1 0 0";
let custom_color_1_2 = "1 0.33 0.33";
let custom_color_1_3 = "1 0.67 0.67";
let custom_color_1_4 = "0.78 0 0";
let custom_color_1_5 = "0.59 0 0";
let custom_color_1_6 = "1 0.50 0.50";

// 自定义颜色组 2 (6个颜色)
let custom_color_2_1 = "0 1 0";
let custom_color_2_2 = "0.33 1 0.33";
let custom_color_2_3 = "0.67 1 0.67";
let custom_color_2_4 = "0 0.78 0";
let custom_color_2_5 = "0 0.59 0";
let custom_color_2_6 = "0.50 1 0.50";

// 自定义颜色组 3 (6个颜色)
let custom_color_3_1 = "0 0 1";
let custom_color_3_2 = "0.33 0.33 1";
let custom_color_3_3 = "0.67 0.67 1";
let custom_color_3_4 = "0 0 0.78";
let custom_color_3_5 = "0 0 0.59";
let custom_color_3_6 = "0.50 0.50 1";

// Classic 烟花参数
let classic_enable = true;
let classic_interval = 250;
let classic_duration_ms = 1000;
let classic_rest_ms = 0;
let classic_duration_s = 9;
let classic_rest_s = 40;
let classic_first_wait = 0;
let classic_speed = 250;
let classic_count = 28;
let classic_lifetime = 3000;
let classic_withlaunch = true;
let classic_launch_ratio = 0.85;
let classic_speed_variance = 0.85;
// Classic 颜色组开关 (0-7: 预设, 8-10: 自定义)
let classic_colors = [true, true, true, true, true, true, false, false, false, false, false];

// Fountain 烟花参数
let fountain_enable = true;
let fountain_interval = 50;
let fountain_duration_ms = 1000;
let fountain_rest_ms = 950;
let fountain_duration_s = 9;
let fountain_rest_s = 40;
let fountain_first_wait = 20;
let fountain_fan_angle = 10;
let fountain_count = 10;
let fountain_speed = 72;
let fountain_speed_variance = 1;
let fountain_lifetime = 5000;
// Fountain 颜色组开关 (0-7: 预设, 8-10: 自定义)
let fountain_colors = [false, false, false, true, false, false, false, false, false, false, false];

// Vortex 烟花参数
let vortex_enable = true;
let vortex_interval = 250;
let vortex_duration_ms = 1000;
let vortex_rest_ms = 0;
let vortex_duration_s = 6;
let vortex_rest_s = 43;
let vortex_first_wait = 40;
let vortex_size = 75;
// Vortex 颜色组开关 (0-7: 预设, 8-10: 自定义)
let vortex_colors = [false, false, false, false, false, false, true, false, false, false, false];

// FountainArray 烟花参数
let fountainarray_enable = true;
let fountainarray_interval = 2000;
let fountainarray_duration_ms = 1000;
let fountainarray_rest_ms = 0;
let fountainarray_duration_s = 9;
let fountainarray_rest_s = 40;
let fountainarray_first_wait = 15;
let fountainarray_speed = 45;
let fountainarray_lifetime = 5000;
let fountainarray_speed_variance = 0.2;
let fountainarray_array_count = 16;
let fountainarray_particle_per_array = 1;
let fountainarray_angle_range = 10;
// FountainArray 颜色组开关 (0-7: 预设, 8-10: 自定义)
let fountainarray_colors = [true, true, true, false, false, false, true, false, false, false, false];

// CrossFire 烟花参数
let crossfire_enable = true;
let crossfire_interval = 50;
let crossfire_duration_ms = 1000;
let crossfire_rest_ms = 0;
let crossfire_duration_s = 9;
let crossfire_rest_s = 40;
let crossfire_first_wait = 10;
let crossfire_pos_offset = 0.15;
let crossfire_angle_direction = 56;
let crossfire_angle_range = 4;
let crossfire_count = 3;
let crossfire_speed = 51;
let crossfire_speed_variance = 0.7;
let crossfire_lifetime = 5000;
// CrossFire 颜色组开关 (0-7: 预设, 8-10: 自定义)
let crossfire_colors = [false, false, false, false, false, false, false, true, false, false, false];

// GrandFinale 烟花参数
let grandfinale_enable = true;
let grandfinale_interval = 3000;
let grandfinale_duration_ms = 1000;
let grandfinale_rest_ms = 0;
let grandfinale_duration_s = 0;
let grandfinale_rest_s = 49;
let grandfinale_first_wait = 31;
let grandfinale_count1 = 170;
let grandfinale_speed1 = 11;
let grandfinale_count2 = 470;
let grandfinale_speed2 = 24;
let grandfinale_count3 = 6;
let grandfinale_speed3 = 30;
let grandfinale_ring_radius = 12;
let grandfinale_lifetime = 5000;
// GrandFinale 颜色组开关 (0-7: 预设, 8-10: 自定义)
let grandfinale_colors = [true, false, false, false, false, false, false, false, false, false, false];

//====== Helper Functions =====
function parseColorStr(colorStr) {
  const parts = (colorStr || "").trim().split(/\s+/).map(p => parseFloat(p));
  if (parts.length >= 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    const r = Math.round(Math.max(0, Math.min(1, parts[0])) * 255);
    const g = Math.round(Math.max(0, Math.min(1, parts[1])) * 255);
    const b = Math.round(Math.max(0, Math.min(1, parts[2])) * 255);
    return { r, g, b, valid: true };
  }
  return { valid: false };
}

function updateCustomColorGroup(groupIndex, properties, groupNum) {
  if (!FireworkLib || !FireworkLib.setCustomColorGroup || !FireworkLib.Color) return;
  
  // 从 properties 中更新全局变量
  let updated = false;
  for (let i = 1; i <= 6; i++) {
    const propName = `custom_color_${groupNum}_${i}`;
    if (properties[propName]) {
      eval(`custom_color_${groupNum}_${i} = properties[propName].value;`);
      updated = true;
    }
  }
  
  if (!updated) return;
  
  // 构建颜色数组
  const colorArray = [];
  for (let i = 1; i <= 6; i++) {
    const colorStr = eval(`custom_color_${groupNum}_${i}`);
    const color = parseColorStr(colorStr);
    if (color.valid) {
      colorArray.push(new FireworkLib.Color(color.r, color.g, color.b, 1));
    }
  }
  
  if (colorArray.length > 0) {
    FireworkLib.setCustomColorGroup(groupIndex, colorArray);
  }
}

//====== Wallpaper Engine bindings =====
// wallpaper.js 已处理所有属性更新逻辑

//====== HiDPI canvas helpers =====
const PIXEL_RATIO = (function () {
  const ctx = document.createElement("canvas").getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const bsr =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;
  return dpr / bsr;
})();

function createHiDPICanvas(w, h, ratio) {
  if (!ratio) { ratio = PIXEL_RATIO; }
  const can = document.createElement("canvas");
  can.width = w * ratio;
  can.height = h * ratio;
  can.style.width = w + "px";
  can.style.height = h + "px";
  can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
  return can;
}

//====== Canvas bootstrap =====
const canvas = createHiDPICanvas(window.innerWidth, window.innerHeight);
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
ctx.font = font_size * 2 + "px/" + font_size * 4 + "px FiraCode";

let _width = Math.ceil(ctx.canvas.width / font_size);
let _height = Math.ceil(ctx.canvas.height / (font_size * 2));
let grid = Array.from({ length: _height }, () => Array(_width).fill(false));

const state = {
  font_size,
  fontSizeChanged,
  fps,
  gravity,
  drag,
  lifetime_offset,
  backgroundColor: undefined,
  width: _width,
  height: _height,
  grid: grid,
};
state.width = _width;
state.height = _height;


//====== Firework collection =====
let fm = [];
let fireworkEmitter = new FireworkEmitter();

function spawnFirework(type, globalState) {
  let result = null;
  
  // classic 和 grandFinale 使用随机位置
  if (type === 'classic' || type === 'grandFinale') {
    const x = (Math.random() * 0.5) * globalState.width;
    const y = (Math.random() * 0.6) * (globalState.height - button_offset);
    if (type === 'classic') {
      // 修复 withLaunch 逻辑
      if (FireworkLib.ClassicParams && FireworkLib.ClassicParams.withLaunch && globalState.height) {
        result = FireworkLib.genFirework_ClassicWithLaunch(x, y, globalState.height - button_offset);
      } else {
        result = FireworkLib.genFirework_Classic(x, y);
      }
    } else {
      result = FireworkLib.genFirework_GrandFinale(globalState.width, globalState.height - button_offset);
    }
  } else if (type === 'vortex') {
    // vortex 使用屏幕中心位置
    const x = globalState.width / 2;
    const y = (globalState.height - button_offset) / 2;
    result = FireworkLib.genFirework_Vortex(x, y);
  } else {
    // 其他类型使用 state 来处理固定位置
    switch(type) {
      case 'fountain':
        result = FireworkLib.genFirework_Fountain(globalState.width, globalState.height - button_offset);
        break;
      case 'fountainArray':
        result = FireworkLib.genFirework_FountainArray(globalState.width, globalState.height - button_offset);
        break;
      case 'crossFire':
        result = FireworkLib.genFirework_CrossFire(globalState.width, globalState.height - button_offset);
        break;
    }
  }
  
  if (result === null) {
    return;
  }
  
  if (Array.isArray(result)) {
    fm.push(...result);
  } else {
    fm.push(result);
  }
}


let last = performance.now();
let lastPoolLog = performance.now();
const POOL_LOG_INTERVAL = 5000; // 每5秒输出一次对象池信息

//====== Main loop =====
function run() {
  window.requestAnimationFrame(run);
  const now = performance.now();
  const dt = Math.min(now - last, 200);

  // Update state from globals
  state.font_size = font_size;
  state.fontSizeChanged = fontSizeChanged;
  state.fps = fps;
  state.gravity = gravity;
  state.drag = drag;
  state.lifetime_offset = lifetime_offset;
  
  // 转换背景色为RGB格式
  if (background_color) {
    const bgColorParts = background_color.split(' ').map(v => Math.floor(parseFloat(v) * 255));
    state.backgroundColor = `rgb(${bgColorParts[0]}, ${bgColorParts[1]}, ${bgColorParts[2]})`;
  }

  if (dt < 1000 / state.fps) {
    return;
  }

  last = now;
  
  // 使用烟火发射器更新所有烟火的连续发射
  fireworkEmitter.update(now, state, spawnFirework);

  fm.forEach((f) => f.update(dt));
  fm = fm.filter((f) => f.alive === true);

  RenderLib.render(fm, ctx, state);

  // 定期输出对象池信息
  if (now - lastPoolLog >= POOL_LOG_INTERVAL) {
    lastPoolLog = now;
    const vec2Stats = FireworkLib.Vec2Pool.getStats();
    const particleStats = FireworkLib.ParticlePool.getStats();
    let totalParticles = 0;
    fm.forEach(f => totalParticles += f.particles.length);
    
    console.log('=== 对象池状态 ===');
    console.log(`Vec2Pool: 池=${vec2Stats.poolSize}, 使用中=${vec2Stats.inUse}, 峰值=${vec2Stats.peakUsage}, 总创建=${vec2Stats.totalCreated}, 丢弃=${vec2Stats.discarded}`);
    // 检查是否有真正的泄漏: poolSize + inUse + discarded 应该等于 totalCreated
    const vec2Leaked = vec2Stats.totalCreated - (vec2Stats.poolSize + vec2Stats.inUse + vec2Stats.discarded);
    if (vec2Leaked !== 0) {
      console.warn(`[警告] Vec2 真正泄漏: ${vec2Leaked} 个对象`);
    }
    if (vec2Stats.discarded > 0) {
      console.log(`[提示] Vec2 因池满丢弃了 ${vec2Stats.discarded} 个对象（会被GC回收）`);
    }
    console.log(`ParticlePool: 池=${particleStats.poolSize}, 使用中=${particleStats.inUse}, 峰值=${particleStats.peakUsage}, 总创建=${particleStats.totalCreated}`);
    const particleLeaked = particleStats.totalCreated - (particleStats.poolSize + particleStats.inUse + particleStats.discarded);
    if (particleLeaked !== 0) {
      console.warn(`[警告] Particle 真正泄漏: ${particleLeaked} 个对象`);
    }
    console.log(`当前烟花数量: ${fm.length}, 粒子总数: ${totalParticles}`);
    console.log('==================');
  }
}

// 初始化自定义颜色组 - 在运行前设置
function initCustomColorGroup(groupIndex, groupNum) {
  if (!FireworkLib || !FireworkLib.setCustomColorGroup || !FireworkLib.Color) return false;
  
  const colorArray = [];
  for (let i = 1; i <= 6; i++) {
    const colorStr = eval(`custom_color_${groupNum}_${i}`);
    const color = parseColorStr(colorStr);
    if (color.valid) {
      colorArray.push(new FireworkLib.Color(color.r, color.g, color.b, 1));
    }
  }
  
  if (colorArray.length > 0) {
    FireworkLib.setCustomColorGroup(groupIndex, colorArray);
    return true;
  }
  return false;
}

function initializeCustomColors() {
  if (!FireworkLib || !FireworkLib.setCustomColorGroup || !FireworkLib.Color) {
    console.warn('FireworkLib 或所需函数未准备好，等待重试...');
    return false;
  }

  try {
    // 初始化自定义颜色组
    if (initCustomColorGroup(0, 1)) console.log(`✓ 自定义颜色组 1 初始化成功`);
    if (initCustomColorGroup(1, 2)) console.log(`✓ 自定义颜色组 2 初始化成功`);
    if (initCustomColorGroup(2, 3)) console.log(`✓ 自定义颜色组 3 初始化成功`);

    // 初始化所有烟花类型的颜色可用性 - 基于项目配置
    if (FireworkLib && FireworkLib.colorAvailability) {
      console.log('初始化颜色可用性...');
      // 从 classic_colors, fountain_colors 等数组初始化
      const fireworkTypes = ['classic', 'classicLaunch', 'fountain', 'vortex', 'fountainArray', 'crossFire', 'grandFinale'];
      const colorArrays = {
        classic: classic_colors,
        classicLaunch: classic_colors,
        fountain: fountain_colors,
        vortex: vortex_colors,
        fountainArray: fountainarray_colors,
        crossFire: crossfire_colors,
        grandFinale: grandfinale_colors
      };

      for (const fireworkType of fireworkTypes) {
        if (colorArrays[fireworkType]) {
          for (let i = 0; i <= 10; i++) {
            if (FireworkLib.colorAvailability[fireworkType]) {
              FireworkLib.colorAvailability[fireworkType][i] = colorArrays[fireworkType][i];
            }
          }
        }
      }
    }

    console.log('✓ 颜色初始化完成');
    return true;
  } catch (err) {
    console.error('初始化自定义颜色失败:', err);
    return false;
  }
}

// 尝试初始化自定义颜色
let initAttempts = 0;
const maxAttempts = 20;
const initTimer = setInterval(() => {
  if (initializeCustomColors()) {
    clearInterval(initTimer);
    console.log('✓ 自定义颜色初始化成功');
  } else if (++initAttempts >= maxAttempts) {
    console.error('✗ 初始化自定义颜色最终失败');
    clearInterval(initTimer);
  }
}, 50);

// 也在 run 之后再尝试一次初始化（确保 ColorLib 已完全加载）
setTimeout(() => {
  if (initAttempts < maxAttempts) {
    initializeCustomColors();
  }
}, 500);

run();

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
let fountain_rest_ms = 0;
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

//====== Lively 初始化 =====
// 当 Lively 加载时调用此函数来初始化所有参数
function initializeFromLively(properties) {
  if (!properties) return;
  
  console.log('Lively initialization started');
  
  // 通用参数
  if (properties.font_size !== undefined) font_size = properties.font_size;
  if (properties.fps !== undefined) fps = properties.fps;
  if (properties.gravity !== undefined) gravity = properties.gravity;
  if (properties.drag !== undefined) drag = properties.drag;
  if (properties.lifetime_offset !== undefined) lifetime_offset = properties.lifetime_offset;
  if (properties.button_offset !== undefined) button_offset = properties.button_offset;
  
  // 背景色转换：从 HEX 格式 (#000000) 转为 RGB 0-1 格式 (0 0 0)
  if (properties.background_color !== undefined) {
    const hexColor = properties.background_color;
    if (hexColor && hexColor.startsWith('#')) {
      // 从 HEX 转为 RGB 0-1 范围
      const hexStr = hexColor.replace('#', '');
      const r = parseInt(hexStr.substring(0, 2), 16) / 255;
      const g = parseInt(hexStr.substring(2, 4), 16) / 255;
      const b = parseInt(hexStr.substring(4, 6), 16) / 255;
      background_color = `${r} ${g} ${b}`;
    } else {
      background_color = properties.background_color;
    }
  }
  
  // 自定义颜色
  for (let group = 1; group <= 3; group++) {
    for (let i = 1; i <= 6; i++) {
      const propName = `custom_color_${group}_${i}`;
      if (properties[propName] !== undefined) {
        eval(`custom_color_${group}_${i} = properties["${propName}"];`);
      }
    }
  }
  
  // Classic 烟花
  if (properties.classic_enable !== undefined) classic_enable = properties.classic_enable;
  if (properties.classic_interval !== undefined) classic_interval = properties.classic_interval;
  if (properties.classic_duration_ms !== undefined) classic_duration_ms = properties.classic_duration_ms;
  if (properties.classic_rest_ms !== undefined) classic_rest_ms = properties.classic_rest_ms;
  if (properties.classic_duration_s !== undefined) classic_duration_s = properties.classic_duration_s;
  if (properties.classic_rest_s !== undefined) classic_rest_s = properties.classic_rest_s;
  if (properties.classic_first_wait !== undefined) classic_first_wait = properties.classic_first_wait;
  if (properties.classic_speed !== undefined) classic_speed = properties.classic_speed;
  if (properties.classic_count !== undefined) classic_count = properties.classic_count;
  if (properties.classic_lifetime !== undefined) classic_lifetime = properties.classic_lifetime;
  if (properties.classic_withlaunch !== undefined) classic_withlaunch = properties.classic_withlaunch;
  if (properties.classic_launch_ratio !== undefined) classic_launch_ratio = properties.classic_launch_ratio;
  if (properties.classic_speed_variance !== undefined) classic_speed_variance = properties.classic_speed_variance;
  for (let i = 0; i <= 10; i++) {
    const propName = `classic_color_${i}`;
    if (properties[propName] !== undefined) classic_colors[i] = properties[propName];
  }
  
  // Fountain 烟花
  if (properties.fountain_enable !== undefined) fountain_enable = properties.fountain_enable;
  if (properties.fountain_interval !== undefined) fountain_interval = properties.fountain_interval;
  if (properties.fountain_duration_ms !== undefined) fountain_duration_ms = properties.fountain_duration_ms;
  if (properties.fountain_rest_ms !== undefined) fountain_rest_ms = properties.fountain_rest_ms;
  if (properties.fountain_duration_s !== undefined) fountain_duration_s = properties.fountain_duration_s;
  if (properties.fountain_rest_s !== undefined) fountain_rest_s = properties.fountain_rest_s;
  if (properties.fountain_first_wait !== undefined) fountain_first_wait = properties.fountain_first_wait;
  if (properties.fountain_fan_angle !== undefined) fountain_fan_angle = properties.fountain_fan_angle;
  if (properties.fountain_count !== undefined) fountain_count = properties.fountain_count;
  if (properties.fountain_speed !== undefined) fountain_speed = properties.fountain_speed;
  if (properties.fountain_speed_variance !== undefined) fountain_speed_variance = properties.fountain_speed_variance;
  if (properties.fountain_lifetime !== undefined) fountain_lifetime = properties.fountain_lifetime;
  for (let i = 0; i <= 10; i++) {
    const propName = `fountain_color_${i}`;
    if (properties[propName] !== undefined) fountain_colors[i] = properties[propName];
  }
  
  // Vortex 烟花
  if (properties.vortex_enable !== undefined) vortex_enable = properties.vortex_enable;
  if (properties.vortex_interval !== undefined) vortex_interval = properties.vortex_interval;
  if (properties.vortex_duration_ms !== undefined) vortex_duration_ms = properties.vortex_duration_ms;
  if (properties.vortex_rest_ms !== undefined) vortex_rest_ms = properties.vortex_rest_ms;
  if (properties.vortex_duration_s !== undefined) vortex_duration_s = properties.vortex_duration_s;
  if (properties.vortex_rest_s !== undefined) vortex_rest_s = properties.vortex_rest_s;
  if (properties.vortex_first_wait !== undefined) vortex_first_wait = properties.vortex_first_wait;
  if (properties.vortex_size !== undefined) vortex_size = properties.vortex_size;
  for (let i = 0; i <= 10; i++) {
    const propName = `vortex_color_${i}`;
    if (properties[propName] !== undefined) vortex_colors[i] = properties[propName];
  }
  
  // FountainArray 烟花
  if (properties.fountainarray_enable !== undefined) fountainarray_enable = properties.fountainarray_enable;
  if (properties.fountainarray_interval !== undefined) fountainarray_interval = properties.fountainarray_interval;
  if (properties.fountainarray_duration_ms !== undefined) fountainarray_duration_ms = properties.fountainarray_duration_ms;
  if (properties.fountainarray_rest_ms !== undefined) fountainarray_rest_ms = properties.fountainarray_rest_ms;
  if (properties.fountainarray_duration_s !== undefined) fountainarray_duration_s = properties.fountainarray_duration_s;
  if (properties.fountainarray_rest_s !== undefined) fountainarray_rest_s = properties.fountainarray_rest_s;
  if (properties.fountainarray_first_wait !== undefined) fountainarray_first_wait = properties.fountainarray_first_wait;
  if (properties.fountainarray_speed !== undefined) fountainarray_speed = properties.fountainarray_speed;
  if (properties.fountainarray_lifetime !== undefined) fountainarray_lifetime = properties.fountainarray_lifetime;
  if (properties.fountainarray_speed_variance !== undefined) fountainarray_speed_variance = properties.fountainarray_speed_variance;
  if (properties.fountainarray_array_count !== undefined) fountainarray_array_count = properties.fountainarray_array_count;
  if (properties.fountainarray_particle_per_array !== undefined) fountainarray_particle_per_array = properties.fountainarray_particle_per_array;
  if (properties.fountainarray_angle_range !== undefined) fountainarray_angle_range = properties.fountainarray_angle_range;
  for (let i = 0; i <= 10; i++) {
    const propName = `fountainarray_color_${i}`;
    if (properties[propName] !== undefined) fountainarray_colors[i] = properties[propName];
  }
  
  // CrossFire 烟花
  if (properties.crossfire_enable !== undefined) crossfire_enable = properties.crossfire_enable;
  if (properties.crossfire_interval !== undefined) crossfire_interval = properties.crossfire_interval;
  if (properties.crossfire_duration_ms !== undefined) crossfire_duration_ms = properties.crossfire_duration_ms;
  if (properties.crossfire_rest_ms !== undefined) crossfire_rest_ms = properties.crossfire_rest_ms;
  if (properties.crossfire_duration_s !== undefined) crossfire_duration_s = properties.crossfire_duration_s;
  if (properties.crossfire_rest_s !== undefined) crossfire_rest_s = properties.crossfire_rest_s;
  if (properties.crossfire_first_wait !== undefined) crossfire_first_wait = properties.crossfire_first_wait;
  if (properties.crossfire_pos_offset !== undefined) crossfire_pos_offset = properties.crossfire_pos_offset;
  if (properties.crossfire_angle_direction !== undefined) crossfire_angle_direction = properties.crossfire_angle_direction;
  if (properties.crossfire_angle_range !== undefined) crossfire_angle_range = properties.crossfire_angle_range;
  if (properties.crossfire_count !== undefined) crossfire_count = properties.crossfire_count;
  if (properties.crossfire_speed !== undefined) crossfire_speed = properties.crossfire_speed;
  if (properties.crossfire_speed_variance !== undefined) crossfire_speed_variance = properties.crossfire_speed_variance;
  if (properties.crossfire_lifetime !== undefined) crossfire_lifetime = properties.crossfire_lifetime;
  for (let i = 0; i <= 10; i++) {
    const propName = `crossfire_color_${i}`;
    if (properties[propName] !== undefined) crossfire_colors[i] = properties[propName];
  }
  
  // GrandFinale 烟花
  if (properties.grandfinale_enable !== undefined) grandfinale_enable = properties.grandfinale_enable;
  if (properties.grandfinale_interval !== undefined) grandfinale_interval = properties.grandfinale_interval;
  if (properties.grandfinale_duration_ms !== undefined) grandfinale_duration_ms = properties.grandfinale_duration_ms;
  if (properties.grandfinale_rest_ms !== undefined) grandfinale_rest_ms = properties.grandfinale_rest_ms;
  if (properties.grandfinale_duration_s !== undefined) grandfinale_duration_s = properties.grandfinale_duration_s;
  if (properties.grandfinale_rest_s !== undefined) grandfinale_rest_s = properties.grandfinale_rest_s;
  if (properties.grandfinale_first_wait !== undefined) grandfinale_first_wait = properties.grandfinale_first_wait;
  if (properties.grandfinale_count1 !== undefined) grandfinale_count1 = properties.grandfinale_count1;
  if (properties.grandfinale_speed1 !== undefined) grandfinale_speed1 = properties.grandfinale_speed1;
  if (properties.grandfinale_count2 !== undefined) grandfinale_count2 = properties.grandfinale_count2;
  if (properties.grandfinale_speed2 !== undefined) grandfinale_speed2 = properties.grandfinale_speed2;
  if (properties.grandfinale_count3 !== undefined) grandfinale_count3 = properties.grandfinale_count3;
  if (properties.grandfinale_speed3 !== undefined) grandfinale_speed3 = properties.grandfinale_speed3;
  if (properties.grandfinale_ring_radius !== undefined) grandfinale_ring_radius = properties.grandfinale_ring_radius;
  if (properties.grandfinale_lifetime !== undefined) grandfinale_lifetime = properties.grandfinale_lifetime;
  for (let i = 0; i <= 10; i++) {
    const propName = `grandfinale_color_${i}`;
    if (properties[propName] !== undefined) grandfinale_colors[i] = properties[propName];
  }
  
  console.log('✓ Lively initialization completed');
}

// 向外暴露 initLibraryParams 函数供 lively.js 调用
// 这个函数会在 FireworkLib 初始化后被调用
window.initLibraryParams = function(properties) {
  console.log('Initializing FireworkLib parameters from Lively...');
  
  // Physics 参数
  if (FireworkLib && FireworkLib.Physics) {
    if (properties.gravity !== undefined) FireworkLib.Physics.BASE_GRAVITY = properties.gravity;
    if (properties.drag !== undefined) FireworkLib.Physics.BASE_DRAG = properties.drag;
    if (properties.lifetime_offset !== undefined) FireworkLib.Physics.LIFETIME_OFFSET = properties.lifetime_offset;
  }
  
  // Classic 参数
  if (FireworkLib && FireworkLib.ClassicParams) {
    if (properties.classic_speed !== undefined) FireworkLib.ClassicParams.speed = properties.classic_speed;
    if (properties.classic_count !== undefined) FireworkLib.ClassicParams.count = properties.classic_count;
    if (properties.classic_lifetime !== undefined) FireworkLib.ClassicParams.lifetime = properties.classic_lifetime;
    if (properties.classic_withlaunch !== undefined) FireworkLib.ClassicParams.withLaunch = properties.classic_withlaunch;
    if (properties.classic_launch_ratio !== undefined) FireworkLib.ClassicParams.launchRatio = properties.classic_launch_ratio;
    if (properties.classic_speed_variance !== undefined) FireworkLib.ClassicParams.speedVariance = properties.classic_speed_variance;
  }
  
  // Fountain 参数
  if (FireworkLib && FireworkLib.FountainParams) {
    if (properties.fountain_fan_angle !== undefined) FireworkLib.FountainParams.fanAngle = properties.fountain_fan_angle;
    if (properties.fountain_count !== undefined) FireworkLib.FountainParams.count = properties.fountain_count;
    if (properties.fountain_speed !== undefined) FireworkLib.FountainParams.speed = properties.fountain_speed;
    if (properties.fountain_speed_variance !== undefined) FireworkLib.FountainParams.speedVariance = properties.fountain_speed_variance;
    if (properties.fountain_lifetime !== undefined) FireworkLib.FountainParams.lifetime = properties.fountain_lifetime;
  }
  
  // Vortex 参数
  if (FireworkLib && FireworkLib.VortexParams) {
    if (properties.vortex_size !== undefined) FireworkLib.VortexParams.size = properties.vortex_size;
  }
  
  // FountainArray 参数
  if (FireworkLib && FireworkLib.FountainArrayParams) {
    if (properties.fountainarray_speed !== undefined) FireworkLib.FountainArrayParams.speed = properties.fountainarray_speed;
    if (properties.fountainarray_lifetime !== undefined) FireworkLib.FountainArrayParams.lifetime = properties.fountainarray_lifetime;
    if (properties.fountainarray_speed_variance !== undefined) FireworkLib.FountainArrayParams.speedVariance = properties.fountainarray_speed_variance;
    if (properties.fountainarray_array_count !== undefined) FireworkLib.FountainArrayParams.arrayCount = properties.fountainarray_array_count;
    if (properties.fountainarray_particle_per_array !== undefined) FireworkLib.FountainArrayParams.particlePerArray = properties.fountainarray_particle_per_array;
    if (properties.fountainarray_angle_range !== undefined) FireworkLib.FountainArrayParams.angleRange = properties.fountainarray_angle_range;
  }
  
  // CrossFire 参数
  if (FireworkLib && FireworkLib.CrossFireParams) {
    if (properties.crossfire_pos_offset !== undefined) FireworkLib.CrossFireParams.posOffset = properties.crossfire_pos_offset;
    if (properties.crossfire_angle_direction !== undefined) FireworkLib.CrossFireParams.angleDirection = properties.crossfire_angle_direction;
    if (properties.crossfire_angle_range !== undefined) FireworkLib.CrossFireParams.angleRange = properties.crossfire_angle_range;
    if (properties.crossfire_count !== undefined) FireworkLib.CrossFireParams.count = properties.crossfire_count;
    if (properties.crossfire_speed !== undefined) FireworkLib.CrossFireParams.speed = properties.crossfire_speed;
    if (properties.crossfire_speed_variance !== undefined) FireworkLib.CrossFireParams.speedVariance = properties.crossfire_speed_variance;
    if (properties.crossfire_lifetime !== undefined) FireworkLib.CrossFireParams.lifetime = properties.crossfire_lifetime;
  }
  
  // GrandFinale 参数
  if (FireworkLib && FireworkLib.GrandFinaleParams) {
    if (properties.grandfinale_count1 !== undefined) FireworkLib.GrandFinaleParams.count1 = properties.grandfinale_count1;
    if (properties.grandfinale_speed1 !== undefined) FireworkLib.GrandFinaleParams.speed1 = properties.grandfinale_speed1;
    if (properties.grandfinale_count2 !== undefined) FireworkLib.GrandFinaleParams.count2 = properties.grandfinale_count2;
    if (properties.grandfinale_speed2 !== undefined) FireworkLib.GrandFinaleParams.speed2 = properties.grandfinale_speed2;
    if (properties.grandfinale_count3 !== undefined) FireworkLib.GrandFinaleParams.count3 = properties.grandfinale_count3;
    if (properties.grandfinale_speed3 !== undefined) FireworkLib.GrandFinaleParams.speed3 = properties.grandfinale_speed3;
    if (properties.grandfinale_ring_radius !== undefined) FireworkLib.GrandFinaleParams.ringRadius = properties.grandfinale_ring_radius;
    if (properties.grandfinale_lifetime !== undefined) FireworkLib.GrandFinaleParams.lifetime = properties.grandfinale_lifetime;
  }
  
  // 颜色可用性
  if (FireworkLib && FireworkLib.colorAvailability) {
    // Classic 颜色
    for (let i = 0; i <= 10; i++) {
      const propName = `classic_color_${i}`;
      if (properties[propName] !== undefined) {
        if (FireworkLib.colorAvailability.classic) FireworkLib.colorAvailability.classic[i] = properties[propName];
        if (FireworkLib.colorAvailability.classicLaunch) FireworkLib.colorAvailability.classicLaunch[i] = properties[propName];
      }
    }
    
    // Fountain 颜色
    for (let i = 0; i <= 10; i++) {
      const propName = `fountain_color_${i}`;
      if (properties[propName] !== undefined && FireworkLib.colorAvailability.fountain) {
        FireworkLib.colorAvailability.fountain[i] = properties[propName];
      }
    }
    
    // Vortex 颜色
    for (let i = 0; i <= 10; i++) {
      const propName = `vortex_color_${i}`;
      if (properties[propName] !== undefined && FireworkLib.colorAvailability.vortex) {
        FireworkLib.colorAvailability.vortex[i] = properties[propName];
      }
    }
    
    // FountainArray 颜色
    for (let i = 0; i <= 10; i++) {
      const propName = `fountainarray_color_${i}`;
      if (properties[propName] !== undefined && FireworkLib.colorAvailability.fountainArray) {
        FireworkLib.colorAvailability.fountainArray[i] = properties[propName];
      }
    }
    
    // CrossFire 颜色
    for (let i = 0; i <= 10; i++) {
      const propName = `crossfire_color_${i}`;
      if (properties[propName] !== undefined && FireworkLib.colorAvailability.crossFire) {
        FireworkLib.colorAvailability.crossFire[i] = properties[propName];
      }
    }
    
    // GrandFinale 颜色
    for (let i = 0; i <= 10; i++) {
      const propName = `grandfinale_color_${i}`;
      if (properties[propName] !== undefined && FireworkLib.colorAvailability.grandFinale) {
        FireworkLib.colorAvailability.grandFinale[i] = properties[propName];
      }
    }
  }
  
  console.log('✓ FireworkLib parameters initialized');
};

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
let canvas = createHiDPICanvas(window.innerWidth, window.innerHeight);
document.body.appendChild(canvas);
let ctx = canvas.getContext("2d");
ctx.font = font_size * 2 + "px/" + font_size * 4 + "px FiraCode";

// 使用 canvas 的逻辑尺寸（style.width/height）而不是物理尺寸（width/height）
const canvasLogicalWidth = parseInt(canvas.style.width);
const canvasLogicalHeight = parseInt(canvas.style.height);
let _width = Math.floor(canvasLogicalWidth / font_size);
let _height = Math.floor(canvasLogicalHeight / (font_size * 2));
let grid = Array.from({ length: _height }, () => Array(_width).fill(false));

// 缓存背景色以检测变化
let lastBackgroundColor = background_color;

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

// 处理窗口大小变化 - 重新创建 canvas
window.addEventListener('resize', () => {
  // 移除旧 canvas
  document.body.removeChild(canvas);
  
  // 创建新 canvas
  canvas = createHiDPICanvas(window.innerWidth, window.innerHeight);
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");
  ctx.font = state.font_size * 2 + "px/" + state.font_size * 4 + "px FiraCode";
  
  // 更新尺寸 - 使用逻辑尺寸而不是物理尺寸
  const canvasLogicalWidth = parseInt(canvas.style.width);
  const canvasLogicalHeight = parseInt(canvas.style.height);
  state.width = Math.floor(canvasLogicalWidth / state.font_size);
  state.height = Math.floor(canvasLogicalHeight / (state.font_size * 2));
  state.grid = Array.from({ length: state.height }, () => Array(state.width).fill(false));
  state.fontSizeChanged = true;
});


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
  
  // 只在背景色实际变化时才转换（使用缓存值比较，避免每帧乱闪）
  if (background_color !== lastBackgroundColor) {
    lastBackgroundColor = background_color;
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

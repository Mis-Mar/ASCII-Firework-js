//====== Lively Wallpaper Properties Handler =====
// This file handles all Lively wallpaper property updates
// Lively passes properties through the window.livelyPropertyListener interface

function updateCustomColorGroupLively(groupNum, properties) {
  for (let i = 1; i <= 6; i++) {
    const propName = `custom_color_${groupNum}_${i}`;
    if (properties[propName]) {
      const colorValue = properties[propName];
      // Convert hex color to RGB (0-1 range)
      const hexColor = colorValue.replace('#', '');
      const r = parseInt(hexColor.substring(0, 2), 16) / 255;
      const g = parseInt(hexColor.substring(2, 4), 16) / 255;
      const b = parseInt(hexColor.substring(4, 6), 16) / 255;
      
      eval(`custom_color_${groupNum}_${i} = "${r} ${g} ${b}";`);
      
      // 同时更新 FireworkLib 中的自定义颜色
      const colorParts = colorValue.replace('#', '');
      if (FireworkLib && FireworkLib.customColors && FireworkLib.customColors[groupNum - 1]) {
        FireworkLib.customColors[groupNum - 1][i - 1] = {
          r: parseInt(colorParts.substring(0, 2), 16),
          g: parseInt(colorParts.substring(2, 4), 16),
          b: parseInt(colorParts.substring(4, 6), 16),
          a: 1
        };
      }
    }
  }
}

// 从 LivelyProperties.json 读取初始配置
async function loadLivelyPropertiesConfig() {
  try {
    const response = await fetch('./LivelyProperties.json');
    const config = await response.json();
    const properties = {};
    
    // 提取所有默认值
    for (const [key, value] of Object.entries(config)) {
      if (value && value.value !== undefined) {
        properties[key] = value.value;
      }
    }
    
    // 调用初始化函数
    if (typeof initializeFromLively === 'function') {
      initializeFromLively(properties);
    }
    
    // 立即同步所有参数到 FireworkLib
    if (typeof window.initLibraryParams === 'function') {
      window.initLibraryParams(properties);
    }
    
    console.log('✓ Lively properties config loaded and initialized');
  } catch (err) {
    console.warn('Could not load LivelyProperties.json:', err);
  }
}

// Lively property listener - 处理实时更新
window.livelyPropertyListener = {
  applyUserProperties: function(properties) {
    // 通用参数
    if (properties.font_size !== undefined) {
      font_size = properties.font_size;
      fontSizeChanged = true;
    }
    
    if (properties.fps !== undefined) {
      fps = properties.fps;
    }
    
    if (properties.gravity !== undefined) {
      gravity = properties.gravity;
      if (FireworkLib && FireworkLib.Physics) {
        FireworkLib.Physics.BASE_GRAVITY = gravity;
      }
    }
    
    if (properties.drag !== undefined) {
      drag = properties.drag;
      if (FireworkLib && FireworkLib.Physics) {
        FireworkLib.Physics.BASE_DRAG = drag;
      }
    }
    
    if (properties.lifetime_offset !== undefined) {
      lifetime_offset = properties.lifetime_offset;
      if (FireworkLib && FireworkLib.Physics) {
        FireworkLib.Physics.LIFETIME_OFFSET = lifetime_offset;
      }
    }
    
    if (properties.button_offset !== undefined) {
      button_offset = properties.button_offset;
    }
    
    if (properties.background_color !== undefined) {
      // 背景色转换：从 HEX 格式 (#000000) 转为 RGB 0-1 格式 (0 0 0)
      const hexColor = properties.background_color;
      if (hexColor && hexColor.startsWith('#')) {
        const hexStr = hexColor.replace('#', '');
        const r = parseInt(hexStr.substring(0, 2), 16) / 255;
        const g = parseInt(hexStr.substring(2, 4), 16) / 255;
        const b = parseInt(hexStr.substring(4, 6), 16) / 255;
        background_color = `${r} ${g} ${b}`;
      } else {
        background_color = properties.background_color;
      }
    }
    
    // 自定义颜色组
    updateCustomColorGroupLively(1, properties);
    updateCustomColorGroupLively(2, properties);
    updateCustomColorGroupLively(3, properties);
    
    // Classic fireworks
    if (properties.classic_enable !== undefined) {
      classic_enable = properties.classic_enable;
    }
    if (properties.classic_interval !== undefined) {
      classic_interval = properties.classic_interval;
    }
    if (properties.classic_duration_ms !== undefined) {
      classic_duration_ms = properties.classic_duration_ms;
    }
    if (properties.classic_rest_ms !== undefined) {
      classic_rest_ms = properties.classic_rest_ms;
    }
    if (properties.classic_duration_s !== undefined) {
      classic_duration_s = properties.classic_duration_s;
    }
    if (properties.classic_rest_s !== undefined) {
      classic_rest_s = properties.classic_rest_s;
    }
    if (properties.classic_first_wait !== undefined) {
      classic_first_wait = properties.classic_first_wait;
    }
    if (properties.classic_speed !== undefined) {
      classic_speed = properties.classic_speed;
      if (FireworkLib && FireworkLib.ClassicParams) {
        FireworkLib.ClassicParams.speed = classic_speed;
      }
    }
    if (properties.classic_count !== undefined) {
      classic_count = properties.classic_count;
      if (FireworkLib && FireworkLib.ClassicParams) {
        FireworkLib.ClassicParams.count = classic_count;
      }
    }
    if (properties.classic_lifetime !== undefined) {
      classic_lifetime = properties.classic_lifetime;
      if (FireworkLib && FireworkLib.ClassicParams) {
        FireworkLib.ClassicParams.lifetime = classic_lifetime;
      }
    }
    if (properties.classic_withlaunch !== undefined) {
      classic_withlaunch = properties.classic_withlaunch;
      if (FireworkLib && FireworkLib.ClassicParams) {
        FireworkLib.ClassicParams.withLaunch = classic_withlaunch;
      }
    }
    if (properties.classic_launch_ratio !== undefined) {
      classic_launch_ratio = properties.classic_launch_ratio;
      if (FireworkLib && FireworkLib.ClassicParams) {
        FireworkLib.ClassicParams.launchRatio = classic_launch_ratio;
      }
    }
    if (properties.classic_speed_variance !== undefined) {
      classic_speed_variance = properties.classic_speed_variance;
      if (FireworkLib && FireworkLib.ClassicParams) {
        FireworkLib.ClassicParams.speedVariance = classic_speed_variance;
      }
    }
    
    // Classic color groups
    for (let i = 0; i <= 10; i++) {
      const propName = `classic_color_${i}`;
      if (properties[propName] !== undefined) {
        classic_colors[i] = properties[propName];
        if (FireworkLib && FireworkLib.colorAvailability) {
          FireworkLib.colorAvailability.classic[i] = classic_colors[i];
          FireworkLib.colorAvailability.classicLaunch[i] = classic_colors[i];
        }
      }
    }
    
    // Fountain fireworks
    if (properties.fountain_enable !== undefined) {
      fountain_enable = properties.fountain_enable;
    }
    if (properties.fountain_interval !== undefined) {
      fountain_interval = properties.fountain_interval;
    }
    if (properties.fountain_duration_ms !== undefined) {
      fountain_duration_ms = properties.fountain_duration_ms;
    }
    if (properties.fountain_rest_ms !== undefined) {
      fountain_rest_ms = properties.fountain_rest_ms;
    }
    if (properties.fountain_duration_s !== undefined) {
      fountain_duration_s = properties.fountain_duration_s;
    }
    if (properties.fountain_rest_s !== undefined) {
      fountain_rest_s = properties.fountain_rest_s;
    }
    if (properties.fountain_first_wait !== undefined) {
      fountain_first_wait = properties.fountain_first_wait;
    }
    if (properties.fountain_fan_angle !== undefined) {
      fountain_fan_angle = properties.fountain_fan_angle;
      if (FireworkLib && FireworkLib.FountainParams) {
        FireworkLib.FountainParams.fanAngle = fountain_fan_angle;
      }
    }
    if (properties.fountain_count !== undefined) {
      fountain_count = properties.fountain_count;
      if (FireworkLib && FireworkLib.FountainParams) {
        FireworkLib.FountainParams.count = fountain_count;
      }
    }
    if (properties.fountain_speed !== undefined) {
      fountain_speed = properties.fountain_speed;
      if (FireworkLib && FireworkLib.FountainParams) {
        FireworkLib.FountainParams.speed = fountain_speed;
      }
    }
    if (properties.fountain_speed_variance !== undefined) {
      fountain_speed_variance = properties.fountain_speed_variance;
      if (FireworkLib && FireworkLib.FountainParams) {
        FireworkLib.FountainParams.speedVariance = fountain_speed_variance;
      }
    }
    if (properties.fountain_lifetime !== undefined) {
      fountain_lifetime = properties.fountain_lifetime;
      if (FireworkLib && FireworkLib.FountainParams) {
        FireworkLib.FountainParams.lifetime = fountain_lifetime;
      }
    }
    
    // Fountain color groups
    for (let i = 0; i <= 10; i++) {
      const propName = `fountain_color_${i}`;
      if (properties[propName] !== undefined) {
        fountain_colors[i] = properties[propName];
        if (FireworkLib && FireworkLib.colorAvailability) {
          FireworkLib.colorAvailability.fountain[i] = fountain_colors[i];
        }
      }
    }
    
    // Vortex fireworks
    if (properties.vortex_enable !== undefined) {
      vortex_enable = properties.vortex_enable;
    }
    if (properties.vortex_interval !== undefined) {
      vortex_interval = properties.vortex_interval;
    }
    if (properties.vortex_duration_ms !== undefined) {
      vortex_duration_ms = properties.vortex_duration_ms;
    }
    if (properties.vortex_rest_ms !== undefined) {
      vortex_rest_ms = properties.vortex_rest_ms;
    }
    if (properties.vortex_duration_s !== undefined) {
      vortex_duration_s = properties.vortex_duration_s;
    }
    if (properties.vortex_rest_s !== undefined) {
      vortex_rest_s = properties.vortex_rest_s;
    }
    if (properties.vortex_first_wait !== undefined) {
      vortex_first_wait = properties.vortex_first_wait;
    }
    if (properties.vortex_size !== undefined) {
      vortex_size = properties.vortex_size;
      if (FireworkLib && FireworkLib.VortexParams) {
        FireworkLib.VortexParams.size = vortex_size;
      }
    }
    
    // Vortex color groups
    for (let i = 0; i <= 10; i++) {
      const propName = `vortex_color_${i}`;
      if (properties[propName] !== undefined) {
        vortex_colors[i] = properties[propName];
        if (FireworkLib && FireworkLib.colorAvailability) {
          FireworkLib.colorAvailability.vortex[i] = vortex_colors[i];
        }
      }
    }
    
    // FountainArray fireworks
    if (properties.fountainarray_enable !== undefined) {
      fountainarray_enable = properties.fountainarray_enable;
    }
    if (properties.fountainarray_interval !== undefined) {
      fountainarray_interval = properties.fountainarray_interval;
    }
    if (properties.fountainarray_duration_ms !== undefined) {
      fountainarray_duration_ms = properties.fountainarray_duration_ms;
    }
    if (properties.fountainarray_rest_ms !== undefined) {
      fountainarray_rest_ms = properties.fountainarray_rest_ms;
    }
    if (properties.fountainarray_duration_s !== undefined) {
      fountainarray_duration_s = properties.fountainarray_duration_s;
    }
    if (properties.fountainarray_rest_s !== undefined) {
      fountainarray_rest_s = properties.fountainarray_rest_s;
    }
    if (properties.fountainarray_first_wait !== undefined) {
      fountainarray_first_wait = properties.fountainarray_first_wait;
    }
    if (properties.fountainarray_speed !== undefined) {
      fountainarray_speed = properties.fountainarray_speed;
      if (FireworkLib && FireworkLib.FountainArrayParams) {
        FireworkLib.FountainArrayParams.speed = fountainarray_speed;
      }
    }
    if (properties.fountainarray_lifetime !== undefined) {
      fountainarray_lifetime = properties.fountainarray_lifetime;
      if (FireworkLib && FireworkLib.FountainArrayParams) {
        FireworkLib.FountainArrayParams.lifetime = fountainarray_lifetime;
      }
    }
    if (properties.fountainarray_speed_variance !== undefined) {
      fountainarray_speed_variance = properties.fountainarray_speed_variance;
      if (FireworkLib && FireworkLib.FountainArrayParams) {
        FireworkLib.FountainArrayParams.speedVariance = fountainarray_speed_variance;
      }
    }
    if (properties.fountainarray_array_count !== undefined) {
      fountainarray_array_count = properties.fountainarray_array_count;
      if (FireworkLib && FireworkLib.FountainArrayParams) {
        FireworkLib.FountainArrayParams.arrayCount = fountainarray_array_count;
      }
    }
    if (properties.fountainarray_particle_per_array !== undefined) {
      fountainarray_particle_per_array = properties.fountainarray_particle_per_array;
      if (FireworkLib && FireworkLib.FountainArrayParams) {
        FireworkLib.FountainArrayParams.particlePerArray = fountainarray_particle_per_array;
      }
    }
    if (properties.fountainarray_angle_range !== undefined) {
      fountainarray_angle_range = properties.fountainarray_angle_range;
      if (FireworkLib && FireworkLib.FountainArrayParams) {
        FireworkLib.FountainArrayParams.angleRange = fountainarray_angle_range;
      }
    }
    
    // FountainArray color groups
    for (let i = 0; i <= 10; i++) {
      const propName = `fountainarray_color_${i}`;
      if (properties[propName] !== undefined) {
        fountainarray_colors[i] = properties[propName];
        if (FireworkLib && FireworkLib.colorAvailability) {
          FireworkLib.colorAvailability.fountainArray[i] = fountainarray_colors[i];
        }
      }
    }
    
    // CrossFire fireworks
    if (properties.crossfire_enable !== undefined) {
      crossfire_enable = properties.crossfire_enable;
    }
    if (properties.crossfire_interval !== undefined) {
      crossfire_interval = properties.crossfire_interval;
    }
    if (properties.crossfire_duration_ms !== undefined) {
      crossfire_duration_ms = properties.crossfire_duration_ms;
    }
    if (properties.crossfire_rest_ms !== undefined) {
      crossfire_rest_ms = properties.crossfire_rest_ms;
    }
    if (properties.crossfire_duration_s !== undefined) {
      crossfire_duration_s = properties.crossfire_duration_s;
    }
    if (properties.crossfire_rest_s !== undefined) {
      crossfire_rest_s = properties.crossfire_rest_s;
    }
    if (properties.crossfire_first_wait !== undefined) {
      crossfire_first_wait = properties.crossfire_first_wait;
    }
    if (properties.crossfire_pos_offset !== undefined) {
      crossfire_pos_offset = properties.crossfire_pos_offset;
      if (FireworkLib && FireworkLib.CrossFireParams) {
        FireworkLib.CrossFireParams.posOffset = crossfire_pos_offset;
      }
    }
    if (properties.crossfire_angle_direction !== undefined) {
      crossfire_angle_direction = properties.crossfire_angle_direction;
      if (FireworkLib && FireworkLib.CrossFireParams) {
        FireworkLib.CrossFireParams.angleDirection = crossfire_angle_direction;
      }
    }
    if (properties.crossfire_angle_range !== undefined) {
      crossfire_angle_range = properties.crossfire_angle_range;
      if (FireworkLib && FireworkLib.CrossFireParams) {
        FireworkLib.CrossFireParams.angleRange = crossfire_angle_range;
      }
    }
    if (properties.crossfire_count !== undefined) {
      crossfire_count = properties.crossfire_count;
      if (FireworkLib && FireworkLib.CrossFireParams) {
        FireworkLib.CrossFireParams.count = crossfire_count;
      }
    }
    if (properties.crossfire_speed !== undefined) {
      crossfire_speed = properties.crossfire_speed;
      if (FireworkLib && FireworkLib.CrossFireParams) {
        FireworkLib.CrossFireParams.speed = crossfire_speed;
      }
    }
    if (properties.crossfire_speed_variance !== undefined) {
      crossfire_speed_variance = properties.crossfire_speed_variance;
      if (FireworkLib && FireworkLib.CrossFireParams) {
        FireworkLib.CrossFireParams.speedVariance = crossfire_speed_variance;
      }
    }
    if (properties.crossfire_lifetime !== undefined) {
      crossfire_lifetime = properties.crossfire_lifetime;
      if (FireworkLib && FireworkLib.CrossFireParams) {
        FireworkLib.CrossFireParams.lifetime = crossfire_lifetime;
      }
    }
    
    // CrossFire color groups
    for (let i = 0; i <= 10; i++) {
      const propName = `crossfire_color_${i}`;
      if (properties[propName] !== undefined) {
        crossfire_colors[i] = properties[propName];
        if (FireworkLib && FireworkLib.colorAvailability) {
          FireworkLib.colorAvailability.crossFire[i] = crossfire_colors[i];
        }
      }
    }
    
    // GrandFinale fireworks
    if (properties.grandfinale_enable !== undefined) {
      grandfinale_enable = properties.grandfinale_enable;
    }
    if (properties.grandfinale_interval !== undefined) {
      grandfinale_interval = properties.grandfinale_interval;
    }
    if (properties.grandfinale_duration_ms !== undefined) {
      grandfinale_duration_ms = properties.grandfinale_duration_ms;
    }
    if (properties.grandfinale_rest_ms !== undefined) {
      grandfinale_rest_ms = properties.grandfinale_rest_ms;
    }
    if (properties.grandfinale_duration_s !== undefined) {
      grandfinale_duration_s = properties.grandfinale_duration_s;
    }
    if (properties.grandfinale_rest_s !== undefined) {
      grandfinale_rest_s = properties.grandfinale_rest_s;
    }
    if (properties.grandfinale_first_wait !== undefined) {
      grandfinale_first_wait = properties.grandfinale_first_wait;
    }
    if (properties.grandfinale_count1 !== undefined) {
      grandfinale_count1 = properties.grandfinale_count1;
      if (FireworkLib && FireworkLib.GrandFinaleParams) {
        FireworkLib.GrandFinaleParams.count1 = grandfinale_count1;
      }
    }
    if (properties.grandfinale_speed1 !== undefined) {
      grandfinale_speed1 = properties.grandfinale_speed1;
      if (FireworkLib && FireworkLib.GrandFinaleParams) {
        FireworkLib.GrandFinaleParams.speed1 = grandfinale_speed1;
      }
    }
    if (properties.grandfinale_count2 !== undefined) {
      grandfinale_count2 = properties.grandfinale_count2;
      if (FireworkLib && FireworkLib.GrandFinaleParams) {
        FireworkLib.GrandFinaleParams.count2 = grandfinale_count2;
      }
    }
    if (properties.grandfinale_speed2 !== undefined) {
      grandfinale_speed2 = properties.grandfinale_speed2;
      if (FireworkLib && FireworkLib.GrandFinaleParams) {
        FireworkLib.GrandFinaleParams.speed2 = grandfinale_speed2;
      }
    }
    if (properties.grandfinale_count3 !== undefined) {
      grandfinale_count3 = properties.grandfinale_count3;
      if (FireworkLib && FireworkLib.GrandFinaleParams) {
        FireworkLib.GrandFinaleParams.count3 = grandfinale_count3;
      }
    }
    if (properties.grandfinale_speed3 !== undefined) {
      grandfinale_speed3 = properties.grandfinale_speed3;
      if (FireworkLib && FireworkLib.GrandFinaleParams) {
        FireworkLib.GrandFinaleParams.speed3 = grandfinale_speed3;
      }
    }
    if (properties.grandfinale_ring_radius !== undefined) {
      grandfinale_ring_radius = properties.grandfinale_ring_radius;
      if (FireworkLib && FireworkLib.GrandFinaleParams) {
        FireworkLib.GrandFinaleParams.ringRadius = grandfinale_ring_radius;
      }
    }
    if (properties.grandfinale_lifetime !== undefined) {
      grandfinale_lifetime = properties.grandfinale_lifetime;
      if (FireworkLib && FireworkLib.GrandFinaleParams) {
        FireworkLib.GrandFinaleParams.lifetime = grandfinale_lifetime;
      }
    }
    
    // GrandFinale color groups
    for (let i = 0; i <= 10; i++) {
      const propName = `grandfinale_color_${i}`;
      if (properties[propName] !== undefined) {
        grandfinale_colors[i] = properties[propName];
        if (FireworkLib && FireworkLib.colorAvailability) {
          FireworkLib.colorAvailability.grandFinale[i] = grandfinale_colors[i];
        }
      }
    }
  }
};

// 当页面加载时初始化 Lively 配置
// 等待一段时间确保 FireworkLib 已加载
setTimeout(() => {
  loadLivelyPropertiesConfig();
}, 500);

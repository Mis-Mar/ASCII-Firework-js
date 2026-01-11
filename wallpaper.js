//====== Wallpaper Engine Properties Handler =====
// 这个文件处理所有与Wallpaper Engine属性更新相关的逻辑

function updateCustomColorGroup(groupIndex, properties, groupNum) {
  for (let i = 1; i <= 6; i++) {
    const propName = `custom_color_${groupNum}_${i}`;
    const varName = `custom_color_${groupNum}_${i}`;
    if (properties[propName]) {
      eval(`${varName} = properties[propName].value;`);
      const colorValue = properties[propName].value;
      const colorParts = colorValue.split(' ').map(v => Math.floor(parseFloat(v) * 255));
      if (FireworkLib && FireworkLib.customColors && FireworkLib.customColors[groupIndex]) {
        FireworkLib.customColors[groupIndex][i - 1] = {
          r: colorParts[0],
          g: colorParts[1],
          b: colorParts[2],
          a: 1
        };
      }
    }
  }
}

window.wallpaperPropertyListener = {
  applyUserProperties: function (properties) {
    if (properties.font_size) {
      font_size = properties.font_size.value;
      fontSizeChanged = true;
    }
    if (properties.fps) {
      fps = properties.fps.value;
    }
    if (properties.gravity) {
      gravity = properties.gravity.value;
      // 同步到 FireworkLib.Physics
      if (FireworkLib && FireworkLib.Physics) {
        FireworkLib.Physics.BASE_GRAVITY = gravity;
      }
    }
    if (properties.drag) {
      drag = properties.drag.value;
      // 同步到 FireworkLib.Physics
      if (FireworkLib && FireworkLib.Physics) {
        FireworkLib.Physics.BASE_DRAG = drag;
      }
    }
    if (properties.lifetime_offset) {
      lifetime_offset = properties.lifetime_offset.value;
      // 同步到 FireworkLib.Physics
      if (FireworkLib && FireworkLib.Physics) {
        FireworkLib.Physics.LIFETIME_OFFSET = lifetime_offset;
      }
    }
    if (properties.button_offset) {
      button_offset = properties.button_offset.value;
    }
    if (properties.background_color) {
      background_color = properties.background_color.value;
      const bgColorParts = background_color.split(' ').map(v => Math.floor(parseFloat(v) * 255));
      const bgColorStr = `rgb(${bgColorParts[0]}, ${bgColorParts[1]}, ${bgColorParts[2]})`;
      // 设置背景色到canvas或body
      const canvas = document.getElementById('canvas');
      if (canvas) {
        canvas.style.backgroundColor = bgColorStr;
      }
      document.body.style.backgroundColor = bgColorStr;
    }
    // 自定义颜色组 1 的处理
    updateCustomColorGroup(0, properties, 1);
    // 自定义颜色组 2 的处理
    updateCustomColorGroup(1, properties, 2);
    // 自定义颜色组 3 的处理
    updateCustomColorGroup(2, properties, 3);
    // 自定义颜色组布尔开关处理 (custom_color_8, custom_color_9, custom_color_10)
    // 这些是在各个烟花类型中启用/禁用自定义颜色的开关
    for (let fireworkType of ['classic', 'fountain', 'vortex', 'ring', 'cross', 'palm']) {
      for (let i = 8; i <= 10; i++) {
        const propName = fireworkType + '_color_' + i;
        if (properties[propName]) {
          eval(`${fireworkType}_colors[${i}] = properties[propName].value;`);
          if (FireworkLib && FireworkLib.colorAvailability && FireworkLib.colorAvailability[fireworkType]) {
            FireworkLib.colorAvailability[fireworkType][i] = properties[propName].value;
            console.log(`Updated ${propName} = ${properties[propName].value}`);
          }
        }
      }
      // 也要处理launch颜色 (只有classic有)
      if (fireworkType === 'classic') {
        for (let i = 8; i <= 10; i++) {
          const propName = fireworkType + '_color_' + i;
          if (properties[propName] && FireworkLib && FireworkLib.colorAvailability) {
            FireworkLib.colorAvailability.classicLaunch[i] = properties[propName].value;
          }
        }
      }
    }
    // Classic 烟花参数
    if (properties.classic_enable) {
      classic_enable = properties.classic_enable.value;
    }
    if (properties.classic_interval) {
      classic_interval = properties.classic_interval.value;
    }
    if (properties.classic_duration_ms) {
      classic_duration_ms = properties.classic_duration_ms.value;
    }
    if (properties.classic_rest_ms) {
      classic_rest_ms = properties.classic_rest_ms.value;
    }
    if (properties.classic_duration_s) {
      classic_duration_s = properties.classic_duration_s.value;
    }
    if (properties.classic_rest_s) {
      classic_rest_s = properties.classic_rest_s.value;
    }
    if (properties.classic_first_wait) {
      classic_first_wait = properties.classic_first_wait.value;
    }
    if (properties.classic_speed) {
      classic_speed = properties.classic_speed.value;
      if (FireworkLib && FireworkLib.ClassicParams) {
        FireworkLib.ClassicParams.speed = classic_speed;
      }
    }
    if (properties.classic_count) {
      classic_count = properties.classic_count.value;
      if (FireworkLib && FireworkLib.ClassicParams) {
        FireworkLib.ClassicParams.count = classic_count;
      }
    }
    if (properties.classic_lifetime) {
      classic_lifetime = properties.classic_lifetime.value;
      if (FireworkLib && FireworkLib.ClassicParams) {
        FireworkLib.ClassicParams.lifetime = classic_lifetime;
      }
    }
    if (properties.classic_withlaunch) {
      classic_withlaunch = properties.classic_withlaunch.value;
      if (FireworkLib && FireworkLib.ClassicParams) {
        FireworkLib.ClassicParams.withLaunch = classic_withlaunch;
      }
    }
    if (properties.classic_launch_ratio) {
      classic_launch_ratio = properties.classic_launch_ratio.value;
      if (FireworkLib && FireworkLib.ClassicParams) {
        FireworkLib.ClassicParams.launchRatio = classic_launch_ratio;
      }
    }
    if (properties.classic_speed_variance) {
      classic_speed_variance = properties.classic_speed_variance.value;
      if (FireworkLib && FireworkLib.ClassicParams) {
        FireworkLib.ClassicParams.speedVariance = classic_speed_variance;
      }
    }
    // Classic 颜色组开关
    for (let i = 0; i <= 10; i++) {
      const propName = 'classic_color_' + i;
      if (properties[propName]) {
        classic_colors[i] = properties[propName].value;
        if (FireworkLib && FireworkLib.colorAvailability) {
          FireworkLib.colorAvailability.classic[i] = classic_colors[i];
          FireworkLib.colorAvailability.classicLaunch[i] = classic_colors[i];
          console.log(`Updated classic_color_${i} = ${classic_colors[i]}`);
        }
      }
    }
    // Fountain 烟花参数
    if (properties.fountain_enable) {
      fountain_enable = properties.fountain_enable.value;
    }
    if (properties.fountain_interval) {
      fountain_interval = properties.fountain_interval.value;
    }
    if (properties.fountain_duration_ms) {
      fountain_duration_ms = properties.fountain_duration_ms.value;
    }
    if (properties.fountain_rest_ms) {
      fountain_rest_ms = properties.fountain_rest_ms.value;
    }
    if (properties.fountain_duration_s) {
      fountain_duration_s = properties.fountain_duration_s.value;
    }
    if (properties.fountain_rest_s) {
      fountain_rest_s = properties.fountain_rest_s.value;
    }
    if (properties.fountain_first_wait) {
      fountain_first_wait = properties.fountain_first_wait.value;
    }
    if (properties.fountain_weight) {
      fountain_weight = properties.fountain_weight.value;
      if (FireworkLib && FireworkLib.setFireworkWeight) {
        FireworkLib.setFireworkWeight('fountain', fountain_weight);
      }
    }
    if (properties.fountain_fan_angle) {
      fountain_fan_angle = properties.fountain_fan_angle.value;
      if (FireworkLib && FireworkLib.FountainParams) {
        FireworkLib.FountainParams.fanAngle = fountain_fan_angle;
      }
    }
    if (properties.fountain_count) {
      fountain_count = properties.fountain_count.value;
      if (FireworkLib && FireworkLib.FountainParams) {
        FireworkLib.FountainParams.count = fountain_count;
      }
    }
    if (properties.fountain_speed) {
      fountain_speed = properties.fountain_speed.value;
      if (FireworkLib && FireworkLib.FountainParams) {
        FireworkLib.FountainParams.speed = fountain_speed;
      }
    }
    if (properties.fountain_speed_variance) {
      fountain_speed_variance = properties.fountain_speed_variance.value;
      if (FireworkLib && FireworkLib.FountainParams) {
        FireworkLib.FountainParams.speedVariance = fountain_speed_variance;
      }
    }
    if (properties.fountain_lifetime) {
      fountain_lifetime = properties.fountain_lifetime.value;
      if (FireworkLib && FireworkLib.FountainParams) {
        FireworkLib.FountainParams.lifetime = fountain_lifetime;
      }
    }
    // Fountain 颜色组开关
    for (let i = 0; i <= 10; i++) {
      const propName = 'fountain_color_' + i;
      if (properties[propName]) {
        fountain_colors[i] = properties[propName].value;
        if (FireworkLib && FireworkLib.colorAvailability) {
          FireworkLib.colorAvailability.fountain[i] = fountain_colors[i];
        }
      }
    }
    // Vortex 烟花参数
    if (properties.vortex_enable) {
      vortex_enable = properties.vortex_enable.value;
    }
    if (properties.vortex_interval) {
      vortex_interval = properties.vortex_interval.value;
    }
    if (properties.vortex_duration_ms) {
      vortex_duration_ms = properties.vortex_duration_ms.value;
    }
    if (properties.vortex_rest_ms) {
      vortex_rest_ms = properties.vortex_rest_ms.value;
    }
    if (properties.vortex_duration_s) {
      vortex_duration_s = properties.vortex_duration_s.value;
    }
    if (properties.vortex_rest_s) {
      vortex_rest_s = properties.vortex_rest_s.value;
    }
    if (properties.vortex_first_wait) {
      vortex_first_wait = properties.vortex_first_wait.value;
    }
    if (properties.vortex_size) {
      vortex_size = properties.vortex_size.value;
      if (FireworkLib && FireworkLib.VortexParams) {
        FireworkLib.VortexParams.size = vortex_size;
      }
    }
    // Vortex 颜色组开关
    for (let i = 0; i <= 10; i++) {
      const propName = 'vortex_color_' + i;
      if (properties[propName]) {
        vortex_colors[i] = properties[propName].value;
        if (FireworkLib && FireworkLib.colorAvailability) {
          FireworkLib.colorAvailability.vortex[i] = vortex_colors[i];
        }
      }
    }
    // FountainArray 烟花参数
    if (properties.fountainarray_enable) {
      fountainarray_enable = properties.fountainarray_enable.value;
    }
    if (properties.fountainarray_interval) {
      fountainarray_interval = properties.fountainarray_interval.value;
    }
    if (properties.fountainarray_duration_ms) {
      fountainarray_duration_ms = properties.fountainarray_duration_ms.value;
    }
    if (properties.fountainarray_rest_ms) {
      fountainarray_rest_ms = properties.fountainarray_rest_ms.value;
    }
    if (properties.fountainarray_duration_s) {
      fountainarray_duration_s = properties.fountainarray_duration_s.value;
    }
    if (properties.fountainarray_rest_s) {
      fountainarray_rest_s = properties.fountainarray_rest_s.value;
    }
    if (properties.fountainarray_first_wait) {
      fountainarray_first_wait = properties.fountainarray_first_wait.value;
    }
    if (properties.fountainarray_speed) {
      fountainarray_speed = properties.fountainarray_speed.value;
      if (FireworkLib && FireworkLib.FountainArrayParams) {
        FireworkLib.FountainArrayParams.speed = fountainarray_speed;
      }
    }
    if (properties.fountainarray_lifetime) {
      fountainarray_lifetime = properties.fountainarray_lifetime.value;
      if (FireworkLib && FireworkLib.FountainArrayParams) {
        FireworkLib.FountainArrayParams.lifetime = fountainarray_lifetime;
      }
    }
    if (properties.fountainarray_speed_variance) {
      fountainarray_speed_variance = properties.fountainarray_speed_variance.value;
      if (FireworkLib && FireworkLib.FountainArrayParams) {
        FireworkLib.FountainArrayParams.speedVariance = fountainarray_speed_variance;
      }
    }
    if (properties.fountainarray_array_count) {
      fountainarray_array_count = properties.fountainarray_array_count.value;
      if (FireworkLib && FireworkLib.FountainArrayParams) {
        FireworkLib.FountainArrayParams.arrayCount = fountainarray_array_count;
      }
    }
    if (properties.fountainarray_particle_per_array) {
      fountainarray_particle_per_array = properties.fountainarray_particle_per_array.value;
      if (FireworkLib && FireworkLib.FountainArrayParams) {
        FireworkLib.FountainArrayParams.particlePerArray = fountainarray_particle_per_array;
      }
    }
    if (properties.fountainarray_angle_range) {
      fountainarray_angle_range = properties.fountainarray_angle_range.value;
      if (FireworkLib && FireworkLib.FountainArrayParams) {
        FireworkLib.FountainArrayParams.angleRange = fountainarray_angle_range;
      }
    }
    // FountainArray 颜色组开关
    for (let i = 0; i <= 10; i++) {
      const propName = 'fountainarray_color_' + i;
      if (properties[propName]) {
        fountainarray_colors[i] = properties[propName].value;
        if (FireworkLib && FireworkLib.colorAvailability) {
          FireworkLib.colorAvailability.fountainArray[i] = fountainarray_colors[i];
        }
      }
    }
    // CrossFire 烟花参数
    if (properties.crossfire_enable) {
      crossfire_enable = properties.crossfire_enable.value;
    }
    if (properties.crossfire_interval) {
      crossfire_interval = properties.crossfire_interval.value;
    }
    if (properties.crossfire_duration_ms) {
      crossfire_duration_ms = properties.crossfire_duration_ms.value;
    }
    if (properties.crossfire_rest_ms) {
      crossfire_rest_ms = properties.crossfire_rest_ms.value;
    }
    if (properties.crossfire_duration_s) {
      crossfire_duration_s = properties.crossfire_duration_s.value;
    }
    if (properties.crossfire_rest_s) {
      crossfire_rest_s = properties.crossfire_rest_s.value;
    }
    if (properties.crossfire_first_wait) {
      crossfire_first_wait = properties.crossfire_first_wait.value;
    }
    if (properties.crossfire_pos_offset) {
      crossfire_pos_offset = properties.crossfire_pos_offset.value;
      if (FireworkLib && FireworkLib.CrossFireParams) {
        FireworkLib.CrossFireParams.posOffset = crossfire_pos_offset;
      }
    }
    if (properties.crossfire_angle_direction) {
      crossfire_angle_direction = properties.crossfire_angle_direction.value;
      if (FireworkLib && FireworkLib.CrossFireParams) {
        FireworkLib.CrossFireParams.angleDirection = crossfire_angle_direction;
      }
    }
    if (properties.crossfire_angle_range) {
      crossfire_angle_range = properties.crossfire_angle_range.value;
      if (FireworkLib && FireworkLib.CrossFireParams) {
        FireworkLib.CrossFireParams.angleRange = crossfire_angle_range;
      }
    }
    if (properties.crossfire_count) {
      crossfire_count = properties.crossfire_count.value;
      if (FireworkLib && FireworkLib.CrossFireParams) {
        FireworkLib.CrossFireParams.count = crossfire_count;
      }
    }
    if (properties.crossfire_speed) {
      crossfire_speed = properties.crossfire_speed.value;
      if (FireworkLib && FireworkLib.CrossFireParams) {
        FireworkLib.CrossFireParams.speed = crossfire_speed;
      }
    }
    if (properties.crossfire_speed_variance) {
      crossfire_speed_variance = properties.crossfire_speed_variance.value;
      if (FireworkLib && FireworkLib.CrossFireParams) {
        FireworkLib.CrossFireParams.speedVariance = crossfire_speed_variance;
      }
    }
    if (properties.crossfire_lifetime) {
      crossfire_lifetime = properties.crossfire_lifetime.value;
      if (FireworkLib && FireworkLib.CrossFireParams) {
        FireworkLib.CrossFireParams.lifetime = crossfire_lifetime;
      }
    }
    // CrossFire 颜色组开关
    for (let i = 0; i <= 10; i++) {
      const propName = 'crossfire_color_' + i;
      if (properties[propName]) {
        crossfire_colors[i] = properties[propName].value;
        if (FireworkLib && FireworkLib.colorAvailability) {
          FireworkLib.colorAvailability.crossFire[i] = crossfire_colors[i];
        }
      }
    }
    // GrandFinale 烟花参数
    if (properties.grandfinale_enable) {
      grandfinale_enable = properties.grandfinale_enable.value;
    }
    if (properties.grandfinale_interval) {
      grandfinale_interval = properties.grandfinale_interval.value;
    }
    if (properties.grandfinale_duration_ms) {
      grandfinale_duration_ms = properties.grandfinale_duration_ms.value;
    }
    if (properties.grandfinale_rest_ms) {
      grandfinale_rest_ms = properties.grandfinale_rest_ms.value;
    }
    if (properties.grandfinale_duration_s) {
      grandfinale_duration_s = properties.grandfinale_duration_s.value;
    }
    if (properties.grandfinale_rest_s) {
      grandfinale_rest_s = properties.grandfinale_rest_s.value;
    }
    if (properties.grandfinale_first_wait) {
      grandfinale_first_wait = properties.grandfinale_first_wait.value;
    }
    if (properties.grandfinale_count1) {
      grandfinale_count1 = properties.grandfinale_count1.value;
      if (FireworkLib && FireworkLib.GrandFinaleParams) {
        FireworkLib.GrandFinaleParams.count1 = grandfinale_count1;
      }
    }
    if (properties.grandfinale_speed1) {
      grandfinale_speed1 = properties.grandfinale_speed1.value;
      if (FireworkLib && FireworkLib.GrandFinaleParams) {
        FireworkLib.GrandFinaleParams.speed1 = grandfinale_speed1;
      }
    }
    if (properties.grandfinale_count2) {
      grandfinale_count2 = properties.grandfinale_count2.value;
      if (FireworkLib && FireworkLib.GrandFinaleParams) {
        FireworkLib.GrandFinaleParams.count2 = grandfinale_count2;
      }
    }
    if (properties.grandfinale_speed2) {
      grandfinale_speed2 = properties.grandfinale_speed2.value;
      if (FireworkLib && FireworkLib.GrandFinaleParams) {
        FireworkLib.GrandFinaleParams.speed2 = grandfinale_speed2;
      }
    }
    if (properties.grandfinale_count3) {
      grandfinale_count3 = properties.grandfinale_count3.value;
      if (FireworkLib && FireworkLib.GrandFinaleParams) {
        FireworkLib.GrandFinaleParams.count3 = grandfinale_count3;
      }
    }
    if (properties.grandfinale_speed3) {
      grandfinale_speed3 = properties.grandfinale_speed3.value;
      if (FireworkLib && FireworkLib.GrandFinaleParams) {
        FireworkLib.GrandFinaleParams.speed3 = grandfinale_speed3;
      }
    }
    if (properties.grandfinale_ring_radius) {
      grandfinale_ring_radius = properties.grandfinale_ring_radius.value;
      if (FireworkLib && FireworkLib.GrandFinaleParams) {
        FireworkLib.GrandFinaleParams.ringRadius = grandfinale_ring_radius;
      }
    }
    if (properties.grandfinale_lifetime) {
      grandfinale_lifetime = properties.grandfinale_lifetime.value;
      if (FireworkLib && FireworkLib.GrandFinaleParams) {
        FireworkLib.GrandFinaleParams.lifetime = grandfinale_lifetime;
      }
    }
    // GrandFinale 颜色组开关
    for (let i = 0; i <= 10; i++) {
      const propName = 'grandfinale_color_' + i;
      if (properties[propName]) {
        grandfinale_colors[i] = properties[propName].value;
        if (FireworkLib && FireworkLib.colorAvailability) {
          FireworkLib.colorAvailability.grandFinale[i] = grandfinale_colors[i];
        }
      }
    }
  },
};

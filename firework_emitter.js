/**
 * 连续发射器类 - 管理单个烟火类型的连续发射逻辑
 */
class ContinuousEmitter {
  constructor() {
    this.lastEmitTime = 0;
    this.cycleStartTime = 0;
    this.isEmitting = false;
    this.firstWaitDone = false;
  }
  
  reset() {
    this.lastEmitTime = 0;
    this.cycleStartTime = 0;
    this.isEmitting = false;
    this.firstWaitDone = false;
  }
  
  update(now, enabled, interval, durationMs, durationS, restMs, restS, firstWait, emitCallback) {
    if (!enabled) {
      this.reset();
      return;
    }
    
    // 初始化周期
    if (this.cycleStartTime === 0) {
      this.cycleStartTime = now;
      this.firstWaitDone = false;
      this.isEmitting = false;
      this.lastEmitTime = now;
      return; // 首帧等待
    }
    
    // 处理首次等待
    if (!this.firstWaitDone) {
      const firstWaitMs = firstWait * 1000;
      if (now - this.cycleStartTime < firstWaitMs) {
        return;
      }
      this.firstWaitDone = true;
      this.cycleStartTime = now;
      this.isEmitting = true;
      this.lastEmitTime = now;
      // 立即发射一个，不受 duration 限制
      emitCallback();
      return;
    }
    
    // 计算总时长（秒和毫秒参数相加）
    const duration = durationMs + durationS * 1000;
    const rest = restMs + restS * 1000;
    
    const timeInCycle = now - this.cycleStartTime;
    
    // 检查状态切换
    if (this.isEmitting && timeInCycle >= duration) {
      // 切换到休息阶段，补偿超出的时间
      const overflow = timeInCycle - duration;
      this.isEmitting = false;
      this.cycleStartTime = now - overflow;
    } else if (!this.isEmitting && timeInCycle >= rest) {
      // 切换回发射阶段，补偿超出的时间
      const overflow = timeInCycle - rest;
      this.isEmitting = true;
      this.cycleStartTime = now - overflow;
      // 立即发射一个，不受 duration 限制
      emitCallback();
      this.lastEmitTime = now;
      return;
    }
    
    // 在发射阶段按间隔发射
    if (this.isEmitting && now - this.lastEmitTime >= interval) {
      emitCallback();
      this.lastEmitTime = now;
    }
  }
}

/**
 * 烟火发射器类 - 管理所有烟火类型的连续发射
 */
class FireworkEmitter {
  constructor() {
    this.emitters = {
      classic: new ContinuousEmitter(),
      fountain: new ContinuousEmitter(),
      vortex: new ContinuousEmitter(),
      fountainArray: new ContinuousEmitter(),
      crossFire: new ContinuousEmitter(),
      grandFinale: new ContinuousEmitter()
    };
  }
  
  update(now, globalState, emitCallback) {
    this.updateEmitter('classic', now, classic_enable, classic_interval, classic_duration_ms, classic_duration_s, classic_rest_ms, classic_rest_s, classic_first_wait, emitCallback, globalState);
    this.updateEmitter('fountain', now, fountain_enable, fountain_interval, fountain_duration_ms, fountain_duration_s, fountain_rest_ms, fountain_rest_s, fountain_first_wait, emitCallback, globalState);
    this.updateEmitter('vortex', now, vortex_enable, vortex_interval, vortex_duration_ms, vortex_duration_s, vortex_rest_ms, vortex_rest_s, vortex_first_wait, emitCallback, globalState);
    this.updateEmitter('fountainArray', now, fountainarray_enable, fountainarray_interval, fountainarray_duration_ms, fountainarray_duration_s, fountainarray_rest_ms, fountainarray_rest_s, fountainarray_first_wait, emitCallback, globalState);
    this.updateEmitter('crossFire', now, crossfire_enable, crossfire_interval, crossfire_duration_ms, crossfire_duration_s, crossfire_rest_ms, crossfire_rest_s, crossfire_first_wait, emitCallback, globalState);
    this.updateEmitter('grandFinale', now, grandfinale_enable, grandfinale_interval, grandfinale_duration_ms, grandfinale_duration_s, grandfinale_rest_ms, grandfinale_rest_s, grandfinale_first_wait, emitCallback, globalState);
  }
  
  updateEmitter(type, now, enabled, interval, durationMs, durationS, restMs, restS, firstWait, emitCallback, globalState) {
    this.emitters[type].update(now, enabled, interval, durationMs, durationS, restMs, restS, firstWait, () => {
      emitCallback(type, globalState);
    });
  }
}

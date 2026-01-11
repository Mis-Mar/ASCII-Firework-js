//====== Firework primitives =====
(function (global) {
  //====== 对象池实现 =====
  class ObjectPool {
    constructor(factory, reset, initialSize = 100, maxSize = 0) {
      this.factory = factory;
      this.reset = reset;
      this.pool = [];
      this.maxSize = maxSize; // 0 表示不限制
      this.peakUsage = 0; // 历史峰值使用量
      this.totalCreated = initialSize; // 总共创建的对象数
      this.currentInUse = 0; // 当前正在使用的数量
      this.discarded = 0; // 因池满而被丢弃的对象数量
      
      // 预分配对象
      for (let i = 0; i < initialSize; i++) {
        this.pool.push(this.factory());
      }
    }

    acquire(...args) {
      let obj;
      if (this.pool.length > 0) {
        obj = this.pool.pop();
        this.reset(obj, ...args);
      } else {
        // 池空了，创建新对象
        obj = this.factory(...args);
        this.totalCreated++;
      }
      this.currentInUse++;
      // 记录峰值
      if (this.currentInUse > this.peakUsage) {
        this.peakUsage = this.currentInUse;
      }
      return obj;
    }

    release(obj) {
      if (obj === null || obj === undefined) return; // 防止释放空对象
      this.currentInUse--;
      // 如果设置了最大容量且池已满，丢弃对象（让GC处理）
      // 否则放回池中
      if (this.maxSize > 0 && this.pool.length >= this.maxSize) {
        // 记录被丢弃的对象
        this.discarded++;
        return;
      }
      this.pool.push(obj);
    }

    releaseAll(arr) {
      for (let i = 0; i < arr.length; i++) {
        this.release(arr[i]);
      }
    }

    // 确保池中至少有指定数量的对象（预热）
    ensureCapacity(count) {
      const needed = count - this.pool.length;
      for (let i = 0; i < needed; i++) {
        this.pool.push(this.factory());
        this.totalCreated++;
      }
    }

    get size() {
      return this.pool.length;
    }

    // 获取统计信息
    getStats() {
      return {
        poolSize: this.pool.length,
        inUse: this.currentInUse,
        peakUsage: this.peakUsage,
        totalCreated: this.totalCreated,
        discarded: this.discarded,
      };
    }
  }

  //====== Vec2 类和对象池 =====
  class Vec2 {
    constructor(x, y) {
      this.x = x || 0;
      this.y = y || 0;
    }
    set(x, y) {
      this.x = x;
      this.y = y;
      return this;
    }
    add(other) {
      return Vec2Pool.acquire(this.x + other.x, this.y + other.y);
    }
    sub(other) {
      return Vec2Pool.acquire(this.x - other.x, this.y - other.y);
    }
    mul(scalar) {
      return Vec2Pool.acquire(this.x * scalar, this.y * scalar);
    }
    len() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
      const l = this.len() || 1;
      return Vec2Pool.acquire(this.x / l, this.y / l);
    }
    clone() {
      return Vec2Pool.acquire(this.x, this.y);
    }
  }

  // Vec2 对象池 (预分配足够多的对象以避免运行时创建)
  const Vec2Pool = new ObjectPool(
    // 工厂函数：当池为空时创建新 Vec2
    (x, y) => new Vec2(x || 0, y || 0),
    // 重置函数：复用时设置坐标
    (obj, x, y) => obj.set(x || 0, y || 0),
    5000, // 预分配5000个Vec2对象
    0 // 不限制最大容量，避免对象被丢弃导致频繁创建
  );

  //====== Particle 类和对象池 =====
  class Particle {
    constructor() {
      // 构造函数不分配资源，由 init 方法初始化
      this.pos = null;
      this.vel = null;
      this.trailLength = 0;
      this.lifeTime = 0;
      this.timeElapsed = 0;
      this.trail = [];
      this.color = null;
      this.useAirResistance = true; // 是否使用空气阻力，默认 true
      this._initialized = false;
    }

    init(pos, vel, trailLength, lifeTime, color, applyLifetimeOffset = true) {
      // 如果之前有位置和速度向量，先释放回池
      if (this._initialized) {
        if (this.pos) Vec2Pool.release(this.pos);
        if (this.vel) Vec2Pool.release(this.vel);
        if (this.attractCenter) Vec2Pool.release(this.attractCenter);
        // 释放轨迹中的Vec2
        if (this.trail.length > 0) Vec2Pool.releaseAll(this.trail);
      }
      // 重置 attractCenter（将在外部按需设置）
      this.attractCenter = null;
      
      this.pos = pos;
      this.vel = vel;
      this.trailLength = trailLength;
      // 应用生命周期随机偏移: lifeTime * (1 + random(-offset, +offset))
      if (applyLifetimeOffset) {
        const offset = Physics.LIFETIME_OFFSET;
        const randomFactor = 1 + (Math.random() * 2 - 1) * offset;
        this.lifeTime = lifeTime * randomFactor;
      } else {
        this.lifeTime = lifeTime;
      }
      this.timeElapsed = 0;
      this.color = color;
      this._initialized = true;
      
      // 初始化轨迹
      this.trail.length = 0;
      for (let i = 0; i < trailLength; i++) {
        this.trail.push(Vec2Pool.acquire(pos.x, pos.y));
      }
      return this;
    }

    update(dt) {
      if (!this._initialized) return;
      
      const stepMs = 4; // 4毫秒为一步
      this.timeElapsed += dt;
      const steps = Math.floor(dt / stepMs);
      const stepSec = 0.004; // 4毫秒 = 0.004秒
      
      // 使用实例级别的参数（如果有）
      const gravityScale = this.gravityScale !== undefined ? this.gravityScale : 1.0;
      
      // 是否使用空气阻力
      if (this.useAirResistance) {
        const drag = Physics.BASE_DRAG * (this.arScale || 1.0);
        
        for (let i = 0; i < steps; i++) {
          const vlen = this.vel.len();
          const dragFactor = vlen * drag;
          const gravityFactor = (Physics.BASE_GRAVITY * gravityScale) - this.vel.y * dragFactor;

          this.vel.x += stepSec * (-this.vel.x * dragFactor);
          this.vel.y += stepSec * gravityFactor;
        
        // 如果有吸引力中心，添加向中心的力
        if (this.attractCenter) {
          const dx = this.attractCenter.x - this.pos.x;
          const dy = this.attractCenter.y - this.pos.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          
          let forceMag = this.attractStrength || 0;
          if (this.attractInverse) {
            // 距离反比衰减 (1/distance)
            forceMag = forceMag / dist;
          }
          
          this.vel.x += stepSec * (dx / dist) * forceMag;
          this.vel.y += stepSec * (dy / dist) * forceMag;
        }
        
        this.pos.x += this.vel.x * stepSec;
        this.pos.y += this.vel.y * stepSec;
      }
      } else {
        // 无空气阻力模式：简化计算
        for (let i = 0; i < steps; i++) {
          this.vel.y += stepSec * (Physics.BASE_GRAVITY * gravityScale);
          this.pos.x += this.vel.x * stepSec;
          this.pos.y += this.vel.y * stepSec;
        }
      }
      
      // 复用轨迹中最老的Vec2对象
      if (this.trail.length > 0) {
        const oldTrailVec = this.trail.shift();
        oldTrailVec.set(this.pos.x, this.pos.y);
        this.trail.push(oldTrailVec);
      }
    }

    isDead() {
      return this.timeElapsed > this.lifeTime;
    }

    // 释放粒子持有的所有Vec2对象
    release() {
      if (this._initialized) {
        if (this.pos) Vec2Pool.release(this.pos);
        if (this.vel) Vec2Pool.release(this.vel);
        if (this.attractCenter) Vec2Pool.release(this.attractCenter);
        if (this.trail.length > 0) Vec2Pool.releaseAll(this.trail);
        this.pos = null;
        this.vel = null;
        this.attractCenter = null;
        this.attractStrength = 0;
        this.attractInverse = false;
        this.gravityScale = 1.0;
        this.arScale = 1.0;
        this.useAirResistance = true;
        this.gradientFunc = null;
        this.trail.length = 0;
        this.color = null;
        this._initialized = false;
      }
    }
  }

  // Particle 对象池 (预分配足够多的对象以避免运行时创建)
  const ParticlePool = new ObjectPool(
    // 工厂函数：当池为空时创建新粒子并初始化
    (pos, vel, trailLength, lifeTime, color, applyLifetimeOffset = true) => {
      const p = new Particle();
      if (pos !== undefined) {
        p.init(pos, vel, trailLength, lifeTime, color, applyLifetimeOffset);
      }
      return p;
    },
    // 重置函数：复用粒子时调用
    (obj, pos, vel, trailLength, lifeTime, color, applyLifetimeOffset = true) => obj.init(pos, vel, trailLength, lifeTime, color, applyLifetimeOffset),
    500, // 预分配500个Particle对象
    2000 // 最大容量2000
  );

  class Firework {
    constructor(spawnAfter, center, particles) {
      this.initTime = Date.now();
      this.spawnAfter = spawnAfter;
      this.timeElapsed = 0;
      this.center = center;
      this.particles = particles;
      this.alive = true;
    }

    update(dt) {
      this.timeElapsed += dt;
      if (this.timeElapsed >= this.spawnAfter && this.alive) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i];
          p.update(dt);
          if (p.isDead()) {
            // 释放粒子资源并回收到对象池
            p.release();
            ParticlePool.release(p);
            this.particles.splice(i, 1);
          }
        }
        if (this.particles.length === 0) {
          this.alive = false;
          // 释放center向量
          Vec2Pool.release(this.center);
        }
      }
    }
  }

  function gen_Vec2s_in_circle_normal(std, num) {
    const vecs = [];
    while (vecs.length < num) {
      const u1 = 1 - Math.random();
      const u2 = Math.random();
      const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const x = (z1 * std) / 6;

      const u3 = 1 - Math.random();
      const u4 = Math.random();
      const z2 = Math.sqrt(-2 * Math.log(u3)) * Math.cos(2 * Math.PI * u4);
      const y = (z2 * std) / 6;

      vecs.push(Vec2Pool.acquire(x, y));
    }
    return vecs;
  }

  function gen_Vec2s_in_circle(radius, num) {
    const vecs = [];
    while (vecs.length < num) {
      const x = (Math.random() - 0.5) * radius * 2;
      const y = (Math.random() - 0.5) * radius * 2;
      if (x * x + y * y <= radius * radius) {
        vecs.push(Vec2Pool.acquire(x, y));
      }
    }
    return vecs;
  }

  function explosion_gradient(t) {
    if (t < 0.087) {
      return 150 * Math.pow(t, 2);
    }
    return -0.8 * t + 1.2;
  }

  // 心形/漩涡类烟花的渐变函数
  function gradient_slow(t) {
    if (t < 0.8125) {
      return -0.4 * t + 1.1;
    }
    return -2 * t + 2.2;
  }

  // 根据烟花类型获取可用的颜色组索引列表
  function getAvailableColorGroups(fireworkType) {
    return ColorLib.getAvailableColorGroups(fireworkType);
  }

  // 根据烟花类型随机获取一个颜色主题
  function getColorTheme(fireworkType) {
    return ColorLib.getColorTheme(fireworkType);
  }

  // 从颜色主题中随机获取一个颜色
  function getRandomColor(colorTheme) {
    return ColorLib.getRandomColor(colorTheme);
  }

  // ====== 全局物理参数 ======
  const Physics = {
    // 基础重力加速度 (像素/秒²)
    BASE_GRAVITY: 10,
    // 基础空气阻力系数
    BASE_DRAG: 0.28,
    // 生命周期偏移 (0-1，负数缩短，正数延长)
    LIFETIME_OFFSET: 0,
    
    // 默认重力缩放 (1.0 = 正常重力)
    DEFAULT_GRAVITY_SCALE: 1.0,
    // 默认空气阻力缩放 (1.0 = 正常阻力)
    DEFAULT_AR_SCALE: 1.0,
    
    // 喷泉类烟花物理参数 (Fountain, FountainArray, CrossFire)
    FOUNTAIN_GRAVITY_SCALE: 0.5,
    FOUNTAIN_AR_SCALE: 0.15,
    
    // 漩涡烟花物理参数 (特殊)
    VORTEX_GRAVITY_SCALE: 0,
    VORTEX_AR_SCALE: 0.05,
    VORTEX_ATTRACT_STRENGTH: 150,
  };

  // ====== 工具函数 ======
  
  // 在扇形范围内生成随机速度向量
  function gen_Vec2s_in_fan(radius, num, startAngle, endAngle) {
    const vecs = [];
    while (vecs.length < num) {
      const x = (Math.random() - 0.5) * radius * 2;
      const y = (Math.random() - 0.5) * radius * 2;
      const angle = Math.atan2(y, x);
      if (angle >= startAngle && angle <= endAngle && x * x + y * y <= radius * radius) {
        vecs.push(Vec2Pool.acquire(x, -y)); // y 取反，因为屏幕坐标系 y 向下
      }
    }
    return vecs;
  }

  // 在圆上生成均匀分布的点（用于漩涡初始位置）
  function gen_points_on_circle(radius, num) {
    const points = [];
    while (points.length < num) {
      const x = Math.floor((Math.random() - 0.5) * radius * 2);
      const y = Math.floor((Math.random() - 0.5) * radius * 2);
      if (x * x + y * y <= radius * radius) {
        points.push(Vec2Pool.acquire(x, y));
      }
    }
    return points;
  }

  // ====== Classic 烟花可调参数 ======
  const ClassicParams = {
    speed: 315,        // 炸开速度 (velStd 基准值)
    count: 38,         // 粒子数量 (基准值)
    lifetime: 2200,    // 存活时间 (ms)
    withLaunch: true,  // 是否使用发射模式
    launchRatio: 0.8,  // 发射爆炸临界比例
    speedVariance: 0.25, // 速度方差 (0-0.5，应用到速度标准差的随机范围)
  };

  // ====== Fountain 烟花可调参数 ======
  const FountainParams = {
    weight: 0,         // 随机权重 (0 表示不选中)
    fanAngle: 60,      // 扇形角度 (度数，目前硬编码为60，可以调整)
    count: 45,         // 粒子数量 (基准值)
    speed: 80,         // 喷射速度 (radius 基准值)
    speedVariance: 0,  // 速度方差 (0-1，混合均匀和高斯分布)
    lifetime: 2200,    // 存活时间 (ms)
  };

  // ====== Vortex 烟花可调参数 ======
  const VortexParams = {
    weight: 0,         // 随机权重 (0 表示不选中)
    size: 30,          // 漩涡大小 (圆形区域半径)
  };

  // ====== FountainArray 烟花可调参数 ======
  const FountainArrayParams = {
    weight: 0,         // 随机权重 (0 表示不选中)
    speed: 225,        // 喷射速度 (基准值)
    lifetime: 1600,    // 存活时间 (ms)
    speedVariance: 0,  // 速度方差 (0-1)，与 fountain 含义一致
    arrayCount: 6,     // 阵列数量 (发射位置数)
    particlePerArray: 2, // 每个阵列的粒子数
    angleRange: 10,    // 角度偏移范围 (度数)
  };

  // ====== CrossFire 烟花可调参数 ======
  const CrossFireParams = {
    weight: 0,         // 随机权重 (0 表示不选中)
    posOffset: 0.2,    // 发射点位置偏移 (0-0.5，从底部宽度的比例)
    angleDirection: 0, // 角度方向 (0=向上，90=向左，180=向下，270=向右，单位度数)
    angleRange: 45,    // 角度范围 (度数)
    count: 50,         // 每侧粒子数
    speed: 280,        // 发射速度 (基准值)
    speedVariance: 0,  // 速度方差 (0-1，混合均匀和高斯分布)
    lifetime: 2000,    // 存活时间 (ms)
  };

  // ====== GrandFinale 烟花可调参数 ======
  const GrandFinaleParams = {
    weight: 0,         // 随机权重 (0 表示不选中)
    // 第一层参数 (温暖爆炸)
    count1: 200,       // 粒子数量1
    speed1: 14,        // 粒子速度1
    // 第二层参数 (蓝色渐变爆炸)
    count2: 600,       // 粒子数量2
    speed2: 10000,     // 粒子速度2
    // 第三层参数 (环形阵列)
    count3: 27,        // 环位置数量3 (每个位置生成固定35个粒子)
    speed3: 100,       // 粒子速度3
    ringRadius: 10,    // 环半径 (像素)
    lifetime: 5000,    // 存活时间 (ms)
  };

  // ====== 烟花类型 1：经典爆炸烟花 ======
  // colorTheme: 可选，指定颜色主题，不传则随机选择
  // isLaunchExplosion: 是否为launch烟花的爆炸（爆炸粒子不受lifetime offset影响）
  function genFirework_Classic(x, y, colorTheme, isLaunchExplosion = false) {
    if (!colorTheme) colorTheme = getColorTheme('classic');
    const spawnAfter = Math.random() * 2000;
    const particles = [];
    // 使用 ClassicParams 配置，加一些随机变化
    const baseCount = ClassicParams.count;
    const numParticles = Math.floor(baseCount * (0.85 + Math.random() * 0.3)); // ±15% 随机变化
    const baseSpeed = ClassicParams.speed;
    const speedVariance = ClassicParams.speedVariance;
    
    // 生成高斯分布速度向量（用于混合）
    const gaussianStd = baseSpeed * 0.5;
    const gaussianVels = gen_Vec2s_in_circle_normal(gaussianStd, numParticles);
    
    gaussianVels.forEach((gaussianV, index) => {
      // 生成均匀随机方向，速度大小固定为 baseSpeed
      const angle = Math.random() * 2 * Math.PI;
      const uniformVx = Math.cos(angle) * baseSpeed;
      const uniformVy = Math.sin(angle) * baseSpeed;
      
      // 混合权重：speedVariance 越大，高斯分布权重越大
      // speedVariance = 0：100% 均匀随机方向
      // speedVariance = 0.5：50% 均匀 + 50% 高斯
      // speedVariance = 1：100% 高斯分布
      const weight = speedVariance;
      const v = gaussianV; // 重用对象
      v.x = uniformVx * (1 - weight) + v.x * weight;
      v.y = uniformVy * (1 - weight) + v.y * weight;
      
      const trailLength = Math.floor(Math.random() * 6 + 20);
      const baseLifetime = ClassicParams.lifetime;
      const lifetime = baseLifetime * (0.8 + Math.random() * 0.4); // ±20% 随机变化
      
      const particle = ParticlePool.acquire(
        Vec2Pool.acquire(x, y),
        v,
        trailLength,
        lifetime,
        getRandomColor(colorTheme),
        true  // Classic粒子都受lifetime variance影响
      );
      particles.push(particle);
    });
    return new Firework(spawnAfter, Vec2Pool.acquire(x, y), particles);
  }

  // ====== 烟花类型 1b：带发射的经典烟花 (Classic with Launch) ======
  // 从底部发射一个粒子到目标点，在速度减小到一定比例时爆炸
  // explosionRatio: 爆炸临界速度比例 (0-0.9)，速度变为原来的 ratio 倍时爆炸
  function genFirework_ClassicWithLaunch(targetX, targetY, screenHeight, explosionRatio) {
    // 使用 ClassicParams 中的 launchRatio，如果未传入则使用配置值
    if (explosionRatio === undefined) explosionRatio = ClassicParams.launchRatio;
    const ratio = Math.max(0, Math.min(0.9, explosionRatio));
    const startY = screenHeight-1;
    const startX = targetX + (Math.random() - 0.5) * 20;
    const h = startY - targetY;
    
    // 先选择一个颜色组，火箭和爆炸共用
    const colorTheme = getColorTheme('classicLaunch');
    
    // v0 = sqrt(2gh / (1 - ratio^2)), t = v0 * (1 - ratio) / g
    // 火箭使用 DEFAULT_GRAVITY_SCALE，实际重力 = BASE_GRAVITY * DEFAULT_GRAVITY_SCALE
    const g = Physics.BASE_GRAVITY * Physics.DEFAULT_GRAVITY_SCALE;
    const v0 = Math.sqrt(2 * g * h / (1 - ratio * ratio));
    const flightTime = v0 * (1 - ratio) / g * 1000;
    
    // 火箭粒子，使用颜色组中的一个颜色
    const rocketParticle = ParticlePool.acquire(
      Vec2Pool.acquire(startX, startY),
      Vec2Pool.acquire((targetX - startX) / (flightTime / 1000), -v0),
      8,
      flightTime,
      getRandomColor(colorTheme),
      false  // 火箭也不受lifetime offset影响
    );
    rocketParticle.useAirResistance = false; // 火箭无空气阻力
    rocketParticle.gravityScale = Physics.DEFAULT_GRAVITY_SCALE; // 使用默认重力
    
    const rocketFirework = new Firework(0, Vec2Pool.acquire(startX, startY), [rocketParticle]);
    rocketFirework.type = 'rocket';
    
    // 爆炸烟花，使用相同的颜色主题，标记为launch爆炸（不受lifetime offset影响）
    const explosionFirework = genFirework_Classic(targetX, targetY, colorTheme, true);
    explosionFirework.spawnAfter = flightTime;
    explosionFirework.type = 'classicExplosion';
    
    return [rocketFirework, explosionFirework];
  }

  // ====== 烟花类型 2：喷泉烟花 (Fountain) ======
  // 向上扇形喷射，持续发射粒子，固定在底部中间
  function genFirework_Fountain(screenWidth, screenHeight) {
    const x = screenWidth / 4; 
    const y = screenHeight; // 底部位置
    
    const colorTheme = getColorTheme('fountain');
    const spawnAfter = Math.random() * 1000;
    const particles = [];
    const numParticles = Math.floor(FountainParams.count * (0.8 + Math.random() * 0.4)); // ±20% 随机变化
    const trailLength = Math.floor(Math.random() * 10 + 28);
    const baseLifetime = FountainParams.lifetime;
    const lifetime = baseLifetime * (0.8 + Math.random() * 0.4); // ±20% 随机变化
    
    // 扇形角度配置
    const fanAngleDeg = FountainParams.fanAngle || 60;
    const fanAngleRad = (fanAngleDeg * Math.PI) / 180;
    const centerAngle = Math.PI / 2; // 向上
    const angleStd = fanAngleRad / 2; // 标准差为fan_angle的一半
    
    const baseSpeed = FountainParams.speed || 80;
    const speedStd = baseSpeed / 2; // 速度标准差为speed的一半
    const speedVariance = FountainParams.speedVariance || 0;
    
    // Helper: 生成标准正态分布随机数
    const generateGaussian = () => {
      const u1 = 1 - Math.random();
      const u2 = Math.random();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    };
    
    // 为每个粒子生成速度向量
    for (let i = 0; i < numParticles; i++) {
      // 生成高斯分布的角度（中心在centerAngle，标准差为angleStd）
      const angleGaussian = generateGaussian();
      const randomAngle = centerAngle + angleGaussian * angleStd;
      
      // 生成高斯分布的速度大小（中心在baseSpeed，标准差为speedStd）
      const speedGaussian = generateGaussian();
      const particleSpeed = Math.max(baseSpeed * 0.1, baseSpeed + speedGaussian * speedStd); // 至少为baseSpeed的10%
      
      // 均匀方向向量（基于高斯随机角度）
      const uniformVx = Math.cos(randomAngle) * baseSpeed;
      const uniformVy = Math.sin(randomAngle) * baseSpeed;
      
      // 高斯分布速度向量（基于高斯随机速度大小）
      const gaussianVx = Math.cos(randomAngle) * particleSpeed;
      const gaussianVy = Math.sin(randomAngle) * particleSpeed;
      
      // 混合权重：speedVariance 越大，高斯分布权重越大
      const weight = speedVariance;
      const vx = uniformVx * (1 - weight) + gaussianVx * weight;
      const vy = -(uniformVy * (1 - weight) + gaussianVy * weight); // y 取反，因为屏幕坐标系 y 向下
      
      const v = Vec2Pool.acquire(vx, vy);
      
      const particle = ParticlePool.acquire(
        Vec2Pool.acquire(x, y),
        v,
        trailLength,
        lifetime,
        getRandomColor(colorTheme),
        true  // 正常接受lifetime offset影响
      );
      // 喷泉使用较低的重力和空气阻力
      particle.gravityScale = Physics.FOUNTAIN_GRAVITY_SCALE;
      particle.arScale = Physics.FOUNTAIN_AR_SCALE;
      particle.gradientFunc = gradient_slow;
      particles.push(particle);
    };
    
    const fw = new Firework(spawnAfter, Vec2Pool.acquire(x, y), particles);
    fw.type = 'fountain';
    return fw;
  }



  // ====== 烟花类型 4：漩涡烟花 (Vortex) ======
  // 粒子绕中心旋转，固定在底部中间
  function genFirework_Vortex(screenWidth, screenHeight) {
    //这个xy对应的是屏幕中心位置，不能随便改的
    const x = screenWidth / 2; 
    const y = screenHeight; 
    
    const colorTheme = getColorTheme('vortex');
    const spawnAfter = Math.random() * 1000;
    const particles = [];
    const numParticles = 45;
    const trailLength = Math.floor(Math.random() * 12 + 28);
    const lifetime = Math.random() * 2500 + 4500;
    
    // 使用 VortexParams 中的大小参数
    const vortexSize = VortexParams.size || 30;
    
    // 在中心周围圆形区域生成初始位置
    const initPositions = gen_points_on_circle(vortexSize, numParticles);
    
    initPositions.forEach((offset) => {
      // 初始速度垂直于到中心的方向（形成旋转）
      const perpVel = Vec2Pool.acquire(offset.y, -offset.x);
      const len = Math.sqrt(perpVel.x * perpVel.x + perpVel.y * perpVel.y) || 1;
      perpVel.x = perpVel.x / len * 15;
      perpVel.y = perpVel.y / len * 15;
      
      const particle = ParticlePool.acquire(
        Vec2Pool.acquire(x + offset.x, y + offset.y),
        perpVel,
        trailLength,
        lifetime,
        getRandomColor(colorTheme),
        true  // 正常接受lifetime offset影响
      );
      // 漩涡无重力，有向中心的吸引力
      particle.gravityScale = Physics.VORTEX_GRAVITY_SCALE;
      particle.arScale = Physics.VORTEX_AR_SCALE;
      particle.attractCenter = Vec2Pool.acquire(x, y);
      particle.attractStrength = Physics.VORTEX_ATTRACT_STRENGTH; // 强吸引力但会因距离衰减
      particle.attractInverse = true; // 使用 1/distance 衰减
      particle.gradientFunc = gradient_slow;
      particles.push(particle);
      
      // 释放临时 offset
      Vec2Pool.release(offset);
    });
    
    const fw = new Firework(spawnAfter, Vec2Pool.acquire(x, y), particles);
    fw.type = 'vortex';
    return fw;
  }

  // ====== 烟花类型 5：底部喷泉阵列 (Fountain Array) ======
  // 底部每固定一段距离向上发射粒子
  function genFirework_FountainArray(screenWidth, screenHeight) {
    const colorTheme = getColorTheme('fountainArray');
    const spawnAfter = Math.random() * 300;
    const particles = [];
    // 使用 FountainArrayParams 中的参数
    const numPositions = Math.max(2, FountainArrayParams.arrayCount || 6);
    const baseY = screenHeight - 1; // 底部位置
    const baseSpeed = FountainArrayParams.speed || 225;
    const baseLifetime = FountainArrayParams.lifetime || 1600;
    // 速度方差 (0-1)，与 fountain 含义一致
    const speedVariance = FountainArrayParams.speedVariance || 0;
    const particlesPerPos = Math.max(1, FountainArrayParams.particlePerArray || 2);
    const angleRangeDeg = (typeof FountainArrayParams.angleRange === 'number') ? FountainArrayParams.angleRange : 10;
    const angleRangeRad = (angleRangeDeg * Math.PI) / 180;
    const trailLength = Math.floor(Math.random() * 8 + 15);

    // fountain 的高斯分布生成器
    const generateGaussian = () => {
      const u1 = 1 - Math.random();
      const u2 = Math.random();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    };

    // 均匀分布在屏幕左半区间 [0, screenWidth/2]
    // 将区间分成 numPositions + 1 等份，fountain 出现在中间的 numPositions 个位置
    // 例如 numPositions=3，分成 4 等份，fountain 在第 2,3 个位置（留出两端边距）
    const left = 0;
    const right = screenWidth / 2;
    const spacing = (right - left) / (numPositions + 1);
    for (let i = 0; i < numPositions; i++) {
      const posX = spacing * (i + 1);
      for (let j = 0; j < particlesPerPos; j++) {
        // 角度扰动（与 fountain 一致）
        const centerAngle = Math.PI / 2;
        const angleStd = angleRangeRad / 2;
        const angleGaussian = generateGaussian();
        const randomAngle = centerAngle + angleGaussian * angleStd;
        // 速度扰动（与 fountain 一致）
        const speedStd = baseSpeed / 2;
        const speedGaussian = generateGaussian();
        const particleSpeed = Math.max(baseSpeed * 0.1, baseSpeed + speedGaussian * speedStd);
        // 混合权重
        const weight = speedVariance;
        const uniformVx = Math.cos(randomAngle) * baseSpeed;
        const uniformVy = Math.sin(randomAngle) * baseSpeed;
        const gaussianVx = Math.cos(randomAngle) * particleSpeed;
        const gaussianVy = Math.sin(randomAngle) * particleSpeed;
        const vx = uniformVx * (1 - weight) + gaussianVx * weight;
        const vy = -(uniformVy * (1 - weight) + gaussianVy * weight);
        const v = Vec2Pool.acquire(vx, vy);
        const lifetime = baseLifetime * (0.8 + Math.random() * 0.4);
        const particle = ParticlePool.acquire(
          Vec2Pool.acquire(posX, baseY),
          v,
          trailLength,
          lifetime,
          getRandomColor(colorTheme),
          true
        );
        particle.gravityScale = Physics.FOUNTAIN_GRAVITY_SCALE;
        particle.arScale = Physics.FOUNTAIN_AR_SCALE;
        particle.gradientFunc = gradient_slow;
        particles.push(particle);
      }
    }
    const fw = new Firework(spawnAfter, Vec2Pool.acquire(0, baseY), particles);
    fw.type = 'fountainArray';
    return fw;
  }

  // ====== 烟花类型 6：交叉发射 (Cross Fire) ======
  // 从底部两边向中上方发射粒子
  function genFirework_CrossFire(screenWidth, screenHeight) {
    const colorTheme = getColorTheme('crossFire');
    const spawnAfter = Math.random() * 500;
    const particles = [];
    const baseY = screenHeight - 1; // 底部位置
    
    // 使用 CrossFireParams 中的参数
    const posOffset = Math.max(0, Math.min(0.5, CrossFireParams.posOffset));
    const baseSpeed = CrossFireParams.speed || 280;
    const baseLifetime = CrossFireParams.lifetime || 2000;
    const numParticlesPerSide = Math.max(1, CrossFireParams.count || 50);
    const angleDirectionDeg = CrossFireParams.angleDirection || 0;
    const angleRangeDeg = CrossFireParams.angleRange || 45;
    
    // 发射点位置：posOffset 从 0 到 0.5，控制发射点从屏幕边缘到中心移动
    // 当 posOffset=0: leftX=0, rightX=screenWidth/2 (屏幕两边)
    // 当 posOffset=0.5: leftX=rightX=screenWidth/4 (屏幕中间)
    const leftX = posOffset * (screenWidth / 2);
    const rightX = screenWidth / 2 - posOffset * (screenWidth / 2);
    const centerX = 0;
    const centerY = -screenHeight / 4; // 目标中心点在上方
    
    const trailLength = Math.floor(Math.random() * 10 + 30);
    const angleDirectionRad = (angleDirectionDeg * Math.PI) / 180;
    const angleRangeRad = (angleRangeDeg * Math.PI) / 180;
    const speedVariance = CrossFireParams.speedVariance || 0;
    const speedStd = baseSpeed / 2; // 速度标准差为speed的一半
    
    // Helper: 生成标准正态分布随机数
    const generateGaussian = () => {
      const u1 = 1 - Math.random();
      const u2 = Math.random();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    };
    
    // Helper: 在指定角度范围内生成粒子
    const generateParticlesInAngleRange = (angleStart, angleEnd, posX, posY) => {
      for (let i = 0; i < numParticlesPerSide; i++) {
        // 生成高斯分布的角度（中心在angleStart和angleEnd中点，标准差为angleRange的1/4）
        const centerAngle = (angleStart + angleEnd) / 2;
        const angleStd = angleRangeRad / 4;
        const angleGaussian = generateGaussian();
        const randomAngle = centerAngle + angleGaussian * angleStd;
        
        // 生成高斯分布的速度大小
        const speedGaussian = generateGaussian();
        const gaussianVel = Math.max(baseSpeed * 0.1, baseSpeed + speedGaussian * speedStd);
        
        // 均匀方向向量（基准速度）
        const uniformVx = Math.cos(randomAngle) * baseSpeed;
        const uniformVy = Math.sin(randomAngle) * baseSpeed;
        
        // 高斯分布速度向量
        const gaussianVx = Math.cos(randomAngle) * gaussianVel;
        const gaussianVy = Math.sin(randomAngle) * gaussianVel;
        
        // 混合权重：speedVariance = 0 时100%均匀，speedVariance = 1 时100%高斯
        const weight = speedVariance;
        const vx = uniformVx * (1 - weight) + gaussianVx * weight;
        const vy = -(uniformVy * (1 - weight) + gaussianVy * weight); // y 取反，因为屏幕坐标系 y 向下
        
        const v = Vec2Pool.acquire(vx, vy);
        const lifetime = baseLifetime * (0.8 + Math.random() * 0.4);
        
        const particle = ParticlePool.acquire(
          Vec2Pool.acquire(posX, posY),
          v,
          trailLength,
          lifetime,
          getRandomColor(colorTheme),
          true  // 正常接受lifetime offset影响
        );
        particle.gravityScale = Physics.FOUNTAIN_GRAVITY_SCALE;
        particle.arScale = Physics.FOUNTAIN_AR_SCALE;
        particle.attractCenter = Vec2Pool.acquire(centerX, centerY);
        particle.attractStrength = 0.8;
        particle.gradientFunc = gradient_slow;
        particles.push(particle);
      }
    };
    
    // 左边：从角度方向偏左
    const leftAngleStart = angleDirectionRad - angleRangeRad / 2;
    const leftAngleEnd = angleDirectionRad + angleRangeRad / 2;
    generateParticlesInAngleRange(leftAngleStart, leftAngleEnd, leftX, baseY);
    
    // 右边：从角度方向偏右（对称）
    const rightAngleStart = Math.PI - angleDirectionRad - angleRangeRad / 2;
    const rightAngleEnd = Math.PI - angleDirectionRad + angleRangeRad / 2;
    generateParticlesInAngleRange(rightAngleStart, rightAngleEnd, rightX, baseY);
    
    const fw = new Firework(spawnAfter, Vec2Pool.acquire(centerX, centerY), particles);
    fw.type = 'crossFire';
    return fw;
  }

  // ====== 烟花类型 7：超大烟花综合演出 (Grand Finale) ======
  // 三层烟花组合：中心爆炸 + 蓝色渐变爆炸 + 环形阵列
  // 中心位置固定在屏幕中心 (screenWidth/4, screenHeight/2)
  function genFirework_GrandFinale(screenWidth, screenHeight) {
    const centerX = screenWidth / 4;
    const centerY = screenHeight*2/5;
    
    const count1 = GrandFinaleParams.count1;
    const speed1 = GrandFinaleParams.speed1;
    
    const count2 = GrandFinaleParams.count2;
    const speed2 = GrandFinaleParams.speed2;
    
    const count3 = GrandFinaleParams.count3;
    const speed3 = GrandFinaleParams.speed3;
    const ringRadius = GrandFinaleParams.ringRadius || 10;
    
    const baseLifetime = GrandFinaleParams.lifetime || 5000;
    
    // Helper: 生成高斯随机数
    const generateGaussian = () => {
      const u1 = 1 - Math.random();
      const u2 = Math.random();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    };
    
    const colorTheme = getColorTheme('grandFinale');
    
    // ===== 第一层=====
    const particles1 = [];
    for (let i = 0; i < count1; i++) {
      const randomAngle = Math.random() * 2 * Math.PI;
      const speedGaussian = generateGaussian();
      const particleSpeed = Math.max(speed1 * 0.1, speed1 + speedGaussian * (speed1 / 2));
      
      const vx = Math.cos(randomAngle) * particleSpeed;
      const vy = Math.sin(randomAngle) * particleSpeed;
      const v = Vec2Pool.acquire(vx, vy);
      
      const lifetime = baseLifetime * (0.6 + Math.random() * 0.4); // 3.0~5.0秒
      const trailLength = Math.floor(Math.random() * 5 + 15);
      
      const particle = ParticlePool.acquire(
        Vec2Pool.acquire(centerX, centerY),
        v,
        trailLength,
        lifetime,
        getRandomColor(colorTheme),
        true
      );
      particle.gravityScale = Physics.DEFAULT_GRAVITY_SCALE;
      particle.arScale = 0.15;
      particles1.push(particle);
    }
    const fw1 = new Firework(0, Vec2Pool.acquire(centerX, centerY), particles1);
    fw1.type = 'grandFinale';
    
    // ===== 第二层 =====
    const particles2 = [];
    for (let i = 0; i < count2; i++) {
      const randomAngle = Math.random() * 2 * Math.PI;
      const speedGaussian = generateGaussian();
      const particleSpeed = Math.max(speed2 * 0.1, speed2 + speedGaussian * (speed2 / 2));
      
      const vx = Math.cos(randomAngle) * particleSpeed;
      const vy = Math.sin(randomAngle) * particleSpeed;
      const v = Vec2Pool.acquire(vx, vy);
      
      const lifetime = baseLifetime * (0.96 + Math.random() * 0.4); // 4.8~10.0秒
      const trailLength = Math.floor(Math.random() * 8 + 20);
      
      const particle = ParticlePool.acquire(
        Vec2Pool.acquire(centerX, centerY),
        v,
        trailLength,
        lifetime,
        getRandomColor(colorTheme),
        true
      );
      particle.gravityScale = Physics.DEFAULT_GRAVITY_SCALE;
      particle.arScale = 0.09;
      particles2.push(particle);
    }
    const fw2 = new Firework(300, Vec2Pool.acquire(centerX, centerY), particles2); // 延迟300毫秒
    fw2.type = 'grandFinale';
    
    // ===== 第三层：环形阵列 =====
    const ringCount = Math.max(1, Math.floor(count3)); // count3 控制环位置数量
    const ringPositions = [];
    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * 2 * Math.PI;
      const x = Math.cos(angle) * ringRadius; // 形成真正的环
      const y = Math.sin(angle) * ringRadius;
      ringPositions.push(Vec2Pool.acquire(x, y));
    }
    const particlesPerRing = 35; // 每个环位置固定生成35个粒子
    
    const particles3 = [];
    ringPositions.forEach((offset) => {
      for (let i = 0; i < particlesPerRing; i++) {
        const randomAngle = Math.random() * 2 * Math.PI;
        const speedGaussian = generateGaussian();
        const particleSpeed = Math.max(speed3 * 0.1, speed3 + speedGaussian * (speed3 / 2));
        
        const vx = Math.cos(randomAngle) * particleSpeed;
        const vy = Math.sin(randomAngle) * particleSpeed;
        const v = Vec2Pool.acquire(vx, vy);
        
        const lifetime = baseLifetime * (0.6 + Math.random() * 0.2); // 3.0~4.0秒
        const trailLength = Math.floor(Math.random() * 10 + 20);
        
        const particle = ParticlePool.acquire(
          Vec2Pool.acquire(centerX + offset.x, centerY + offset.y),
          v,
          trailLength,
          lifetime,
          getRandomColor(colorTheme),
          true
        );
        particle.gravityScale = Physics.DEFAULT_GRAVITY_SCALE;
        particle.arScale = 0.28;
        particles3.push(particle);
      }
      
      Vec2Pool.release(offset);
    });
    const fw3 = new Firework(600, Vec2Pool.acquire(centerX, centerY), particles3); // 延迟600毫秒
    fw3.type = 'grandFinale';
    
    // 返回三层烟花数组，每层有不同的延迟时间
    // 效仿Rust版本中的demo_firework_comb_0，实现分层时间延迟效果
    return [fw1, fw2, fw3];
  }

  // ====== 烟花生成权重配置 ======
  // 每种烟花类型的权重，权重越大生成概率越高
  const fireworkWeights = {
    classic:        0,  // 经典爆炸（包括带/不带发射模式）
    fountain:       0,  // 喷泉
    vortex:         0,   // 漩涡
    fountainArray:  0,   // 喷泉阵列
    crossFire:      0,  // 交叉发射
    grandFinale:    0,  // 超大烟花
  };

  // 计算权重总和（缓存）
  let totalWeight = 0;
  let weightEntries = [];
  
  function recalculateWeights() {
    totalWeight = 0;
    weightEntries = [];
    for (const [type, weight] of Object.entries(fireworkWeights)) {
      totalWeight += weight;
      weightEntries.push({ type, weight, cumulative: totalWeight });
    }
  }
  recalculateWeights(); // 初始化

  // 轮盘赌选择烟花类型
  function selectFireworkType() {
    // 如果没有任何权重，不生成烟花（返回 null）
    if (totalWeight === 0) {
      return null;
    }
    const rand = Math.random() * totalWeight;
    for (const entry of weightEntries) {
      if (rand < entry.cumulative) {
        return entry.type;
      }
    }
    // 理论上不应该到这里，但作为保险返回最后一个权重非零的类型
    for (let i = weightEntries.length - 1; i >= 0; i--) {
      if (weightEntries[i].weight > 0) {
        return weightEntries[i].type;
      }
    }
    return null;
  }

  // ====== 随机生成烟花（带屏幕尺寸参数） ======
  // 返回值可能是单个 Firework 或 Firework 数组，如果没有权重则返回 null
  function genFirework(x, y, screenWidth, screenHeight) {
    const type = selectFireworkType();
    
    // 如果没有任何权重，返回 null
    if (type === null) {
      return null;
    }
    
    switch (type) {
      case 'classic':
        // 根据 ClassicParams.withLaunch 决定是否使用发射模式
        if (ClassicParams.withLaunch && screenHeight) {
          return genFirework_ClassicWithLaunch(x, y, screenHeight);
        }
        return genFirework_Classic(x, y);
      
      case 'fountain':
        if (screenWidth && screenHeight) {
          return genFirework_Fountain(screenWidth, screenHeight);
        }
        return null;
      
      case 'vortex':
        if (screenWidth && screenHeight) {
          return genFirework_Vortex(screenWidth, screenHeight);
        }
        return null;
      
      case 'fountainArray':
        if (screenWidth && screenHeight) {
          return genFirework_FountainArray(screenWidth, screenHeight);
        }
        return null;
      
      case 'crossFire':
        if (screenWidth && screenHeight) {
          return genFirework_CrossFire(screenWidth, screenHeight);
        }
        return null;
      
      case 'grandFinale':
        return genFirework_GrandFinale(x, y);
      
      default:
        return null;
    }
  }

  // 设置烟花权重（可在运行时动态调整）
  function setFireworkWeight(type, weight) {
    if (fireworkWeights.hasOwnProperty(type)) {
      fireworkWeights[type] = Math.max(0, weight);
      recalculateWeights();
    }
  }

  // 获取当前权重配置
  function getFireworkWeights() {
    return { ...fireworkWeights };
  }

  global.FireworkLib = {
    Vec2,
    Vec2Pool,
    Particle,
    ParticlePool,
    ObjectPool,
    Firework,
    // 从 ColorLib 导入颜色相关
    Color: ColorLib ? ColorLib.Color : null,
    colors: ColorLib ? ColorLib.colors : [],
    COLOR_GROUP_COUNT: ColorLib ? ColorLib.COLOR_GROUP_COUNT : 0,
    colorAvailability: ColorLib ? ColorLib.colorAvailability : {},
    getAvailableColorGroups,
    getColorTheme,
    getRandomColor,
    setCustomColorGroup: ColorLib ? ColorLib.setCustomColorGroup : null,
    Physics,
    ClassicParams,
    FountainParams,
    VortexParams,
    FountainArrayParams,
    CrossFireParams,
    GrandFinaleParams,
    explosion_gradient,
    gradient_slow,
    gen_Vec2s_in_circle_normal,
    gen_Vec2s_in_circle,
    gen_Vec2s_in_fan,
    gen_points_on_circle,
    genFirework,
    genFirework_Classic,
    genFirework_ClassicWithLaunch,
    genFirework_Fountain,
    genFirework_Vortex,
    genFirework_FountainArray,
    genFirework_CrossFire,
    genFirework_GrandFinale,
    // 权重系统
    fireworkWeights,
    setFireworkWeight,
    getFireworkWeights,
    recalculateWeights,
  };
})(window);

export const SNOISE = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0); const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy)); vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz); vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy); vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx; vec3 x2 = x0 - i2 + 2.0 * C.xxx; vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0; vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z); vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy; vec4 y = y_ *ns.x + ns.yyyy; vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy); vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0; vec4 s1 = floor(b1)*2.0 + 1.0; vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy; vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x); vec3 p1 = vec3(a0.zw,h.y); vec3 p2 = vec3(a1.xy,h.z); vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0); m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
float random(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453); }
vec3 helixPoint(float rnd1, float rnd2, float rnd3, float rnd4, float twist, float radius, float height, float thick, float wave, float time) {
  float yCont = (rnd2 * 2.0 - 1.0) * height;
  float beadN = 20.0;
  float yBead = floor(yCont / height * beadN + 0.5) / beadN * height;
  float y = mix(yBead, yCont, 0.12);
  vec3 core;
  if (rnd1 < 0.82) {
    float strand = step(0.5, rnd1) * 3.14159265;
    float a = y * twist + strand;
    core = vec3(radius * cos(a), y, radius * sin(a));
    core += (vec3(rnd2, rnd3, rnd4) - 0.5) * thick;
  } else {
    float rungT = rnd3;
    float dy = floor(y * 2.2) / 2.2;
    float a = dy * twist;
    vec3 p1 = vec3(radius * cos(a), dy, radius * sin(a));
    vec3 p2 = vec3(radius * cos(a + 3.14159265), dy, radius * sin(a + 3.14159265));
    core = mix(p1, p2, rungT) + (vec3(rnd2, rnd4, rnd3) - 0.5) * 0.08;
  }
  core.x += sin(time * 0.5 + y * 0.6) * wave;
  core.z += cos(time * 0.4 + y * 0.6) * wave;
  return core;
}
`;

export const helixVertex = /* glsl */ `
uniform float uTime, uHelixSize, uTwist, uRadius, uHeight, uThick, uWave;
uniform float uPixelScale;
uniform vec3 uHelixA, uHelixB;
uniform vec3 uCursor; uniform float uRepelRadius, uRepelStrength, uActivity;
varying vec3 vColor; varying float vFade;
${SNOISE}
void main() {
  vec3 s = position;
  float rnd1 = random(s), rnd2 = random(s + 1.7), rnd3 = random(s + 3.3), rnd4 = random(s + 5.9);
  vec3 p = helixPoint(rnd1, rnd2, rnd3, rnd4, uTwist, uRadius, uHeight, uThick, uWave, uTime);
  vec3 wp = (modelMatrix * vec4(p, 1.0)).xyz;
  vec3 toP = wp - uCursor;
  float fall = smoothstep(uRepelRadius, 0.0, length(toP));
  wp += normalize(toP + vec3(1e-4)) * fall * uRepelStrength * uActivity;
  vec4 mv = viewMatrix * vec4(wp, 1.0);
  vColor = mix(uHelixB, uHelixA, rnd4);
  vFade = 0.65 + 0.35 * rnd2;
  gl_PointSize = uHelixSize * uPixelScale * (12.0 / -mv.z);
  gl_PointSize = max(gl_PointSize, 1.5);
  gl_Position = projectionMatrix * mv;
}
`;

export const helixFragment = /* glsl */ `
uniform float uBrightness, uHelixOpacity, uAppear;
varying vec3 vColor; varying float vFade;
void main() {
  vec2 xy = gl_PointCoord - 0.5;
  float ll = length(xy);
  if (ll > 0.5) discard;
  float soft = smoothstep(0.5, 0.05, ll);
  float cov = clamp(soft * vFade * uHelixOpacity * uAppear * uBrightness, 0.0, 1.0);
  gl_FragColor = vec4(mix(vec3(1.0), vColor, cov), 1.0);
}
`;

export const inkVertex = /* glsl */ `
uniform float uTime, uInkSize, uTwist, uRadius, uHeight, uThick, uWave;
uniform float uEmitRate, uSpread, uRise, uTurb, uNoiseFreq, uNoiseEvolve, uInkGrow;
uniform float uPixelScale;
uniform vec3 uInkCore, uInkMid, uInkEdge;
uniform vec3 uCursor; uniform float uRepelRadius, uRepelStrength, uActivity;
varying vec3 vColor; varying float vAlpha;
${SNOISE}
void main() {
  vec3 s = position;
  float rnd1 = random(s), rnd2 = random(s + 1.7), rnd3 = random(s + 3.3), rnd4 = random(s + 5.9);
  float seed = random(s + 9.1);

  float life = fract(seed + uTime * uEmitRate);

  float birthTime = uTime - life / max(uEmitRate, 1e-4);
  vec3 birth = helixPoint(rnd1, rnd2, rnd3, rnd4, uTwist, uRadius, uHeight, uThick, uWave, birthTime);

  vec3 outward = normalize(vec3(birth.x, 0.0, birth.z) + vec3(1e-4));

  float e = uTime * uNoiseEvolve;
  vec3 np = birth * uNoiseFreq;
  vec3 flow = vec3(
    snoise(np + vec3(e, 0.0, 0.0)),
    snoise(np + vec3(0.0, e, 0.0) + 11.0),
    snoise(np + vec3(0.0, 0.0, e) + 23.0)
  );

  vec3 disp = outward * life * uSpread
            + flow * pow(life, 1.4) * uTurb
            + vec3(0.0, life * uRise, 0.0);
  vec3 p = birth + disp;

  vec3 wp = (modelMatrix * vec4(p, 1.0)).xyz;
  vec3 toP = wp - uCursor;
  float fall = smoothstep(uRepelRadius, 0.0, length(toP));
  wp += normalize(toP + vec3(1e-4)) * fall * uRepelStrength * uActivity;
  vec4 mv = viewMatrix * vec4(wp, 1.0);

  vec3 c = mix(uInkCore, uInkMid, smoothstep(0.0, 0.4, life));
  c = mix(c, uInkEdge, smoothstep(0.35, 1.0, life));
  vColor = c;

  vAlpha = smoothstep(0.0, 0.06, life) * (1.0 - smoothstep(0.4, 1.0, life));

  float grow = 0.35 + life * uInkGrow;
  gl_PointSize = uInkSize * grow * uPixelScale * (12.0 / -mv.z);
  gl_PointSize = max(gl_PointSize, 1.0);
  gl_Position = projectionMatrix * mv;
}
`;

export const inkFragment = /* glsl */ `
uniform float uBrightness, uInkOpacity, uAppear;
varying vec3 vColor; varying float vAlpha;
void main() {
  vec2 xy = gl_PointCoord - 0.5;
  float ll = length(xy);
  if (ll > 0.5) discard;
  float soft = exp(-ll * ll * 7.0);
  float cov = clamp(soft * vAlpha * uInkOpacity * uAppear * uBrightness, 0.0, 1.0);
  gl_FragColor = vec4(mix(vec3(1.0), vColor, cov), 1.0);
}
`;

export const atmoVertex = /* glsl */ `
attribute float size; attribute float seed; uniform float uTime; uniform vec2 uRes;
varying float vA;
vec3 warp(vec3 p, float t){ float c=0.9,a=1.9,b=0.02,s=0.05; p*=2.;
  p.x+=c*sin(s*t+a*p.y)+t*b; p.y+=c*cos(s*t+a*p.x); p.y+=c*sin(s*t+a*p.z)+t*b;
  p.z+=c*cos(s*t+a*p.y); p.z+=c*sin(s*t+a*p.x)+t*b; p.x+=c*cos(s*t+a*p.z);
  return cos(p+vec3(1,2,4)); }
void main(){
  vec3 v = position*5.0 + warp(position, uTime)*1.4;
  vec4 mv = modelViewMatrix * vec4(v, 1.0);
  float r = length(v); float farF = 1.0 - smoothstep(6.0, 8.0, r); float nearF = smoothstep(0.0, 0.5, -mv.z);
  vA = farF * nearF;
  gl_PointSize = size * uRes.y / 900.0 / -mv.z; gl_PointSize = max(gl_PointSize, 1.0);
  gl_Position = projectionMatrix * mv;
}
`;

export const atmoFragment = /* glsl */ `
uniform vec3 uColor; varying float vA;
void main(){ vec2 p = gl_PointCoord - 0.5; float l = length(p); if (l > 0.5) discard;
  float tex = smoothstep(0.5, 0.0, l); float cov = clamp(tex * vA * 0.4, 0.0, 1.0);
  gl_FragColor = vec4(mix(vec3(1.0), uColor, cov), 1.0); }
`;

export const finalVertex = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }
`;

export const finalFragment = /* glsl */ `
uniform sampler2D tDiffuse; varying vec2 vUv;
void main(){ gl_FragColor = vec4(texture2D(tDiffuse, vUv).xyz, 1.); }
`;

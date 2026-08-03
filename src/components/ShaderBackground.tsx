"use client";

import { useCallback, useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

#define MAX_DIST 50.0
#define SURF_DIST 0.0005
#define EPS 0.0001
#define PI 3.141592
#define PI2 6.283185

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = rand(i);
  float b = rand(i + vec2(1.0, 0.0));
  float c = rand(i + vec2(0.0, 1.0));
  float d = rand(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float rep = 0.04;

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

vec2 minMat(vec2 d1, vec2 d2) {
  return (d1.x < d2.x) ? d1 : d2;
}

vec2 scene(vec3 p, vec3 mouseWorld) {
  vec2 d = vec2(100000.0, 0.0);
  vec3 q = p;

  vec2 id = floor(q.xz / rep);
  float hash = rand(id * 0.001);

  q.xz = mod(q.xz, rep) - rep * 0.5;

  vec3 bcp = vec3(0.0);
  bcp.xz = id * rep + rep * 0.5;

  // Mouse proximity
  float mDist = length(mouseWorld.xz - bcp.xz);
  float s = smoothstep(0.0, 0.25, mDist);

  float t = u_time;
  float trigger = noise(id * 0.5 + t * 0.04);
  float ambientNoise = smoothstep(0.85, 1.0, trigger) * sin(t * 0.4 + hash * PI2) * 0.018;

  q -= vec3(
    0.0,
    0.125 - (sin(hash * PI2 + t * (0.6 + mDist * 0.005)) * 0.04) * (1.0 - pow(s, 0.9)) - ambientNoise,
    0.0
  );

  d = minMat(d, vec2(sdBox(q, vec3(rep * 0.5, 0.1, rep * 0.5)), 1.0));
  return d;
}

vec3 getNormal(vec3 p, vec3 mw) {
  vec2 e = vec2(EPS, 0.0);
  return normalize(vec3(
    scene(p + e.xyy, mw).x - scene(p - e.xyy, mw).x,
    scene(p + e.yxy, mw).x - scene(p - e.yxy, mw).x,
    scene(p + e.yyx, mw).x - scene(p - e.yyx, mw).x
  ));
}

vec2 raymarch(vec3 ro, vec3 rd, vec3 mw) {
  float accDist = 0.0;
  float mat = 0.0;
  for (int i = 0; i < 80; i++) {
    vec3 p = ro + rd * accDist;
    vec2 result = scene(p, mw);
    float dist = result.x;
    mat = result.y;
    if (abs(dist) < SURF_DIST || accDist > MAX_DIST) break;
    vec3 rdi = 1.0 / rd;
    accDist += min(
      min(
        (step(0.0, rd.x) - mod(p.x, rep)) * rdi.x,
        (step(0.0, rd.z) - mod(p.z, rep)) * rdi.z
      ) + 0.0001,
      dist
    );
  }
  return vec2(accDist, mat);
}

vec3 getRayDir(vec2 uv, vec3 p, vec3 l, float z) {
  vec3 forward = normalize(l - p);
  vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
  vec3 up = normalize(cross(right, forward));
  return normalize(right * uv.x + up * uv.y + forward * z);
}

void main() {
  float t = u_time;
  vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);

  vec2 m = (u_mouse * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);

  vec3 ro = vec3(0.0, 1.0, 1.2);
  vec3 ta = vec3(0.0, 0.2, 0.0);
  vec3 rd = getRayDir(uv, ro, ta, 3.5);

  vec3 mRd = getRayDir(m, ro, ta, 3.5);
  float mt = (0.125 - ro.y) / mRd.y;
  vec3 mouseWorld = ro + mRd * max(mt, 0.0);

  vec2 result = raymarch(ro, rd, mouseWorld);
  float dist = result.x;

  vec3 col = vec3(0.025, 0.021, 0.018);

  if (dist < MAX_DIST) {
    vec3 p = ro + rd * dist;
    vec3 n = getNormal(p, mouseWorld);
    vec3 l = normalize(vec3(1.0, 1.0, -1.0));

    float diffuse = dot(l, n) * 0.5 + 0.5;

    vec3 diffuseColor;
    if (n.y > 0.5) {
      diffuseColor = diffuse * vec3(0.08, 0.06, 0.04);
    } else if (n.x > 0.5 || n.x < -0.5) {
      diffuseColor = diffuse * vec3(0.05, 0.035, 0.02);
    } else {
      diffuseColor = diffuse * vec3(0.04, 0.025, 0.015);
    }

    // Gold highlight near mouse
    float mDist = length(mouseWorld.xz - p.xz);
    float glow = exp(-mDist * mDist * 30.0) * 0.12;
    diffuseColor += vec3(0.686, 0.376, 0.145) * glow;

    float fog = exp(-dist * 0.9);
    col = mix(col, diffuseColor, fog);
  }

  // Vignette
  vec2 vuv = gl_FragCoord.xy / u_resolution;
  float vig = 1.0 - smoothstep(0.25, 1.1, length(vuv - 0.5) * 1.4);
  col *= vig;

  col = pow(col, vec3(0.4545));
  gl_FragColor = vec4(col, 1.0);
}
`;

export function ShaderBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const mouseRef = useRef({ x: 0, y: 0 });
	const smoothMouseRef = useRef({ x: 0, y: 0 });
	const rafRef = useRef<number>(0);

	const handleMouseMove = useCallback((e: MouseEvent) => {
		mouseRef.current = { x: e.clientX, y: e.clientY };
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
		if (!gl) return;

		function createShader(
			ctx: WebGLRenderingContext,
			type: number,
			source: string,
		) {
			const s = ctx.createShader(type);
			if (!s) return null;
			ctx.shaderSource(s, source);
			ctx.compileShader(s);
			if (!ctx.getShaderParameter(s, ctx.COMPILE_STATUS)) {
				ctx.deleteShader(s);
				return null;
			}
			return s;
		}

		const vs = createShader(gl, gl.VERTEX_SHADER, VERT);
		const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAG);
		if (!vs || !fs) return;

		const program = gl.createProgram();
		if (!program) return;
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

		const posLoc = gl.getAttribLocation(program, "a_position");
		const resLoc = gl.getUniformLocation(program, "u_resolution");
		const timeLoc = gl.getUniformLocation(program, "u_time");
		const mouseLoc = gl.getUniformLocation(program, "u_mouse");

		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
			gl.STATIC_DRAW,
		);

		function resize() {
			if (!canvas) return;
			const dpr = Math.min(window.devicePixelRatio, 1.5);
			const w = Math.floor(canvas.clientWidth * dpr);
			const h = Math.floor(canvas.clientHeight * dpr);
			if (canvas.width !== w || canvas.height !== h) {
				canvas.width = w;
				canvas.height = h;
			}
		}

		const start = performance.now();

		function render() {
			if (!gl || !canvas) return;
			resize();

			// Lerp the smooth mouse toward the actual mouse for lingering
			const lerpSpeed = 0.03;
			smoothMouseRef.current.x +=
				(mouseRef.current.x - smoothMouseRef.current.x) * lerpSpeed;
			smoothMouseRef.current.y +=
				(mouseRef.current.y - smoothMouseRef.current.y) * lerpSpeed;

			gl.viewport(0, 0, canvas.width, canvas.height);
			// biome-ignore lint/correctness/useHookAtTopLevel: WebGL API, not a React hook
			gl.useProgram(program);

			gl.enableVertexAttribArray(posLoc);
			gl.bindBuffer(gl.ARRAY_BUFFER, buf);
			gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

			gl.uniform2f(resLoc, canvas.width, canvas.height);
			gl.uniform1f(timeLoc, (performance.now() - start) / 1000);

			gl.uniform2f(
				mouseLoc,
				(smoothMouseRef.current.x / canvas.clientWidth) * canvas.width,
				((canvas.clientHeight - smoothMouseRef.current.y) /
					canvas.clientHeight) *
					canvas.height,
			);

			gl.drawArrays(gl.TRIANGLES, 0, 6);
			rafRef.current = requestAnimationFrame(render);
		}

		window.addEventListener("mousemove", handleMouseMove);
		rafRef.current = requestAnimationFrame(render);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			cancelAnimationFrame(rafRef.current);
		};
	}, [handleMouseMove]);

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 -z-10"
			style={{ width: "100%", height: "100%" }}
		/>
	);
}

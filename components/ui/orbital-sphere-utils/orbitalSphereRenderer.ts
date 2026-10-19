import * as THREE from "three";

export const ORBITAL_SPHERE_DEFAULTS = {
  speed: 1,
  particleSize: 0.015,
  particleOpacity: 0.8,
  orbitOpacity: 0.25,
  scale: 1,
  haloOpacity: 0.2,
  hue: 0,
};

export type OrbitalSphereOptions = typeof ORBITAL_SPHERE_DEFAULTS;

export function createOrbitalSphereRenderer(
  canvas: HTMLCanvasElement,
  getOptions: () => OrbitalSphereOptions
) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2));

  const group = new THREE.Group();
  scene.add(group);

  const radius = 2.2;
  const count = 15000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color1 = new THREE.Color(0xa78bfa); // Violet
  const color2 = new THREE.Color(0x701a75); // Deep magenta

  let n = 0;
  for (let e = 0; e < count; e += 1) {
    const o = Math.acos(-1 + (2 * e) / count);
    const r = Math.sqrt(count * Math.PI) * o;
    const c = radius * Math.cos(r) * Math.sin(o);
    const l = radius * Math.sin(r) * Math.sin(o);
    const s = radius * Math.cos(o);
    const i =
      Math.sin(c * 3.5) * Math.cos(l * 3.5) * Math.sin(s * 3.5) +
      Math.cos(c * 6) * 0.4;
    if (i <= -0.1) continue;
    const p = 1 + i * 0.1;
    positions[n * 3] = c * p;
    positions[n * 3 + 1] = l * p;
    positions[n * 3 + 2] = s * p;
    const d = color2.clone().lerp(color1, i > 0.5 ? 1 : 0.3);
    colors[n * 3] = d.r;
    colors[n * 3 + 1] = d.g;
    colors[n * 3 + 2] = d.b;
    n += 1;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions.slice(0, n * 3), 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors.slice(0, n * 3), 3));

  const material = new THREE.PointsMaterial({
    size: 0.015,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  group.add(new THREE.Points(geometry, material));

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
  });

  const lineGeometries: THREE.BufferGeometry[] = [];
  const sphereGeometries: THREE.SphereGeometry[] = [];
  const materials: THREE.Material[] = [];
  const haloMaterials: THREE.MeshBasicMaterial[] = [];
  let baseScale = 1;

  for (let e = 0; e < 6; e += 1) {
    const lineGeo = new THREE.BufferGeometry();
    const pts: number[] = [];
    const ringRadius = radius * (1.08 + Math.random() * 0.2);
    for (let s = 0; s <= 90; s += 1) {
      const angle = (s / 90) * Math.PI * 2;
      pts.push(Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius, Math.sin(angle * 4) * 0.1);
    }
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    lineGeometries.push(lineGeo);

    const line = new THREE.Line(lineGeo, lineMaterial);
    line.rotation.x = Math.random() * Math.PI * 2;
    line.rotation.y = Math.random() * Math.PI * 2;
    group.add(line);

    if (e % 2 !== 0) {
      const nodeGeo = new THREE.SphereGeometry(0.025, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xd8b4fe });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = Math.random() * Math.PI * 2;
      nodeMesh.position.set(Math.cos(angle) * ringRadius, Math.sin(angle) * ringRadius, 0);
      line.add(nodeMesh);

      const haloGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xc084fc,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      nodeMesh.add(haloMesh);

      sphereGeometries.push(nodeGeo, haloGeo);
      materials.push(nodeMat, haloMat);
      haloMaterials.push(haloMat);
    }
  }

  return {
    resize(width: number, height: number) {
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      const options = getOptions();
      if (width >= 1024) {
        group.position.set(0, 0, -2);
        baseScale = 1.15;
        camera.position.z = 5.5;
      } else {
        group.position.set(0, 0, -3);
        baseScale = 1;
        camera.position.z = 6.5;
      }
      group.scale.setScalar(baseScale * options.scale);
    },
    render() {
      const options = getOptions();
      material.size = options.particleSize;
      material.opacity = options.particleOpacity;
      lineMaterial.opacity = options.orbitOpacity;
      haloMaterials.forEach((m) => (m.opacity = options.haloOpacity));
      group.scale.setScalar(baseScale * options.scale);
      group.rotation.y += 0.0008 * options.speed;
      group.rotation.x += 0.0003 * options.speed;
      group.children.forEach((child, index) => {
        if (child.type === "Line") {
          child.rotation.z += 0.0004 * options.speed * (index % 2 === 0 ? 1 : -1);
        }
      });
      renderer.render(scene, camera);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      lineMaterial.dispose();
      lineGeometries.forEach((g) => g.dispose());
      sphereGeometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
    },
  };
}

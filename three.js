import * as THREE from "https://esm.sh/three@0.150.0";
import { GLTFLoader } from "https://esm.sh/three@0.150.0/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "https://esm.sh/gsap@3.13.0";

// Animated Intro Sequence - Commented out
// const introOverlay = document.querySelector(".intro-overlay");
// const introWords = document.querySelectorAll(".intro-word");

// // Animate intro words
// gsap.to(introWords, {
//   y: 0,
//   opacity: 1,
//   duration: 1.2,
//   stagger: 0.3,
//   ease: "power4.out",
//   delay: 0.3
// });

// // Fade out intro overlay and reveal hero section
// gsap.to(introOverlay, {
//   opacity: 0,
//   duration: 1,
//   delay: 3,
//   ease: "power2.inOut",
//   onComplete: () => {
//     introOverlay.style.display = "none";
//   }
// });

const canvas = document.querySelector("#carCanvas");
const scene = new THREE.Scene();
scene.background = null; // Transparent background to show gradient

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1, 6);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Mouse tracking for camera rotation
const mouse = { x: 0, y: 0 };
const targetRotation = { x: 0, y: 0 };

window.addEventListener('mousemove', (event) => {
  // Normalize mouse position to -1 to 1 range
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  // Set target rotation based on mouse position
  targetRotation.y = mouse.x * 0.5; // Horizontal rotation
  targetRotation.x = mouse.y * 0.3; // Vertical rotation
});

// Street Light Effect - Soft white lighting from above
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

// Main Street Light - Soft white from above
const streetLight = new THREE.SpotLight(0xffffff, 5);
streetLight.position.set(0, 10, 4);
streetLight.angle = Math.PI / 3.5;
streetLight.penumbra = 0.6;
streetLight.decay = 1.5;
streetLight.distance = 25;
streetLight.castShadow = true;
streetLight.shadow.mapSize.width = 2048;
streetLight.shadow.mapSize.height = 2048;
streetLight.shadow.camera.near = 0.5;
streetLight.shadow.camera.far = 25;
scene.add(streetLight);

// Secondary soft fill light from side
const sideLight = new THREE.SpotLight(0xffffff, 3);
sideLight.position.set(-7, 7, 2);
sideLight.angle = Math.PI / 4;
sideLight.penumbra = 0.7;
sideLight.decay = 1.5;
sideLight.distance = 20;
scene.add(sideLight);

// Soft fill light from the other side
const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
fillLight.position.set(5, 4, 3);
scene.add(fillLight);

// Subtle blue accent rim light
const rimLight = new THREE.DirectionalLight(0x667eea, 0.5);
rimLight.position.set(0, 2, -8);
scene.add(rimLight);

// Ground plane to receive shadows
const groundGeometry = new THREE.PlaneGeometry(30, 30);
const groundMaterial = new THREE.ShadowMaterial({
  opacity: 0.3
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1;
ground.receiveShadow = true;
scene.add(ground);

// Load Model
const loader = new GLTFLoader();
loader.load(
  "models/scene.gltf",
  (gltf) => {
    const car = gltf.scene;
    
    // Hide text meshes (name and email on the car)
    car.traverse((child) => {
      if (child.isMesh) {
        // Enable shadows on car meshes
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Hide the plane objects that contain the text
        if (child.name.includes('Plane') || 
            child.name.includes('Plane.001') || 
            child.name.includes('Plane.005') || 
            child.name.includes('Plane.006')) {
          child.visible = false;
        }
      }
    });
    
    car.scale.set(1.8, 1.8, 1.8);
    car.position.set(0, 0, 0);
    car.rotation.y = Math.PI * 0.15; // Slight angle for better view
    scene.add(car);

    // GSAP entry animation - More dramatic
    gsap.from(car.rotation, { 
      y: Math.PI * 3, 
      duration: 2.5, 
      ease: "power3.out",
      delay: 0.5
    });
    gsap.from(car.position, { 
      y: -5, 
      z: -10,
      duration: 2.5, 
      ease: "power3.out",
      delay: 0.5
    });
    gsap.from(car.scale, {
      x: 0.5,
      y: 0.5,
      z: 0.5,
      duration: 2.5,
      ease: "back.out(1.5)",
      delay: 0.5
    });

    // Gentle floating animation
    gsap.to(car.position, {
      y: "+=0.3",
      repeat: -1,
      yoyo: true,
      duration: 3,
      ease: "sine.inOut",
      delay: 3
    });

    // Continuous 360-degree rotation
    gsap.to(car.rotation, {
      y: "+=6.28319", // 2 * Math.PI (360 degrees in radians)
      repeat: -1,
      duration: 20,
      ease: "none",
      delay: 3
    });

    // DOM intro animations (hero text) — commented out for now
    // try {
    //   gsap.from(".home-title", { 
    //     y: 60, 
    //     opacity: 0, 
    //     duration: 1.2, 
    //     delay: 4, 
    //     ease: "power3.out" 
    //   });
    //   gsap.from(".home-subtitle", { 
    //     y: 40, 
    //     opacity: 0, 
    //     duration: 1.2, 
    //     delay: 4.3, 
    //     ease: "power3.out" 
    //   });
    //   gsap.from(".home-description", { 
    //     y: 30, 
    //     opacity: 0, 
    //     duration: 1.2, 
    //     delay: 4.6, 
    //     ease: "power3.out" 
    //   });
    //   gsap.from(".button", { 
    //     scale: 0.8, 
    //     opacity: 0, 
    //     duration: 1, 
    //     delay: 4.9, 
    //     ease: "back.out(2)" 
    //   });
    // } catch (e) {
    //   console.warn("GSAP DOM intro failed:", e);
    // }
  },
  undefined,
  (error) => {
    console.error("Failed to load models/scene.gltf:", error);
  }
);

// Responsive
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  
  // Smooth camera rotation following mouse
  camera.position.x += (targetRotation.y * 3 - camera.position.x) * 0.05;
  camera.position.y += (targetRotation.x * 2 + 1 - camera.position.y) * 0.05;
  camera.lookAt(0, 0, 0);
  
  renderer.render(scene, camera);
}

// Start the render loop
animate();

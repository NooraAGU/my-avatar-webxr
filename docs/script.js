// Check WebGL support
function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

if (!checkWebGLSupport()) {
  document.getElementById('loading').innerHTML = `
    <div style="color: #ff4757;">
      <h3>WebGL Not Supported</h3>
      <p>Your browser doesn't support WebGL, which is required for 3D graphics.</p>
      <p>Please update your browser or try a different one.</p>
    </div>
  `;
  throw new Error("WebGL not supported");
}

// Utility functions
function showError(message) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

function hideLoading() {
  document.getElementById('loading').classList.add('hidden');
}

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(1.8, 0.5, 0.2);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = false;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.body.appendChild(renderer.domElement);

// Lighting setup
const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
hemisphereLight.position.set(0, 20, 0);
scene.add(hemisphereLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(-3, 8, 4);
scene.add(directionalLight);

// Rim lighting for better avatar definition
const rimLight = new THREE.DirectionalLight(0x6699ff, 0.3);
rimLight.position.set(-5, 5, -5);
scene.add(rimLight);

// OrbitControls  
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.1, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 1;
controls.maxDistance = 10;
controls.minPolarAngle = Math.PI / 6;
controls.maxPolarAngle = Math.PI - Math.PI / 6;

// Double-click to reset camera
renderer.domElement.addEventListener('dblclick', () => {
  camera.position.set(1.8, 0.5, 0.2);
  controls.target.set(0, 0.1, 0);
  controls.update();
});

// Avatar loading
let mixer;
let avatar;
const loader = new THREE.GLTFLoader();

// Create a fallback cube in case avatar fails to load
function createFallbackAvatar() {
  const geometry = new THREE.BoxGeometry(1, 2, 0.5);
  const material = new THREE.MeshLambertMaterial({ color: 0x4488ff });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 1, 0);
  cube.castShadow = true;
  scene.add(cube);
  
  // Add simple rotation animation
  const clock = new THREE.Clock();
  function animateCube() {
    cube.rotation.y = Math.sin(clock.getElapsedTime()) * 0.2;
  }
  
  return { update: animateCube };
}

// Load the avatar
loader.load(
  "avatar.glb",
  function (gltf) {
    try {
      avatar = gltf.scene;
      
      // Center and scale the avatar
      const box = new THREE.Box3().setFromObject(avatar);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      // Scale avatar to appropriate size (around 1.8 units tall)
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.8 / maxDim;
      avatar.scale.setScalar(scale);
      
      // Center the avatar
      avatar.position.x = -center.x * scale;
      avatar.position.y = -center.y * scale;
      avatar.position.z = -center.z * scale;
      
      // Enhance materials
      avatar.traverse((child) => {
        if (child.isMesh) {
          if (child.material) {
            child.material.envMapIntensity = 1;
          }
        }
      });
      
      scene.add(avatar);
      
      // Setup animations
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(avatar);
        
        // Play the first available animation
        const action = mixer.clipAction(gltf.animations[0]);
        action.play();
        
        console.log(`Loaded avatar with ${gltf.animations.length} animation(s)`);
      } else {
        // Create a subtle breathing animation
        const clock = new THREE.Clock();
        avatar.userData.breathe = function() {
          const time = clock.getElapsedTime();
          avatar.scale.y = scale + Math.sin(time * 2) * 0.02;
        };
      }
      
      hideLoading();
      console.log("Avatar loaded successfully");
    } catch (error) {
      console.error("Error processing avatar:", error);
      showError("Error processing avatar model");
      mixer = createFallbackAvatar();
      hideLoading();
    }
  },
  function (progress) {
    const percent = Math.round((progress.loaded / progress.total) * 100);
    document.querySelector('#loading div:last-child').textContent = `Loading Avatar... ${percent}%`;
  },
  function (error) {
    console.error("Error loading avatar:", error);
    showError("Failed to load avatar. Using fallback model.");
    mixer = createFallbackAvatar();
    hideLoading();
  }
);

// Removed shadow ground plane

// Resize handler
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Handle visibility change for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    renderer.setAnimationLoop(null);
  } else {
    animate();
  }
});

// Animation loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();
  
  // Update mixer for GLTF animations
  if (mixer && mixer.update) {
    mixer.update(delta);
  }
  
  // Update custom breathing animation
  if (avatar && avatar.userData.breathe) {
    avatar.userData.breathe();
  }
  
  // Update controls
  controls.update();
  
  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();

// Initialize after a short delay to ensure everything is loaded
setTimeout(() => {
  if (document.getElementById('loading') && !document.getElementById('loading').classList.contains('hidden')) {
    console.log("Avatar loading taking longer than expected...");
  }
}, 3000);
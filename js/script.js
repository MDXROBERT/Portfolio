const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

// Lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Function to create a star shape
function createStarShape(spikeCount, outerRadius, innerRadius) {
    const shape = new THREE.Shape();
    const step = Math.PI / spikeCount;
    let angle = 0;

    for (let i = 0; i < spikeCount; i++) {
        // Outer point
        angle += step;
        shape.lineTo(Math.cos(angle) * outerRadius, Math.sin(angle) * outerRadius);
        // Inner point
        angle += step;
        shape.lineTo(Math.cos(angle) * innerRadius, Math.sin(angle) * innerRadius);
    }
    shape.closePath();
    return shape;
}

// Create and add small stars
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
}
Array(200).fill().forEach(addStar);

// Create and add 3D star shapes
const starShape = createStarShape(5, 1, 0.5);
const extrudeSettings = { depth: 0.2, bevelEnabled: false };
const starGeometry = new THREE.ExtrudeBufferGeometry(starShape, extrudeSettings);
const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
function add3DStar() {
    const starMesh = new THREE.Mesh(starGeometry, starMaterial);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    starMesh.position.set(x, y, z);
    scene.add(starMesh);
}
Array(50).fill().forEach(add3DStar);

// Sun Background
const sunTexture = new THREE.TextureLoader().load('assets1/222.gif');
const geometrySun = new THREE.SphereGeometry(500, 64, 64);
const materialSun = new THREE.MeshBasicMaterial({ map: sunTexture, side: THREE.BackSide });
const sunMesh = new THREE.Mesh(geometrySun, materialSun);
sunMesh.position.set(0, 0, -1000);
scene.add(sunMesh);

// Adding Avatar
const jeffTexture = new THREE.TextureLoader().load('assets1/profilepic.jpeg');
const jeff = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: jeffTexture }));
jeff.position.set(2, 0, -5);
scene.add(jeff);

// Adding Moon
const moonTexture = new THREE.TextureLoader().load('assets1/moon.jpg');
const normalTexture = new THREE.TextureLoader().load('assets1/normal.jpg');
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalTexture })
);
moon.position.set(-10, 0, 30);
scene.add(moon);

// Scroll Animation
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    moon.rotation.x += 0.05;
    moon.rotation.y += 0.075;
    moon.rotation.z += 0.05;

    jeff.rotation.y += 0.01;
    jeff.rotation.z += 0.01;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
}
document.body.onscroll = moveCamera;

const imgSrc = 'assets1/rocket.png'; // Replace with your actual image path
const rocket = document.createElement('img');
rocket.src = imgSrc;
rocket.style.position = 'fixed';
rocket.style.width = '100px'; // Increased size
rocket.style.height = 'auto';
rocket.style.willChange = 'transform';
document.body.appendChild(rocket);

const speed = 0.5; // Reduced speed for slower movement
let xPos = Math.random() * window.innerWidth;
let yPos = Math.random() * window.innerHeight;
let angle = Math.random() * 2 * Math.PI; // Use angle for direction

function moveRocket() {
    xPos += speed * Math.cos(angle);
    yPos += speed * Math.sin(angle);

    // Change direction randomly
    if (xPos <= 0 || xPos >= window.innerWidth - rocket.offsetWidth || Math.random() < 0.01) {
        angle = Math.PI - angle + Math.random() - 0.5;
    }
    if (yPos <= 0 || yPos >= window.innerHeight - rocket.offsetHeight || Math.random() < 0.01) {
        angle = -angle + Math.random() - 0.5;
    }

    // Flip image based on direction
    rocket.style.transform = `translate(-50%, -50%) rotate(${angle}rad) scaleX(${Math.cos(angle) >= 0 ? 1 : -1})`;

    // Update rocket position
    rocket.style.left = `${xPos}px`;
    rocket.style.top = `${yPos}px`;

    requestAnimationFrame(moveRocket);
}

moveRocket();




// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    scene.traverse(function (object) {
        if (object instanceof THREE.Mesh && object !== jeff && object !== moon) {
            object.rotation.x += 0.01;
            object.rotation.y += 0.01;
        }
    });
    renderer.render(scene, camera);
}
animate();




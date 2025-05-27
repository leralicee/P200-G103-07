class Display {
}

/********************************* 
 * BACKGROUND
**********************************/ 

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('glCanvas'), alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);

// geometría del grid
const gridGeometry = new THREE.BufferGeometry();
const positions = [];
const colors = [];

for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 40 - 20;
    const y = Math.random() * 40 - 20;
    const z = Math.random() * 40 - 20;

    positions.push(x, y, z);
    colors.push(
        Math.random() * 0.5 + 0.5,
        Math.random() * 0.3,
        Math.random() * 0.5 + 0.5
    );
}

gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
gridGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

const gridMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.7
});

const grid = new THREE.Points(gridGeometry, gridMaterial);
scene.add(grid);

camera.position.z = 30;

// reactivitat a l'àudio
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const audioElement = document.getElementById('backgroundMusic');
const source = audioContext.createMediaElementSource(audioElement);

source.connect(analyser);
analyser.connect(audioContext.destination);
const frequencyData = new Uint8Array(analyser.frequencyBinCount);

// bucle d'animació
function animate() {
    requestAnimationFrame(animate);

    analyser.getByteFrequencyData(frequencyData);

    const positions = gridGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        positions[i] += (Math.random() - 0.5) * 0.1 * (frequencyData[i % 1024] / 255);
        positions[i + 1] += (Math.random() - 0.5) * 0.1 * (frequencyData[(i + 1) % 1024] / 255);
        positions[i + 2] += (Math.random() - 0.5) * 0.1 * (frequencyData[(i + 2) % 1024] / 255);
    }

    gridGeometry.attributes.position.needsUpdate = true;
    grid.rotation.x += 0.001;
    grid.rotation.y += 0.001;

    renderer.render(scene, camera);
}
animate();
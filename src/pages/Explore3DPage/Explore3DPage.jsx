import { useState, useEffect, useRef, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Text, Stars, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { categories } from '../../data/mockData';
import Loader from '../../components/Loader/Loader';
import './Explore3DPage.css';

/* ─────────────────────────────────────────────
   3D Scene Components
   ───────────────────────────────────────────── */

/** Rotating wireframe globe in the center */
const Globe = () => {
    const meshRef = useRef();
    const wireRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.y = t * 0.15;
            meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
        }
        if (wireRef.current) {
            wireRef.current.rotation.y = -t * 0.1;
            wireRef.current.rotation.z = t * 0.05;
        }
    });

    return (
        <group>
            {/* Inner glowing sphere */}
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[1.8, 1]} />
                <MeshDistortMaterial
                    color="#6366f1"
                    emissive="#6366f1"
                    emissiveIntensity={0.3}
                    transparent
                    opacity={0.15}
                    distort={0.2}
                    speed={2}
                    wireframe={false}
                />
            </mesh>
            {/* Outer wireframe */}
            <mesh ref={wireRef}>
                <icosahedronGeometry args={[2.2, 2]} />
                <meshBasicMaterial
                    color="#818cf8"
                    wireframe
                    transparent
                    opacity={0.25}
                />
            </mesh>
            {/* Glow ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.5, 0.02, 16, 100]} />
                <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} />
            </mesh>
            <mesh rotation={[Math.PI / 2.5, 0.3, 0]}>
                <torusGeometry args={[2.8, 0.015, 16, 100]} />
                <meshBasicMaterial color="#8b5cf6" transparent opacity={0.25} />
            </mesh>
        </group>
    );
};

/** A single floating category card in 3D space */
const CategoryCard = ({ category, index, total, onClick }) => {
    const meshRef = useRef();
    const angle = (index / total) * Math.PI * 2;
    const radius = 4.2;
    const yOffset = Math.sin(index * 1.5) * 0.8;

    // Category color mapping
    const colorMap = {
        technology: '#6366f1',
        business: '#22c55e',
        health: '#ef4444',
        science: '#06b6d4',
        sports: '#f59e0b',
        entertainment: '#ec4899',
    };
    const color = colorMap[category.id] || '#6366f1';

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            const currentAngle = angle + t * 0.2;
            meshRef.current.position.x = Math.cos(currentAngle) * radius;
            meshRef.current.position.z = Math.sin(currentAngle) * radius;
            meshRef.current.position.y = yOffset + Math.sin(t * 0.8 + index) * 0.3;
            // Always face camera direction
            meshRef.current.lookAt(0, meshRef.current.position.y, 0);
            meshRef.current.rotateY(Math.PI);
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3}>
            <group ref={meshRef} onClick={onClick}>
                {/* Card background */}
                <mesh>
                    <planeGeometry args={[1.6, 0.9]} />
                    <meshPhysicalMaterial
                        color={color}
                        transparent
                        opacity={0.12}
                        roughness={0.1}
                        metalness={0.8}
                        side={THREE.DoubleSide}
                    />
                </mesh>
                {/* Card border */}
                <mesh position={[0, 0, -0.001]}>
                    <planeGeometry args={[1.65, 0.95]} />
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={0.3}
                        side={THREE.DoubleSide}
                    />
                </mesh>
                {/* Category icon */}
                <Text
                    position={[0, 0.12, 0.01]}
                    fontSize={0.25}
                    anchorX="center"
                    anchorY="middle"
                >
                    {category.icon}
                </Text>
                {/* Category name */}
                <Text
                    position={[0, -0.18, 0.01]}
                    fontSize={0.12}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                    font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
                >
                    {category.name}
                </Text>
            </group>
        </Float>
    );
};

/** Floating particles around the scene */
const FloatingParticles = () => {
    const ref = useRef();
    const count = 60;
    const positions = useRef(
        new Float32Array(
            Array.from({ length: count * 3 }, () => (Math.random() - 0.5) * 15)
        )
    );

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (ref.current) {
            ref.current.rotation.y = t * 0.02;
            ref.current.rotation.x = Math.sin(t * 0.05) * 0.1;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions.current}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#818cf8"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
};

/** Complete 3D scene */
const Scene3D = ({ onCategoryClick }) => {
    const navCategories = categories.filter((c) => c.id !== 'all');

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#6366f1" />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#06b6d4" />
            <pointLight position={[0, 5, -10]} intensity={0.3} color="#8b5cf6" />

            {/* Stars background */}
            <Stars
                radius={50}
                depth={50}
                count={2500}
                factor={4}
                saturation={0}
                fade
                speed={1}
            />

            {/* Central globe */}
            <Globe />

            {/* Orbiting category cards */}
            {navCategories.map((cat, i) => (
                <CategoryCard
                    key={cat.id}
                    category={cat}
                    index={i}
                    total={navCategories.length}
                    onClick={() => onCategoryClick(cat.id)}
                />
            ))}

            {/* Floating particles */}
            <FloatingParticles />

            {/* Camera controls */}
            <OrbitControls
                enablePan={false}
                enableZoom={true}
                minDistance={5}
                maxDistance={15}
                autoRotate
                autoRotateSpeed={0.3}
                makeDefault
            />
        </>
    );
};

/* ─────────────────────────────────────────────
   Feature data
   ───────────────────────────────────────────── */
const features = [
    {
        icon: '🌐',
        title: 'Global Coverage',
        description: 'Access breaking news from every corner of the world in real-time.',
        gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    },
    {
        icon: '⚡',
        title: 'Real-Time Updates',
        description: 'Stay ahead with instant notifications and live news feeds.',
        gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)',
    },
    {
        icon: '🔖',
        title: 'Smart Bookmarks',
        description: 'Save articles and organize your reading list effortlessly.',
        gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    },
    {
        icon: '🎨',
        title: 'Personalized Themes',
        description: 'Customize your reading experience with dark and light modes.',
        gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
    },
    {
        icon: '📊',
        title: 'Trending Analytics',
        description: 'Discover what\'s trending with smart analytics and insights.',
        gradient: 'linear-gradient(135deg, #22c55e, #4ade80)',
    },
    {
        icon: '🔍',
        title: 'Smart Search',
        description: 'Find exactly what you need with our intelligent search engine.',
        gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
    },
];

/* ─────────────────────────────────────────────
   Main Page Component
   ───────────────────────────────────────────── */
const Explore3DPage = () => {
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 200);
        return () => clearTimeout(timer);
    }, []);

    const handleCategoryClick = (categoryId) => {
        navigate(`/category/${categoryId}`);
    };

    return (
        <div className={`explore-3d-page ${loaded ? 'explore-loaded' : ''}`}>
            {/* ── Hero Section ── */}
            <section className="explore-hero">
                <div className="explore-hero-bg">
                    <div className="explore-glow explore-glow-1"></div>
                    <div className="explore-glow explore-glow-2"></div>
                    <div className="explore-glow explore-glow-3"></div>
                </div>
                <div className="container explore-hero-content">
                    <span className="explore-badge">🌐 Interactive Experience</span>
                    <h1 className="explore-title">
                        Explore News in
                        <span className="explore-gradient-text"> 3D Space</span>
                    </h1>
                    <p className="explore-subtitle">
                        Immerse yourself in a new way of discovering news.
                        Interact with the globe, click categories, and explore the future of reading.
                    </p>
                </div>
            </section>

            {/* ── 3D Canvas Section ── */}
            <section className="explore-canvas-section">
                <div className="canvas-wrapper">
                    <Suspense fallback={<Loader message="Loading 3D scene..." />}>
                        <Canvas
                            camera={{ position: [0, 2, 8], fov: 60 }}
                            style={{ background: 'transparent' }}
                            dpr={[1, 2]}
                        >
                            <Scene3D onCategoryClick={handleCategoryClick} />
                        </Canvas>
                    </Suspense>
                    <div className="canvas-overlay-hint">
                        <span>🖱️ Drag to rotate • Scroll to zoom • Click a card to explore</span>
                    </div>
                </div>
            </section>

            {/* ── Category Quick Links ── */}
            <section className="explore-categories container">
                <div className="section-header">
                    <h2>🚀 Quick Explore</h2>
                    <p className="section-subtitle">Jump into any category instantly</p>
                </div>
                <div className="explore-category-grid">
                    {categories.filter((c) => c.id !== 'all').map((cat) => (
                        <Link
                            key={cat.id}
                            to={`/category/${cat.id}`}
                            className="explore-category-card"
                        >
                            <span className="explore-cat-icon">{cat.icon}</span>
                            <span className="explore-cat-name">{cat.name}</span>
                            <span className="explore-cat-arrow">→</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Features Section ── */}
            <section className="explore-features container">
                <div className="section-header">
                    <h2>✨ Platform Features</h2>
                    <p className="section-subtitle">
                        Everything you need for a premium news experience
                    </p>
                </div>
                <div className="features-grid">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className="feature-card"
                            style={{ '--feature-delay': `${i * 0.1}s` }}
                        >
                            <div
                                className="feature-icon-wrapper"
                                style={{ background: feature.gradient }}
                            >
                                <span className="feature-icon">{feature.icon}</span>
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section className="explore-cta">
                <div className="container explore-cta-content">
                    <h2>Ready to dive in?</h2>
                    <p>Start reading the latest news from around the world</p>
                    <Link to="/" className="explore-cta-btn">
                        📰 Go to News Feed
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Explore3DPage;

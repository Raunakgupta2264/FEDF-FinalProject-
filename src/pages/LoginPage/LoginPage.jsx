import { useState, useRef, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

/* ═══════════════════════════════════════
   3D Background Scene Components
   ═══════════════════════════════════════ */

// Central glowing torus knot — larger for full-screen presence
const GlowingKnot = () => {
    const meshRef = useRef();

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.3;
            meshRef.current.rotation.y = clock.elapsedTime * 0.35;
        }
    });

    return (
        <Float speed={1.2} rotationIntensity={0.3} floatIntensity={1}>
            <mesh ref={meshRef} position={[-3, 0, -2]}>
                <torusKnotGeometry args={[1.8, 0.5, 200, 40]} />
                <MeshDistortMaterial
                    color="#6366f1"
                    emissive="#4f46e5"
                    emissiveIntensity={0.5}
                    roughness={0.15}
                    metalness={0.85}
                    distort={0.3}
                    speed={2}
                    transparent
                    opacity={0.85}
                />
            </mesh>
        </Float>
    );
};

// Orbiting rings — spread across the scene
const OrbitRing = ({ radius, speed, tilt, color, position = [0, 0, 0] }) => {
    const ringRef = useRef();

    useFrame(({ clock }) => {
        if (ringRef.current) {
            ringRef.current.rotation.z = clock.elapsedTime * speed;
        }
    });

    return (
        <group rotation={tilt} position={position}>
            <mesh ref={ringRef}>
                <torusGeometry args={[radius, 0.02, 16, 120]} />
                <meshBasicMaterial color={color} transparent opacity={0.3} />
            </mesh>
        </group>
    );
};

// Floating particles across the entire scene
const SceneParticles = ({ count = 150 }) => {
    const pointsRef = useRef();

    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const radii = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = 2 + Math.random() * 6;
        positions[i * 3] = Math.cos(angle) * r;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
        positions[i * 3 + 2] = Math.sin(angle) * r - 3;
        speeds[i] = 0.05 + Math.random() * 0.3;
        radii[i] = r;
    }

    useFrame(({ clock }) => {
        if (!pointsRef.current) return;
        const posArray = pointsRef.current.geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
            const t = clock.elapsedTime * speeds[i];
            const r = radii[i];
            posArray[i * 3] = Math.cos(t + i) * r;
            posArray[i * 3 + 2] = Math.sin(t + i) * r - 3;
            posArray[i * 3 + 1] += Math.sin(clock.elapsedTime * 0.3 + i) * 0.002;
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#a78bfa"
                transparent
                opacity={0.7}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

// Floating gemstones scattered around
const FloatingGem = ({ position, color, scale = 1 }) => {
    const ref = useRef();

    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.rotation.x = clock.elapsedTime * 0.5;
            ref.current.rotation.y = clock.elapsedTime * 0.7;
            ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.8 + position[0]) * 0.4;
        }
    });

    return (
        <mesh ref={ref} position={position} scale={scale}>
            <octahedronGeometry args={[0.3, 0]} />
            <MeshWobbleMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.4}
                metalness={0.9}
                roughness={0.1}
                factor={0.3}
                speed={2}
            />
        </mesh>
    );
};

// Glowing sphere accent
const GlowSphere = ({ position, color, size = 0.5 }) => {
    const ref = useRef();

    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.6 + position[0]) * 0.5;
            ref.current.scale.setScalar(size + Math.sin(clock.elapsedTime * 1.2) * 0.05);
        }
    });

    return (
        <mesh ref={ref} position={position}>
            <sphereGeometry args={[size, 32, 32]} />
            <MeshDistortMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.6}
                transparent
                opacity={0.3}
                distort={0.4}
                speed={3}
            />
        </mesh>
    );
};

// Full background scene
const LoginBgScene = () => {
    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight position={[8, 5, 5]} intensity={1.2} color="#6366f1" />
            <pointLight position={[-8, -3, 3]} intensity={0.8} color="#06b6d4" />
            <pointLight position={[0, 5, -8]} intensity={0.5} color="#ec4899" />
            <pointLight position={[5, -5, 5]} intensity={0.4} color="#8b5cf6" />

            <GlowingKnot />

            {/* Rings scattered across the scene */}
            <OrbitRing radius={3} speed={0.25} tilt={[0.5, 0, 0]} color="#6366f1" position={[-3, 0, -2]} />
            <OrbitRing radius={4} speed={-0.15} tilt={[1.2, 0.3, 0]} color="#06b6d4" position={[-3, 0, -2]} />
            <OrbitRing radius={5} speed={0.1} tilt={[0.8, -0.5, 0.3]} color="#8b5cf6" position={[-3, 0, -2]} />

            {/* Extra ring on the right side */}
            <OrbitRing radius={2} speed={0.3} tilt={[0.3, 0.8, 0]} color="#ec4899" position={[4, 1, -4]} />

            <SceneParticles count={200} />

            {/* Gemstones scattered wide */}
            <FloatingGem position={[4, 2, -3]} color="#06b6d4" scale={0.9} />
            <FloatingGem position={[-5, -1, -1]} color="#ec4899" scale={0.7} />
            <FloatingGem position={[3, -2, 1]} color="#6366f1" scale={0.8} />
            <FloatingGem position={[-2, 3, -4]} color="#f59e0b" scale={0.6} />
            <FloatingGem position={[6, 0, -5]} color="#10b981" scale={0.5} />
            <FloatingGem position={[-6, -2, -3]} color="#8b5cf6" scale={0.65} />

            {/* Glowing spheres for depth */}
            <GlowSphere position={[5, -1, -6]} color="#6366f1" size={0.8} />
            <GlowSphere position={[-4, 2, -5]} color="#06b6d4" size={0.6} />
            <GlowSphere position={[2, 3, -7]} color="#ec4899" size={0.5} />

            <Stars radius={50} depth={80} count={2500} factor={4} saturation={0.5} fade speed={0.8} />
        </>
    );
};

/* ═══════════════════════════════════════
   Login Page Component
   ═══════════════════════════════════════ */

const LoginPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    if (isLoggedIn) {
        navigate('/', { replace: true });
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (isRegister && !formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Must be at least 6 characters';
        if (isRegister && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1200));
        login({ name: formData.name, email: formData.email });
        setLoading(false);
        navigate('/');
    };

    const toggleMode = () => {
        setIsRegister(!isRegister);
        setErrors({});
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    };

    return (
        <div className="login-page">
            {/* Full-screen 3D background */}
            <div className="login-3d-bg">
                <Suspense fallback={null}>
                    <Canvas
                        camera={{ position: [0, 0, 8], fov: 55 }}
                        dpr={[1, 1.5]}
                        gl={{ alpha: true, antialias: true }}
                    >
                        <LoginBgScene />
                    </Canvas>
                </Suspense>
                <div className="login-3d-overlay"></div>
            </div>

            {/* Content overlay */}
            <div className="login-content">
                {/* Logo */}
                <Link to="/" className="login-logo">
                    <span className="login-logo-icon">⚡</span>
                    <span className="login-logo-text">NewsRead</span>
                </Link>

                <div className="login-layout">
                    {/* Left — hero text */}
                    <div className="login-branding">
                        <h1 className="login-hero-title">
                            {isRegister ? 'Join the' : 'Welcome back to'}
                            <span className="login-gradient-text"> future of news</span>
                        </h1>
                        <p className="login-hero-subtitle">
                            {isRegister
                                ? 'Create your account and start your personalized news journey today.'
                                : 'Sign in to access your bookmarks, preferences, and personalized feed.'}
                        </p>

                        <div className="login-features">
                            <div className="login-feature">
                                <span className="login-feature-icon">🌐</span>
                                <div>
                                    <strong>Global Coverage</strong>
                                    <p>News from 50+ countries</p>
                                </div>
                            </div>
                            <div className="login-feature">
                                <span className="login-feature-icon">🔖</span>
                                <div>
                                    <strong>Smart Bookmarks</strong>
                                    <p>Save & organize articles</p>
                                </div>
                            </div>
                            <div className="login-feature">
                                <span className="login-feature-icon">🎨</span>
                                <div>
                                    <strong>Dark & Light Mode</strong>
                                    <p>Read your way</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right — form card */}
                    <div className="login-form-wrapper">
                        <div className="login-card">
                            <div className="login-card-header">
                                <h2>{isRegister ? 'Create Account' : 'Sign In'}</h2>
                                <p>
                                    {isRegister
                                        ? 'Fill in your details to get started'
                                        : 'Enter your credentials to continue'}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="login-form" noValidate>
                                {isRegister && (
                                    <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                                        <label htmlFor="name">
                                            <span className="field-icon">👤</span> Full Name
                                        </label>
                                        <input
                                            type="text" id="name" name="name"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            autoComplete="name"
                                        />
                                        {errors.name && <span className="field-error">{errors.name}</span>}
                                    </div>
                                )}

                                <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                                    <label htmlFor="email">
                                        <span className="field-icon">📧</span> Email Address
                                    </label>
                                    <input
                                        type="email" id="email" name="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                    />
                                    {errors.email && <span className="field-error">{errors.email}</span>}
                                </div>

                                <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                                    <label htmlFor="password">
                                        <span className="field-icon">🔒</span> Password
                                    </label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password" name="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            autoComplete={isRegister ? 'new-password' : 'current-password'}
                                        />
                                        <button
                                            type="button" className="password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? '🙈' : '👁️'}
                                        </button>
                                    </div>
                                    {errors.password && <span className="field-error">{errors.password}</span>}
                                </div>

                                {isRegister && (
                                    <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
                                        <label htmlFor="confirmPassword">
                                            <span className="field-icon">🔒</span> Confirm Password
                                        </label>
                                        <input
                                            type="password" id="confirmPassword" name="confirmPassword"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            autoComplete="new-password"
                                        />
                                        {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                                    </div>
                                )}

                                {!isRegister && (
                                    <div className="form-options">
                                        <label className="remember-me">
                                            <input type="checkbox" />
                                            <span>Remember me</span>
                                        </label>
                                        <button type="button" className="forgot-password">Forgot password?</button>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className={`login-submit-btn ${loading ? 'loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? <span className="btn-loader"></span> : (isRegister ? '🚀 Create Account' : '⚡ Sign In')}
                                </button>
                            </form>

                            <div className="login-divider"><span>or continue with</span></div>

                            <div className="social-login">
                                <button className="social-btn google-btn" type="button">
                                    <svg width="18" height="18" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Google
                                </button>
                                <button className="social-btn github-btn" type="button">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                    GitHub
                                </button>
                            </div>

                            <div className="login-footer">
                                <p>
                                    {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                                    <button type="button" className="toggle-mode-btn" onClick={toggleMode}>
                                        {isRegister ? 'Sign In' : 'Create Account'}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

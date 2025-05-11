// Three.js Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#hero-canvas'),
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Particle color variables
let darkParticleColor = '#6C63FF';
let lightParticleColor = '#FFD600';

// Create animated particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Create particle material (start with dark mode color)
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: darkParticleColor,
    transparent: true,
    opacity: 0.8
});

// Create particle system
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Position camera
camera.position.z = 2;

// Track mouse position
let mouse = { x: 0, y: 0, radius: 0.5 }; // radius controls the area of effect

window.addEventListener('mousemove', (event) => {
    // Normalize mouse position to -1 to 1 for both axes
    mouse.x = ((event.clientX / window.innerWidth) * 2 - 1) * 2.5; // scale to match particle space
    mouse.y = -((event.clientY / window.innerHeight) * 2 - 1) * 2.5;
});

// Animation
function animate() {
    requestAnimationFrame(animate);

    // Get positions array
    const positions = particlesGeometry.attributes.position.array;

    for (let i = 0; i < particlesCount; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        // Calculate distance from mouse
        const dx = positions[ix] - mouse.x;
        const dy = positions[iy] - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // If within radius, push particle away
        if (dist < mouse.radius) {
            const force = (mouse.radius - dist) * 0.03;
            positions[ix] += dx / dist * force;
            positions[iy] += dy / dist * force;
        } else {
            // Slowly return to original position (optional, for a "spring" effect)
            positions[ix] += (posArray[ix] - positions[ix]) * 0.01;
            positions[iy] += (posArray[iy] - positions[iy]) * 0.01;
        }
    }

    particlesGeometry.attributes.position.needsUpdate = true;

    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.001;

    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- THEME PARTICLE COLOR SWITCHING ---
function setParticlesColorForTheme() {
    if (document.body.classList.contains('light-mode')) {
        particlesMaterial.color.set(lightParticleColor);
    } else {
        particlesMaterial.color.set(darkParticleColor);
    }
}

// Listen for theme changes
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        setTimeout(setParticlesColorForTheme, 10); // Wait for class toggle
    });
}

// Also set on page load
document.addEventListener('DOMContentLoaded', () => {
    setParticlesColorForTheme();
});

// Loading screen handler
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    
    // Fade out loading screen
    gsap.to(loadingScreen, {
        opacity: 0,
        duration: 1,
        onComplete: () => {
            loadingScreen.style.display = 'none';
            // Start animation after loading screen is gone
            animate();
        }
    });
});

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    
    // Add click event to each link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section id
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Close mobile menu if open
            const menuBtn = document.querySelector('.menu-btn');
            const navLinks = document.querySelector('.nav-links');
            if (menuBtn && navLinks) {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
            
            // Scroll to the target section
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active link highlighting
    function updateActiveLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Update active link on scroll
    window.addEventListener('scroll', updateActiveLink);
    
    // Initial check for active link
    updateActiveLink();

    // Mobile menu toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');

    if (menuBtn && navLinksContainer) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                navLinksContainer.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize typing animation
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const text = typingText.textContent;
        typingText.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                typingText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }

        // Start typing animation after a delay
        setTimeout(typeWriter, 1000);
    }

    // Quote functionality
    const quotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Innovation distinguishes between a leader and a follower. - Steve Jobs",
        "Stay hungry, stay foolish. - Steve Jobs",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
        "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
        "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
        "The way to get started is to quit talking and begin doing. - Walt Disney",
        "It does not matter how slowly you go as long as you do not stop. - Confucius",
        "Everything you've ever wanted is on the other side of fear. - George Addair"
    ];

    function getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }

    function updateQuote() {
        const quoteElement = document.querySelector('.daily-quote');
        if (quoteElement) {
            const newQuote = getRandomQuote();
            
            // Simple fade effect
            quoteElement.style.opacity = '0';
            setTimeout(() => {
                quoteElement.textContent = newQuote;
                quoteElement.style.opacity = '1';
            }, 500);
        }
    }

    // Update quote when page loads
    updateQuote();

    // Update quote every 24 hours
    setInterval(updateQuote, 24 * 60 * 60 * 1000);

    // Optional: Update quote on click
    const quoteElement = document.querySelector('.daily-quote');
    if (quoteElement) {
        quoteElement.addEventListener('click', updateQuote);
    }

    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    const scrollTop = document.createElement('div');
    scrollTop.classList.add('scroll-top');
    scrollTop.innerHTML = '↑';
    document.body.appendChild(scrollTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTop.classList.add('visible');
        } else {
            scrollTop.classList.remove('visible');
        }
    });

    scrollTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.querySelectorAll('.experience-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    document.querySelectorAll('.magnetic-button').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = x - centerX;
            const deltaY = y - centerY;
            
            button.style.transform = `translate(${deltaX * 0.3}px, ${deltaY * 0.3}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });

    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    // Load theme from localStorage
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            if (body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.setItem('theme', 'dark');
            }
        });
    }
});


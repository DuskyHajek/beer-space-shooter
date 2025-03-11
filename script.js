// DOM Elements
const cursorFollower = document.querySelector('.cursor-follower');
const navToggle = document.querySelector('.nav-toggle');
const fullscreenMenu = document.querySelector('.fullscreen-menu');
const menuItems = document.querySelectorAll('.menu-item');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const ctaButton = document.querySelector('.cta-button');
const projectCards = document.querySelectorAll('.project-card');
const projectModal = document.querySelector('.project-modal');
const modalClose = document.querySelector('.modal-close');
const modalBody = document.querySelector('.modal-body');
const contactForm = document.getElementById('contact-form');
const navLogo = document.querySelector('.nav-logo');
const timelineEvents = document.querySelector('.timeline-events');
const scrollIndicator = document.querySelector('.scroll-indicator');

// Particles canvases
const particleCanvases = {
    hero: document.getElementById('particles'),
    about: document.getElementById('particles-about'),
    portfolio: document.getElementById('particles-portfolio'),
    timeline: document.getElementById('particles-timeline'),
    contact: document.getElementById('particles-contact')
};

// Particle settings for each canvas
const particleSettings = {
    hero: {
        colors: ['rgba(0, 255, 255, 0.7)', 'rgba(255, 0, 255, 0.5)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 204, 0, 0.5)'],
        count: 100,
        speed: 1,
        size: { min: 1, max: 5 },
        connectionDistance: 150,
        pattern: 'random'
    },
    about: {
        colors: ['rgba(255, 0, 255, 0.7)', 'rgba(153, 102, 255, 0.5)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 204, 0, 0.5)'],
        count: 80,
        speed: 0.7,
        size: { min: 1, max: 4 },
        connectionDistance: 120,
        pattern: 'grid'
    },
    portfolio: {
        colors: ['rgba(0, 255, 153, 0.7)', 'rgba(0, 204, 255, 0.5)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 204, 0, 0.5)'],
        count: 60,
        speed: 0.5,
        size: { min: 2, max: 6 },
        connectionDistance: 180,
        pattern: 'dots'
    },
    timeline: {
        colors: ['rgba(0, 255, 255, 0.7)', 'rgba(153, 102, 255, 0.5)', 'rgba(255, 255, 255, 0.3)', 'rgba(255, 204, 0, 0.5)'],
        count: 70,
        speed: 0.6,
        size: { min: 1, max: 4 },
        connectionDistance: 140,
        pattern: 'wave'
    },
    contact: {
        colors: ['rgba(255, 204, 0, 0.7)', 'rgba(255, 102, 0, 0.5)', 'rgba(255, 255, 255, 0.3)', 'rgba(0, 255, 255, 0.5)'],
        count: 70,
        speed: 0.6,
        size: { min: 1, max: 5 },
        connectionDistance: 130,
        pattern: 'wave'
    }
};

// Timeline data
const timelineData = [
    {
        year: '1840s',
        title: 'Ada Lovelace\'s Algorithm',
        description: 'Lovelace writes the first algorithm for Babbage\'s Analytical Engine, foundational for computing and AI.'
    },
    {
        year: '1936',
        title: 'Turing Machine Introduced',
        description: 'Alan Turing\'s theoretical machine lays the groundwork for modern computing and AI concepts.'
    },
    {
        year: '1943',
        title: 'Neural Network Model',
        description: 'McCulloch and Pitts propose a computational model mimicking brain neurons, inspiring machine learning.'
    },
    {
        year: '1950',
        title: 'Turing Test Proposed',
        description: 'Turing\'s test challenges machines to exhibit human-like intelligence, shaping AI goals.'
    },
    {
        year: '1956',
        title: 'Dartmouth Conference',
        description: 'John McCarthy coins "artificial intelligence," launching AI as a formal research field.'
    },
    {
        year: '1957',
        title: 'Perceptron Developed',
        description: 'Frank Rosenblatt\'s Perceptron, an early neural network, demonstrates learning from data.'
    },
    {
        year: '1957',
        title: 'Illiac Suite Composed',
        description: 'First AI-generated music by Hiller and Isaacson blends computation with creativity.'
    },
    {
        year: '1958',
        title: 'Lisp Language Created',
        description: 'McCarthy\'s Lisp becomes a key programming language for symbolic AI research.'
    },
    {
        year: '1959',
        title: 'Machine Learning Term',
        description: 'Arthur Samuel defines "machine learning" with his self-improving checkers program.'
    },
    {
        year: '1965',
        title: 'ELIZA Chatbot Debuts',
        description: 'Weizenbaum\'s ELIZA simulates a therapist, sparking debates on AI-human interaction.'
    },
    {
        year: '1972',
        title: 'AARON Creates Art',
        description: 'Harold Cohen\'s AARON generates original artwork, pioneering AI in creative fields.'
    },
    {
        year: '1979',
        title: 'BKG 9.8 Wins',
        description: 'Backgammon AI defeats world champion, an early strategic victory for AI.'
    },
    {
        year: '1980s',
        title: 'AI Winter Begins',
        description: 'Funding drops as AI fails to meet overhyped expectations, slowing progress.'
    },
    {
        year: '1997',
        title: 'Deep Blue Triumphs',
        description: 'IBM\'s Deep Blue beats chess champion Kasparov, showcasing AI\'s strategic depth.'
    },
    {
        year: '2011',
        title: 'Watson Wins Jeopardy!',
        description: 'IBM\'s Watson excels in natural language, defeating human champions on TV.'
    },
    {
        year: '2012',
        title: 'ImageNet Breakthrough',
        description: 'Deep learning revolutionizes image recognition, boosting modern AI applications.'
    },
    {
        year: '2015',
        title: 'AlphaGo Defeats Sedol',
        description: 'Google DeepMind\'s AlphaGo beats Go champion, mastering a complex game.'
    },
    {
        year: '2017',
        title: 'Libratus Beats Poker',
        description: 'AI triumphs in poker, excelling in games with incomplete information.'
    },
    {
        year: '2022',
        title: 'ChatGPT Released',
        description: 'OpenAI\'s ChatGPT transforms communication with advanced language generation.'
    },
    {
        year: '2023',
        title: 'AI Ethics Debates',
        description: 'Growing focus on AI\'s societal impact, ethics, and regulation intensifies globally.'
    }
];

// Global variables
let isTransitioning = false;
let currentSection = 'hero';
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

// Create section indicators dynamically
const createSectionIndicators = () => {
    const sectionIndicator = document.createElement('div');
    sectionIndicator.className = 'section-indicator';
    
    const sectionIds = ['hero', 'about', 'portfolio', 'timeline', 'contact'];
    
    sectionIds.forEach(id => {
        const dot = document.createElement('div');
        dot.className = 'indicator-dot';
        dot.setAttribute('data-section', id);
        
        dot.addEventListener('click', () => {
            navigateToSection(id);
        });
        
        sectionIndicator.appendChild(dot);
    });
    
    document.body.appendChild(sectionIndicator);
    
    // Set the first dot as active
    updateSectionIndicator('hero');
};

// Update section indicator
const updateSectionIndicator = (sectionId) => {
    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-section') === sectionId) {
            dot.classList.add('active');
        }
    });
};

// Create page transition element
const createPageTransition = () => {
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    document.body.appendChild(transition);
    return transition;
};

// Particle class for all canvases
class Particle {
    constructor(canvas, settings, isFixed = false) {
        this.canvas = canvas;
        this.settings = settings;
        
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * (settings.size.max - settings.size.min) + settings.size.min;
        this.baseSize = this.size;
        this.speedX = (Math.random() * 2 - 1) * settings.speed;
        this.speedY = (Math.random() * 2 - 1) * settings.speed;
        this.color = settings.colors[Math.floor(Math.random() * settings.colors.length)];
        this.opacity = Math.random() * 0.5 + 0.5;
        this.blinkRate = Math.random() * 0.02;
        this.blinkDirection = Math.random() > 0.5 ? 1 : -1;
        this.isFixed = isFixed;
        
        // For fixed particles (constellation effect)
        if (isFixed) {
            this.speedX = 0;
            this.speedY = 0;
            this.connections = [];
        }
        
        // For grid pattern
        if (settings.pattern === 'grid') {
            // Place particles in a grid pattern
            if (isFixed) {
                const gridSize = Math.sqrt(settings.count);
                const cellWidth = canvas.width / gridSize;
                const cellHeight = canvas.height / gridSize;
                
                const gridX = Math.floor(Math.random() * gridSize);
                const gridY = Math.floor(Math.random() * gridSize);
                
                this.x = (gridX + 0.5) * cellWidth + (Math.random() * 20 - 10);
                this.y = (gridY + 0.5) * cellHeight + (Math.random() * 20 - 10);
            }
        }
        
        // For wave pattern
        if (settings.pattern === 'wave') {
            this.waveAmplitude = Math.random() * 20 + 10;
            this.waveFrequency = Math.random() * 0.02 + 0.01;
            this.waveOffset = Math.random() * Math.PI * 2;
            this.originY = this.y;
        }
        
        // For dots pattern (circular arrangement)
        if (settings.pattern === 'dots' && isFixed) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * (canvas.width / 3) + 50;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            this.x = centerX + Math.cos(angle) * radius;
            this.y = centerY + Math.sin(angle) * radius;
        }
    }

    update(mouseX, mouseY, mouseRadius) {
        // Mouse interaction
        if (!this.isFixed) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouseRadius) {
                const force = (mouseRadius - distance) / mouseRadius;
                const angle = Math.atan2(dy, dx);
                this.x -= Math.cos(angle) * force * 2;
                this.y -= Math.sin(angle) * force * 2;
                
                // Increase size when close to mouse
                this.size = this.baseSize + (force * 3);
            } else {
                // Return to base size
                this.size = this.baseSize;
            }
            
            // Regular movement
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Boundary check
            if (this.x < 0 || this.x > this.canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > this.canvas.height) this.speedY *= -1;
            
            // For wave pattern
            if (this.settings.pattern === 'wave') {
                this.y = this.originY + Math.sin(this.x * this.waveFrequency + this.waveOffset + Date.now() * 0.001) * this.waveAmplitude;
            }
        }
        
        // Blinking effect
        this.opacity += this.blinkRate * this.blinkDirection;
        if (this.opacity > 1 || this.opacity < 0.3) {
            this.blinkDirection *= -1;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace(')', `, ${this.opacity})`).replace('rgba', 'rgba');
        ctx.fill();
        
        // Glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        
        // Draw connections for fixed particles (constellation effect)
        if (this.isFixed && this.connections && this.connections.length > 0) {
            this.connections.forEach(connectedParticle => {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(connectedParticle.x, connectedParticle.y);
                ctx.strokeStyle = this.color.replace(')', ', 0.2)').replace('rgba', 'rgba');
                ctx.lineWidth = 0.5;
                ctx.stroke();
            });
        }
    }
}

// Create particles for each canvas
const particlesMap = new Map();

function initAllParticles() {
    // Initialize particles for each canvas
    Object.keys(particleCanvases).forEach(key => {
        const canvas = particleCanvases[key];
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const settings = particleSettings[key];
            const particles = [];
            
            // Add normal moving particles
            for (let i = 0; i < settings.count; i++) {
                particles.push(new Particle(canvas, settings));
            }
            
            // Add fixed particles for patterns
            if (['grid', 'dots'].includes(settings.pattern)) {
                const fixedParticleCount = Math.floor(settings.count * 0.4);
                const fixedParticles = [];
                
                for (let i = 0; i < fixedParticleCount; i++) {
                    fixedParticles.push(new Particle(canvas, settings, true));
                }
                
                // Create connections between fixed particles
                if (key !== 'portfolio') { // No connections for portfolio's dot pattern
                    fixedParticles.forEach(particle => {
                        // Connect to 1-3 other random fixed particles
                        const connectionCount = Math.floor(Math.random() * 3) + 1;
                        
                        for (let i = 0; i < connectionCount; i++) {
                            const randomParticle = fixedParticles[Math.floor(Math.random() * fixedParticleCount)];
                            if (randomParticle !== particle && !particle.connections.includes(randomParticle)) {
                                particle.connections.push(randomParticle);
                            }
                        }
                    });
                }
                
                particles.push(...fixedParticles);
            }
            
            particlesMap.set(key, particles);
        }
    });
}

function animateAllParticles() {
    Object.keys(particleCanvases).forEach(key => {
        const canvas = particleCanvases[key];
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.shadowBlur = 0; // Reset shadow for performance
            
            const particles = particlesMap.get(key);
            if (particles) {
                particles.forEach(particle => {
                    particle.update(mouseX, mouseY, 150);
                    particle.draw(ctx);
                });
            }
        }
    });
    
    requestAnimationFrame(animateAllParticles);
}

// Enhanced Custom Cursor
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Smooth cursor movement using requestAnimationFrame
    if (!cursorFollower.style.transform) {
        moveCursor(e.clientX, e.clientY);
    }
    
    // Add particles on mouse move on active section
    if (Math.random() > 0.9) {
        const activeSection = document.querySelector('section.active');
        if (activeSection) {
            const sectionId = activeSection.id;
            const particles = particlesMap.get(sectionId);
            const canvas = particleCanvases[sectionId];
            const settings = particleSettings[sectionId];
            
            if (particles && canvas && settings) {
                const particle = new Particle(canvas, settings);
                particle.x = e.clientX;
                particle.y = e.clientY;
                particles.push(particle);
                
                // Limit total particles for performance
                if (particles.length > settings.count * 1.5) {
                    particles.shift();
                }
            }
        }
    }
});

// Smoother cursor movement with animation frame
function moveCursor(targetX, targetY) {
    const currentX = parseFloat(cursorFollower.style.left) || targetX;
    const currentY = parseFloat(cursorFollower.style.top) || targetY;
    
    const dx = targetX - currentX;
    const dy = targetY - currentY;
    
    cursorFollower.style.left = `${currentX + dx * 0.3}px`;
    cursorFollower.style.top = `${currentY + dy * 0.3}px`;
    
    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        requestAnimationFrame(() => moveCursor(targetX, targetY));
    }
}

// Make elements "magnetic" to cursor
const magneticElements = document.querySelectorAll('.cta-button, .nav-logo, .project-card, .submit-btn, .social-link');

magneticElements.forEach(element => {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        
        const strength = 20; // Adjust for stronger/weaker effect
        const moveX = distanceX / strength;
        const moveY = distanceY / strength;
        
        element.style.transform = `translate3d(${moveX}px, ${moveY}px, 20px)`;
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.transform = '';
    });
});

// Mouse click effect
document.addEventListener('mousedown', () => {
    cursorFollower.classList.add('clicking');
    
    // Add ripple effect particles on active section
    const activeSection = document.querySelector('section.active');
    if (activeSection) {
        const sectionId = activeSection.id;
        const particles = particlesMap.get(sectionId);
        const canvas = particleCanvases[sectionId];
        const settings = particleSettings[sectionId];
        
        if (particles && canvas && settings) {
            for (let i = 0; i < 10; i++) {
                const particle = new Particle(canvas, settings);
                particle.x = mouseX;
                particle.y = mouseY;
                particles.push(particle);
            }
        }
    }
});

document.addEventListener('mouseup', () => {
    cursorFollower.classList.remove('clicking');
});

// Make cursor larger when hovering over interactive elements
document.addEventListener('mouseover', (e) => {
    if (
        e.target.classList.contains('menu-item') || 
        e.target.classList.contains('cta-button') || 
        e.target.classList.contains('project-card') ||
        e.target.classList.contains('social-link') ||
        e.target.tagName === 'BUTTON' ||
        e.target.tagName === 'A' ||
        e.target.classList.contains('nav-logo') ||
        e.target.classList.contains('indicator-dot')
    ) {
        cursorFollower.classList.add('active');
    }
});

document.addEventListener('mouseout', (e) => {
    if (
        e.target.classList.contains('menu-item') || 
        e.target.classList.contains('cta-button') || 
        e.target.classList.contains('project-card') ||
        e.target.classList.contains('social-link') ||
        e.target.tagName === 'BUTTON' ||
        e.target.tagName === 'A' ||
        e.target.classList.contains('nav-logo') ||
        e.target.classList.contains('indicator-dot')
    ) {
        cursorFollower.classList.remove('active');
    }
});

// Navigation toggle with improved animation
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    fullscreenMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Enhanced section transitions with animation effects
function navigateToSection(sectionId) {
    if (isTransitioning || currentSection === sectionId) return;
    isTransitioning = true;
    
    // Get direction of transition
    const sectionIds = ['hero', 'about', 'portfolio', 'timeline', 'contact'];
    const currentIndex = sectionIds.indexOf(currentSection);
    const targetIndex = sectionIds.indexOf(sectionId);
    const direction = targetIndex > currentIndex ? 'down' : 'up';
    
    // Get current and target sections
    const fromSection = document.getElementById(currentSection);
    const toSection = document.getElementById(sectionId);
    
    // Set animation classes based on direction
    if (direction === 'down') {
        fromSection.classList.add('slide-out-up');
        toSection.classList.add('slide-in-down');
    } else {
        fromSection.classList.add('slide-out-down');
        toSection.classList.add('slide-in-up');
    }
    
    // Make target section visible (but not active yet so animations work)
    toSection.style.visibility = 'visible';
    toSection.style.opacity = '1';
    
    // Wait for animations to complete
    setTimeout(() => {
        // Update section classes
        fromSection.classList.remove('active');
        fromSection.classList.remove('slide-out-up', 'slide-out-down');
        
        toSection.classList.add('active');
        toSection.classList.remove('slide-in-down', 'slide-in-up');
        
        // Reset visibility for transition animations
        fromSection.style.visibility = '';
        fromSection.style.opacity = '';
        
        // Update current section tracking
        currentSection = sectionId;
        
        // Update section indicator
        updateSectionIndicator(sectionId);
        
        // Update active nav link
        updateActiveNavLink(sectionId);
        
        // Update navigation progress
        updateNavProgress(sectionId);
        
        // Close menu if open
        navToggle.classList.remove('active');
        fullscreenMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Dispatch custom event for section change
        document.dispatchEvent(new CustomEvent('sectionChange', { 
            detail: { sectionId: sectionId } 
        }));
        
        // If timeline section, check if we need to initialize timeline
        if (sectionId === 'timeline') {
            animateTimelineEvents();
            
            // Ensure the timeline is scrollable from the start
            const timelineContainer = document.querySelector('.timeline-container');
            if (timelineContainer) {
                timelineContainer.scrollLeft = 0;
            }
        }
        
        // End transition state
        isTransitioning = false;
    }, 1000); // Match the animation duration
}

// Menu item click handlers
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const sectionId = item.getAttribute('data-section');
        navigateToSection(sectionId);
    });
});

// Logo click handler - return to home
navLogo.addEventListener('click', () => {
    navigateToSection('hero');
});

// CTA button handler
if (ctaButton) {
    ctaButton.addEventListener('click', () => {
        const sectionId = ctaButton.getAttribute('data-section');
        navigateToSection(sectionId);
    });
}

// Project card click handlers with enhanced modal
projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-project');
        const projectUrl = card.getAttribute('data-url');
        
        // Open the URL in a new tab if data-url attribute exists
        if (projectUrl) {
            window.open(projectUrl, '_blank');
        }
    });
});

// Modal close handler
modalClose.addEventListener('click', () => {
    projectModal.classList.remove('active');
});

// Close modal when clicking outside content
projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
        projectModal.classList.remove('active');
    }
});

// Open project modal with content
function openProjectModal(projectId) {
    // This function is kept for reference but no longer used
    // ... existing code ...
}

// Form submission with enhanced animation
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // In a real application, you would send this data to a server
        console.log('Form submitted:', { name, email, message });
        
        // Show success message with animation
        const formContainer = contactForm.parentElement;
        
        formContainer.innerHTML = `
            <div class="success-message">
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                    <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out, ${name}. I'll get back to you soon.</p>
            </div>
        `;
    });
}

// Parallax effect for background elements
document.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) / 50;
    const moveY = (e.clientY - window.innerHeight / 2) / 50;
    
    // Apply subtle movement to various elements for depth effect
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Modal is no longer used
        
        // Close menu if open
        if (fullscreenMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            fullscreenMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
    
    // Arrow key navigation between sections
    const sectionIds = ['hero', 'about', 'portfolio', 'timeline', 'contact'];
    const currentIndex = sectionIds.indexOf(currentSection);
    
    if (!isTransitioning) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            if (currentIndex < sectionIds.length - 1) {
                navigateToSection(sectionIds[currentIndex + 1]);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            if (currentIndex > 0) {
                navigateToSection(sectionIds[currentIndex - 1]);
            }
        }
    }
});

// Mouse wheel navigation
let isScrolling = false;
window.addEventListener('wheel', (e) => {
    if (!isScrolling && !isTransitioning) {
        isScrolling = true;
        
        const sectionIds = ['hero', 'about', 'portfolio', 'timeline', 'contact'];
        const currentIndex = sectionIds.indexOf(currentSection);
        
        if (e.deltaY > 0 && currentIndex < sectionIds.length - 1) {
            navigateToSection(sectionIds[currentIndex + 1]);
        } else if (e.deltaY < 0 && currentIndex > 0) {
            navigateToSection(sectionIds[currentIndex - 1]);
        }
        
        // Prevent too frequent scrolling
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }
});

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
    Object.keys(particleCanvases).forEach(key => {
        const canvas = particleCanvases[key];
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    });
    
    initAllParticles();
});

// Populate timeline events
function populateTimelineEvents() {
    if (!timelineEvents) return;
    
    timelineEvents.innerHTML = '';
    
    // Create a container for each year group to optimize space
    const yearGroups = {};
    
    // Group events by decade for better organization
    timelineData.forEach((event) => {
        const year = event.year;
        const decade = year.includes('s') ? year : Math.floor(parseInt(year) / 10) * 10 + 's';
        
        if (!yearGroups[decade]) {
            yearGroups[decade] = [];
        }
        
        yearGroups[decade].push(event);
    });
    
    // Sort decades chronologically
    const sortedDecades = Object.keys(yearGroups).sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, ''));
        const numB = parseInt(b.replace(/\D/g, ''));
        return numA - numB;
    });
    
    // Keywords to highlight in descriptions
    const keywordsToHighlight = [
        'algorithm', 'neural', 'machine', 'intelligence', 'AI', 'learning', 
        'computing', 'Turing', 'network', 'data', 'language', 'deep learning',
        'ethics', 'strategic', 'recognition', 'generation', 'communication'
    ];
    
    // Function to highlight keywords in text
    const highlightKeywords = (text) => {
        let highlightedText = text;
        keywordsToHighlight.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            highlightedText = highlightedText.replace(regex, match => `<strong>${match}</strong>`);
        });
        return highlightedText;
    };
    
    // Get the details area
    const detailsArea = document.querySelector('.timeline-details-area');
    const detailsPlaceholder = document.querySelector('.timeline-details-placeholder');
    
    // Variable to track hover timers
    let hoverTimers = {};
    let activeEvent = null;
    
    // Function to update the details area
    const updateDetailsArea = (event) => {
        if (!detailsArea) return;
        
        // Clear the details area
        detailsArea.innerHTML = '';
        
        // Create elements for the details
        const dateElement = document.createElement('div');
        dateElement.className = 'timeline-date';
        dateElement.textContent = event.year;
        
        const titleElement = document.createElement('div');
        titleElement.className = 'timeline-title';
        titleElement.textContent = event.title;
        
        const descriptionElement = document.createElement('div');
        descriptionElement.className = 'timeline-description';
        descriptionElement.innerHTML = highlightKeywords(event.description);
        
        // Add elements to the details area
        detailsArea.appendChild(dateElement);
        detailsArea.appendChild(titleElement);
        detailsArea.appendChild(descriptionElement);
        
        // Show the details area
        detailsArea.classList.add('active');
    };
    
    // Function to reset the details area
    const resetDetailsArea = () => {
        if (!detailsArea) return;
        
        // Add a small delay before hiding the details
        setTimeout(() => {
            // Only reset if no event is active
            if (!activeEvent) {
                detailsArea.classList.remove('active');
                
                // Wait for the transition to complete before resetting the content
                setTimeout(() => {
                    if (!activeEvent) {
                        detailsArea.innerHTML = '';
                        detailsArea.appendChild(detailsPlaceholder);
                    }
                }, 400);
            }
        }, 100);
    };
    
    // Create timeline events
    let index = 0;
    sortedDecades.forEach(decade => {
        yearGroups[decade].forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'timeline-event';
            eventElement.classList.add('visible'); // Make events visible immediately
            eventElement.setAttribute('data-index', index);
            
            const eventContent = document.createElement('div');
            eventContent.className = 'timeline-event-content';
            
            const dateElement = document.createElement('div');
            dateElement.className = 'timeline-date';
            dateElement.textContent = event.year;
            
            const titleElement = document.createElement('div');
            titleElement.className = 'timeline-title';
            titleElement.textContent = event.title;
            
            eventContent.appendChild(dateElement);
            eventContent.appendChild(titleElement);
            
            eventElement.appendChild(eventContent);
            timelineEvents.appendChild(eventElement);
            
            // Add event listeners with debouncing for smoother transitions
            eventContent.addEventListener('mouseenter', () => {
                // Clear any existing timers for this event
                if (hoverTimers[index]) {
                    clearTimeout(hoverTimers[index]);
                }
                
                // Set a small delay before showing the details
                hoverTimers[index] = setTimeout(() => {
                    // If there's an active event and it's not this one, remove its active state
                    if (activeEvent && activeEvent !== eventContent) {
                        activeEvent.classList.remove('active');
                    }
                    
                    // Set this event as active
                    eventContent.classList.add('active');
                    activeEvent = eventContent;
                    
                    // Update the details area with this event's information
                    updateDetailsArea(event);
                }, 50);
            });
            
            eventContent.addEventListener('mouseleave', () => {
                // Clear any existing timers for this event
                if (hoverTimers[index]) {
                    clearTimeout(hoverTimers[index]);
                }
                
                // Set a delay before hiding the details to prevent flickering
                hoverTimers[index] = setTimeout(() => {
                    eventContent.classList.remove('active');
                    if (activeEvent === eventContent) {
                        activeEvent = null;
                        resetDetailsArea();
                    }
                }, 300);
            });
            
            index++;
        });
    });
    
    // Add keyboard navigation for timeline
    document.addEventListener('keydown', (e) => {
        if (document.querySelector('#timeline.active')) {
            const container = document.querySelector('.timeline-container');
            if (!container) return;
            
            if (e.key === 'ArrowRight') {
                container.scrollBy({
                    left: 300,
                    behavior: 'smooth'
                });
            } else if (e.key === 'ArrowLeft') {
                container.scrollBy({
                    left: -300,
                    behavior: 'smooth'
                });
            }
        }
    });
}

// Check if timeline events are in viewport and animate them - modified for horizontal timeline
function animateTimelineEvents() {
    // All events are already set to visible when created
    // This function now focuses on making sure timeline is properly initialized
    if (document.querySelector('#timeline.active')) {
        const container = document.querySelector('.timeline-container');
        if (container) {
            // Ensure container is scrollable horizontally
            container.scrollLeft = 0;
        }
    }
}

// Handle navigation bar scroll effect
function handleNavScroll() {
    const mainNav = document.querySelector('.main-nav');
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    
    if (scrollY > 50) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Create section indicators
    createSectionIndicators();
    
    // Create page transition element
    const pageTransition = createPageTransition();
    
    // Initialize particles
    initAllParticles();
    
    // Populate timeline events
    populateTimelineEvents();
    
    // Initialize timeline navigation
    initTimelineNavigation();
    
    // Create parallax elements for each section
    createParallaxElements();
    
    // Update scroll indicator visibility
    updateScrollIndicator();
    
    // Set initial active nav link
    updateActiveNavLink(currentSection);
    
    // Set initial navigation progress
    updateNavProgress(currentSection);
    
    // Add event listeners to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const sectionId = link.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    });
    
    // Add scroll event for navigation bar
    window.addEventListener('scroll', handleNavScroll);
    
    // Initial call to set correct state
    handleNavScroll();
    
    // Start animation loop
    animateAllParticles();
    
    // Set up navigation toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        fullscreenMenu.classList.toggle('active');
    });
    
    // Set up menu item navigation
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.getAttribute('data-section');
            navigateToSection(sectionId);
            navToggle.classList.remove('active');
            fullscreenMenu.classList.remove('active');
        });
    });
    
    // Set up CTA button navigation
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            const sectionId = ctaButton.getAttribute('data-section');
            navigateToSection(sectionId);
        });
    }
    
    // Set up project card links
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            const projectUrl = card.getAttribute('data-url');
            
            // Open the URL in a new tab if data-url attribute exists
            if (projectUrl) {
                window.open(projectUrl, '_blank');
            }
        });
    });
    
    // The modal is no longer used, but the code is kept for reference
    // Close modal
    modalClose.addEventListener('click', () => {
        projectModal.classList.remove('active');
    });
    
    // Handle contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Logo click to home
    navLogo.addEventListener('click', () => {
        navigateToSection('hero');
    });
    
    // Scroll event for timeline animations
    window.addEventListener('scroll', () => {
        if (document.querySelector('#timeline.active')) {
            animateTimelineEvents();
        }
    });
    
    // Initial check for timeline animations if timeline is active
    if (document.querySelector('#timeline.active')) {
        animateTimelineEvents();
    }
});

// Initialize timeline navigation
function initTimelineNavigation() {
    const timelineContainer = document.querySelector('.timeline-container');
    if (!timelineContainer) return;

    // Add scroll buttons for timeline
    const scrollLeftBtn = document.createElement('button');
    scrollLeftBtn.className = 'timeline-scroll-btn scroll-left';
    scrollLeftBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    const scrollRightBtn = document.createElement('button');
    scrollRightBtn.className = 'timeline-scroll-btn scroll-right';
    scrollRightBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    const timelineSection = document.getElementById('timeline');
    timelineSection.appendChild(scrollLeftBtn);
    timelineSection.appendChild(scrollRightBtn);
    
    // Initially hide left button (at the start of the timeline)
    scrollLeftBtn.style.opacity = '0';
    scrollLeftBtn.style.pointerEvents = 'none';
    
    // Calculate scroll distance based on container width
    const getScrollDistance = () => {
        return Math.max(timelineContainer.clientWidth * 0.8, 800);
    };
    
    // Add event listeners for scroll buttons
    scrollLeftBtn.addEventListener('click', () => {
        timelineContainer.scrollBy({
            left: -getScrollDistance(),
            behavior: 'smooth'
        });
    });
    
    scrollRightBtn.addEventListener('click', () => {
        timelineContainer.scrollBy({
            left: getScrollDistance(),
            behavior: 'smooth'
        });
    });
    
    // Add mouse wheel scrolling for timeline
    timelineContainer.addEventListener('wheel', (e) => {
        if (document.querySelector('#timeline.active')) {
            e.preventDefault();
            timelineContainer.scrollLeft += e.deltaY;
            updateScrollButtons();
        }
    });
    
    // Update button visibility based on scroll position
    const updateScrollButtons = () => {
        // Hide/show left button based on scroll position
        if (timelineContainer.scrollLeft <= 20) {
            scrollLeftBtn.style.opacity = '0';
            scrollLeftBtn.style.pointerEvents = 'none';
        } else {
            scrollLeftBtn.style.opacity = '1';
            scrollLeftBtn.style.pointerEvents = 'auto';
        }
        
        // Hide/show right button based on scroll position
        const maxScrollLeft = timelineContainer.scrollWidth - timelineContainer.clientWidth - 20;
        if (timelineContainer.scrollLeft >= maxScrollLeft) {
            scrollRightBtn.style.opacity = '0';
            scrollRightBtn.style.pointerEvents = 'none';
        } else {
            scrollRightBtn.style.opacity = '1';
            scrollRightBtn.style.pointerEvents = 'auto';
        }
    };
    
    // Listen for scroll events to update button visibility
    timelineContainer.addEventListener('scroll', updateScrollButtons);
    
    // Initial check for button visibility
    setTimeout(updateScrollButtons, 100);
    
    // Update on window resize
    window.addEventListener('resize', updateScrollButtons);
    
    // Update when section becomes active
    document.addEventListener('sectionChange', (e) => {
        if (e.detail.sectionId === 'timeline') {
            setTimeout(updateScrollButtons, 100);
        }
    });
}

// Create parallax elements for each section
function createParallaxElements() {
    sections.forEach(section => {
        // Create 3 different sized elements for each section
        const small = document.createElement('div');
        small.className = 'parallax-element small';
        small.style.top = Math.random() * 80 + 10 + '%';
        small.style.left = Math.random() * 80 + 10 + '%';
        
        const medium = document.createElement('div');
        medium.className = 'parallax-element medium';
        medium.style.top = Math.random() * 80 + 10 + '%';
        medium.style.left = Math.random() * 80 + 10 + '%';
        
        const large = document.createElement('div');
        large.className = 'parallax-element large';
        large.style.top = Math.random() * 80 + 10 + '%';
        large.style.left = Math.random() * 80 + 10 + '%';
        
        section.appendChild(small);
        section.appendChild(medium);
        section.appendChild(large);
    });
}

// Handle parallax effect on mouse move
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update parallax elements in the current section
    const currentSectionElement = document.getElementById(currentSection);
    if (currentSectionElement) {
        const parallaxElements = currentSectionElement.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach(element => {
            const speed = element.classList.contains('small') ? 0.05 : 
                          element.classList.contains('medium') ? 0.03 : 0.02;
            
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const moveX = (mouseX - centerX) * speed;
            const moveY = (mouseY - centerY) * speed;
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }
});

// Update scroll indicator visibility based on current section
function updateScrollIndicator() {
    const sectionIds = ['hero', 'about', 'portfolio', 'timeline', 'contact'];
    const currentIndex = sectionIds.indexOf(currentSection);
    
    if (currentIndex === sectionIds.length - 1) {
        // Last section, show upward arrow
        scrollIndicator.querySelector('.scroll-text').textContent = 'Scroll Up';
        scrollIndicator.style.transform = 'translateX(-50%) rotate(180deg)';
    } else {
        // Not last section, show downward arrow
        scrollIndicator.querySelector('.scroll-text').textContent = 'Scroll Down';
        scrollIndicator.style.transform = 'translateX(-50%) rotate(0deg)';
    }
    
    // Hide on last and first section after a delay
    if (currentIndex === 0 || currentIndex === sectionIds.length - 1) {
        scrollIndicator.style.opacity = '0.8';
        setTimeout(() => {
            scrollIndicator.style.opacity = '0';
        }, 3000);
    } else {
        scrollIndicator.style.opacity = '0.8';
    }
}

// Add wheel event listener for section navigation
document.addEventListener('wheel', (e) => {
    if (isTransitioning) return;
    
    const sectionIds = ['hero', 'about', 'portfolio', 'timeline', 'contact'];
    const currentIndex = sectionIds.indexOf(currentSection);
    
    // Determine direction based on wheel delta
    if (e.deltaY > 0 && currentIndex < sectionIds.length - 1) {
        // Scrolling down
        navigateToSection(sectionIds[currentIndex + 1]);
    } else if (e.deltaY < 0 && currentIndex > 0) {
        // Scrolling up
        navigateToSection(sectionIds[currentIndex - 1]);
    }
});

// Add click event to scroll indicator
scrollIndicator.addEventListener('click', () => {
    const sectionIds = ['hero', 'about', 'portfolio', 'timeline', 'contact'];
    const currentIndex = sectionIds.indexOf(currentSection);
    
    if (currentIndex < sectionIds.length - 1) {
        // Not on last section, go to next
        navigateToSection(sectionIds[currentIndex + 1]);
    } else {
        // On last section, go to first
        navigateToSection(sectionIds[0]);
    }
});

// Add keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (isTransitioning) return;
    
    const sectionIds = ['hero', 'about', 'portfolio', 'timeline', 'contact'];
    const currentIndex = sectionIds.indexOf(currentSection);
    
    // Arrow down or Page down
    if ((e.key === 'ArrowDown' || e.key === 'PageDown') && currentIndex < sectionIds.length - 1) {
        e.preventDefault();
        navigateToSection(sectionIds[currentIndex + 1]);
    }
    // Arrow up or Page up
    else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentIndex > 0) {
        e.preventDefault();
        navigateToSection(sectionIds[currentIndex - 1]);
    }
    // Home key
    else if (e.key === 'Home') {
        e.preventDefault();
        navigateToSection(sectionIds[0]);
    }
    // End key
    else if (e.key === 'End') {
        e.preventDefault();
        navigateToSection(sectionIds[sectionIds.length - 1]);
    }
    // Number keys 1-5
    else if (e.key >= '1' && e.key <= '5') {
        const index = parseInt(e.key) - 1;
        if (index >= 0 && index < sectionIds.length) {
            e.preventDefault();
            navigateToSection(sectionIds[index]);
        }
    }
});

// Update active nav link
function updateActiveNavLink(sectionId) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

// Update navigation progress bar
function updateNavProgress(sectionId) {
    const progressBar = document.querySelector('.nav-progress-bar');
    const sectionIds = ['hero', 'about', 'portfolio', 'timeline', 'contact'];
    const currentIndex = sectionIds.indexOf(sectionId);
    const progress = (currentIndex / (sectionIds.length - 1)) * 100;
    
    progressBar.style.width = `${progress}%`;
}
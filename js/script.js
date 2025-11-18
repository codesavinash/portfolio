// Mobile Menu Toggle
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');

// Show menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

// Hide menu
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// Close menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector('.nav__link[href*=' + sectionId + ']');

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', scrollActive);

// Header Shadow on Scroll
function scrollHeader() {
    const header = document.getElementById('header');
    if (window.scrollY >= 50) {
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    }
}

window.addEventListener('scroll', scrollHeader);

// Form Validation and Handling
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Basic validation
        if (!name || !email || !message) {
            showFormStatus('Please fill in all fields.', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormStatus('Please enter a valid email address.', 'error');
            return;
        }
        
        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        formStatus.style.display = 'none';
        
        try {
            // Create FormData object
            const formData = new FormData(contactForm);
            
            // Submit to Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                showFormStatus('Thank you for your message! I will get back to you soon.', 'success');
                contactForm.reset();
            } else {
                showFormStatus('Sorry, there was an error sending your message. Please try again later.', 'error');
            }
        } catch (error) {
            showFormStatus('Sorry, there was an error sending your message. Please try again later.', 'error');
            console.error('Form submission error:', error);
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}

// Function to show form status messages
function showFormStatus(message, type) {
    if (!formStatus) return;
    
    formStatus.textContent = message;
    formStatus.style.display = 'block';
    formStatus.className = 'form__status';
    
    if (type === 'success') {
        formStatus.style.color = '#10b981';
        formStatus.style.backgroundColor = '#d1fae5';
        formStatus.style.padding = '12px';
        formStatus.style.borderRadius = '4px';
        formStatus.style.marginBottom = '16px';
    } else if (type === 'error') {
        formStatus.style.color = '#ef4444';
        formStatus.style.backgroundColor = '#fee2e2';
        formStatus.style.padding = '12px';
        formStatus.style.borderRadius = '4px';
        formStatus.style.marginBottom = '16px';
    }
    
    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }
}

// Scroll Animation on Elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections for scroll animation
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const isClickInsideMenu = navMenu.contains(event.target);
    const isClickOnToggle = navToggle.contains(event.target);
    
    if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('show-menu')) {
        navMenu.classList.remove('show-menu');
    }
});

// Prevent body scroll when menu is open
navToggle.addEventListener('click', () => {
    document.body.style.overflow = 'hidden';
});

navClose.addEventListener('click', () => {
    document.body.style.overflow = '';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        document.body.style.overflow = '';
    });
});

// Project Filtering
const filterButtons = document.querySelectorAll('.projects__filter-btn');
const projectCards = document.querySelectorAll('.project__card');

if (filterButtons.length > 0 && projectCards.length > 0) {
    function filterProjects(category) {
        // Update active button state
        filterButtons.forEach(btn => {
            if (btn.dataset.filter === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Filter project cards with smooth transition
        let visibleIndex = 0;
        projectCards.forEach((card) => {
            const cardCategory = card.dataset.category;
            const isComingSoon = card.classList.contains('project__card--coming-soon');
            
            // Remove fade-in class first
            card.classList.remove('fade-in');
            
            if (category === 'all' || cardCategory === category || isComingSoon) {
                // Show card
                card.classList.remove('hidden');
                
                // Add fade-in animation with slight delay for stagger effect
                // Only stagger visible cards
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, visibleIndex * 50);
                visibleIndex++;
            } else {
                // Hide card
                card.classList.add('hidden');
            }
        });

        // Smooth scroll to projects section if not already visible
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            const rect = projectsSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Only scroll if section is not mostly visible
            if (rect.top < 100 || rect.bottom > viewportHeight - 100) {
                const headerOffset = 80;
                const elementPosition = projectsSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    }

    // Add event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.dataset.filter;
            filterProjects(filterValue);
        });
    });

    // Observe project cards for scroll animation
    projectCards.forEach(card => {
        observer.observe(card);
    });

    // Initialize - ensure all projects are visible on load
    window.addEventListener('DOMContentLoaded', () => {
        // Remove hidden class from all cards
        projectCards.forEach(card => {
            card.classList.remove('hidden');
        });
        
        // Add fade-in animation on load with subtle stagger for visual appeal
        projectCards.forEach((card, index) => {
            // Only add animation if card is in viewport or will be soon
            setTimeout(() => {
                if (!card.classList.contains('hidden')) {
                    card.classList.add('fade-in');
                }
            }, Math.min(index * 50, 500)); // Cap total delay at 500ms
        });
    });
}

// ===== Image Gallery Modal =====
const designProject1 = document.getElementById('design-project-1');
const designProject2 = document.getElementById('design-project-2');
const designProject3 = document.getElementById('design-project-3');
const galleryModal = document.getElementById('gallery-modal');
const galleryClose = document.getElementById('gallery-close');
const galleryPrev = document.getElementById('gallery-prev');
const galleryNext = document.getElementById('gallery-next');
const galleryImage = document.getElementById('gallery-image');
const galleryCurrent = document.getElementById('gallery-current');
const galleryTotal = document.getElementById('gallery-total');
const galleryThumbnails = document.getElementById('gallery-thumbnails');

// Image paths for design project 1
const designProject1Images = [
    'images/dsgn1.1.png',
    'images/dsgn1.2.png',
    'images/dsgn1.3.png',
    'images/dsgn1.4.png',
    'images/dsgn1.5.png',
    'images/dsgn1.6.png',
    'images/dsgn1.7.png'
];

// Image paths for design project 2 (UI/UX Web)
const designProject2Images = [
    'images/wdsgn2.1.png',
    'images/wdsgn2.2.png',
    'images/wdsgn2.3.png',
    'images/wdsgn2.4.png',
    'images/wdsgn2.5.png',
    'images/wdsgn2.6.png',
    'images/wdsgn2.7.png',
    'images/wdsgn2.8.png',
    'images/wdsgn2.9.png',
    'images/wdsgn2.10.png'
];

// Image paths for design project 3 (SmartChef UI/UX)
const designProject3Images = [
    'images/wdsgn1.1.png',
    'images/wdsgn1.2.png',
    'images/wdsgn1.3.png',
    'images/wdsgn1.4.png',
    'images/wdsgn1.5.png',
    'images/wdsgn1.7.png',
    'images/wdsgn1.8.png'
];

let currentImageIndex = 0;
let currentGalleryImages = [];

// Function to open gallery
function openGallery(images, startIndex = 0) {
    if (!images || images.length === 0) return;
    currentGalleryImages = images;
    currentImageIndex = startIndex;
    if (galleryTotal) {
        galleryTotal.textContent = images.length;
    }
    updateGalleryImage(images);
    createThumbnails(images);
    if (galleryModal) {
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
    }
}

// Function to close gallery
function closeGallery() {
    galleryModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore body scroll
}

// Function to update gallery image
function updateGalleryImage(images) {
    if (!galleryImage || !images || images.length === 0) return;
    galleryImage.src = images[currentImageIndex];
    if (galleryCurrent) {
        galleryCurrent.textContent = currentImageIndex + 1;
    }
    updateThumbnailActive();
}

// Function to show next image
function showNextImage(images) {
    if (!images || images.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateGalleryImage(images);
}

// Function to show previous image
function showPrevImage(images) {
    if (!images || images.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateGalleryImage(images);
}

// Function to create thumbnails
function createThumbnails(images) {
    if (!galleryThumbnails) return;
    galleryThumbnails.innerHTML = '';
    images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.className = 'gallery-modal__thumbnail';
        thumbnail.alt = `Thumbnail ${index + 1}`;
        if (index === currentImageIndex) {
            thumbnail.classList.add('active');
        }
        thumbnail.addEventListener('click', () => {
            currentImageIndex = index;
            updateGalleryImage(images);
        });
        galleryThumbnails.appendChild(thumbnail);
    });
}

// Function to update active thumbnail
function updateThumbnailActive() {
    const thumbnails = galleryThumbnails.querySelectorAll('.gallery-modal__thumbnail');
    thumbnails.forEach((thumb, index) => {
        if (index === currentImageIndex) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

// Event listener for clicking on design project 1 title
if (designProject1) {
    designProject1.addEventListener('click', (e) => {
        e.preventDefault();
        openGallery(designProject1Images, 0);
    });
}

// Event listener for clicking on design project 1 thumbnail
const designProject1Thumbnail = document.querySelector('#design-project-1')?.closest('.project__card')?.querySelector('.project__thumbnail');
if (designProject1Thumbnail) {
    designProject1Thumbnail.addEventListener('click', (e) => {
        e.preventDefault();
        openGallery(designProject1Images, 0);
    });
}

// Event listener for clicking on design project 2 title
if (designProject2) {
    designProject2.addEventListener('click', (e) => {
        e.preventDefault();
        openGallery(designProject2Images, 0);
    });
}

// Event listener for clicking on design project 2 thumbnail
const designProject2Thumbnail = document.querySelector('#design-project-2')?.closest('.project__card')?.querySelector('.project__thumbnail');
if (designProject2Thumbnail) {
    designProject2Thumbnail.addEventListener('click', (e) => {
        e.preventDefault();
        openGallery(designProject2Images, 0);
    });
}

// Event listener for clicking on design project 3 title
if (designProject3) {
    designProject3.addEventListener('click', (e) => {
        e.preventDefault();
        openGallery(designProject3Images, 0);
    });
}

// Event listener for clicking on design project 3 thumbnail
const designProject3Thumbnail = document.querySelector('#design-project-3')?.closest('.project__card')?.querySelector('.project__thumbnail');
if (designProject3Thumbnail) {
    designProject3Thumbnail.addEventListener('click', (e) => {
        e.preventDefault();
        openGallery(designProject3Images, 0);
    });
}

// Event listeners for gallery controls
if (galleryClose) {
    galleryClose.addEventListener('click', closeGallery);
}

if (galleryPrev) {
    galleryPrev.addEventListener('click', () => {
        showPrevImage(currentGalleryImages);
    });
}

if (galleryNext) {
    galleryNext.addEventListener('click', () => {
        showNextImage(currentGalleryImages);
    });
}

// Close gallery when clicking on overlay
if (galleryModal) {
    const overlay = galleryModal.querySelector('.gallery-modal__overlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeGallery();
            }
        });
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (galleryModal && galleryModal.classList.contains('active')) {
        switch(e.key) {
            case 'Escape':
                closeGallery();
                break;
            case 'ArrowLeft':
                showPrevImage(currentGalleryImages);
                e.preventDefault();
                break;
            case 'ArrowRight':
                showNextImage(currentGalleryImages);
                e.preventDefault();
                break;
        }
    }
});

// ===== AWS Certification Image Modal =====
const awsCertificationTitle = document.getElementById('aws-certification-title');
const awsCloudImage = ['images/awsCloud.png'];

if (awsCertificationTitle) {
    awsCertificationTitle.addEventListener('click', (e) => {
        e.preventDefault();
        openGallery(awsCloudImage, 0);
    });
}

// ===== Logo Collection Gallery =====
const logoCollectionView = document.getElementById('logo-collection-view');
const logoCollectionImages = [
    'images/LG1.png',
    'images/LG2.png',
    'images/LG3.png',
    'images/LG4.png',
    'images/LG5.png'
];

if (logoCollectionView) {
    logoCollectionView.addEventListener('click', (e) => {
        e.preventDefault();
        openGallery(logoCollectionImages, 0);
    });
}

// ===== Lenovo Certification Image Modal =====
const lenovoCertificationTitle = document.getElementById('lenovo-certification-title');
const lenovoCertificationImages = [
    'images/L1.png',
    'images/L2.png',
    'images/L3.png',
    'images/L4.png',
    'images/L5.png',
    'images/L6.png',
    'images/L7.png',
    'images/L8.png',
    'images/L9.png'
];

if (lenovoCertificationTitle) {
    lenovoCertificationTitle.addEventListener('click', (e) => {
        e.preventDefault();
        openGallery(lenovoCertificationImages, 0);
    });
}

// ===== Coming Soon Video Handling =====
document.addEventListener('DOMContentLoaded', function() {
    const comingSoonVideo = document.getElementById('coming-soon-video');
    const comingSoonFallback = document.getElementById('coming-soon-fallback');
    
    if (comingSoonVideo) {
        // Handle video load errors
        comingSoonVideo.addEventListener('error', function(e) {
            console.error('Video failed to load. Error code:', comingSoonVideo.error ? comingSoonVideo.error.code : 'unknown');
            console.error('Video source:', comingSoonVideo.querySelector('source')?.src);
            if (comingSoonVideo) {
                comingSoonVideo.style.display = 'none';
            }
            if (comingSoonFallback) {
                comingSoonFallback.style.display = 'flex';
            }
        });
        
        // Check if video can play
        comingSoonVideo.addEventListener('loadeddata', function() {
            console.log('Video loaded successfully');
            // Try to play the video
            comingSoonVideo.play().catch(function(error) {
                console.warn('Autoplay prevented:', error);
            });
        });
        
        // Try to play when video is ready
        comingSoonVideo.addEventListener('canplay', function() {
            comingSoonVideo.play().catch(function(error) {
                console.warn('Video play failed:', error);
            });
        });
        
        // Fallback if video doesn't load after a timeout
        setTimeout(function() {
            if (comingSoonVideo && comingSoonVideo.readyState < 2) {
                console.warn('Video taking too long to load, showing fallback');
                if (comingSoonVideo) {
                    comingSoonVideo.style.display = 'none';
                }
                if (comingSoonFallback) {
                    comingSoonFallback.style.display = 'flex';
                }
            }
        }, 3000);
    }
});




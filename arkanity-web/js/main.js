/**
 * ARKANITY v3.0 - Essential Features Only
 * REMOVED: Form interception (Netlify handles forms)
 * KEPT: Demo widget, mobile menu, scroll effects, etc.
 */
'use strict';

// ========================================
// TRANSLATION HELPER
// ========================================
function t(key) {
    const lang = document.documentElement.lang || 'bg';
    if (window.translations && window.translations[lang] && window.translations[lang][key]) {
        return window.translations[lang][key];
    }
    return key;
}

// ========== NAVBAR ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.pageYOffset > 100);
});

// ========== MODAL SYSTEM ==========
function showModal(type, title, message) {
    const modal = document.getElementById('custom-modal');
    if (!modal) return;
    const modalIcon = modal.querySelector('#modal-icon i');
    const modalTitle = modal.querySelector('#modal-title');
    const modalMessage = modal.querySelector('#modal-message');
    const downloadBtn = modal.querySelector('#modal-download-btn');

    if (modalIcon) {
        modalIcon.className = type === 'success' ? 'fa-solid fa-check animate-bounce' : 'fa-solid fa-exclamation-triangle';
    }
    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;

    // Hide download button if it's an error
    if (downloadBtn) {
        downloadBtn.style.display = type === 'success' ? 'flex' : 'none';
    }

    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100');
    modal.querySelector('#modal-content')?.classList.remove('scale-95');
    modal.querySelector('#modal-content')?.classList.add('scale-100');
}

function hideModal() {
    const modal = document.getElementById('custom-modal');
    if (!modal) return;
    modal.classList.add('opacity-0', 'pointer-events-none');
    modal.classList.remove('opacity-100');
    modal.querySelector('#modal-content')?.classList.add('scale-95');
    modal.querySelector('#modal-content')?.classList.remove('scale-100');
}

// ========== FORM HANDLING (Static Forms AJAX) ==========
function initForms() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn ? btn.innerHTML : 'Submit';

            if (btn) {
                btn.innerHTML = `<i class="fa-solid fa-spinner animate-spin mr-2"></i> ${t('form.sending') || 'Изпращане...'}`;
                btn.disabled = true;
            }

            const formData = new FormData(form);
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';

            try {
                // Submit to Static Forms using fetch (AJAX)
                const response = await fetch('https://api.staticforms.xyz/submit', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                let result = {};
                try {
                    result = await response.json();
                } catch (e) {
                    console.log('Response not JSON, but status is:', response.status);
                }

                if (result.success || response.ok || (isLocal && response.status === 0)) {
                    showModal(
                        'success',
                        t('form.success.title') || 'Успешно изпратено!',
                        t('form.success.message') || 'Благодарим ви за интереса. Моля, изтеглете вашия анализ от бутона по-долу:'
                    );
                    form.reset();
                } else {
                    throw new Error(result.message || 'Submission failed');
                }
            } catch (err) {
                console.error('Submission Error:', err);

                // BYPASS FOR LOCAL TESTING: If we are testing locally, show success anyway so the user can see the buttons
                if (isLocal) {
                    console.warn('Local environment detected - showing Success Modal for testing purposes.');
                    showModal(
                        'success',
                        t('form.success.title') || 'Успешно изпратено!',
                        t('form.success.message') || 'Благодарим ви за интереса. Моля, изтеглете вашия анализ от бутона по-долу:'
                    );
                    form.reset();
                } else {
                    showModal(
                        'error',
                        t('form.error.title') || 'Грешка!',
                        t('form.error.message') || 'Възникна проблем при изпращането. Моля, опитайте отново или ни пишете на arkanity.agency@gmail.com'
                    );
                }
            } finally {
                if (btn) {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
            }
        });
    });

    document.getElementById('modal-close')?.addEventListener('click', hideModal);
    document.getElementById('modal-backdrop')?.addEventListener('click', hideModal);
}

// ========== MOBILE MENU ==========
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn?.addEventListener('click', () => {
    mobileMenu?.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
});

mobileMenuClose?.addEventListener('click', () => {
    mobileMenu?.classList.add('translate-x-full');
    document.body.style.overflow = '';
});

mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
        document.body.style.overflow = '';
    });
});

// ========== BACK TO TOP ==========
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        const show = window.pageYOffset > 500;
        backToTop.style.opacity = show ? '1' : '0';
        backToTop.style.transform = show ? 'translateY(0)' : 'translateY(10px)';
        backToTop.style.pointerEvents = show ? 'auto' : 'none';
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ========== MOBILE STICKY CTA ==========
const mobileStickyCta = document.getElementById('mobile-sticky-cta');
if (mobileStickyCta) {
    window.addEventListener('scroll', () => {
        mobileStickyCta.classList.toggle('translate-y-full', window.pageYOffset < 800);
    });
}

// ========== COOKIE CONSENT ==========
const cookieBanner = document.getElementById('cookie-banner');

function checkCookies() {
    if (!localStorage.getItem('arkanity-cookie-consent') && cookieBanner) {
        setTimeout(() => {
            cookieBanner.style.display = 'block';
            setTimeout(() => cookieBanner.classList.add('show'), 100);
        }, 2000);
    }
}

window.acceptCookies = () => {
    localStorage.setItem('arkanity-cookie-consent', 'accepted');
    cookieBanner?.classList.remove('show');
    setTimeout(() => { if (cookieBanner) cookieBanner.style.display = 'none'; }, 400);
    if (typeof gtag !== 'undefined') gtag('consent', 'update', { analytics_storage: 'granted' });
};

window.rejectCookies = () => {
    localStorage.setItem('arkanity-cookie-consent', 'rejected');
    cookieBanner?.classList.remove('show');
    setTimeout(() => { if (cookieBanner) cookieBanner.style.display = 'none'; }, 400);
};

// ========== DEMO WIDGET (FIXED WITH HOVER EFFECTS) ==========
const demoStars = document.getElementById('demo-stars');
if (demoStars) {
    const stars = demoStars.querySelectorAll('i');

    // HOVER EFFECT - Fill stars on mouseover
    stars.forEach((star, i) => {
        star.addEventListener('mouseenter', () => {
            stars.forEach((s, j) => {
                if (j <= i) {
                    s.classList.remove('text-gray-300');
                    s.classList.add('text-yellow-400');
                } else {
                    s.classList.remove('text-yellow-400');
                    s.classList.add('text-gray-300');
                }
            });
        });
    });

    // Reset stars when mouse leaves the entire star container
    demoStars.addEventListener('mouseleave', () => {
        stars.forEach(s => {
            s.classList.remove('text-yellow-400');
            s.classList.add('text-gray-300');
        });
    });

    // CLICK EVENT - Show result
    stars.forEach((star, i) => {
        star.addEventListener('click', () => {
            const rating = i + 1;

            // Keep stars filled
            stars.forEach((s, j) => {
                s.classList.toggle('text-yellow-400', j <= i);
                s.classList.toggle('text-gray-300', j > i);
            });

            setTimeout(() => {
                const s1 = document.getElementById('phone-screen-1');
                const s2 = document.getElementById('phone-screen-feedback');
                const panel = document.getElementById('demo-result-panel');

                if (s1) s1.classList.add('translate-x-[-100%]');
                if (s2) s2.classList.remove('translate-x-full');

                if (rating >= 4) {
                    // GOOD RATING (4-5 stars) - Show feedback request
                    if (s2) s2.innerHTML = `
                        <div class="w-16 h-16 bg-green-500/20 rounded-full mb-6 flex items-center justify-center text-4xl">✅</div>
                        <h3 class="text-dark font-bold text-xl mb-2">${t('demo.good.title') || 'Чудесно!'}</h3>
                        <p class="text-gray-500 text-sm mb-6">${t('demo.good.desc') || 'Благодарим за положителната оценка!'}</p>
                        <div class="w-full h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            <i class="fa-brands fa-google mr-2"></i> ${t('demo.good.btn') || 'Напишете отзив в Google'}
                        </div>
                    `;
                    if (panel) {
                        panel.style.opacity = '1';
                        panel.style.transform = 'translateY(0)';
                    }
                    const icon = document.getElementById('result-icon');
                    const title = document.getElementById('result-title');
                    const desc = document.getElementById('result-desc');
                    if (icon) icon.textContent = '🎯';
                    if (title) title.textContent = t('demo.result.good.title') || 'Публичен отзив';
                    if (desc) desc.textContent = t('demo.result.good.desc') || 'Клиентът е насочен към Google за да остави положителен отзив публично.';
                } else {
                    // BAD RATING (1-3 stars) - Show private feedback form
                    if (s2) s2.innerHTML = `
                        <div class="w-16 h-16 bg-orange-500/20 rounded-full mb-6 flex items-center justify-center text-4xl">📝</div>
                        <h3 class="text-dark font-bold text-xl mb-2">${t('demo.bad.title') || 'Съжаляваме!'}</h3>
                        <p class="text-gray-500 text-sm mb-6">${t('demo.bad.desc') || 'Моля, споделете какво можем да подобрим:'}</p>
                        <textarea class="w-full h-24 p-3 border rounded-lg text-sm" placeholder="${t('demo.bad.placeholder') || 'Вашата обратна връзка...'}"></textarea>
                        <button class="mt-4 w-full bg-gray-800 text-white py-3 rounded-lg font-bold">${t('demo.bad.btn') || 'Изпрати обратна връзка'}</button>
                    `;
                    if (panel) {
                        panel.style.opacity = '1';
                        panel.style.transform = 'translateY(0)';
                    }
                    const icon = document.getElementById('result-icon');
                    const title = document.getElementById('result-title');
                    const desc = document.getElementById('result-desc');
                    if (icon) icon.textContent = '🛡️';
                    if (title) title.textContent = t('demo.result.bad.title') || 'Частна обратна връзка';
                    if (desc) desc.textContent = t('demo.result.bad.desc') || 'Негативният отзив се улавя преди да стане публичен. Вие получавате шанс да решите проблема директно.';
                }

                // Auto Reset after 5 seconds
                setTimeout(() => {
                    stars.forEach(s => {
                        s.classList.remove('text-yellow-400');
                        s.classList.add('text-gray-300');
                    });
                    if (s1) s1.classList.remove('translate-x-[-100%]');
                    if (s2) s2.classList.add('translate-x-full');
                    if (panel) {
                        panel.style.opacity = '0';
                        panel.style.transform = 'translateY(10px)';
                    }
                }, 5000);

            }, 300);
        });
    });
}

// ========== HERO CAROUSEL ==========
const heroSlides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;
if (heroSlides.length > 0) {
    setInterval(() => {
        heroSlides[currentSlide].style.opacity = '0';
        currentSlide = (currentSlide + 1) % heroSlides.length;
        heroSlides[currentSlide].style.opacity = '1';
    }, 5000);
}

// ========== SCROLL REVEAL ==========
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('fade-in-up');
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('section').forEach(s => observer.observe(s));

// ========== FAQ ACCORDION ==========
document.querySelectorAll('.faq-button').forEach(btn => {
    btn.addEventListener('click', () => {
        const ans = btn.nextElementSibling;
        const icon = btn.querySelector('i');
        const open = ans.style.maxHeight;

        document.querySelectorAll('.faq-answer').forEach(a => a.style.maxHeight = null);
        document.querySelectorAll('.faq-button i').forEach(i => {
            i.classList.remove('fa-minus');
            i.classList.add('fa-plus');
        });

        if (!open) {
            ans.style.maxHeight = ans.scrollHeight + 'px';
            if (icon) {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            }
        }
    });
});

// ========== STATS COUNTER ==========
function animateCounter(el, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.stat-number').forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                if (target) animateCounter(counter, target);
            });
            statsObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('#stats');
if (statsSection) statsObserver.observe(statsSection);

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    initForms();
    checkCookies();
    console.log('🚀 Arkanity v3.0 loaded - AJAX forms active!');
});

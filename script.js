 document.addEventListener('DOMContentLoaded', () => {
            const hamburger = document.querySelector('.hamburger');
            const mobileMenu = document.getElementById('mobileMenu');
            const navLinks = Array.from(document.querySelectorAll('.nav-links a, .mobile-menu a'));

            if (hamburger && mobileMenu) {
                // toggle menu and update aria-expanded for a11y
                hamburger.addEventListener('click', () => {
                    const isOpen = hamburger.classList.toggle('open');
                    mobileMenu.classList.toggle('open');
                    hamburger.setAttribute('aria-expanded', String(hamburger.classList.contains('open')));
                });

                navLinks.forEach(link => link.addEventListener('click', () => {
                    if (mobileMenu.classList.contains('open')) {
                        mobileMenu.classList.remove('open');
                        hamburger.classList.remove('open');
                        hamburger.setAttribute('aria-expanded', 'false');
                    }
                }));
            }

            const animateItems = document.querySelectorAll('[data-animate]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.18 });

        animateItems.forEach(item => observer.observe(item));

        const serviceTrack = document.getElementById('serviceTrack');
        const serviceCards = serviceTrack ? serviceTrack.querySelectorAll('.service-card') : [];
        const scrollStep = () => (serviceCards[0] ? serviceCards[0].getBoundingClientRect().width + 24 : 300);

        /* Staggered reveal for cards (service / why / testimonial) */
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    let index = 0;
                    if (el.classList.contains('service-card')) {
                        index = Array.from(serviceCards).indexOf(el);
                        if (index === -1) index = 0;
                    } else {
                        index = Array.from(el.parentElement.children).indexOf(el) || 0;
                    }
                    el.style.transitionDelay = `${(index || 0) * 110}ms`;
                    el.classList.add('visible');
                    cardObserver.unobserve(el);
                }
            });
        }, { threshold: 0.16 });

        (serviceCards || []).forEach(c => cardObserver.observe(c));

        const whyCards = document.querySelectorAll('.why-card');
        whyCards.forEach((c,i) => { c.style.transitionDelay = `${i*90}ms`; cardObserver.observe(c); });

        const testimonialCards = document.querySelectorAll('.testimonial-card');
        testimonialCards.forEach((c,i) => { c.style.transitionDelay = `${i*90}ms`; cardObserver.observe(c); });

        /* Randomly assign icon motion to a subset of icons */
        const iconCandidates = document.querySelectorAll('.why-icon, .testimonial-avatar, .service-image');
        iconCandidates.forEach((el) => {
            const r = Math.random();
            if (r < 0.28) el.classList.add('icon-bouncy');
            else if (r < 0.48) el.classList.add('icon-shaky');
        });

        let autoSlide;
        const initializeAutoSlide = () => {
            clearInterval(autoSlide);
            if (window.innerWidth > 768 && serviceTrack) {
                autoSlide = setInterval(() => {
                    if (serviceTrack.scrollLeft + serviceTrack.clientWidth >= serviceTrack.scrollWidth - 10) {
                        serviceTrack.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        serviceTrack.scrollBy({ left: scrollStep(), behavior: 'smooth' });
                    }
                }, 2400);
            }
        };

        initializeAutoSlide();
        window.addEventListener('resize', initializeAutoSlide);
    });
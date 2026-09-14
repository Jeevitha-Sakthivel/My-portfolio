document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. Interactive Neural Network Particle Canvas
    // ==========================================
    const canvas = document.getElementById("neural-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener("resize", function () {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        const mouse = {
            x: null,
            y: null,
            radius: 120
        };

        window.addEventListener("mousemove", function (e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener("mouseleave", function () {
            mouse.x = null;
            mouse.y = null;
        });

        // Determine number of particles based on screen width
        const particleCount = Math.floor(Math.min(width, 1400) / 18);
        let particles = [];

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 1;
                this.baseX = this.x;
                this.baseY = this.y;
                this.speedX = (Math.random() - 0.5) * 0.8;
                this.speedY = (Math.random() - 0.5) * 0.8;
                this.color = Math.random() > 0.4 ? "rgba(56, 189, 248, " : "rgba(168, 85, 247, ";
                this.alpha = Math.random() * 0.5 + 0.3;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.speedX *= -1;
                if (this.y < 0 || this.y > height) this.speedY *= -1;

                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = (dx / distance) * force * 1.5;
                        let directionY = (dy / distance) * force * 1.5;
                        this.x -= directionX;
                        this.y -= directionY;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color + this.alpha + ")";
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function connectParticles() {
            const maxDistance = 110;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDistance) {
                        let opacity = (1 - dist / maxDistance) * 0.25;
                        ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = particles[a].x - mouse.x;
                    let dy = particles[a].y - mouse.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        let opacity = (1 - dist / mouse.radius) * 0.45;
                        ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            connectParticles();
            requestAnimationFrame(animateCanvas);
        }

        initParticles();
        animateCanvas();
    }


    // ==========================================
    // 2. 3D Card Tilt & Interactive Glare
    // ==========================================
    const tiltCards = document.querySelectorAll(".tilt-card");

    tiltCards.forEach(function (card) {
        const glare = card.querySelector(".card-glare");

        card.addEventListener("mousemove", function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;

            if (glare) {
                glare.style.opacity = "1";
                glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.12) 0%, transparent 60%)`;
            }
        });

        card.addEventListener("mouseleave", function () {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
            if (glare) {
                glare.style.opacity = "0";
            }
        });
    });


    // ==========================================
    // 3. Mobile Navigation Drawer & Explore Dropdown
    // ==========================================
    const menuToggle = document.getElementById("menuToggle");
    const mobileNavDrawer = document.getElementById("mobileNavDrawer");
    const mobileNavBackdrop = document.getElementById("mobileNavBackdrop");
    const drawerCloseBtn = document.getElementById("drawerCloseBtn");
    const drawerSearchTrigger = document.getElementById("drawerSearchTrigger");
    const drawerLinks = document.querySelectorAll(".drawer-nav-link");

    function openMobileDrawer() {
        if (mobileNavDrawer && mobileNavBackdrop) {
            mobileNavDrawer.classList.add("open");
            mobileNavBackdrop.classList.add("open");
            if (menuToggle) {
                menuToggle.classList.add("active");
                menuToggle.setAttribute("aria-expanded", "true");
            }
            document.body.style.overflow = "hidden";
        }
    }

    function closeMobileDrawer() {
        if (mobileNavDrawer && mobileNavBackdrop) {
            mobileNavDrawer.classList.remove("open");
            mobileNavBackdrop.classList.remove("open");
            if (menuToggle) {
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            }
            document.body.style.overflow = "";
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            if (mobileNavDrawer && mobileNavDrawer.classList.contains("open")) {
                closeMobileDrawer();
            } else {
                openMobileDrawer();
            }
        });
    }

    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener("click", closeMobileDrawer);
    }

    if (mobileNavBackdrop) {
        mobileNavBackdrop.addEventListener("click", closeMobileDrawer);
    }

    drawerLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            closeMobileDrawer();
        });
    });

    if (drawerSearchTrigger) {
        drawerSearchTrigger.addEventListener("click", function () {
            closeMobileDrawer();
            setTimeout(openCmdPalette, 250);
        });
    }

    // Explore Dropdown (Desktop & Touch)
    const navDropdown = document.getElementById("navDropdown");
    const navDropdownBtn = document.getElementById("navDropdownBtn");
    const dropdownItems = document.querySelectorAll(".dropdown-item");

    if (navDropdownBtn && navDropdown) {
        navDropdownBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            const isOpen = navDropdown.classList.contains("open");
            navDropdown.classList.toggle("open");
            navDropdownBtn.setAttribute("aria-expanded", (!isOpen).toString());
        });

        document.addEventListener("click", function (e) {
            if (!navDropdown.contains(e.target)) {
                navDropdown.classList.remove("open");
                navDropdownBtn.setAttribute("aria-expanded", "false");
            }
        });

        dropdownItems.forEach(function (item) {
            item.addEventListener("click", function () {
                navDropdown.classList.remove("open");
                navDropdownBtn.setAttribute("aria-expanded", "false");
            });
        });
    }

    // Navbar Scrolled Elevation Effect
    const mainNavbar = document.getElementById("mainNavbar");
    window.addEventListener("scroll", function () {
        if (mainNavbar) {
            if (window.scrollY > 20) {
                mainNavbar.classList.add("scrolled");
            } else {
                mainNavbar.classList.remove("scrolled");
            }
        }
    }, { passive: true });


    // ==========================================
    // 4. Smooth Scrolling with Offset
    // ==========================================
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = this.getAttribute("href");

            if (targetId === "#" || targetId === "") {
                return;
            }

            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                event.preventDefault();
                const navHeight = document.querySelector("nav")?.offsetHeight || 70;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });


    // ==========================================
    // 5. Looping Typewriter Effect
    // ==========================================
    const typingElement = document.querySelector(".typing");

    if (typingElement) {
        const phrases = [
            "AI & Machine Learning Student",
            "Python Developer",
            "Aspiring Software Engineer",
            "GenAI Enthusiast"
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 80;
        const deleteSpeed = 40;
        const delayBetweenPhrases = 1600;

        function typeLoop() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }

            let nextTimeout = isDeleting ? deleteSpeed : typeSpeed;

            if (!isDeleting && charIndex === currentPhrase.length) {
                nextTimeout = delayBetweenPhrases;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                nextTimeout = 400;
            }

            setTimeout(typeLoop, nextTimeout);
        }

        typeLoop();
    }


    // ==========================================
    // 6. Section Scroll Reveal
    // ==========================================
    const sections = document.querySelectorAll("section");

    const sectionObserver = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1
        }
    );

    sections.forEach(function (section) {
        if (section.id !== "home") {
            section.classList.add("hidden");
        }
        sectionObserver.observe(section);
    });


    // ==========================================
    // 7. Animated Skill Bars & Percentage Counter
    // ==========================================
    const skillsSection = document.querySelector("#skills");
    const skillBars = document.querySelectorAll(".bar");
    const percentageLabels = document.querySelectorAll(".percentage");

    if (skillsSection) {
        const skillsObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        // Animate Bar Fill
                        skillBars.forEach(function (bar) {
                            const width = bar.getAttribute("data-width");
                            if (width) {
                                bar.style.width = width;
                            }
                        });

                        // Animate Percentage Numbers
                        percentageLabels.forEach(function (label) {
                            const target = parseInt(label.getAttribute("data-count"), 10);
                            let count = 0;
                            const duration = 1200;
                            const stepTime = Math.abs(Math.floor(duration / target));

                            const timer = setInterval(function () {
                                count += 1;
                                label.textContent = count + "%";
                                if (count >= target) {
                                    label.textContent = target + "%";
                                    clearInterval(timer);
                                }
                            }, stepTime);
                        });

                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.2
            }
        );

        skillsObserver.observe(skillsSection);
    }


    // ==========================================
    // 8. Animated Stats Counter (CGPA, Projects, etc.)
    // ==========================================
    const statsSection = document.querySelector(".stats-grid");
    const counters = document.querySelectorAll(".counter");

    if (statsSection && counters.length > 0) {
        const counterObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        counters.forEach(function (counter) {
                            const target = parseFloat(counter.getAttribute("data-target"));
                            const hasDecimal = counter.getAttribute("data-decimal");
                            const suffix = counter.getAttribute("data-suffix") || "";
                            const duration = 1500;
                            const startTime = performance.now();

                            function updateCount(currentTime) {
                                const elapsed = currentTime - startTime;
                                const progress = Math.min(elapsed / duration, 1);
                                // Ease-out quad
                                const ease = 1 - (1 - progress) * (1 - progress);
                                const currentVal = target * ease;

                                if (hasDecimal) {
                                    counter.textContent = currentVal.toFixed(1) + suffix;
                                } else {
                                    counter.textContent = Math.floor(currentVal) + suffix;
                                }

                                if (progress < 1) {
                                    requestAnimationFrame(updateCount);
                                } else {
                                    counter.textContent = (hasDecimal ? target.toFixed(1) : target) + suffix;
                                }
                            }

                            requestAnimationFrame(updateCount);
                        });

                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.3
            }
        );

        counterObserver.observe(statsSection);
    }


    // ==========================================
    // 9. Floating Back-to-Top Button & Top Scroll Progress Bar
    // ==========================================
    const backToTopBtn = document.getElementById("backToTop");
    const scrollProgressBar = document.getElementById("scroll-progress");

    window.addEventListener("scroll", function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Top Scroll Progress Bar
        if (scrollProgressBar) {
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgressBar.style.width = progress + "%";
        }

        // Back to Top Button Toggle
        if (backToTopBtn) {
            if (scrollTop > 350) {
                backToTopBtn.classList.add("show-btn");
            } else {
                backToTopBtn.classList.remove("show-btn");
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    // ==========================================
    // 10. Navbar Active Link on Scroll (Scroll Spy)
    // ==========================================
    const sectionsForNav = document.querySelectorAll("section[id]");
    const allNavLinks = document.querySelectorAll(".nav-link-item, .drawer-nav-link");

    window.addEventListener("scroll", function () {
        let currentSection = "";
        const scrollPosition = window.scrollY + 160;

        sectionsForNav.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (
                scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight
            ) {
                currentSection = section.getAttribute("id");
            }
        });

        allNavLinks.forEach(function (link) {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + currentSection) {
                link.classList.add("active");
            }
        });
    }, { passive: true });


    // ==========================================
    // 11. Interactive Contact Form Handling (Immediate Email Delivery)
    // ==========================================
    const contactForm = document.getElementById("portfolioContactForm");
    const formFeedback = document.getElementById("formFeedback");
    const submitBtn = document.getElementById("submitBtn");
    const directMailBtn = document.getElementById("directMailBtn");
    const OWNER_EMAIL = "kayaljeevitha43@gmail.com";

    // Helper: open default mail client (Gmail/Outlook) with pre-filled message
    function launchMailClient(name, email, subject, message, customMsg) {
        const mailSubject = encodeURIComponent(subject ? `[Portfolio] ${subject}` : `[Portfolio Inquiry] From ${name || 'Visitor'}`);
        let mailBody = "";
        if (name) mailBody += `Sender Name: ${name}\n`;
        if (email) mailBody += `Sender Email: ${email}\n`;
        mailBody += `\nMessage:\n${message || '(No message content)'}\n`;

        const mailtoUrl = `mailto:${OWNER_EMAIL}?subject=${mailSubject}&body=${encodeURIComponent(mailBody)}`;
        window.location.href = mailtoUrl;

        if (formFeedback) {
            formFeedback.className = "form-feedback info";
            formFeedback.innerHTML = `<i class="fas fa-info-circle"></i> ${customMsg || `Opened your email app to send directly to <strong>${OWNER_EMAIL}</strong>.`}`;
            formFeedback.style.display = "block";
        }
        if (typeof showToast === "function") {
            showToast(`Draft ready for ${OWNER_EMAIL}`);
        }
    }

    // Direct Mail App Button Click Handler
    if (directMailBtn) {
        directMailBtn.addEventListener("click", function () {
            const name = document.getElementById("senderName") ? document.getElementById("senderName").value.trim() : "";
            const email = document.getElementById("senderEmail") ? document.getElementById("senderEmail").value.trim() : "";
            const subject = document.getElementById("msgSubject") ? document.getElementById("msgSubject").value.trim() : "";
            const message = document.getElementById("msgBody") ? document.getElementById("msgBody").value.trim() : "";

            launchMailClient(name, email, subject, message, `Opening your email app to compose directly to <strong>${OWNER_EMAIL}</strong>...`);
        });
    }

    // Form Submission Handler
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("senderName").value.trim();
            const email = document.getElementById("senderEmail").value.trim();
            const subject = document.getElementById("msgSubject").value.trim();
            const message = document.getElementById("msgBody").value.trim();

            if (!name || !email || !message) {
                if (formFeedback) {
                    formFeedback.className = "form-feedback error";
                    formFeedback.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please fill in all required fields (Name, Email, Message).';
                    formFeedback.style.display = "block";
                }
                return;
            }

            if (formFeedback) {
                formFeedback.style.display = "none";
            }

            // If the user is browsing index.html directly from local disk (file:///)
            // Browser CORS security prevents external AJAX dispatch. Provide seamless instant email client launch.
            if (window.location.protocol === "file:") {
                launchMailClient(
                    name,
                    email,
                    subject,
                    message,
                    `Browsing via local files (file://). Opened your email client to send immediately to <strong>${OWNER_EMAIL}</strong>!`
                );
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending message...';
            }

            // Real email notification dispatch via FormSubmit API
            fetch(`https://formsubmit.co/ajax/${OWNER_EMAIL}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    _subject: subject ? `[Portfolio] ${subject}` : `[Portfolio Inquiry] From ${name}`,
                    message: message,
                    _template: "table",
                    _captcha: "false"
                })
            })
            .then(function (response) {
                return response.json().then(data => ({ status: response.status, ok: response.ok, data: data }));
            })
            .then(function (res) {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                }

                const data = res.data || {};

                // Detect FormSubmit One-Time Activation status
                if (data.success === "false" || data.success === false) {
                    const errorMsg = (data.message || "").toLowerCase();
                    if (errorMsg.includes("activation")) {
                        if (formFeedback) {
                            formFeedback.className = "form-feedback warning";
                            formFeedback.innerHTML = `
                                <i class="fas fa-bell"></i> <strong>One-Time Activation Required!</strong><br>
                                FormSubmit has sent a confirmation link to <strong>${OWNER_EMAIL}</strong>.<br>
                                Please check your Gmail (including <em>Spam / Junk</em> folders) and click <strong>'Activate Form'</strong> once. All future messages will then be received immediately!<br>
                                <a href="#" id="activationFallbackLink" style="color: #38bdf8; text-decoration: underline; display: inline-block; margin-top: 8px;">
                                    <i class="fas fa-envelope"></i> Send this message via your email app instead
                                </a>
                            `;
                            formFeedback.style.display = "block";

                            const fallbackLink = document.getElementById("activationFallbackLink");
                            if (fallbackLink) {
                                fallbackLink.addEventListener("click", function (evt) {
                                    evt.preventDefault();
                                    launchMailClient(name, email, subject, message);
                                });
                            }
                        }
                        return;
                    } else {
                        throw new Error(data.message || "Failed to deliver message.");
                    }
                }

                // Successful delivery
                if (formFeedback) {
                    formFeedback.className = "form-feedback success";
                    formFeedback.innerHTML = `<i class="fas fa-check-circle"></i> Thank you, <strong>${name}</strong>! Your message was delivered directly to <strong>${OWNER_EMAIL}</strong>. I will reply soon!`;
                    formFeedback.style.display = "block";
                }

                if (typeof showToast === "function") {
                    showToast(`Message sent to ${OWNER_EMAIL}!`);
                }

                contactForm.reset();

                setTimeout(function () {
                    if (formFeedback && formFeedback.classList.contains("success")) {
                        formFeedback.style.display = "none";
                    }
                }, 8000);
            })
            .catch(function (error) {
                console.error("Form delivery error:", error);

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                }

                if (formFeedback) {
                    formFeedback.className = "form-feedback error";
                    formFeedback.innerHTML = `
                        <i class="fas fa-exclamation-circle"></i> Automated delivery encountered a network issue.<br>
                        <a href="#" id="errorFallbackLink" style="color: #38bdf8; text-decoration: underline; display: inline-block; margin-top: 6px;">
                            <i class="fas fa-envelope"></i> Click here to send directly via your email app to ${OWNER_EMAIL}
                        </a>
                    `;
                    formFeedback.style.display = "block";

                    const errLink = document.getElementById("errorFallbackLink");
                    if (errLink) {
                        errLink.addEventListener("click", function (evt) {
                            evt.preventDefault();
                            launchMailClient(name, email, subject, message);
                        });
                    }
                }
            });
        });
    }


    // ==========================================
    // 12. Project Filter Tabs
    // ==========================================
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(function (btn) {
            btn.addEventListener("click", function () {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const filterValue = btn.getAttribute("data-filter");

                projectCards.forEach(function (card) {
                    const category = card.getAttribute("data-category") || "";
                    if (filterValue === "all" || category.includes(filterValue)) {
                        card.classList.remove("hide");
                        card.style.animation = 'none';
                        card.offsetHeight; /* trigger reflow */
                        card.style.animation = '';
                    } else {
                        card.classList.add("hide");
                    }
                });
            });
        });
    }


    // ==========================================
    // 13. FAQ Accordion Toggle
    // ==========================================
    const faqQuestions = document.querySelectorAll(".faq-question");

    if (faqQuestions.length > 0) {
        faqQuestions.forEach(function (question) {
            question.addEventListener("click", function () {
                const parentItem = question.closest(".faq-item");
                const isActive = parentItem.classList.contains("active");

                // Close all other items
                document.querySelectorAll(".faq-item").forEach(function (item) {
                    item.classList.remove("active");
                });

                // Toggle current item
                if (!isActive) {
                    parentItem.classList.add("active");
                }
            });
        });
    }


    // ==========================================
    // 14. Interactive Copy-to-Clipboard & Toast
    // ==========================================
    const copyBtns = document.querySelectorAll("[data-copy]");
    const toast = document.getElementById("portfolioToast");
    const toastMsg = document.getElementById("toastMsg");
    const toastIcon = document.getElementById("toastIcon");
    let toastTimeout = null;

    function showToast(message, iconClass) {
        if (!toast) return;
        if (toastMsg) toastMsg.textContent = message;
        if (toastIcon) {
            toastIcon.className = iconClass || "fas fa-info-circle";
        }
        toast.classList.add("show");
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(function () {
            toast.classList.remove("show");
        }, 3000);
    }

    copyBtns.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            const textToCopy = btn.getAttribute("data-copy");
            if (!textToCopy) return;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy).then(function () {
                    showToast("Copied to clipboard: " + textToCopy);
                }).catch(function () {
                    copyFallback(textToCopy);
                });
            } else {
                copyFallback(textToCopy);
            }
        });
    });

    function copyFallback(text) {
        const tempInput = document.createElement("input");
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
            document.execCommand("copy");
            showToast("Copied to clipboard: " + text);
        } catch (err) {
            showToast("Failed to copy automatically.");
        }
        document.body.removeChild(tempInput);
    }


    // ==========================================
    // 15. Sweet Girl Voice Welcome & Sound Synthesizer
    // ==========================================
    const soundToggle = document.getElementById("soundToggle");
    const soundIcon = document.getElementById("soundIcon");
    const heroVoiceWelcomeBtn = document.getElementById("heroVoiceWelcomeBtn");
    let audioCtx = null;
    let soundEnabled = localStorage.getItem("portfolioSoundEnabled") !== "false"; // default enabled
    let hasWelcomed = sessionStorage.getItem("portfolioWelcomedOnce") === "true";
    let cachedVoices = [];

    // Cache speech synthesis voices as soon as browser loads them
    function loadVoices() {
        if ("speechSynthesis" in window) {
            cachedVoices = window.speechSynthesis.getVoices();
        }
    }
    if ("speechSynthesis" in window) {
        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    function updateSoundUi() {
        if (!soundToggle || !soundIcon) return;
        if (soundEnabled) {
            soundToggle.classList.add("active");
            soundToggle.setAttribute("aria-pressed", "true");
            soundIcon.className = "fas fa-volume-high";
            soundToggle.title = "Mute Sound & Voice Greetings";
        } else {
            soundToggle.classList.remove("active");
            soundToggle.setAttribute("aria-pressed", "false");
            soundIcon.className = "fas fa-volume-mute";
            soundToggle.title = "Enable Sound & Voice Greetings";
        }
    }

    function initAudio() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
        }
    }

    // Interaction events to unlock browser audio policy
    const welcomeEvents = ["touchstart", "click", "keydown", "scroll", "pointerdown"];

    function removeWelcomeInteractionListeners() {
        welcomeEvents.forEach(function (evt) {
            window.removeEventListener(evt, handleFirstWelcomeInteraction);
        });
    }

    function handleFirstWelcomeInteraction() {
        removeWelcomeInteractionListeners();
        if (!hasWelcomed && soundEnabled) {
            playWelcomeGreeting(false);
        }
    }

    if (!hasWelcomed) {
        welcomeEvents.forEach(function (evt) {
            window.addEventListener(evt, handleFirstWelcomeInteraction, { passive: true, once: true });
        });
    }

    // Play pleasant crystal chime chord via Web Audio API
    function playCrystalWelcomeChime() {
        if (!soundEnabled) return;
        try {
            initAudio();
            if (!audioCtx) return;
            const now = audioCtx.currentTime;
            const notes = [
                { freq: 783.99, time: 0.00, dur: 0.35, gain: 0.10 }, // G5
                { freq: 1046.50, time: 0.08, dur: 0.38, gain: 0.12 }, // C6
                { freq: 1318.51, time: 0.16, dur: 0.42, gain: 0.13 }, // E6
                { freq: 1567.98, time: 0.24, dur: 0.55, gain: 0.14 }  // G6
            ];

            notes.forEach(function (n) {
                const osc = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                osc.type = "sine";
                osc.frequency.setValueAtTime(n.freq, now + n.time);

                gainNode.gain.setValueAtTime(0.0001, now + n.time);
                gainNode.gain.exponentialRampToValueAtTime(n.gain, now + n.time + 0.02);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);

                osc.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                osc.start(now + n.time);
                osc.stop(now + n.time + n.dur + 0.05);
            });
        } catch (err) {
            // Audio context policy fallback
        }
    }

    // Find the sweetest, most pleasant female voice available on the device
    function getSweetGirlVoice() {
        if (!("speechSynthesis" in window)) return null;
        if (!cachedVoices || cachedVoices.length === 0) {
            cachedVoices = window.speechSynthesis.getVoices();
        }
        if (!cachedVoices || cachedVoices.length === 0) return null;

        // Preferred sweet natural female voice names across Windows, macOS, iOS, Android, and Chrome
        const sweetFemaleKeywords = [
            "jenny", "natural", "aria", "samantha", "victoria", "karen",
            "zira", "moira", "fiona", "tessa", "female", "girl",
            "google us english", "google uk english female"
        ];

        for (let i = 0; i < sweetFemaleKeywords.length; i++) {
            const kw = sweetFemaleKeywords[i];
            const match = cachedVoices.find(function (v) {
                const name = (v.name || "").toLowerCase();
                const lang = (v.lang || "").toLowerCase();
                return (lang.startsWith("en") || lang.includes("us") || lang.includes("gb")) && name.includes(kw);
            });
            if (match) return match;
        }

        // Secondary fallback: any English female voice
        const anyFemale = cachedVoices.find(function (v) {
            const name = (v.name || "").toLowerCase();
            return (v.lang || "").toLowerCase().startsWith("en") && (name.includes("female") || name.includes("woman"));
        });
        if (anyFemale) return anyFemale;

        // Tertiary fallback: any English voice
        const anyEn = cachedVoices.find(function (v) {
            return (v.lang || "").toLowerCase().startsWith("en");
        });
        return anyEn || cachedVoices[0];
    }

    // Play the sweet girl voice greeting — strictly ONE TIME when opened
    function playWelcomeGreeting(force) {
        if (!soundEnabled) return;
        if (hasWelcomed && !force) return;

        // Lock immediately so it only executes once
        hasWelcomed = true;
        sessionStorage.setItem("portfolioWelcomedOnce", "true");
        removeWelcomeInteractionListeners();

        // Play sparkling crystal chime chord first
        playCrystalWelcomeChime();

        if (!("speechSynthesis" in window)) return;

        try {
            // If already speaking, cancel previous speech
            window.speechSynthesis.cancel();

            // Custom sweet greeting requested by user
            const welcomeUtterance = new SpeechSynthesisUtterance(
                "Hey there!! Welcome to my portfolio. I'm Jeevitha. Take a look around and explore my work!!"
            );

            const girlVoice = getSweetGirlVoice();
            if (girlVoice) {
                welcomeUtterance.voice = girlVoice;
            }

            // Tuned for sweet, cheerful, friendly girl tone
            welcomeUtterance.pitch = 1.30;
            welcomeUtterance.rate = 0.92;
            welcomeUtterance.volume = 1.0;

            const voiceBars = document.querySelectorAll(".voice-anim-bars");

            welcomeUtterance.onstart = function () {
                voiceBars.forEach(function (el) {
                    el.classList.add("speaking");
                });
                showToast("❤️ Hey there! Welcome to my portfolio!", "fas fa-volume-high");
            };

            welcomeUtterance.onend = function () {
                voiceBars.forEach(function (el) {
                    el.classList.remove("speaking");
                });
            };

            welcomeUtterance.onerror = function () {
                voiceBars.forEach(function (el) {
                    el.classList.remove("speaking");
                });
            };

            // Small delay to allow the crystal chime to ring in softly
            setTimeout(function () {
                window.speechSynthesis.speak(welcomeUtterance);
            }, 250);

        } catch (e) {
            // Speech synthesis fallback
        }
    }

    // Attempt auto-greeting on initial page load (if allowed by browser)
    window.addEventListener("load", function () {
        setTimeout(function () {
            if (!hasWelcomed && soundEnabled) {
                playWelcomeGreeting(false);
            }
        }, 600);
    });

    function playUiSound(type) {
        if (!soundEnabled) return;
        try {
            initAudio();
            if (!audioCtx) return;
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            if (type === "click" || type === "nav") {
                osc.type = "sine";
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
            } else if (type === "run" || type === "success") {
                osc.type = "triangle";
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
                osc.frequency.exponentialRampToValueAtTime(1320, now + 0.16);
                gain.gain.setValueAtTime(0.18, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.20);
                osc.start(now);
                osc.stop(now + 0.20);
            } else if (type === "chat") {
                osc.type = "sine";
                osc.frequency.setValueAtTime(587.33, now);
                osc.frequency.setValueAtTime(880, now + 0.07);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
            }
        } catch (e) {
            // Audio policy fallback
        }
    }

    if (soundToggle) {
        updateSoundUi();
        soundToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            soundEnabled = !soundEnabled;
            localStorage.setItem("portfolioSoundEnabled", soundEnabled);
            updateSoundUi();
            if (soundEnabled) {
                initAudio();
                playWelcomeGreeting(true);
                showToast("Sound & Sweet Voice Greeting Enabled! 🔊", "fas fa-volume-high");
            } else {
                if ("speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                }
                showToast("Sound & Voice Muted 🔇", "fas fa-volume-mute");
            }
        });
    }

    if (heroVoiceWelcomeBtn) {
        heroVoiceWelcomeBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            soundEnabled = true;
            localStorage.setItem("portfolioSoundEnabled", "true");
            updateSoundUi();
            initAudio();
            playWelcomeGreeting(true);
        });
    }

    // Add subtle sound to buttons
    document.querySelectorAll("button, .btn, .filter-btn, .nav-cmd-pill, .ai-chip").forEach(function (btn) {
        btn.addEventListener("click", function () {
            if (btn.id === "soundToggle" || btn.id === "heroVoiceWelcomeBtn") return;
            playUiSound("click");
        });
    });


    // ==========================================
    // 16. Interactive AI Code & Simulation Lab (#lab)
    // ==========================================
    const labTabs = document.querySelectorAll(".lab-tab-btn");
    const terminalLineNumbers = document.getElementById("terminalLineNumbers");
    const terminalCodeDisplay = document.getElementById("terminalCodeDisplay");
    const terminalConsoleLogs = document.getElementById("terminalConsoleLogs");
    const copyCodeSnippetBtn = document.getElementById("copyCodeSnippetBtn");
    const runCodeSnippetBtn = document.getElementById("runCodeSnippetBtn");
    const clearLogsBtn = document.getElementById("clearLogsBtn");
    const currentFileNameEl = document.getElementById("currentFileName");
    const labParamsPanel = document.getElementById("labParamsPanel");
    const labHardwareText = document.getElementById("labHardwareText");
    const executionStatusPill = document.getElementById("executionStatusPill");
    const labStatusText = document.getElementById("labStatusText");

    // Stage Views
    const stagePose = document.getElementById("stagePose");
    const stageGroq = document.getElementById("stageGroq");
    const stageNeural = document.getElementById("stageNeural");
    const stageTimetable = document.getElementById("stageTimetable");

    // Canvas References
    const poseCanvas = document.getElementById("poseCanvas");
    const lossChartCanvas = document.getElementById("lossChartCanvas");

    // HUD & Metric elements
    const poseRepCount = document.getElementById("poseRepCount");
    const poseAngleVal = document.getElementById("poseAngleVal");
    const poseScoreVal = document.getElementById("poseScoreVal");
    const posePhaseVal = document.getElementById("posePhaseVal");

    const groqTpsVal = document.getElementById("groqTpsVal");
    const speedBarFill = document.getElementById("speedBarFill");
    const groqTtftVal = document.getElementById("groqTtftVal");
    const groqPromptText = document.getElementById("groqPromptText");
    const groqResponseText = document.getElementById("groqResponseText");

    const nnAccVal = document.getElementById("nnAccVal");
    const nnLossVal = document.getElementById("nnLossVal");
    const nnF1Val = document.getElementById("nnF1Val");
    const nnEpochVal = document.getElementById("nnEpochVal");

    const cspSolveTime = document.getElementById("cspSolveTime");
    const timetableGridPreview = document.getElementById("timetableGridPreview");

    // Active state
    let activeTabKey = "pose";
    let isPipelineRunning = false;
    let poseAnimFrameId = null;
    let poseRepCounter = 0;

    // Code Snippets Data Dictionary
    const codeSnippets = {
        pose: {
            filename: "pose_analyzer.py",
            hardware: "WebGL / TensorRT (GPU 0)",
            raw: `import cv2
import mediapipe as mp
import numpy as np

# Initialize MediaPipe Pose Model (33 3D Keypoints)
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.Pose(
    static_image_mode=False,
    model_complexity=2,
    smooth_landmarks=True,
    min_detection_confidence=0.75,
    min_tracking_confidence=0.75
)

def calculate_angle(a, b, c):
    """Calculate 2D joint angle between three landmarks in degrees"""
    a, b, c = np.array(a), np.array(b), np.array(c)
    radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
    angle = np.abs(radians * 180.0 / np.pi)
    return 360.0 - angle if angle > 180.0 else angle

# Real-time Video Stream & Kinematic Evaluation
cap = cv2.VideoCapture(0)
rep_counter, stage = 0, "standing"

while cap.isOpened():
    ret, frame = cap.read()
    if not ret: break
    image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(image_rgb)
    
    if results.pose_landmarks:
        lm = results.pose_landmarks.landmark
        hip = [lm[mp_pose.PoseLandmark.LEFT_HIP.value].x, lm[mp_pose.PoseLandmark.LEFT_HIP.value].y]
        knee = [lm[mp_pose.PoseLandmark.LEFT_KNEE.value].x, lm[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
        ankle = [lm[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, lm[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
        
        angle = calculate_angle(hip, knee, ankle)
        if angle < 90 and stage == "standing":
            stage = "deep_squat"
        if angle > 160 and stage == "deep_squat":
            stage = "standing"
            rep_counter += 1
            print(f"[REP #{rep_counter}] Validated Squat | Form Score: 98.4%")

    cv2.imshow("AI Sports Pose Analyzer", frame)
    if cv2.waitKey(10) & 0xFF == ord('q'): break
cap.release()`,
            html: `<span class="tok-kw">import</span> cv2
<span class="tok-kw">import</span> mediapipe <span class="tok-kw">as</span> mp
<span class="tok-kw">import</span> numpy <span class="tok-kw">as</span> np

<span class="tok-cmt"># Initialize MediaPipe Pose Model (33 3D Keypoints)</span>
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
pose = mp_pose.<span class="tok-fn">Pose</span>(
    static_image_mode=<span class="tok-kw">False</span>,
    model_complexity=<span class="tok-num">2</span>,
    smooth_landmarks=<span class="tok-kw">True</span>,
    min_detection_confidence=<span class="tok-num">0.75</span>,
    min_tracking_confidence=<span class="tok-num">0.75</span>
)

<span class="tok-kw">def</span> <span class="tok-fn">calculate_angle</span>(a, b, c):
    <span class="tok-str">"""Calculate 2D joint angle between three landmarks in degrees"""</span>
    a, b, c = np.<span class="tok-fn">array</span>(a), np.<span class="tok-fn">array</span>(b), np.<span class="tok-fn">array</span>(c)
    radians = np.<span class="tok-fn">arctan2</span>(c[<span class="tok-num">1</span>] - b[<span class="tok-num">1</span>], c[<span class="tok-num">0</span>] - b[<span class="tok-num">0</span>]) - np.<span class="tok-fn">arctan2</span>(a[<span class="tok-num">1</span>] - b[<span class="tok-num">1</span>], a[<span class="tok-num">0</span>] - b[<span class="tok-num">0</span>])
    angle = np.<span class="tok-fn">abs</span>(radians * <span class="tok-num">180.0</span> / np.pi)
    <span class="tok-kw">return</span> <span class="tok-num">360.0</span> - angle <span class="tok-kw">if</span> angle &gt; <span class="tok-num">180.0</span> <span class="tok-kw">else</span> angle

<span class="tok-cmt"># Real-time Video Stream &amp; Kinematic Evaluation</span>
cap = cv2.<span class="tok-fn">VideoCapture</span>(<span class="tok-num">0</span>)
rep_counter, stage = <span class="tok-num">0</span>, <span class="tok-str">"standing"</span>

<span class="tok-kw">while</span> cap.<span class="tok-fn">isOpened</span>():
    ret, frame = cap.<span class="tok-fn">read</span>()
    <span class="tok-kw">if not</span> ret: <span class="tok-kw">break</span>
    image_rgb = cv2.<span class="tok-fn">cvtColor</span>(frame, cv2.COLOR_BGR2RGB)
    results = pose.<span class="tok-fn">process</span>(image_rgb)
    
    <span class="tok-kw">if</span> results.pose_landmarks:
        lm = results.pose_landmarks.landmark
        hip = [lm[mp_pose.PoseLandmark.LEFT_HIP.value].x, lm[mp_pose.PoseLandmark.LEFT_HIP.value].y]
        knee = [lm[mp_pose.PoseLandmark.LEFT_KNEE.value].x, lm[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
        ankle = [lm[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, lm[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
        
        angle = <span class="tok-fn">calculate_angle</span>(hip, knee, ankle)
        <span class="tok-kw">if</span> angle &lt; <span class="tok-num">90</span> <span class="tok-kw">and</span> stage == <span class="tok-str">"standing"</span>:
            stage = <span class="tok-str">"deep_squat"</span>
        <span class="tok-kw">if</span> angle &gt; <span class="tok-num">160</span> <span class="tok-kw">and</span> stage == <span class="tok-str">"deep_squat"</span>:
            stage = <span class="tok-str">"standing"</span>
            rep_counter += <span class="tok-num">1</span>
            <span class="tok-fn">print</span>(<span class="tok-str">f"[REP #{rep_counter}] Validated Squat | Form Score: 98.4%"</span>)

    cv2.<span class="tok-fn">imshow</span>(<span class="tok-str">"AI Sports Pose Analyzer"</span>, frame)
    <span class="tok-kw">if</span> cv2.<span class="tok-fn">waitKey</span>(<span class="tok-num">10</span>) &amp; <span class="tok-num">0xFF</span> == <span class="tok-fn">ord</span>(<span class="tok-str">'q'</span>): <span class="tok-kw">break</span>
cap.<span class="tok-fn">release</span>()`
        },
        groq: {
            filename: "groq_voice_ai.py",
            hardware: "Groq LPU™ Tensor Cluster",
            raw: `import os
import time
from groq import Groq
import speech_recognition as sr
import pyttsx3

# Initialize Groq Cloud LPU Ultra-Fast LLM Client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
engine = pyttsx3.init()

SYSTEM_PROMPT = """You are Jeevitha Sakthivel's Academic & Code Assistant.
Provide concise, production-ready Python, GenAI, and system optimization tips."""

def stream_groq_response(user_query):
    print(f"[QUERY] Inbound audio transcribed: '{user_query}'")
    start_time = time.time()
    first_token_time = None
    
    stream = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_query}
        ],
        temperature=0.6,
        max_tokens=512,
        stream=True
    )
    
    full_response = []
    token_count = 0
    for chunk in stream:
        token = chunk.choices[0].delta.content or ""
        if token and first_token_time is None:
            first_token_time = time.time()
            ttft = (first_token_time - start_time) * 1000
            print(f"[GROQ LPU] Time To First Token: {ttft:.1f}ms")
        full_response.append(token)
        token_count += 1
        print(token, end="", flush=True)

    total_time = time.time() - start_time
    tps = token_count / total_time
    print(f"\n[BENCHMARK] Streamed {token_count} tokens @ {tps:.1f} tokens/sec")
    return "".join(full_response)

if __name__ == "__main__":
    stream_groq_response("Explain how MediaPipe pose landmark estimation works")`,
            html: `<span class="tok-kw">import</span> os
<span class="tok-kw">import</span> time
<span class="tok-kw">from</span> groq <span class="tok-kw">import</span> Groq
<span class="tok-kw">import</span> speech_recognition <span class="tok-kw">as</span> sr
<span class="tok-kw">import</span> pyttsx3

<span class="tok-cmt"># Initialize Groq Cloud LPU Ultra-Fast LLM Client</span>
client = <span class="tok-fn">Groq</span>(api_key=os.environ.<span class="tok-fn">get</span>(<span class="tok-str">"GROQ_API_KEY"</span>))
engine = pyttsx3.<span class="tok-fn">init</span>()

SYSTEM_PROMPT = <span class="tok-str">"""You are Jeevitha Sakthivel's Academic &amp; Code Assistant.
Provide concise, production-ready Python, GenAI, and system optimization tips."""</span>

<span class="tok-kw">def</span> <span class="tok-fn">stream_groq_response</span>(user_query):
    <span class="tok-fn">print</span>(<span class="tok-str">f"[QUERY] Inbound audio transcribed: '{user_query}'"</span>)
    start_time = time.<span class="tok-fn">time</span>()
    first_token_time = <span class="tok-kw">None</span>
    
    stream = client.chat.completions.<span class="tok-fn">create</span>(
        model=<span class="tok-str">"llama3-70b-8192"</span>,
        messages=[
            {<span class="tok-str">"role"</span>: <span class="tok-str">"system"</span>, <span class="tok-str">"content"</span>: SYSTEM_PROMPT},
            {<span class="tok-str">"role"</span>: <span class="tok-str">"user"</span>, <span class="tok-str">"content"</span>: user_query}
        ],
        temperature=<span class="tok-num">0.6</span>,
        max_tokens=<span class="tok-num">512</span>,
        stream=<span class="tok-kw">True</span>
    )
    
    full_response = []
    token_count = <span class="tok-num">0</span>
    <span class="tok-kw">for</span> chunk <span class="tok-kw">in</span> stream:
        token = chunk.choices[<span class="tok-num">0</span>].delta.content <span class="tok-kw">or</span> <span class="tok-str">""</span>
        <span class="tok-kw">if</span> token <span class="tok-kw">and</span> first_token_time <span class="tok-kw">is None</span>:
            first_token_time = time.<span class="tok-fn">time</span>()
            ttft = (first_token_time - start_time) * <span class="tok-num">1000</span>
            <span class="tok-fn">print</span>(<span class="tok-str">f"[GROQ LPU] Time To First Token: {ttft:.1f}ms"</span>)
        full_response.<span class="tok-fn">append</span>(token)
        token_count += <span class="tok-num">1</span>
        <span class="tok-fn">print</span>(token, end=<span class="tok-str">""</span>, flush=<span class="tok-kw">True</span>)

    total_time = time.<span class="tok-fn">time</span>() - start_time
    tps = token_count / total_time
    <span class="tok-fn">print</span>(<span class="tok-str">f"\n[BENCHMARK] Streamed {token_count} tokens @ {tps:.1f} tokens/sec"</span>)
    <span class="tok-kw">return</span> <span class="tok-str">""</span>.<span class="tok-fn">join</span>(full_response)

<span class="tok-kw">if</span> __name__ == <span class="tok-str">"__main__"</span>:
    <span class="tok-fn">stream_groq_response</span>(<span class="tok-str">"Explain how MediaPipe pose landmark estimation works"</span>)`
        },
        neural: {
            filename: "neural_classifier.py",
            hardware: "NVIDIA CUDA / cuDNN 8.9",
            raw: `import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader

# Define Deep Residual Classifier Architecture
class DeepClassifier(nn.Module):
    def __init__(self, num_classes=10):
        super(DeepClassifier, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(kernel_size=2, stride=2),
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.AdaptiveAvgPool2d((4, 4))
        )
        self.classifier = nn.Sequential(
            nn.Linear(128 * 4 * 4, 256),
            nn.Dropout(p=0.3),
            nn.ReLU(inplace=True),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = torch.flatten(x, 1)
        return self.classifier(x)

# Training Loop with AdamW Optimizer
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = DeepClassifier(num_classes=10).to(device)
criterion = nn.CrossEntropyLoss()
optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)

def train_epoch(dataloader, epoch):
    model.train()
    running_loss, correct, total = 0.0, 0, 0
    for batch_idx, (inputs, targets) in enumerate(dataloader):
        inputs, targets = inputs.to(device), targets.to(device)
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, targets)
        loss.backward()
        optimizer.step()
        running_loss += loss.item() * inputs.size(0)
        _, predicted = outputs.max(1)
        total += targets.size(0)
        correct += predicted.eq(targets).sum().item()
    return running_loss / total, 100.0 * correct / total`,
            html: `<span class="tok-kw">import</span> torch
<span class="tok-kw">import</span> torch.nn <span class="tok-kw">as</span> nn
<span class="tok-kw">import</span> torch.optim <span class="tok-kw">as</span> optim
<span class="tok-kw">from</span> torch.utils.data <span class="tok-kw">import</span> DataLoader

<span class="tok-cmt"># Define Deep Residual Classifier Architecture</span>
<span class="tok-kw">class</span> <span class="tok-var">DeepClassifier</span>(nn.Module):
    <span class="tok-kw">def</span> <span class="tok-fn">__init__</span>(self, num_classes=<span class="tok-num">10</span>):
        <span class="tok-fn">super</span>(DeepClassifier, self).<span class="tok-fn">__init__</span>()
        self.features = nn.<span class="tok-fn">Sequential</span>(
            nn.<span class="tok-fn">Conv2d</span>(<span class="tok-num">3</span>, <span class="tok-num">64</span>, kernel_size=<span class="tok-num">3</span>, padding=<span class="tok-num">1</span>),
            nn.<span class="tok-fn">BatchNorm2d</span>(<span class="tok-num">64</span>),
            nn.<span class="tok-fn">ReLU</span>(inplace=<span class="tok-kw">True</span>),
            nn.<span class="tok-fn">MaxPool2d</span>(kernel_size=<span class="tok-num">2</span>, stride=<span class="tok-num">2</span>),
            nn.<span class="tok-fn">Conv2d</span>(<span class="tok-num">64</span>, <span class="tok-num">128</span>, kernel_size=<span class="tok-num">3</span>, padding=<span class="tok-num">1</span>),
            nn.<span class="tok-fn">BatchNorm2d</span>(<span class="tok-num">128</span>),
            nn.<span class="tok-fn">ReLU</span>(inplace=<span class="tok-kw">True</span>),
            nn.<span class="tok-fn">AdaptiveAvgPool2d</span>((<span class="tok-num">4</span>, <span class="tok-num">4</span>))
        )
        self.classifier = nn.<span class="tok-fn">Sequential</span>(
            nn.<span class="tok-fn">Linear</span>(<span class="tok-num">128</span> * <span class="tok-num">4</span> * <span class="tok-num">4</span>, <span class="tok-num">256</span>),
            nn.<span class="tok-fn">Dropout</span>(p=<span class="tok-num">0.3</span>),
            nn.<span class="tok-fn">ReLU</span>(inplace=<span class="tok-kw">True</span>),
            nn.<span class="tok-fn">Linear</span>(<span class="tok-num">256</span>, num_classes)
        )

    <span class="tok-kw">def</span> <span class="tok-fn">forward</span>(self, x):
        x = self.<span class="tok-fn">features</span>(x)
        x = torch.<span class="tok-fn">flatten</span>(x, <span class="tok-num">1</span>)
        <span class="tok-kw">return</span> self.<span class="tok-fn">classifier</span>(x)

<span class="tok-cmt"># Training Loop with AdamW Optimizer</span>
device = torch.<span class="tok-fn">device</span>(<span class="tok-str">"cuda"</span> <span class="tok-kw">if</span> torch.cuda.<span class="tok-fn">is_available</span>() <span class="tok-kw">else</span> <span class="tok-str">"cpu"</span>)
model = <span class="tok-fn">DeepClassifier</span>(num_classes=<span class="tok-num">10</span>).<span class="tok-fn">to</span>(device)
criterion = nn.<span class="tok-fn">CrossEntropyLoss</span>()
optimizer = optim.<span class="tok-fn">AdamW</span>(model.<span class="tok-fn">parameters</span>(), lr=<span class="tok-num">1e-3</span>, weight_decay=<span class="tok-num">1e-4</span>)

<span class="tok-kw">def</span> <span class="tok-fn">train_epoch</span>(dataloader, epoch):
    model.<span class="tok-fn">train</span>()
    running_loss, correct, total = <span class="tok-num">0.0</span>, <span class="tok-num">0</span>, <span class="tok-num">0</span>
    <span class="tok-kw">for</span> batch_idx, (inputs, targets) <span class="tok-kw">in</span> <span class="tok-fn">enumerate</span>(dataloader):
        inputs, targets = inputs.<span class="tok-fn">to</span>(device), targets.<span class="tok-fn">to</span>(device)
        optimizer.<span class="tok-fn">zero_grad</span>()
        outputs = <span class="tok-fn">model</span>(inputs)
        loss = <span class="tok-fn">criterion</span>(outputs, targets)
        loss.<span class="tok-fn">backward</span>()
        optimizer.<span class="tok-fn">step</span>()
        running_loss += loss.<span class="tok-fn">item</span>() * inputs.<span class="tok-fn">size</span>(<span class="tok-num">0</span>)
        _, predicted = outputs.<span class="tok-fn">max</span>(<span class="tok-num">1</span>)
        total += targets.<span class="tok-fn">size</span>(<span class="tok-num">0</span>)
        correct += predicted.<span class="tok-fn">eq</span>(targets).<span class="tok-fn">sum</span>().<span class="tok-fn">item</span>()
    <span class="tok-kw">return</span> running_loss / total, <span class="tok-num">100.0</span> * correct / total`
        },
        timetable: {
            filename: "timetable_csp.py",
            hardware: "CSP Constraint Solver Engine",
            raw: `class TimetableCSP:
    """Constraint Satisfaction Backtracking Scheduler for College Depts"""
    def __init__(self, subjects, faculty, classrooms, time_slots):
        self.subjects = subjects       # List of departmental courses
        self.faculty = faculty         # Course -> Professor mapping
        self.classrooms = classrooms   # Lecture halls & AI/ML Labs
        self.time_slots = time_slots   # Mon-Fri x 6 periods
        self.schedule = {}             # Solution: subject -> (teacher, room, slot)

    def is_conflict_free(self, subject, teacher, room, slot):
        """Verify hard constraints: No faculty clash & no classroom overlap"""
        for s, (t, r, sl) in self.schedule.items():
            if sl == slot and t == teacher:
                return False  # Faculty already teaching another section
            if sl == slot and r == room:
                return False  # Classroom or Lab hardware occupied
        return True

    def solve(self, index=0):
        """MRV Backtracking search with Forward Checking"""
        if index == len(self.subjects):
            return True  # All variables assigned with zero violations
            
        subject = self.subjects[index]
        teacher = self.faculty[subject]
        
        for slot in self.time_slots:
            for room in self.classrooms:
                if self.is_conflict_free(subject, teacher, room, slot):
                    self.schedule[subject] = (teacher, room, slot)
                    if self.solve(index + 1):
                        return True
                    del self.schedule[subject]  # Backtrack step
        return False

# Initialize and Solve
if __name__ == "__main__":
    csp = TimetableCSP(subjects, faculty, classrooms, time_slots)
    if csp.solve():
        print("[CSP] Valid Conflict-Free Timetable Generated in 0.24s!")`,
            html: `<span class="tok-kw">class</span> <span class="tok-var">TimetableCSP</span>:
    <span class="tok-str">"""Constraint Satisfaction Backtracking Scheduler for College Depts"""</span>
    <span class="tok-kw">def</span> <span class="tok-fn">__init__</span>(self, subjects, faculty, classrooms, time_slots):
        self.subjects = subjects       <span class="tok-cmt"># List of departmental courses</span>
        self.faculty = faculty         <span class="tok-cmt"># Course -&gt; Professor mapping</span>
        self.classrooms = classrooms   <span class="tok-cmt"># Lecture halls &amp; AI/ML Labs</span>
        self.time_slots = time_slots   <span class="tok-cmt"># Mon-Fri x 6 periods</span>
        self.schedule = {}             <span class="tok-cmt"># Solution: subject -&gt; (teacher, room, slot)</span>

    <span class="tok-kw">def</span> <span class="tok-fn">is_conflict_free</span>(self, subject, teacher, room, slot):
        <span class="tok-str">"""Verify hard constraints: No faculty clash &amp; no classroom overlap"""</span>
        <span class="tok-kw">for</span> s, (t, r, sl) <span class="tok-kw">in</span> self.schedule.<span class="tok-fn">items</span>():
            <span class="tok-kw">if</span> sl == slot <span class="tok-kw">and</span> t == teacher:
                <span class="tok-kw">return False</span>  <span class="tok-cmt"># Faculty already teaching another section</span>
            <span class="tok-kw">if</span> sl == slot <span class="tok-kw">and</span> r == room:
                <span class="tok-kw">return False</span>  <span class="tok-cmt"># Classroom or Lab hardware occupied</span>
        <span class="tok-kw">return True</span>

    <span class="tok-kw">def</span> <span class="tok-fn">solve</span>(self, index=<span class="tok-num">0</span>):
        <span class="tok-str">"""MRV Backtracking search with Forward Checking"""</span>
        <span class="tok-kw">if</span> index == <span class="tok-fn">len</span>(self.subjects):
            <span class="tok-kw">return True</span>  <span class="tok-cmt"># All variables assigned with zero violations</span>
            
        subject = self.subjects[index]
        teacher = self.faculty[subject]
        
        <span class="tok-kw">for</span> slot <span class="tok-kw">in</span> self.time_slots:
            <span class="tok-kw">for</span> room <span class="tok-kw">in</span> self.classrooms:
                <span class="tok-kw">if</span> self.<span class="tok-fn">is_conflict_free</span>(subject, teacher, room, slot):
                    self.schedule[subject] = (teacher, room, slot)
                    <span class="tok-kw">if</span> self.<span class="tok-fn">solve</span>(index + <span class="tok-num">1</span>):
                        <span class="tok-kw">return True</span>
                    <span class="tok-kw">del</span> self.schedule[subject]  <span class="tok-cmt"># Backtrack step</span>
        <span class="tok-kw">return False</span>

<span class="tok-cmt"># Initialize and Solve</span>
<span class="tok-kw">if</span> __name__ == <span class="tok-str">"__main__"</span>:
    csp = <span class="tok-fn">TimetableCSP</span>(subjects, faculty, classrooms, time_slots)
    <span class="tok-kw">if</span> csp.<span class="tok-fn">solve</span>():
        <span class="tok-fn">print</span>(<span class="tok-str">"[CSP] Valid Conflict-Free Timetable Generated in 0.24s!"</span>)`
        }
    };

    // Groq Query Presets
    const groqPresets = [
        {
            query: "Explain how MediaPipe pose landmark estimation works",
            text: `### MediaPipe Pose Landmark Estimation Pipeline

MediaPipe Pose implements a high-throughput **Detector-Tracker** architecture:

1. **BlazePose Detector (Single-Shot Detector)**:
   - Identifies the region-of-interest (ROI) within full resolution frames.
   - Computes an aligned bounding box centered at mid-hip and shoulder keypoints.
   - Invoked only on initial video frame or when tracking confidence drops below 0.75.

2. **3D Landmark Regressor**:
   - Ingests the 256x256 cropped ROI and regresses **33 3D landmarks** (x, y, z).
   - Coordinates (x, y) represent normalized image space; z indicates depth relative to mid-hip center.
   - Generates landmark visibility probabilities for occlusion handling.

3. **Kinematic Angle Trigonometry**:
   - Calculates joint angles using 2D vector dot products:
     $$\\theta = \\arccos\\left(\\frac{\\vec{u} \\cdot \\vec{v}}{\\|\\vec{u}\\| \\|\\vec{v}\\|}\\right)$$
   - Sub-10ms latency ensures stable 60 FPS feedback for athletic reps.`
        },
        {
            query: "Compare PyTorch CNN vs Vision Transformer for edge devices",
            text: `### CNN vs. Vision Transformer (ViT) on Edge Systems

| Metric | Convolutional Net (MobileNetV4) | Vision Transformer (ViT-Small) |
|---|---|---|
| **Inductive Bias** | Spatial locality & shift invariance | Minimal (must learn patch relations) |
| **Data Efficiency** | High (converges on small datasets) | Requires extensive pre-training |
| **Complexity** | $\\mathcal{O}(K \\cdot H \\cdot W)$ linear with resolution | $\\mathcal{O}(N^2)$ quadratic with tokens |
| **Memory Bandwidth**| Cache-friendly streaming kernels | High KV/attention memory traffic |
| **Edge Feasibility** | **Optimal (60+ FPS on mobile)** | Requires dedicated NPU acceleration |

**Recommendation**: For real-time mobile computer vision and pose tracking, optimized CNN backbones remain superior for latency and thermal efficiency.`
        },
        {
            query: "How does Groq LPU achieve 300+ tokens/sec?",
            text: `### Groq LPU™ Tensor Streaming Architecture

Groq achieves deterministic 300+ tokens/sec LLM inference via hardware-software co-design:

1. **Deterministic Execution (Ultra-SRAM)**:
   - Eliminates traditional HBM external memory bottlenecks.
   - Each Groq chip embeds **230 MB of on-chip SRAM** delivering 80 TB/s aggregate bandwidth.

2. **Software-Scheduled Hardware**:
   - Dispenses with runtime branch predictors, caches, and instruction dispatchers.
   - The Groq compiler orchestrates tensor movement down to individual clock cycles.

3. **Inter-Chip Interconnect**:
   - Low-latency chip-to-chip networking allows rack-scale tensor streaming.
   - **Result**: Consistent sub-120ms TTFT with unthrottled 300+ tokens/sec throughput!`
        },
        {
            query: "Implement an Attention Head in PyTorch",
            text: `### Scaled Dot-Product Attention in PyTorch

\`\`\`python
import torch
import torch.nn as nn
import math

class ScaledDotProductAttention(nn.Module):
    def __init__(self, d_k):
        super().__init__()
        self.scale = 1.0 / math.sqrt(d_k)
        self.dropout = nn.Dropout(0.1)

    def forward(self, Q, K, V, mask=None):
        # Q, K, V: [batch_size, n_heads, seq_len, d_k]
        scores = torch.matmul(Q, K.transpose(-2, -1)) * self.scale
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        attn = torch.softmax(scores, dim=-1)
        attn = self.dropout(attn)
        return torch.matmul(attn, V), attn
\`\`\`

- **Key Highlights**: Scaled by $\\frac{1}{\\sqrt{d_k}}$ to prevent vanishing gradients during softmax at large dimensions.`
        }
    ];

    // Render Parameters Panel for Active Tab
    function renderParametersPanel(tabKey) {
        if (!labParamsPanel) return;

        if (tabKey === "pose") {
            labParamsPanel.innerHTML = `
                <div class="param-group">
                    <label class="param-label" for="paramPoseExercise"><i class="fas fa-dumbbell"></i> Exercise:</label>
                    <select id="paramPoseExercise" class="param-select">
                        <option value="squat" selected>Squats (Hip-Knee-Ankle)</option>
                        <option value="curl">Bicep Curls (Shoulder-Elbow-Wrist)</option>
                        <option value="pushup">Pushups (Chest & Elbow)</option>
                    </select>
                </div>
                <div class="param-group">
                    <label class="param-label" for="paramPoseConf"><i class="fas fa-sliders-h"></i> Confidence:</label>
                    <select id="paramPoseConf" class="param-select">
                        <option value="0.75" selected>0.75 (Balanced)</option>
                        <option value="0.85">0.85 (High Precision)</option>
                        <option value="0.95">0.95 (Strict)</option>
                    </select>
                </div>
                <div class="param-group">
                    <span class="hw-pill"><i class="fas fa-check-circle text-green"></i> 33 3D Keypoints</span>
                </div>
            `;
            const exerciseSelect = document.getElementById("paramPoseExercise");
            if (exerciseSelect) {
                exerciseSelect.addEventListener("change", function () {
                    drawIdlePose(this.value);
                });
            }
        } else if (tabKey === "groq") {
            labParamsPanel.innerHTML = `
                <div class="param-group">
                    <label class="param-label" for="paramGroqPrompt"><i class="fas fa-comment-dots"></i> Query Prompt:</label>
                    <select id="paramGroqPrompt" class="param-select">
                        <option value="0" selected>Explain MediaPipe pose landmark estimation</option>
                        <option value="1">Compare PyTorch CNN vs Vision Transformer</option>
                        <option value="2">How does Groq LPU achieve 300+ tokens/sec?</option>
                        <option value="3">Implement an Attention Head in PyTorch</option>
                    </select>
                </div>
                <div class="param-group">
                    <label class="param-label" for="paramGroqTemp"><i class="fas fa-fire"></i> Temperature:</label>
                    <select id="paramGroqTemp" class="param-select">
                        <option value="0.2">0.2 (Deterministic)</option>
                        <option value="0.6" selected>0.6 (Balanced)</option>
                        <option value="0.9">0.9 (Creative)</option>
                    </select>
                </div>
                <div class="param-group">
                    <span class="hw-pill text-purple"><i class="fas fa-bolt"></i> Llama 3 70B</span>
                </div>
            `;
            const promptSelect = document.getElementById("paramGroqPrompt");
            if (promptSelect) {
                promptSelect.addEventListener("change", function () {
                    const idx = parseInt(this.value, 10);
                    if (groqPromptText && groqPresets[idx]) {
                        groqPromptText.textContent = groqPresets[idx].query;
                    }
                    if (groqResponseText) {
                        groqResponseText.textContent = 'Query selected. Click "Run Pipeline" to benchmark ultra-fast Groq LPU stream...';
                    }
                });
            }
        } else if (tabKey === "neural") {
            labParamsPanel.innerHTML = `
                <div class="param-group">
                    <label class="param-label" for="paramNnEpochs"><i class="fas fa-sync-alt"></i> Epochs:</label>
                    <select id="paramNnEpochs" class="param-select">
                        <option value="10" selected>10 Epochs (Full Convergence)</option>
                        <option value="5">5 Epochs (Quick Test)</option>
                        <option value="15">15 Epochs (High Accuracy)</option>
                    </select>
                </div>
                <div class="param-group">
                    <label class="param-label" for="paramNnLr"><i class="fas fa-tachometer-alt"></i> Learning Rate:</label>
                    <select id="paramNnLr" class="param-select">
                        <option value="0.001" selected>0.001 (AdamW)</option>
                        <option value="0.005">0.005 (Fast)</option>
                        <option value="0.0001">0.0001 (Cosine Annealing)</option>
                    </select>
                </div>
                <div class="param-group">
                    <span class="hw-pill text-pink"><i class="fas fa-layer-group"></i> ResNet-Tiny (10 Classes)</span>
                </div>
            `;
        } else if (tabKey === "timetable") {
            labParamsPanel.innerHTML = `
                <div class="param-group">
                    <label class="param-label" for="paramCspDept"><i class="fas fa-university"></i> Scope:</label>
                    <select id="paramCspDept" class="param-select">
                        <option value="aids" selected>AI &amp; DS Dept (8 Semesters, 42 Courses)</option>
                        <option value="full">All Engineering Depts (4 Branches)</option>
                    </select>
                </div>
                <div class="param-group">
                    <label class="param-label" for="paramCspAlgo"><i class="fas fa-sitemap"></i> Algorithm:</label>
                    <select id="paramCspAlgo" class="param-select">
                        <option value="mrv" selected>Backtracking + MRV Heuristic</option>
                        <option value="ac3">Forward Checking + AC-3</option>
                    </select>
                </div>
                <div class="param-group">
                    <span class="hw-pill status-ready"><i class="fas fa-shield-alt"></i> Hard Conflicts: 0</span>
                </div>
            `;
        }
    }

    // Switch Tab & Synchronize Visual Stage
    function renderTerminalSnippet(tabKey) {
        activeTabKey = tabKey;
        const snippet = codeSnippets[tabKey];
        if (!snippet || !terminalCodeDisplay) return;

        // Update active tab buttons
        labTabs.forEach(t => {
            if (t.getAttribute("data-tab") === tabKey) {
                t.classList.add("active");
            } else {
                t.classList.remove("active");
            }
        });

        // Update File Name & Hardware Pill
        if (currentFileNameEl) currentFileNameEl.textContent = snippet.filename;
        if (labHardwareText) labHardwareText.textContent = snippet.hardware;

        // Render line numbers
        const lineCount = snippet.raw.split("\n").length;
        let lineNumsHtml = "";
        for (let i = 1; i <= lineCount; i++) {
            lineNumsHtml += `<div>${i}</div>`;
        }
        if (terminalLineNumbers) terminalLineNumbers.innerHTML = lineNumsHtml;
        terminalCodeDisplay.innerHTML = snippet.html;

        // Render Parameters Panel
        renderParametersPanel(tabKey);

        // Switch Visual Stages
        if (stagePose) stagePose.style.display = (tabKey === "pose") ? "flex" : "none";
        if (stageGroq) stageGroq.style.display = (tabKey === "groq") ? "flex" : "none";
        if (stageNeural) stageNeural.style.display = (tabKey === "neural") ? "flex" : "none";
        if (stageTimetable) stageTimetable.style.display = (tabKey === "timetable") ? "flex" : "none";

        // Draw initial idle canvas / previews
        if (tabKey === "pose") {
            drawIdlePose("squat");
        } else if (tabKey === "groq") {
            if (groqPromptText) groqPromptText.textContent = groqPresets[0].query;
            if (groqResponseText && !isPipelineRunning) {
                groqResponseText.textContent = 'Select prompt options and click "Run Pipeline" to benchmark Groq LPU™ ultra-fast streaming output...';
            }
        } else if (tabKey === "neural") {
            drawLossChartPreview();
        } else if (tabKey === "timetable") {
            renderTimetableGrid();
        }

        // Reset console prompt line if not actively running
        if (terminalConsoleLogs && !isPipelineRunning) {
            terminalConsoleLogs.innerHTML = `<div class="log-entry prompt-line">$ loaded ${snippet.filename} &bull; Environment: Python 3.12 (${snippet.hardware}). Click "Run Pipeline" to execute simulation...</div>`;
        }

        if (executionStatusPill) {
            executionStatusPill.className = "hw-pill status-ready";
            if (labStatusText) labStatusText.textContent = "Ready";
        }
    }

    // Attach Tab Click Listeners
    labTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            if (isPipelineRunning) return;
            const tabKey = tab.getAttribute("data-tab");
            renderTerminalSnippet(tabKey);
        });
    });

    // Copy Source Code
    if (copyCodeSnippetBtn) {
        copyCodeSnippetBtn.addEventListener("click", function () {
            const snippet = codeSnippets[activeTabKey];
            if (!snippet) return;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(snippet.raw).then(function () {
                    showToast(`Copied ${snippet.filename} source to clipboard!`);
                });
            }
        });
    }

    // Clear Terminal Logs
    if (clearLogsBtn) {
        clearLogsBtn.addEventListener("click", function () {
            if (terminalConsoleLogs) {
                terminalConsoleLogs.innerHTML = `<div class="log-entry prompt-line">$ terminal logs cleared. Ready for next pipeline run.</div>`;
            }
        });
    }

    // Helper: Append a Log Entry
    function appendTerminalLog(type, text) {
        if (!terminalConsoleLogs) return;
        const logDiv = document.createElement("div");
        logDiv.className = `log-entry ${type}`;
        logDiv.textContent = text;
        terminalConsoleLogs.appendChild(logDiv);
        terminalConsoleLogs.scrollTop = terminalConsoleLogs.scrollHeight;
    }


    // ==========================================
    // Visual Simulation 1: MediaPipe Pose Kinematics Canvas
    // ==========================================
    function setupRetinaCanvas(canvas, width, height) {
        if (!canvas) return null;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        const ctx = canvas.getContext("2d");
        ctx.resetTransform();
        ctx.scale(dpr, dpr);
        return ctx;
    }

    function drawTechBackground(ctx, w, h) {
        ctx.fillStyle = "#060a14";
        ctx.fillRect(0, 0, w, h);

        // Subtle tech grid
        ctx.strokeStyle = "rgba(56, 189, 248, 0.05)";
        ctx.lineWidth = 1;
        for (let x = 20; x < w; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 20; y < h; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Tech Corner Crosshairs
        ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
        ctx.lineWidth = 1.5;
        const corners = [[16, 16], [w - 16, 16], [16, h - 16], [w - 16, h - 16]];
        corners.forEach(([cx, cy]) => {
            ctx.beginPath();
            ctx.moveTo(cx - 6, cy); ctx.lineTo(cx + 6, cy);
            ctx.moveTo(cx, cy - 6); ctx.lineTo(cx, cy + 6);
            ctx.stroke();
        });

        // Bounding Box Overlay
        ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(100, 24, 280, 236);
        ctx.setLineDash([]);

        // Detection Tag
        ctx.fillStyle = "rgba(14, 22, 40, 0.9)";
        ctx.fillRect(100, 10, 130, 16);
        ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
        ctx.strokeRect(100, 10, 130, 16);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 9px 'Consolas', monospace";
        ctx.fillText("POSE ID: #042 [CONF 98.7%]", 105, 22);
    }

    function drawSkeletonWireframe(ctx, joints, activeJointAngle, targetJointName) {
        // Bones connections
        const bones = [
            ["head", "neck"],
            ["neck", "lShoulder"], ["neck", "rShoulder"],
            ["lShoulder", "lElbow"], ["lElbow", "lWrist"],
            ["rShoulder", "rElbow"], ["rElbow", "rWrist"],
            ["lShoulder", "lHip"], ["rShoulder", "rHip"],
            ["lHip", "rHip"],
            ["lHip", "lKnee"], ["lKnee", "lAnkle"], ["lAnkle", "lFoot"],
            ["rHip", "rKnee"], ["rKnee", "rAnkle"], ["rAnkle", "rFoot"]
        ];

        // Draw glowing bones
        ctx.save();
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3.5;
        ctx.lineCap = "round";
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 10;

        bones.forEach(([p1, p2]) => {
            if (joints[p1] && joints[p2]) {
                ctx.beginPath();
                ctx.moveTo(joints[p1].x, joints[p1].y);
                ctx.lineTo(joints[p2].x, joints[p2].y);
                ctx.stroke();
            }
        });
        ctx.restore();

        // Draw Joint Nodes
        Object.keys(joints).forEach(key => {
            const pt = joints[key];
            const isTarget = (key === targetJointName);

            ctx.save();
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, isTarget ? 6.5 : 4.5, 0, Math.PI * 2);
            ctx.fillStyle = isTarget ? "#10b981" : "#ffffff";
            ctx.shadowColor = isTarget ? "#10b981" : "#38bdf8";
            ctx.shadowBlur = isTarget ? 15 : 8;
            ctx.fill();

            ctx.lineWidth = 2;
            ctx.strokeStyle = isTarget ? "#a7f3d0" : "#38bdf8";
            ctx.stroke();
            ctx.restore();
        });

        // Draw Joint Angle Arc & Indicator
        if (targetJointName && joints[targetJointName] && activeJointAngle !== undefined) {
            const center = joints[targetJointName];
            ctx.save();
            ctx.beginPath();
            ctx.arc(center.x, center.y, 22, -Math.PI / 2, -Math.PI / 2 + (activeJointAngle * Math.PI / 180));
            ctx.strokeStyle = "#10b981";
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Angle badge
            const badgeX = center.x + 28;
            const badgeY = center.y - 8;
            ctx.fillStyle = "rgba(6, 15, 30, 0.9)";
            ctx.strokeStyle = "#10b981";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(badgeX, badgeY - 14, 52, 20, 6);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#34d399";
            ctx.font = "bold 11px 'Consolas', monospace";
            ctx.fillText(`${Math.round(activeJointAngle)}°`, badgeX + 10, badgeY);
            ctx.restore();
        }
    }

    function getSquatJoints(depthProgress) {
        // depthProgress: 0 (standing) -> 1 (deep squat)
        const d = depthProgress;
        const hipDrop = d * 46;
        const kneeDrop = d * 14;
        const kneeSpread = d * 16;
        const headDrop = d * 40;

        return {
            head: { x: 240, y: 50 + headDrop },
            neck: { x: 240, y: 74 + headDrop * 0.9 },
            lShoulder: { x: 212, y: 84 + headDrop * 0.9 },
            rShoulder: { x: 268, y: 84 + headDrop * 0.9 },
            lElbow: { x: 195, y: 120 + headDrop * 0.8 },
            rElbow: { x: 285, y: 120 + headDrop * 0.8 },
            lWrist: { x: 215, y: 135 + headDrop * 0.8 },
            rWrist: { x: 265, y: 135 + headDrop * 0.8 },
            lHip: { x: 224, y: 140 + hipDrop },
            rHip: { x: 256, y: 140 + hipDrop },
            lKnee: { x: 218 - kneeSpread, y: 195 + kneeDrop },
            rKnee: { x: 262 + kneeSpread, y: 195 + kneeDrop },
            lAnkle: { x: 218, y: 248 },
            rAnkle: { x: 262, y: 248 },
            lFoot: { x: 200, y: 252 },
            rFoot: { x: 280, y: 252 }
        };
    }

    function getCurlJoints(curlProgress) {
        const c = curlProgress; // 0 (extended) -> 1 (curled)
        const wristY = 165 - c * 75;
        const wristX = 290 - c * 25;

        return {
            head: { x: 240, y: 50 },
            neck: { x: 240, y: 74 },
            lShoulder: { x: 212, y: 84 },
            rShoulder: { x: 268, y: 84 },
            lElbow: { x: 195, y: 128 },
            rElbow: { x: 285, y: 126 },
            lWrist: { x: 195, y: 165 },
            rWrist: { x: wristX, y: wristY },
            lHip: { x: 224, y: 140 },
            rHip: { x: 256, y: 140 },
            lKnee: { x: 220, y: 195 },
            rKnee: { x: 260, y: 195 },
            lAnkle: { x: 220, y: 248 },
            rAnkle: { x: 260, y: 248 },
            lFoot: { x: 202, y: 252 },
            rFoot: { x: 278, y: 252 }
        };
    }

    function getPushupJoints(progress) {
        // progress 0 (high plank) -> 1 (chest down)
        const p = progress;
        const chestDrop = p * 34;

        return {
            head: { x: 130, y: 140 + chestDrop },
            neck: { x: 155, y: 145 + chestDrop },
            lShoulder: { x: 175, y: 145 + chestDrop },
            rShoulder: { x: 185, y: 155 + chestDrop },
            lElbow: { x: 170, y: 185 + chestDrop * 0.4 },
            rElbow: { x: 185, y: 195 + chestDrop * 0.4 },
            lWrist: { x: 180, y: 228 },
            rWrist: { x: 195, y: 232 },
            lHip: { x: 265, y: 152 + chestDrop * 0.6 },
            rHip: { x: 275, y: 160 + chestDrop * 0.6 },
            lKnee: { x: 325, y: 170 + chestDrop * 0.3 },
            rKnee: { x: 335, y: 178 + chestDrop * 0.3 },
            lAnkle: { x: 380, y: 190 },
            rAnkle: { x: 390, y: 198 },
            lFoot: { x: 398, y: 196 },
            rFoot: { x: 408, y: 204 }
        };
    }

    function drawIdlePose(exerciseType = "squat") {
        if (!poseCanvas) return;
        const ctx = setupRetinaCanvas(poseCanvas, 480, 280);
        if (!ctx) return;

        drawTechBackground(ctx, 480, 280);
        let joints, angle, targetJoint;

        if (exerciseType === "curl") {
            joints = getCurlJoints(0);
            angle = 168;
            targetJoint = "rElbow";
            if (poseAngleVal) poseAngleVal.textContent = "168°";
            if (posePhaseVal) posePhaseVal.textContent = "Arm Extended";
        } else if (exerciseType === "pushup") {
            joints = getPushupJoints(0);
            angle = 170;
            targetJoint = "lElbow";
            if (poseAngleVal) poseAngleVal.textContent = "170°";
            if (posePhaseVal) posePhaseVal.textContent = "Plank Ready";
        } else {
            joints = getSquatJoints(0);
            angle = 172;
            targetJoint = "lKnee";
            if (poseAngleVal) poseAngleVal.textContent = "172°";
            if (posePhaseVal) posePhaseVal.textContent = "Standing";
        }

        drawSkeletonWireframe(ctx, joints, angle, targetJoint);
    }

    function runPosePipelineSimulation() {
        if (poseAnimFrameId) cancelAnimationFrame(poseAnimFrameId);
        const exerciseSelect = document.getElementById("paramPoseExercise");
        const exerciseType = exerciseSelect ? exerciseSelect.value : "squat";

        const ctx = setupRetinaCanvas(poseCanvas, 480, 280);
        if (!ctx) return;

        const startTime = performance.now();
        const cycleDuration = 3200; // 3.2 seconds for full rep
        let logTriggered = { init: false, start: false, peak: false, ascent: false, done: false };

        function animateFrame(now) {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / cycleDuration, 1.0);

            // Sine wave for smooth back-and-forth movement (0 -> 1 -> 0)
            const progress = Math.sin(t * Math.PI);

            drawTechBackground(ctx, 480, 280);

            let joints, currentAngle, targetJointName;

            if (exerciseType === "curl") {
                joints = getCurlJoints(progress);
                currentAngle = 168 - progress * (168 - 45);
                targetJointName = "rElbow";
                if (poseAngleVal) poseAngleVal.textContent = `${Math.round(currentAngle)}°`;

                if (t < 0.15) {
                    if (posePhaseVal) posePhaseVal.textContent = "Starting Curl";
                } else if (t < 0.48) {
                    if (posePhaseVal) posePhaseVal.textContent = "Concentric Flexion";
                } else if (t < 0.58) {
                    if (posePhaseVal) posePhaseVal.textContent = "Peak Contraction";
                } else {
                    if (posePhaseVal) posePhaseVal.textContent = "Eccentric Lowering";
                }
            } else if (exerciseType === "pushup") {
                joints = getPushupJoints(progress);
                currentAngle = 170 - progress * (170 - 82);
                targetJointName = "lElbow";
                if (poseAngleVal) poseAngleVal.textContent = `${Math.round(currentAngle)}°`;

                if (t < 0.15) {
                    if (posePhaseVal) posePhaseVal.textContent = "Plank Hold";
                } else if (t < 0.5) {
                    if (posePhaseVal) posePhaseVal.textContent = "Chest Descent";
                } else if (t < 0.6) {
                    if (posePhaseVal) posePhaseVal.textContent = "Bottom Depth Hold";
                } else {
                    if (posePhaseVal) posePhaseVal.textContent = "Pressing Ascent";
                }
            } else {
                joints = getSquatJoints(progress);
                currentAngle = 172 - progress * (172 - 84);
                targetJointName = "lKnee";
                if (poseAngleVal) poseAngleVal.textContent = `${Math.round(currentAngle)}°`;

                if (t < 0.15) {
                    if (posePhaseVal) posePhaseVal.textContent = "Standing Ready";
                } else if (t < 0.48) {
                    if (posePhaseVal) posePhaseVal.textContent = "Squat Descent";
                } else if (t < 0.58) {
                    if (posePhaseVal) posePhaseVal.textContent = "Parallel Depth (Valid)";
                } else {
                    if (posePhaseVal) posePhaseVal.textContent = "Ascending Drive";
                }
            }

            drawSkeletonWireframe(ctx, joints, currentAngle, targetJointName);

            // Synchronized Terminal Logging
            if (!logTriggered.init && elapsed > 100) {
                logTriggered.init = true;
                appendTerminalLog("log-info", `[INIT] Loading MediaPipe Pose landmarker heavy model (28.4MB)...`);
                appendTerminalLog("log-accent", `[CUDA] TensorRT acceleration initialized on GPU 0 (Latency: 7.6ms)`);
            }
            if (!logTriggered.start && elapsed > 600) {
                logTriggered.start = true;
                appendTerminalLog("log-info", `[TRACKER] Subject detected: 33 3D landmarks tracked @ 60 FPS.`);
                appendTerminalLog("log-info", `[KINEMATICS] ${exerciseType.toUpperCase()} motion engaged. Tracking target joint: ${targetJointName}`);
            }
            if (!logTriggered.peak && elapsed > 1500) {
                logTriggered.peak = true;
                appendTerminalLog("log-warn", `[THRESHOLD] Peak contraction achieved: Angle ${Math.round(currentAngle)}° <= 90°`);
                if (poseScoreVal) poseScoreVal.textContent = "98.7%";
            }
            if (!logTriggered.ascent && elapsed > 2400) {
                logTriggered.ascent = true;
                appendTerminalLog("log-info", `[BIOMECHANICS] Joint symmetry index: 99.1% | Zero valgus collapse detected.`);
            }

            if (t < 1.0) {
                poseAnimFrameId = requestAnimationFrame(animateFrame);
            } else {
                // Completed Repetition!
                poseRepCounter += 1;
                if (poseRepCount) poseRepCount.textContent = poseRepCounter;
                if (posePhaseVal) posePhaseVal.textContent = "Rep Validated!";
                appendTerminalLog("log-success", `[SUCCESS] Valid Repetition #${poseRepCounter} completed! Form Quality Score: 98.7% (Optimal)`);
                finishPipelineExecution(`Pose analyzer completed Rep #${poseRepCounter} with 98.7% form score!`);
            }
        }

        poseAnimFrameId = requestAnimationFrame(animateFrame);
    }


    // ==========================================
    // Visual Simulation 2: Groq Ultra-Fast LPU Streaming
    // ==========================================
    function runGroqPipelineSimulation() {
        const promptSelect = document.getElementById("paramGroqPrompt");
        const promptIdx = promptSelect ? parseInt(promptSelect.value, 10) : 0;
        const preset = groqPresets[promptIdx] || groqPresets[0];

        if (groqPromptText) groqPromptText.textContent = preset.query;
        if (groqResponseText) groqResponseText.textContent = "";

        appendTerminalLog("log-info", `[AUDIO] Inbound speech captured via Whisper STT (16kHz PCM): "${preset.query}"`);
        appendTerminalLog("log-accent", `[GROQ API] Dispatched POST /v1/chat/completions (Model: llama3-70b-8192)...`);

        let ttft = 118 + Math.floor(Math.random() * 18);
        if (groqTtftVal) groqTtftVal.textContent = `${ttft} ms`;

        setTimeout(() => {
            appendTerminalLog("log-info", `[LPU CLUSTER] TTFT received: ${ttft}ms. Initializing streaming token pipeline...`);
            let charIndex = 0;
            const fullText = preset.text;
            const totalChars = fullText.length;
            const streamInterval = 12; // fast typewriter

            let currentTps = 240;
            const tpsInterval = setInterval(() => {
                if (!isPipelineRunning) {
                    clearInterval(tpsInterval);
                    return;
                }
                currentTps = 300 + Math.floor(Math.random() * 26) - 10;
                if (groqTpsVal) groqTpsVal.textContent = currentTps;
                if (speedBarFill) speedBarFill.style.width = `${Math.min(95, (currentTps / 340) * 100)}%`;
            }, 100);

            const streamTimer = setInterval(() => {
                if (!isPipelineRunning || charIndex >= totalChars) {
                    clearInterval(streamTimer);
                    clearInterval(tpsInterval);
                    if (groqResponseText) groqResponseText.textContent = fullText;
                    if (groqTpsVal) groqTpsVal.textContent = "318";
                    if (speedBarFill) speedBarFill.style.width = "90%";
                    appendTerminalLog("log-success", `[SUCCESS] Streamed ${Math.round(totalChars / 4)} tokens @ 318.2 tokens/sec in 0.82s!`);
                    finishPipelineExecution(`Groq LPU stream completed @ 318 tokens/sec!`);
                    return;
                }

                // Append small chunks of characters
                const chunkSize = Math.min(4, totalChars - charIndex);
                charIndex += chunkSize;
                if (groqResponseText) {
                    groqResponseText.textContent = fullText.substring(0, charIndex) + " ▋";
                }
            }, streamInterval);

        }, ttft + 50);
    }


    // ==========================================
    // Visual Simulation 3: Neural Network Loss & Accuracy Curves
    // ==========================================
    function drawLossChartPreview() {
        if (!lossChartCanvas) return;
        const ctx = setupRetinaCanvas(lossChartCanvas, 480, 200);
        if (!ctx) return;

        ctx.fillStyle = "#060914";
        ctx.fillRect(0, 0, 480, 200);

        // Grid lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
        ctx.lineWidth = 1;
        for (let y = 20; y <= 160; y += 35) {
            ctx.beginPath();
            ctx.moveTo(40, y);
            ctx.lineTo(450, y);
            ctx.stroke();
        }

        // Axes
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.beginPath();
        ctx.moveTo(40, 15);
        ctx.lineTo(40, 165);
        ctx.lineTo(450, 165);
        ctx.stroke();

        // Placeholder text
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.font = "11px 'Consolas', monospace";
        ctx.fillText("Click 'Run Pipeline' to execute epoch training simulation...", 70, 95);
    }

    function runNeuralPipelineSimulation() {
        const epochsSelect = document.getElementById("paramNnEpochs");
        const totalEpochs = epochsSelect ? parseInt(epochsSelect.value, 10) : 10;

        const ctx = setupRetinaCanvas(lossChartCanvas, 480, 200);
        if (!ctx) return;

        appendTerminalLog("log-info", `[PYTORCH] Initializing DeepClassifier on cuda:0 (NVIDIA RTX Tensor Core)...`);
        appendTerminalLog("log-accent", `[CONFIG] Loss: CrossEntropyLoss | Optimizer: AdamW(lr=1e-3, weight_decay=1e-4)`);

        // Coordinate space: X from 45 to 445, Y from 25 to 160
        const chartLeft = 45;
        const chartRight = 445;
        const chartTop = 25;
        const chartBottom = 160;
        const chartWidth = chartRight - chartLeft;
        const chartHeight = chartBottom - chartTop;

        const epochData = [
            { epoch: 1, loss: 1.842, acc: 54.2, f1: 52.8 },
            { epoch: 2, loss: 1.215, acc: 68.4, f1: 66.5 },
            { epoch: 3, loss: 0.792, acc: 79.1, f1: 77.8 },
            { epoch: 4, loss: 0.512, acc: 86.3, f1: 85.0 },
            { epoch: 5, loss: 0.348, acc: 90.5, f1: 89.6 },
            { epoch: 6, loss: 0.231, acc: 93.8, f1: 93.1 },
            { epoch: 7, loss: 0.162, acc: 95.7, f1: 95.2 },
            { epoch: 8, loss: 0.118, acc: 97.1, f1: 96.8 },
            { epoch: 9, loss: 0.094, acc: 98.2, f1: 97.9 },
            { epoch: 10, loss: 0.078, acc: 98.9, f1: 98.6 }
        ];

        let currentEpochIdx = 0;

        function renderChartStep(stepIdx) {
            ctx.fillStyle = "#060914";
            ctx.fillRect(0, 0, 480, 200);

            // Horizontal Grid
            ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
            ctx.lineWidth = 1;
            for (let y = chartTop; y <= chartBottom; y += 34) {
                ctx.beginPath();
                ctx.moveTo(chartLeft, y);
                ctx.lineTo(chartRight, y);
                ctx.stroke();
            }

            // Axes
            ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
            ctx.beginPath();
            ctx.moveTo(chartLeft, chartTop - 10);
            ctx.lineTo(chartLeft, chartBottom);
            ctx.lineTo(chartRight + 10, chartBottom);
            ctx.stroke();

            // Y-Axis labels
            ctx.fillStyle = "#64748b";
            ctx.font = "9.5px 'Consolas', monospace";
            ctx.fillText("2.0 (Loss)", 5, chartTop + 5);
            ctx.fillText("0.0", 22, chartBottom);
            ctx.fillText("100% (Acc)", chartRight - 35, chartTop + 5);

            // Points so far
            const points = epochData.slice(0, stepIdx + 1);

            // 1. Draw Loss Curve (Rose / Red)
            ctx.save();
            ctx.strokeStyle = "#f43f5e";
            ctx.lineWidth = 2.5;
            ctx.shadowColor = "#f43f5e";
            ctx.shadowBlur = 10;
            ctx.beginPath();
            points.forEach((p, idx) => {
                const x = chartLeft + (idx / 9) * chartWidth;
                const normLoss = Math.max(0, Math.min(1, p.loss / 2.0));
                const y = chartBottom - normLoss * chartHeight;
                if (idx === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            // Draw loss points
            points.forEach((p, idx) => {
                const x = chartLeft + (idx / 9) * chartWidth;
                const normLoss = Math.max(0, Math.min(1, p.loss / 2.0));
                const y = chartBottom - normLoss * chartHeight;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = "#f43f5e";
                ctx.fill();
            });
            ctx.restore();

            // 2. Draw Accuracy Curve (Cyan)
            ctx.save();
            ctx.strokeStyle = "#38bdf8";
            ctx.lineWidth = 2.5;
            ctx.shadowColor = "#38bdf8";
            ctx.shadowBlur = 10;
            ctx.beginPath();
            points.forEach((p, idx) => {
                const x = chartLeft + (idx / 9) * chartWidth;
                const normAcc = p.acc / 100.0;
                const y = chartBottom - normAcc * chartHeight;
                if (idx === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            // Draw accuracy points
            points.forEach((p, idx) => {
                const x = chartLeft + (idx / 9) * chartWidth;
                const normAcc = p.acc / 100.0;
                const y = chartBottom - normAcc * chartHeight;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = "#38bdf8";
                ctx.fill();
            });
            ctx.restore();
        }

        const epochInterval = setInterval(() => {
            if (!isPipelineRunning) {
                clearInterval(epochInterval);
                return;
            }

            const data = epochData[currentEpochIdx];
            renderChartStep(currentEpochIdx);

            // Update Metrics Ribbon
            if (nnEpochVal) nnEpochVal.textContent = `${data.epoch} / ${totalEpochs}`;
            if (nnLossVal) nnLossVal.textContent = data.loss.toFixed(3);
            if (nnAccVal) nnAccVal.textContent = `${data.acc.toFixed(1)}%`;
            if (nnF1Val) nnF1Val.textContent = `${data.f1.toFixed(1)}%`;

            // Terminal log
            appendTerminalLog("log-info", `[Epoch ${String(data.epoch).padStart(2, '0')}/${totalEpochs}] Loss: ${data.loss.toFixed(4)} | Train Acc: ${data.acc.toFixed(1)}% | Val F1: ${(data.f1 / 100).toFixed(3)} | LR: 0.00100`);

            currentEpochIdx++;

            if (currentEpochIdx >= totalEpochs) {
                clearInterval(epochInterval);
                appendTerminalLog("log-success", `[CONVERGED] Deep residual model converged at 98.9% test accuracy (Loss: 0.078)`);
                finishPipelineExecution(`Neural training converged at 98.9% test accuracy!`);
            }
        }, 320);
    }


    // ==========================================
    // Visual Simulation 4: Timetable CSP Optimization Grid
    // ==========================================
    const timetableSchedule = [
        { day: "Mon", p1: "AI", p1Sub: "Deep Learning (K.S.)", p2: "ML", p2Sub: "Machine Learning", p3: "WEB", p3Sub: "Full Stack (Jeevitha)", p4: "AI", p4Sub: "NLP Foundations", p56: "LAB", p56Sub: "AI &amp; Computer Vision Lab (Lab 302)" },
        { day: "Tue", p1: "ML", p1Sub: "Computer Vision", p2: "AI", p2Sub: "Generative AI (Jeevitha)", p3: "WEB", p3Sub: "Database Systems", p4: "WEB", p4Sub: "Software Engg", p56: "AI", p56Sub: "Neural Networks Seminar &amp; Mentorship" },
        { day: "Wed", p1: "WEB", p1Sub: "Full Stack (Jeevitha)", p2: "AI", p2Sub: "Deep Learning", p3: "ML", p3Sub: "Big Data Analytics", p4: "WEB", p4Sub: "Cloud Computing", p56: "LAB", p56Sub: "GenAI Project Lab (Lab 204)" },
        { day: "Thu", p1: "ML", p1Sub: "Machine Learning", p2: "AI", p2Sub: "Reinforcement Learning", p3: "WEB", p3Sub: "UI/UX &amp; Web Systems", p4: "ML", p4Sub: "Optimization Algo", p56: "WEB", p56Sub: "Open-Source Capstone Studio" },
        { day: "Fri", p1: "AI", p1Sub: "Generative AI &amp; LLMs", p2: "ML", p2Sub: "Natural Language Proc", p3: "WEB", p3Sub: "Cybersecurity Ops", p4: "ML", p4Sub: "Data Science Capstone", p56: "LAB", p56Sub: "Innovation &amp; Robotics Lab (Lab 105)" }
    ];

    function renderTimetableGrid(isSolved = true) {
        if (!timetableGridPreview) return;

        let tableHtml = `
            <table class="tt-table">
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Period 1<br><small>09:00 - 09:50</small></th>
                        <th>Period 2<br><small>09:50 - 10:40</small></th>
                        <th>Period 3<br><small>10:55 - 11:45</small></th>
                        <th>Period 4<br><small>11:45 - 12:35</small></th>
                        <th>Period 5 &amp; 6<br><small>01:30 - 03:10 (Double)</small></th>
                    </tr>
                </thead>
                <tbody>
        `;

        timetableSchedule.forEach(row => {
            tableHtml += `
                <tr>
                    <td><strong>${row.day}</strong></td>
                    <td><div class="tt-cell ${row.p1.toLowerCase()}">${row.p1Sub}</div></td>
                    <td><div class="tt-cell ${row.p2.toLowerCase()}">${row.p2Sub}</div></td>
                    <td><div class="tt-cell ${row.p3.toLowerCase()}">${row.p3Sub}</div></td>
                    <td><div class="tt-cell ${row.p4.toLowerCase()}">${row.p4Sub}</div></td>
                    <td><div class="tt-cell ${row.p56.toLowerCase()}">${row.p56Sub}</div></td>
                </tr>
            `;
        });

        tableHtml += `</tbody></table>`;
        timetableGridPreview.innerHTML = tableHtml;
    }

    function runTimetablePipelineSimulation() {
        if (!timetableGridPreview) return;

        appendTerminalLog("log-info", `[CSP] Formulating domain constraints: 8 Semesters, 42 Courses, 18 Faculty records...`);
        appendTerminalLog("log-info", `[HEURISTIC] Applying Minimum Remaining Values (MRV) & Degree heuristic on Lab Rooms...`);

        if (cspSolveTime) cspSolveTime.textContent = "Solving...";

        // Step 1: Blank solving state
        timetableGridPreview.innerHTML = `
            <div style="text-align: center; padding: 24px; color: var(--text-dim); font-size: 13px;">
                <i class="fas fa-spinner fa-spin text-green fa-2x" style="margin-bottom: 10px; display: block;"></i>
                Searching state space (Backtracking Tree Depth: 24)...
            </div>
        `;

        setTimeout(() => {
            appendTerminalLog("log-warn", `[BACKTRACK] Clash detected: Room 302 double-assigned @ Mon Period 4 -> Pruning subtree...`);
            appendTerminalLog("log-accent", `[RESOLVE] Forward-checking reduced remaining conflict domain to 0. Applied valid assignment.`);

            setTimeout(() => {
                renderTimetableGrid(true);
                if (cspSolveTime) cspSolveTime.textContent = "0.22s";
                appendTerminalLog("log-success", `[SUCCESS] Optimal conflict-free schedule generated! 0 Hard Clashes, 0 Soft Penalty (Solved in 0.22s)`);
                finishPipelineExecution(`Timetable CSP optimization complete with 0 conflicts!`);
            }, 600);
        }, 700);
    }


    // ==========================================
    // Unified "Run Pipeline" Handler
    // ==========================================
    function finishPipelineExecution(successMessage) {
        isPipelineRunning = false;
        if (runCodeSnippetBtn) {
            runCodeSnippetBtn.classList.remove("running");
            runCodeSnippetBtn.innerHTML = '<i class="fas fa-play"></i> <span>Run Pipeline</span>';
        }
        if (executionStatusPill) {
            executionStatusPill.className = "hw-pill status-ready";
            if (labStatusText) labStatusText.textContent = "Ready";
        }
        playUiSound("success");
        if (successMessage) showToast(successMessage);
    }

    if (runCodeSnippetBtn) {
        runCodeSnippetBtn.addEventListener("click", function () {
            if (isPipelineRunning) return;
            const snippet = codeSnippets[activeTabKey];
            if (!snippet) return;

            isPipelineRunning = true;
            runCodeSnippetBtn.classList.add("running");
            runCodeSnippetBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Executing...</span>';

            if (executionStatusPill) {
                executionStatusPill.className = "hw-pill status-running";
                if (labStatusText) labStatusText.textContent = "Running...";
            }

            if (terminalConsoleLogs) {
                terminalConsoleLogs.innerHTML = `<div class="log-entry prompt-line">$ python3 ${snippet.filename}</div>`;
            }

            playUiSound("run");

            // Execute specific visual simulation based on active tab
            if (activeTabKey === "pose") {
                runPosePipelineSimulation();
            } else if (activeTabKey === "groq") {
                runGroqPipelineSimulation();
            } else if (activeTabKey === "neural") {
                runNeuralPipelineSimulation();
            } else if (activeTabKey === "timetable") {
                runTimetablePipelineSimulation();
            }
        });
    }

    // Initialize Default View
    renderTerminalSnippet("pose");

    // Handle Window Resize for Canvas Redraw
    let labResizeTimeout;
    window.addEventListener("resize", function () {
        clearTimeout(labResizeTimeout);
        labResizeTimeout = setTimeout(function () {
            if (!isPipelineRunning) {
                if (activeTabKey === "pose") {
                    const exerciseSelect = document.getElementById("paramPoseExercise");
                    drawIdlePose(exerciseSelect ? exerciseSelect.value : "squat");
                } else if (activeTabKey === "neural") {
                    drawLossChartPreview();
                }
            }
        }, 150);
    });


    // ==========================================
    // 17. Ask Jeevitha AI - Floating Assistant Widget
    // ==========================================
    const aiWidgetContainer = document.getElementById("aiWidgetContainer");
    const aiLauncherBtn = document.getElementById("aiLauncherBtn");
    const aiChatCard = document.getElementById("aiChatCard");
    const aiChatBackdrop = document.getElementById("aiChatBackdrop");
    const closeAiChat = document.getElementById("closeAiChat");
    const clearAiChat = document.getElementById("clearAiChat");
    const aiChatMessages = document.getElementById("aiChatMessages");
    const aiInputForm = document.getElementById("aiInputForm");
    const aiUserInput = document.getElementById("aiUserInput");
    const aiChips = document.querySelectorAll(".ai-chip");

    // Comprehensive Knowledge Base covering technical, career, and general visitor inquiries
    const AI_KNOWLEDGE = [
        // 1. Greetings & Pleasantries
        {
            keywords: ["hi", "hello", "hey", "hola", "greetings", "good morning", "good afternoon", "good evening", "howdy", "sup", "what's up", "namaste", "vanakkam", "hey there"],
            answer: "Hello there! 👋 Delighted to meet you! I'm <strong>Jeevitha's AI Portfolio Assistant</strong>.<br><br>Feel free to ask me anything about Jeevitha's <strong>AI/ML projects, technical skills, Adroit Technologies internship, education (8.8 CGPA), or availability for hire</strong>! How can I help you today? 😊"
        },
        // 2. Identity & Introduction
        {
            keywords: ["who are you", "what is your name", "your name", "who made you", "who built you", "introduce yourself", "tell me about yourself", "about jeevitha", "who is jeevitha", "bio", "summary", "profile", "background", "about you", "your background"],
            answer: "👋 <strong>About Jeevitha Sakthivel:</strong><br>Jeevitha is a final-year <strong>B.E. CSE (Artificial Intelligence & Machine Learning)</strong> student at Arunai Engineering College with a top academic record of <strong>8.8 / 10 CGPA</strong>.<br><br>She specializes in <strong>Python, Generative AI & LLMs, Computer Vision (OpenCV/MediaPipe), and Full-Stack Web Development (React.js, Node.js, Express, MongoDB)</strong>. She completed a Generative AI internship at <em>Adroit Technologies</em> and is actively seeking entry-level software or AI engineering roles! 🚀"
        },
        // 3. How are you / Politeness & Small Talk
        {
            keywords: ["how are you", "how are you doing", "how do you do", "how is it going", "how's everything", "hows everything", "how are things"],
            answer: "I'm doing fantastic, thank you for asking! 😊 Ready to help you discover everything about Jeevitha's technical background, projects, and credentials. What would you like to explore?"
        },
        // 4. Why Hire Jeevitha / Strengths & Value
        {
            keywords: ["why hire", "why should we hire", "why you", "what makes you unique", "strengths", "strength", "advantages", "value", "hire you", "why should i hire", "qualities", "hire jeevitha"],
            answer: "⭐ <strong>Why Hire Jeevitha Sakthivel?</strong><br>&bull; <strong>Strong Academic Foundation:</strong> 8.8 CGPA in B.E. CSE (AI & ML).<br>&bull; <strong>Hands-on Project Execution:</strong> Proven track record building real-world AI apps (GenAI Study Companion, OpenCV Pose Kinematics, Groq AI).<br>&bull; <strong>Full-Stack Versatility:</strong> Proficient from frontend (React/HTML/CSS) to backend APIs (Node/Express/Flask) and databases (MongoDB/MySQL).<br>&bull; <strong>Fast Learner & Industry Intern:</strong> Completed Generative AI internship at Adroit Technologies.<br>&bull; <strong>Immediate Value & Adaptability:</strong> Quick learner, strong collaborative communication, and eager to contribute from Day 1!"
        },
        // 5. Target Roles & Career Goals
        {
            keywords: ["role", "job", "career", "seeking", "looking", "fresher", "position", "opportunity", "open", "work with", "target role", "roles"],
            answer: "🎯 <strong>Target Roles & Career Goals:</strong><br>Jeevitha is actively seeking entry-level opportunities as an: <br>&bull; <strong>AI / ML Engineer</strong> (70% ATS Match)<br>&bull; <strong>Full-Stack Web Developer</strong> (80% ATS Match)<br>&bull; <strong>Python & GenAI Developer</strong> (85% ATS Match)<br>&bull; <strong>Backend & Database Engineer</strong> (65% ATS Match)<br><br>Open to full-time roles, graduate traineeships, and internships with immediate availability!"
        },
        // 6. Relocation & Location
        {
            keywords: ["location", "city", "relocate", "relocation", "where do you live", "where are you from", "chennai", "bangalore", "bengaluru", "hyderabad", "pune", "remote", "hybrid", "on-site", "onsite", "travel", "place", "work from home"],
            answer: "📍 <strong>Location & Relocation Preferences:</strong><br>&bull; <strong>Current Location:</strong> Tiruvannamalai / Chennai, Tamil Nadu, India.<br>&bull; <strong>Relocation:</strong> 100% open and eager to relocate to tech hubs including <strong>Chennai, Bengaluru (Bangalore), Hyderabad, Pune, Coimbatore</strong>, or anywhere nationwide!<br>&bull; <strong>Work Modes:</strong> Readily available for <strong>On-Site, Hybrid, or Remote</strong> arrangements."
        },
        // 7. Joining Availability & Notice Period
        {
            keywords: ["when can you join", "joining", "notice period", "availability", "available", "start date", "immediate joiner", "pass out", "passing out", "graduation date", "graduating", "when will you graduate", "batch"],
            answer: "⏱️ <strong>Availability & Joining:</strong><br>&bull; <strong>Availability:</strong> Immediate / short notice for internships, co-ops, and full-time trainee roles.<br>&bull; <strong>Degree Timeline:</strong> Graduating class of <strong>2027</strong> (Final-year B.E. AI & ML).<br>&bull; <strong>Notice Period:</strong> 0 days / Immediate availability!"
        },
        // 8. General AI & Machine Learning explanation
        {
            keywords: ["what is ai", "what is artificial intelligence", "what is machine learning", "what is ml", "explain ai", "explain machine learning", "difference between ai and ml"],
            answer: "🤖 <strong>Artificial Intelligence (AI) & Machine Learning (ML):</strong><br>&bull; <strong>AI</strong> refers to computer systems engineered to perform tasks that typically require human intelligence, such as visual perception, decision-making, and natural language understanding.<br>&bull; <strong>Machine Learning (ML)</strong> is a subset of AI where algorithms learn patterns from data rather than following strictly hardcoded rules.<br><br>Jeevitha applies supervised/unsupervised ML algorithms, Scikit-Learn, and Python to train predictive models and solve real problems!"
        },
        // 9. Generative AI & LLMs
        {
            keywords: ["what is generative ai", "what is genai", "what is llm", "large language model", "what is gemini", "what is groq", "prompt engineering", "gen ai", "gpt", "rag"],
            answer: "✨ <strong>Generative AI & Large Language Models (LLMs):</strong><br>Generative AI refers to deep learning models (like GPT-4, Llama-3, and Google Gemini) capable of generating original text, code, images, and synthetic data based on natural language prompts.<br><br>Jeevitha gained hands-on industry exposure during her <strong>Generative AI Internship at Adroit Technologies</strong> and built projects integrating the <strong>Gemini API</strong> and <strong>Groq Cloud API</strong> for ultra-low latency intelligent agents!"
        },
        // 10. Computer Vision & OpenCV
        {
            keywords: ["what is computer vision", "what is cv", "what is opencv", "what is mediapipe", "pose detection", "image processing", "vision"],
            answer: "👁️ <strong>Computer Vision & OpenCV:</strong><br>Computer Vision enables machines to extract meaningful insights from digital images and real-time video streams.<br><br>In her <strong>AI Sports Pose Detection project</strong>, Jeevitha utilized <strong>OpenCV and Google MediaPipe</strong> to track 33 3D skeletal landmarks in real-time, compute joint angles with trigonometric kinematics, and provide instant posture correction feedback!"
        },
        // 11. Full-Stack & Web Development / MERN
        {
            keywords: ["what is full stack", "what is fullstack", "what is mern", "what is react", "what is node", "what is express", "web development", "frontend", "backend api"],
            answer: "💻 <strong>Full-Stack & MERN Web Development:</strong><br>Full-Stack development covers both frontend user interfaces and backend server architecture.<br><br>Jeevitha builds modern responsive web applications using the <strong>MERN Stack (MongoDB, Express.js, React.js, Node.js)</strong>, Python Flask backends, and RESTful APIs, combined with custom CSS animations and glassmorphism styling!"
        },
        // 12. Databases (SQL & MongoDB)
        {
            keywords: ["what is database", "what is sql", "what is mysql", "what is mongodb", "sql or mongodb", "nosql"],
            answer: "🗄️ <strong>Databases (MySQL & MongoDB):</strong><br>&bull; <strong>MySQL / SQL:</strong> Relational database management with structured schemas, tables, and ACID transactions. Jeevitha is certified in <em>Relational Databases 101</em> by IBM Cognitive Class.<br>&bull; <strong>MongoDB:</strong> Document-oriented NoSQL database that stores data in flexible JSON-like BSON collections, ideal for high-velocity modern web applications."
        },
        // 13. Featured Projects
        {
            keywords: ["project", "projects", "portfolio", "built", "work", "apps", "pose", "study", "timetable", "groq", "application"],
            answer: "💻 <strong>Featured Projects:</strong><br>1. <strong>GenAI Multi-Agent Study Companion</strong>: Gemini API + Flask + MongoDB multi-agent academic assistant.<br>2. <strong>AI Sports Pose Detection & Exercise Analyzer</strong>: Real-time OpenCV & MediaPipe joint kinematics for workout form feedback.<br>3. <strong>Groq Voice AI Assistant</strong>: Ultra-low latency voice query LLM powered by Groq Llama-3.<br>4. <strong>Automated College Timetable Generator</strong>: Constraint satisfaction backtracking algorithm resolving 100% room/faculty clashes.<br>5. <strong>Full-Stack Student Management System</strong>: React.js + Node.js + Express + MongoDB MERN platform.<br><br>You can click <a href='#projects' style='color:#38bdf8; text-decoration:underline;'>#projects</a> to inspect live interactive previews and code repositories!"
        },
        // 14. Technical Arsenal & Skills
        {
            keywords: ["tech", "stack", "skill", "skills", "languages", "tools", "python", "react", "node", "database", "sql", "mongo", "javascript", "html", "css"],
            answer: "🛠️ <strong>Technical Arsenal:</strong><br>&bull; <strong>Languages:</strong> Python, JavaScript (ES6+), SQL, HTML5, CSS3<br>&bull; <strong>AI / ML & Vision:</strong> OpenCV, MediaPipe, NumPy, Pandas, Groq API, Google Gemini API, Scikit-Learn<br>&bull; <strong>Web & Full-Stack:</strong> React.js, Node.js, Express.js, Flask, MERN Stack, RESTful APIs<br>&bull; <strong>Databases:</strong> MongoDB, MySQL (IBM Cognitive Class Certified)<br>&bull; <strong>Tools & Environment:</strong> Git, GitHub, VS Code, Postman, Power BI, Figma, Jupyter Notebook"
        },
        // 15. Education & CGPA
        {
            keywords: ["education", "college", "cgpa", "degree", "university", "arunai", "marks", "school", "grade", "percentage", "academic", "study"],
            answer: "🎓 <strong>Education & Academics:</strong><br>&bull; <strong>B.E. Computer Science & Engineering (AI & ML)</strong><br>Arunai Engineering College, Tiruvannamalai (2023 – 2027)<br><strong>CGPA: 8.8 / 10</strong> (Consistent Top Academic Performer)<br>&bull; <strong>Higher Secondary Certificate (Class XII):</strong> 87% (2023)<br>&bull; <strong>SSLC (Class X):</strong> 80% (2021)"
        },
        // 16. Internship & Adroit Technologies
        {
            keywords: ["internship", "adroit", "company", "training", "intern", "experience", "work experience", "industrial training"],
            answer: "💼 <strong>Generative AI Internship at Adroit Technologies:</strong><br>&bull; <strong>Period:</strong> June 2026 (Online Internship)<br>&bull; <strong>Focus:</strong> Hands-on exposure to Generative AI concepts, LLM architectures, prompt optimization, model evaluation, and integrating AI into practical business software.<br>&bull; <strong>Key Takeaways:</strong> Applied LLM concepts to information retrieval, automated conversational workflows, and practical multi-agent design."
        },
        // 17. Leadership, Clubs & Activities
        {
            keywords: ["leadership", "club", "organizer", "symposium", "coordinator", "extracurricular", "events", "activities", "co-curricular"],
            answer: "🏆 <strong>Leadership & Co-Curricular Highlights:</strong><br>&bull; <strong>Student Technical Coordinator:</strong> Department of AI & ML, Arunai Engineering College (2024).<br>&bull; <strong>Technical Club Organizer:</strong> Successfully organized <em>Code Clash</em> debugging contest and <em>Tech Quiz 2024</em> for 100+ peers.<br>&bull; <strong>Mentorship:</strong> Conducted peer hands-on workshops on Python and Git/GitHub version control."
        },
        // 18. Certifications & Honors
        {
            keywords: ["certification", "certifications", "certificate", "certificates", "certified", "ibm", "coursera", "hp", "cognitive class"],
            answer: "📜 <strong>Professional Certifications:</strong><br>&bull; <strong>Relational Database & SQL 101</strong> &ndash; IBM Cognitive Class (Issued 2024)<br>&bull; <strong>Applied Machine Learning with Python</strong> &ndash; Coursera<br>&bull; <strong>Effective Business Communication & Leadership</strong> &ndash; HP LIFE<br><br>Check out the full credentials in the <a href='#certifications' style='color:#38bdf8; text-decoration:underline;'>#certifications</a> section!"
        },
        // 19. Languages Spoken
        {
            keywords: ["language", "languages", "speak", "tamil", "english", "fluency", "mother tongue"],
            answer: "🗣️ <strong>Languages Known:</strong><br>&bull; <strong>English:</strong> Professional Working Proficiency (Fluent written & verbal)<br>&bull; <strong>Tamil:</strong> Native / Bilingual Proficiency"
        },
        // 20. Contact & Hiring Details
        {
            keywords: ["contact", "email", "phone", "call", "reach", "hire", "number", "linkedin", "github", "address", "get in touch", "mobile"],
            answer: "📬 <strong>Direct Contact Channels:</strong><br>&bull; <strong>Phone / WhatsApp:</strong> <a href='tel:+916369660084' style='color:#38bdf8; font-weight:600;'>+91 6369660084</a><br>&bull; <strong>Email:</strong> <a href='mailto:kayaljeevitha43@gmail.com' style='color:#38bdf8; font-weight:600;'>kayaljeevitha43@gmail.com</a><br>&bull; <strong>LinkedIn:</strong> <a href='https://www.linkedin.com/in/jeevitha-sakthivel-6a48b7306' target='_blank' style='color:#38bdf8;'>linkedin.com/in/jeevitha-sakthivel-6a48b7306</a><br>&bull; <strong>GitHub:</strong> <a href='https://github.com/Jeevitha-Sakthivel' target='_blank' style='color:#38bdf8;'>github.com/Jeevitha-Sakthivel</a><br>&bull; <strong>Location:</strong> Tiruvannamalai / Chennai, Tamil Nadu, India"
        },
        // 21. Resume Download & Print
        {
            keywords: ["resume", "cv", "download", "pdf", "ats", "print resume", "official resume"],
            answer: "📄 <strong>Official Resume:</strong><br>You can view and print Jeevitha's ATS-compliant LaTeX-style resume directly here: <a href='resume.html' target='_blank' style='color:#38bdf8; font-weight:600; text-decoration:underline;'>View &amp; Print ATS Resume</a>."
        },
        // 22. Hobbies & Personal Passions
        {
            keywords: ["hobby", "hobbies", "interest", "interests", "free time", "leisure", "passion"],
            answer: "🎨 <strong>Hobbies & Personal Passions:</strong><br>&bull; Exploring emerging open-source AI and LLM models on HuggingFace.<br>&bull; Solving algorithm challenges and building responsive web micro-tools.<br>&bull; Tech blogging and continuous self-learning in Artificial Intelligence."
        },
        // 23. Help & Navigation Guidance
        {
            keywords: ["help", "what can you do", "commands", "how to use", "options", "features", "what can i ask", "guide", "menu"],
            answer: "💡 <strong>What You Can Ask Me:</strong><br>&bull; <em>\"Tell me about your top AI projects\"</em><br>&bull; <em>\"What is your tech stack and skills?\"</em><br>&bull; <em>\"Why should we hire Jeevitha?\"</em><br>&bull; <em>\"What is your college, degree, and CGPA?\"</em><br>&bull; <em>\"Are you open to relocate to Bangalore or Chennai?\"</em><br>&bull; <em>\"Explain your Adroit Technologies internship\"</em><br>&bull; <em>\"How can I contact or call Jeevitha?\"</em><br><br>Tip: You can also tap the <strong>🎙️ microphone icon</strong> to speak your question!"
        },
        // 24. Gratitude & Thanks
        {
            keywords: ["thank", "thanks", "thank you", "thx", "appreciate", "helpful", "awesome", "great", "cool", "nice", "perfect", "good job", "well done", "amazing"],
            answer: "You're very welcome! 😊 It's a pleasure sharing Jeevitha's work with you. If you need any more details or want to set up an interview, feel free to drop an email to <a href='mailto:kayaljeevitha43@gmail.com' style='color:#38bdf8;'>kayaljeevitha43@gmail.com</a> or call <a href='tel:+916369660084' style='color:#38bdf8;'>+91 6369660084</a>! ✨"
        },
        // 25. Goodbye & Sign-off
        {
            keywords: ["bye", "goodbye", "see you", "cya", "farewell", "have a nice day", "talk to you later", "later", "good night"],
            answer: "Goodbye! 👋 Thanks for visiting Jeevitha's portfolio. Wishing you a wonderful day ahead, and looking forward to connecting soon! ✨"
        },
        // 26. Humor & Developer Fun
        {
            keywords: ["joke", "funny", "laugh", "tell me a joke", "fun"],
            answer: "😄 Here's one for you:<br><br><em>Why do programmers prefer dark mode?</em><br>Because light attracts bugs! 🐛✨<br><br>Now, back to AI: What project or skill of Jeevitha's would you like to know more about?"
        }
    ];

    function getAiResponse(userText) {
        if (!userText || typeof userText !== "string") {
            return "Please type or speak a question about Jeevitha's skills, projects, or background! 😊";
        }

        const clean = userText.toLowerCase().trim();

        // Exact match checks for short greetings like "hi", "hello", "hey"
        const exactGreetings = ["hi", "hello", "hey", "hey there", "hola", "yo", "namaste", "vanakkam"];
        if (exactGreetings.includes(clean)) {
            return "Hello there! 👋 Delighted to meet you! I'm <strong>Jeevitha's AI Portfolio Assistant</strong>.<br><br>Feel free to ask me anything about Jeevitha's <strong>AI/ML projects, technical skills, Adroit Technologies internship, education (8.8 CGPA), or availability for hire</strong>! How can I help you today? 😊";
        }

        // Score each knowledge entry based on keyword hits and length of matched keyword
        let bestItem = null;
        let highestScore = 0;

        for (let item of AI_KNOWLEDGE) {
            let score = 0;
            for (let kw of item.keywords) {
                if (clean.includes(kw)) {
                    // Longer keyword matches indicate higher specificity
                    score += kw.length * 2;
                    // Exact word boundary match gets extra weight
                    try {
                        const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                        const regex = new RegExp("(^|\\W)" + escaped + "(\\W|$)", "i");
                        if (regex.test(clean)) {
                            score += 8;
                        }
                    } catch (e) {
                        // Regex fallback
                    }
                }
            }
            if (score > highestScore) {
                highestScore = score;
                bestItem = item;
            }
        }

        if (bestItem && highestScore > 0) {
            return bestItem.answer;
        }

        // Contextual dynamic fallback for any other general questions
        return `Thanks for your question! 😊 While I'm specialized in answering questions about Jeevitha's portfolio and engineering career, here is a quick overview:<br><br>&bull; <strong>Jeevitha Sakthivel</strong> is a final-year <strong>B.E. CSE (AI & ML)</strong> engineer with an <strong>8.8 CGPA</strong> at Arunai Engineering College.<br>&bull; Proficient in <strong>Python, Generative AI & LLMs, Computer Vision (OpenCV), and Full-Stack Web Development (React & MERN)</strong>.<br>&bull; Completed an internship at <strong>Adroit Technologies</strong> and is ready for immediate joining!<br><br>You can ask me things like <em>"Why hire Jeevitha?"</em>, <em>"What are your projects?"</em>, <em>"Are you willing to relocate?"</em>, or reach her directly at <strong><a href="mailto:kayaljeevitha43@gmail.com" style="color:#38bdf8;">kayaljeevitha43@gmail.com</a></strong> or <strong><a href="tel:+916369660084" style="color:#38bdf8;">+91 6369660084</a></strong>!`;
    }

    function appendAiMessage(sender, htmlContent) {
        if (!aiChatMessages) return;
        const msgDiv = document.createElement("div");
        msgDiv.className = `ai-msg ${sender}-msg`;
        const bubble = document.createElement("div");
        bubble.className = "ai-msg-bubble";
        bubble.innerHTML = htmlContent;
        msgDiv.appendChild(bubble);
        aiChatMessages.appendChild(msgDiv);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }

    function triggerAiQuery(question) {
        if (!question) return;
        appendAiMessage("user", question);
        playUiSound("chat");

        // Typing indicator
        const typingDiv = document.createElement("div");
        typingDiv.className = "ai-msg bot-msg";
        typingDiv.id = "aiTypingIndicator";
        typingDiv.innerHTML = '<div class="ai-typing-indicator"><span></span><span></span><span></span></div>';
        aiChatMessages.appendChild(typingDiv);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

        setTimeout(function () {
            const indicator = document.getElementById("aiTypingIndicator");
            if (indicator) indicator.remove();
            const reply = getAiResponse(question);
            appendAiMessage("bot", reply);
            playUiSound("chat");
            if (typeof speakAiReply === "function") {
                speakAiReply(reply);
            }
        }, 650);
    }

    function openAiAssistant() {
        if (!aiChatCard) return;
        aiChatCard.classList.add("open");
        if (aiChatBackdrop) aiChatBackdrop.classList.add("open");
        if (aiLauncherBtn) aiLauncherBtn.setAttribute("aria-expanded", "true");
        if (window.innerWidth <= 768) {
            document.body.classList.add("ai-chat-locked");
        }
        playUiSound("chat");
        if (aiUserInput) {
            setTimeout(() => {
                if (window.innerWidth > 768) {
                    aiUserInput.focus();
                }
            }, 250);
        }
    }

    function closeAiAssistant() {
        if (!aiChatCard) return;
        aiChatCard.classList.remove("open");
        if (aiChatBackdrop) aiChatBackdrop.classList.remove("open");
        if (aiLauncherBtn) aiLauncherBtn.setAttribute("aria-expanded", "false");
        document.body.classList.remove("ai-chat-locked");
        playUiSound("click");
    }

    if (aiLauncherBtn && aiChatCard) {
        aiLauncherBtn.addEventListener("click", function () {
            if (aiChatCard.classList.contains("open")) {
                closeAiAssistant();
            } else {
                openAiAssistant();
            }
        });
    }

    if (closeAiChat) {
        closeAiChat.addEventListener("click", closeAiAssistant);
    }

    if (aiChatBackdrop) {
        aiChatBackdrop.addEventListener("click", closeAiAssistant);
    }

    // Touch swipe down on handle to close sheet on mobile
    const sheetHandle = document.querySelector(".ai-sheet-handle");
    if (sheetHandle) {
        let touchStartY = 0;
        sheetHandle.addEventListener("touchstart", function (e) {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        sheetHandle.addEventListener("touchmove", function (e) {
            const touchCurrentY = e.touches[0].clientY;
            if (touchCurrentY - touchStartY > 50) {
                closeAiAssistant();
            }
        }, { passive: true });
    }

    // Close on ESC key
    window.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && aiChatCard && aiChatCard.classList.contains("open")) {
            closeAiAssistant();
        }
    });

    // Clear chat
    if (clearAiChat && aiChatMessages) {
        clearAiChat.addEventListener("click", function () {
            aiChatMessages.innerHTML = `
                <div class="ai-msg bot-msg">
                    <div class="ai-msg-bubble">
                        Conversation reset! ✨ Ask me anything about Jeevitha's technical projects, skills, education, or career goals.
                    </div>
                </div>
            `;
            playUiSound("click");
            showToast("Conversation cleared");
        });
    }

    if (aiInputForm && aiUserInput) {
        aiInputForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const text = aiUserInput.value.trim();
            if (!text) return;
            aiUserInput.value = "";
            triggerAiQuery(text);
        });
    }

    aiChips.forEach(function (chip) {
        chip.addEventListener("click", function () {
            const prompt = chip.getAttribute("data-prompt");
            triggerAiQuery(prompt);
        });
    });

    // ==========================================
    // 17B. AI Voice Speech & Microphone Input (STT & TTS)
    // ==========================================
    const aiVoiceToggleBtn = document.getElementById("aiVoiceToggleBtn");
    const aiVoiceInputBtn = document.getElementById("aiVoiceInputBtn");
    let aiVoiceEnabled = localStorage.getItem("portfolioAiVoiceEnabled") !== "false"; // default enabled
    let isAiSpeechRecognizing = false;
    let aiSpeechRec = null;

    function updateAiVoiceToggleUi() {
        if (!aiVoiceToggleBtn) return;
        if (aiVoiceEnabled) {
            aiVoiceToggleBtn.classList.add("active");
            aiVoiceToggleBtn.classList.remove("muted");
            aiVoiceToggleBtn.innerHTML = '<i class="fas fa-volume-high"></i>';
            aiVoiceToggleBtn.title = "AI Voice Speech: ON (Tap to Mute)";
            aiVoiceToggleBtn.setAttribute("aria-pressed", "true");
        } else {
            aiVoiceToggleBtn.classList.remove("active");
            aiVoiceToggleBtn.classList.add("muted");
            aiVoiceToggleBtn.innerHTML = '<i class="fas fa-volume-xmark"></i>';
            aiVoiceToggleBtn.title = "AI Voice Speech: Muted (Tap to Enable)";
            aiVoiceToggleBtn.setAttribute("aria-pressed", "false");
        }
    }

    if (aiVoiceToggleBtn) {
        updateAiVoiceToggleUi();
        aiVoiceToggleBtn.addEventListener("click", function () {
            aiVoiceEnabled = !aiVoiceEnabled;
            localStorage.setItem("portfolioAiVoiceEnabled", aiVoiceEnabled);
            updateAiVoiceToggleUi();
            if (!aiVoiceEnabled && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
            showToast(aiVoiceEnabled ? "AI Voice Speech Enabled 🔊" : "AI Voice Speech Muted 🔇", aiVoiceEnabled ? "fas fa-volume-high" : "fas fa-volume-xmark");
        });
    }

    function speakAiReply(htmlOrText) {
        if (!aiVoiceEnabled || !soundEnabled || !("speechSynthesis" in window)) return;
        try {
            window.speechSynthesis.cancel();
            // Clean HTML tags and markdown symbols for natural reading
            const cleanText = htmlOrText
                .replace(/<[^>]*>?/gm, " ")
                .replace(/&bull;/g, ", ")
                .replace(/&amp;/g, " and ")
                .replace(/&ndash;/g, " ")
                .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
                .replace(/\s+/g, " ")
                .trim();

            if (!cleanText) return;

            const utterance = new SpeechSynthesisUtterance(cleanText);
            const voice = getSweetGirlVoice();
            if (voice) utterance.voice = voice;
            utterance.pitch = 1.25;
            utterance.rate = 0.96;
            utterance.volume = 1.0;
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            // Speech synthesis policy fallback
        }
    }

    // Speech-to-Text via Web Speech Recognition
    const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionApi) {
        try {
            aiSpeechRec = new SpeechRecognitionApi();
            aiSpeechRec.continuous = false;
            aiSpeechRec.interimResults = false;
            aiSpeechRec.lang = "en-US";

            aiSpeechRec.onstart = function () {
                isAiSpeechRecognizing = true;
                if (aiVoiceInputBtn) aiVoiceInputBtn.classList.add("listening");
                if (aiUserInput) {
                    aiUserInput.placeholder = "Listening... Speak your question now 🎙️";
                }
                playUiSound("nav");
                showToast("🎙️ Listening... Speak your question now!");
            };

            aiSpeechRec.onresult = function (event) {
                isAiSpeechRecognizing = false;
                if (aiVoiceInputBtn) aiVoiceInputBtn.classList.remove("listening");
                if (aiUserInput) aiUserInput.placeholder = "Ask or tap 🎙️ to speak...";
                if (event.results && event.results[0] && event.results[0][0]) {
                    const transcript = event.results[0][0].transcript.trim();
                    if (transcript) {
                        if (aiUserInput) aiUserInput.value = transcript;
                        setTimeout(function () {
                            triggerAiQuery(transcript);
                            if (aiUserInput) aiUserInput.value = "";
                        }, 350);
                    }
                }
            };

            aiSpeechRec.onerror = function (event) {
                isAiSpeechRecognizing = false;
                if (aiVoiceInputBtn) aiVoiceInputBtn.classList.remove("listening");
                if (aiUserInput) aiUserInput.placeholder = "Ask or tap 🎙️ to speak...";
                if (event.error !== "no-speech") {
                    showToast("Voice input: " + (event.error || "Unable to access microphone"), "fas fa-microphone-slash");
                }
            };

            aiSpeechRec.onend = function () {
                isAiSpeechRecognizing = false;
                if (aiVoiceInputBtn) aiVoiceInputBtn.classList.remove("listening");
                if (aiUserInput) aiUserInput.placeholder = "Ask or tap 🎙️ to speak...";
            };
        } catch (recErr) {
            // Speech recognition init fallback
        }
    }

    if (aiVoiceInputBtn) {
        aiVoiceInputBtn.addEventListener("click", function () {
            if (!SpeechRecognitionApi || !aiSpeechRec) {
                showToast("Speech Recognition is not supported in this browser. Please type your query!", "fas fa-info-circle");
                return;
            }
            if (isAiSpeechRecognizing) {
                try { aiSpeechRec.stop(); } catch (err) {}
            } else {
                try {
                    aiSpeechRec.start();
                } catch (err) {
                    try {
                        aiSpeechRec.stop();
                        setTimeout(() => aiSpeechRec.start(), 150);
                    } catch (e) {}
                }
            }
        });
    }



    // ==========================================
    // 18. macOS / VS Code-Style Command Palette (Ctrl + K)
    // ==========================================
    const cmdPaletteBtn = document.getElementById("cmdPaletteBtn");
    const cmdPaletteBackdrop = document.getElementById("cmdPaletteBackdrop");
    const cmdSearchInput = document.getElementById("cmdSearchInput");
    const cmdResultsList = document.getElementById("cmdResultsList");

    const cmdItems = [
        { id: "home", title: "Home", desc: "Hero header, active status pill & profile", category: "Section", icon: "fa-home", action: () => jumpToSection("#home") },
        { id: "about", title: "About Jeevitha", desc: "Background, CGPA 8.8, career goal & stats", category: "Section", icon: "fa-user", action: () => jumpToSection("#about") },
        { id: "services", title: "Services & Capabilities", desc: "AI/ML, Full-Stack, Python & Vision", category: "Section", icon: "fa-briefcase", action: () => jumpToSection("#services") },
        { id: "experience", title: "Experience & Leadership", desc: "Adroit Technologies internship & clubs", category: "Section", icon: "fa-user-tie", action: () => jumpToSection("#experience") },
        { id: "skills", title: "Technical Arsenal", desc: "Python, React.js, Node.js, SQL, MongoDB", category: "Section", icon: "fa-layer-group", action: () => jumpToSection("#skills") },
        { id: "lab", title: "AI Code & Simulation Lab", desc: "Execute live Python AI pipelines in browser", category: "Interactive", icon: "fa-terminal", action: () => jumpToSection("#lab") },
        { id: "projects", title: "Featured Projects", desc: "GenAI, MediaPipe, Groq AI & Web Apps", category: "Section", icon: "fa-laptop-code", action: () => jumpToSection("#projects") },
        { id: "certifications", title: "Certifications", desc: "IBM Cognitive Class SQL, Coursera, HP", category: "Section", icon: "fa-certificate", action: () => jumpToSection("#certifications") },
        { id: "achievements", title: "Achievements & Highlights", desc: "Symposiums, paper presentations, CGPA", category: "Section", icon: "fa-trophy", action: () => jumpToSection("#achievements") },
        { id: "education", title: "Education & Academics", desc: "Arunai Engineering College (8.8 CGPA)", category: "Section", icon: "fa-graduation-cap", action: () => jumpToSection("#education") },
        { id: "faq", title: "Frequently Asked Questions", desc: "Common queries on availability & skills", category: "Section", icon: "fa-circle-question", action: () => jumpToSection("#faq") },
        { id: "contact", title: "Contact & Connect", desc: "Send direct instant email & phone details", category: "Section", icon: "fa-paper-plane", action: () => jumpToSection("#contact") },
        { id: "resume", title: "View Official Resume", desc: "ATS-compliant resume & PDF print format", category: "Document", icon: "fa-file-alt", action: () => window.open("resume.html", "_blank") },
        { id: "copy-email", title: "Copy Email Address", desc: "kayaljeevitha43@gmail.com", category: "Action", icon: "fa-envelope", action: () => { copyTextQuick("kayaljeevitha43@gmail.com"); showToast("Copied kayaljeevitha43@gmail.com!"); } },
        { id: "play-voice-welcome", title: "Play Sweet Voice Greeting", desc: "Hear Jeevitha's AI voice welcome greeting", category: "Action", icon: "fa-microphone", action: () => { if (typeof playWelcomeGreeting === "function") playWelcomeGreeting(true); else if (heroVoiceWelcomeBtn) heroVoiceWelcomeBtn.click(); } },
        { id: "recruiter-lens", title: "Recruiter Lens & ATS Matcher", desc: "Interactive role fit score & candidate summary", category: "Interactive", icon: "fa-bullseye", action: () => { jumpToSection("#skills"); const lens = document.getElementById("recruiterLens"); if (lens) { lens.scrollIntoView({ behavior: "smooth", block: "center" }); lens.classList.add("pulse-focus"); setTimeout(() => lens.classList.remove("pulse-focus"), 2000); } } },
        { id: "theme-cyan", title: "Theme: Electric Cyan", desc: "Switch portfolio accent to Electric Cyan", category: "Theme", icon: "fa-palette", action: () => setPortfolioTheme("cyan", true) },
        { id: "theme-neon", title: "Theme: Cyberpunk Neon", desc: "Switch portfolio accent to Cyberpunk Neon", category: "Theme", icon: "fa-palette", action: () => setPortfolioTheme("neon", true) },
        { id: "theme-emerald", title: "Theme: Matrix Emerald", desc: "Switch portfolio accent to Matrix Emerald", category: "Theme", icon: "fa-palette", action: () => setPortfolioTheme("emerald", true) },
        { id: "theme-amber", title: "Theme: Sunset Gold", desc: "Switch portfolio accent to Sunset Gold", category: "Theme", icon: "fa-palette", action: () => setPortfolioTheme("amber", true) },
        { id: "toggle-ai-voice", title: "Toggle AI Voice Readout", desc: "Enable or mute voice speech in AI Assistant", category: "Action", icon: "fa-microphone", action: () => { if (aiVoiceToggleBtn) aiVoiceToggleBtn.click(); } },
        { id: "open-ai", title: "Ask Jeevitha AI Assistant", desc: "Launch conversational AI chatbot widget", category: "Interactive", icon: "fa-robot", action: () => { if (aiChatCard) { aiChatCard.classList.add("open"); if (aiUserInput) aiUserInput.focus(); } } }
    ];

    let selectedCmdIndex = 0;
    let filteredCmdItems = [...cmdItems];

    function jumpToSection(selector) {
        const target = document.querySelector(selector);
        if (target) {
            const navHeight = document.querySelector("nav")?.offsetHeight || 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
        }
    }

    function copyTextQuick(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
        } else {
            const temp = document.createElement("input");
            temp.value = text;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand("copy");
            document.body.removeChild(temp);
        }
    }

    function openCmdPalette() {
        if (!cmdPaletteBackdrop) return;
        cmdPaletteBackdrop.classList.add("open");
        document.body.style.overflow = "hidden";
        selectedCmdIndex = 0;
        if (cmdSearchInput) {
            cmdSearchInput.value = "";
            renderCmdResults("");
            setTimeout(() => cmdSearchInput.focus(), 150);
        }
    }

    function closeCmdPalette() {
        if (!cmdPaletteBackdrop) return;
        cmdPaletteBackdrop.classList.remove("open");
        document.body.style.overflow = "";
    }

    function renderCmdResults(query) {
        if (!cmdResultsList) return;
        const q = query.toLowerCase().trim();
        filteredCmdItems = cmdItems.filter(function (item) {
            return item.title.toLowerCase().includes(q) ||
                   item.desc.toLowerCase().includes(q) ||
                   item.category.toLowerCase().includes(q);
        });

        if (filteredCmdItems.length === 0) {
            cmdResultsList.innerHTML = `<div class="cmd-empty-state"><i class="fas fa-search"></i> No matching commands found for "${query}"</div>`;
            return;
        }

        if (selectedCmdIndex >= filteredCmdItems.length) {
            selectedCmdIndex = 0;
        }

        let html = "";
        filteredCmdItems.forEach(function (item, idx) {
            const isSelected = idx === selectedCmdIndex ? "selected" : "";
            html += `
                <div class="cmd-item ${isSelected}" data-index="${idx}">
                    <div class="cmd-item-left">
                        <div class="cmd-item-icon"><i class="fas ${item.icon}"></i></div>
                        <div class="cmd-item-info">
                            <span class="cmd-item-title">${item.title}</span>
                            <span class="cmd-item-desc">${item.desc}</span>
                        </div>
                    </div>
                    <span class="cmd-item-badge">${item.category}</span>
                </div>
            `;
        });
        cmdResultsList.innerHTML = html;

        // Click listeners on items
        cmdResultsList.querySelectorAll(".cmd-item").forEach(function (el) {
            el.addEventListener("click", function () {
                const idx = parseInt(el.getAttribute("data-index"), 10);
                if (filteredCmdItems[idx]) {
                    closeCmdPalette();
                    filteredCmdItems[idx].action();
                }
            });
        });
    }

    // Command palette key listeners
    if (cmdSearchInput) {
        cmdSearchInput.addEventListener("input", function () {
            selectedCmdIndex = 0;
            renderCmdResults(cmdSearchInput.value);
        });

        cmdSearchInput.addEventListener("keydown", function (e) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (filteredCmdItems.length > 0) {
                    selectedCmdIndex = (selectedCmdIndex + 1) % filteredCmdItems.length;
                    renderCmdResults(cmdSearchInput.value);
                }
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (filteredCmdItems.length > 0) {
                    selectedCmdIndex = (selectedCmdIndex - 1 + filteredCmdItems.length) % filteredCmdItems.length;
                    renderCmdResults(cmdSearchInput.value);
                }
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (filteredCmdItems[selectedCmdIndex]) {
                    closeCmdPalette();
                    filteredCmdItems[selectedCmdIndex].action();
                }
            } else if (e.key === "Escape") {
                closeCmdPalette();
            }
        });
    }

    // Global shortcut: Ctrl + K or Cmd + K
    window.addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            if (cmdPaletteBackdrop && cmdPaletteBackdrop.classList.contains("open")) {
                closeCmdPalette();
            } else {
                openCmdPalette();
            }
        } else if (e.key === "Escape") {
            closeCmdPalette();
        }
    });

    if (cmdPaletteBtn) {
        cmdPaletteBtn.addEventListener("click", openCmdPalette);
    }

    const cmdCloseBtn = document.getElementById("cmdCloseBtn");
    if (cmdCloseBtn) {
        cmdCloseBtn.addEventListener("click", closeCmdPalette);
    }

    if (cmdPaletteBackdrop) {
        cmdPaletteBackdrop.addEventListener("click", function (e) {
            if (e.target === cmdPaletteBackdrop) {
                closeCmdPalette();
            }
        });
    }

    // ==========================================
    // 19. Multi-Theme Accent Switcher (Cyan, Neon, Emerald, Amber)
    // ==========================================
    const themePaletteBtn = document.getElementById("themePaletteBtn");
    const themePaletteDropdown = document.getElementById("themePaletteDropdown");
    const themePickerWrapper = document.getElementById("themePickerWrapper");
    const themeActiveDot = document.getElementById("themeActiveDot");
    const themeSwatchBtns = document.querySelectorAll(".theme-swatch-btn");

    const THEME_NAMES = {
        cyan: "Electric Cyan",
        neon: "Cyberpunk Neon",
        emerald: "Matrix Emerald",
        amber: "Sunset Gold"
    };

    const THEME_COLORS = {
        cyan: "#38bdf8",
        neon: "#f472b6",
        emerald: "#10b981",
        amber: "#f59e0b"
    };

    function setPortfolioTheme(themeName, showNotification) {
        if (!themeName || !THEME_NAMES[themeName]) themeName = "cyan";

        if (themeName === "cyan") {
            document.documentElement.removeAttribute("data-theme");
        } else {
            document.documentElement.setAttribute("data-theme", themeName);
        }

        localStorage.setItem("portfolioThemeAccent", themeName);

        // Update active dot in navbar
        if (themeActiveDot) {
            themeActiveDot.style.background = THEME_COLORS[themeName] || "#38bdf8";
            themeActiveDot.style.boxShadow = `0 0 6px ${THEME_COLORS[themeName] || "#38bdf8"}`;
        }

        // Update active class on all swatches (desktop navbar + mobile drawer)
        themeSwatchBtns.forEach(function (btn) {
            const btnTheme = btn.getAttribute("data-theme");
            if (btnTheme === themeName) {
                btn.classList.add("active");
                btn.setAttribute("aria-selected", "true");
            } else {
                btn.classList.remove("active");
                btn.setAttribute("aria-selected", "false");
            }
        });

        if (showNotification) {
            showToast(`🎨 Accent changed to ${THEME_NAMES[themeName]}!`);
            playUiSound("nav");
        }
    }

    // Toggle theme dropdown
    if (themePaletteBtn && themePaletteDropdown) {
        themePaletteBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            const isOpen = themePaletteDropdown.classList.contains("open");
            if (isOpen) {
                themePaletteDropdown.classList.remove("open");
                themePaletteBtn.setAttribute("aria-expanded", "false");
            } else {
                themePaletteDropdown.classList.add("open");
                themePaletteBtn.setAttribute("aria-expanded", "true");
                playUiSound("click");
            }
        });

        // Close when clicking outside
        document.addEventListener("click", function (e) {
            if (themePickerWrapper && !themePickerWrapper.contains(e.target)) {
                themePaletteDropdown.classList.remove("open");
                themePaletteBtn.setAttribute("aria-expanded", "false");
            }
        });

        // Close on ESC
        window.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && themePaletteDropdown.classList.contains("open")) {
                themePaletteDropdown.classList.remove("open");
                themePaletteBtn.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Swatch click handlers (desktop dropdown + drawer)
    themeSwatchBtns.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            const chosen = btn.getAttribute("data-theme");
            setPortfolioTheme(chosen, true);
            if (themePaletteDropdown) {
                themePaletteDropdown.classList.remove("open");
                if (themePaletteBtn) themePaletteBtn.setAttribute("aria-expanded", "false");
            }
        });
    });

    // Initialize saved theme on page load
    const savedTheme = localStorage.getItem("portfolioThemeAccent") || "cyan";
    setPortfolioTheme(savedTheme, false);


    // ==========================================
    // 20. Recruiter Lens & Interactive ATS Role Matcher
    // ==========================================
    const recruiterLensCard = document.getElementById("recruiterLens");
    const roleMatcherBtns = document.querySelectorAll(".role-matcher-btn");
    const lensScoreNum = document.getElementById("lensScoreNum");
    const lensScoreStatus = document.getElementById("lensScoreStatus");
    const scoreRingPath = document.getElementById("scoreRingPath");
    const matchedSkillsTags = document.getElementById("matchedSkillsTags");
    const matchedProjectsList = document.getElementById("matchedProjectsList");
    const copyRecruiterSummaryBtn = document.getElementById("copyRecruiterSummaryBtn");

    const ROLE_DATA = {
        aiml: {
            roleTitle: "AI / ML Engineer",
            score: 70,
            status: "High Compatibility",
            dashArray: "70, 100",
            skills: [
                { icon: "fab fa-python", text: "Python & Advanced OOP" },
                { icon: "fas fa-brain", text: "Machine Learning & Neural Nets" },
                { icon: "fas fa-robot", text: "Generative AI & LLMs (Gemini, Groq Llama-3)" },
                { icon: "fas fa-eye", text: "Computer Vision (OpenCV & MediaPipe)" },
                { icon: "fas fa-chart-line", text: "NumPy, Pandas & Pipelines" },
                { icon: "fas fa-database", text: "MySQL & MongoDB" }
            ],
            projects: [
                "GenAI Multi-Agent Study Companion (Gemini API + Flask + MongoDB)",
                "AI Sports Pose Detection & Kinematics Analyzer (OpenCV + MediaPipe)",
                "Groq Ultra-Low Latency Voice AI Assistant (Llama-3 70B)",
                "Generative AI Internship at Adroit Technologies (June 2026)"
            ],
            summary: "Candidate: Jeevitha Sakthivel | Target: AI/ML Engineer | Match: 70% ATS Verified\nAcademics: B.E. CSE (AI & ML) - 8.8 CGPA (Arunai Engineering College, 2023-2027)\nKey Skills: Python, OpenCV, MediaPipe, NumPy, Pandas, Groq API, Gemini API, MySQL, MongoDB\nInternship: Generative AI Intern at Adroit Technologies (June 2026)\nPhone: +91 6369660084 | Email: kayaljeevitha43@gmail.com | Portfolio: https://github.com/Jeevitha-Sakthivel"
        },
        fullstack: {
            roleTitle: "Full-Stack Web Developer",
            score: 80,
            status: "Strong Match",
            dashArray: "80, 100",
            skills: [
                { icon: "fab fa-react", text: "React.js & Component Architecture" },
                { icon: "fab fa-node-js", text: "Node.js & Express.js REST APIs" },
                { icon: "fab fa-js-square", text: "Modern JavaScript (ES6+)" },
                { icon: "fas fa-database", text: "MongoDB & MERN Stack" },
                { icon: "fab fa-html5", text: "HTML5 & Semantic SEO" },
                { icon: "fab fa-css3-alt", text: "CSS3 Glassmorphism & Responsive UI" }
            ],
            projects: [
                "Full-Stack Student Management Portal (React.js + Node.js + Express + MongoDB)",
                "Interactive Portfolio Web Platform (Custom CSS Engine & Particle Physics)",
                "Automated College Timetable Generator (Constraint Backtracking Algorithm)",
                "GenAI Multi-Agent Academic Assistant Web App"
            ],
            summary: "Candidate: Jeevitha Sakthivel | Target: Full-Stack Web Developer | Match: 80% ATS Verified\nAcademics: B.E. CSE (AI & ML) - 8.8 CGPA (Arunai Engineering College)\nKey Skills: React.js, Node.js, Express.js, MongoDB, JavaScript ES6+, HTML5, CSS3, REST APIs\nProjects: MERN Student Management Portal, Automated Timetable Generator, Custom Web Platform\nPhone: +91 6369660084 | Email: kayaljeevitha43@gmail.com"
        },
        python: {
            roleTitle: "Python & GenAI Developer",
            score: 85,
            status: "Exceptional Match",
            dashArray: "85, 100",
            skills: [
                { icon: "fab fa-python", text: "Python Core & Advanced Architecture" },
                { icon: "fas fa-robot", text: "Generative AI & LLM Orchestration" },
                { icon: "fas fa-microchip", text: "Groq Cloud API & Fast Inference" },
                { icon: "fas fa-pepper-hot", text: "Flask Microframework & REST APIs" },
                { icon: "fas fa-code-branch", text: "Constraint Satisfaction Algorithms" },
                { icon: "fas fa-database", text: "Cognitive Class Certified SQL & MongoDB" }
            ],
            projects: [
                "Groq Ultra-Low Latency Voice Assistant (Python + Groq Llama-3)",
                "Automated Schedule Clash Resolver with Backtracking Algorithm",
                "GenAI Multi-Agent Study Companion (Python + Flask)",
                "Generative AI Internship at Adroit Technologies (June 2026)"
            ],
            summary: "Candidate: Jeevitha Sakthivel | Target: Python & GenAI Developer | Match: 85% ATS Verified\nAcademics: B.E. CSE (AI & ML) - 8.8 CGPA (Arunai Engineering College)\nKey Skills: Python 3, Generative AI, Groq API, Google Gemini API, Flask, MySQL, MongoDB, Algorithms\nInternship: Generative AI Intern at Adroit Technologies (June 2026)\nPhone: +91 6369660084 | Email: kayaljeevitha43@gmail.com"
        },
        backend: {
            roleTitle: "Backend & Database Engineer",
            score: 65,
            status: "Well Qualified",
            dashArray: "65, 100",
            skills: [
                { icon: "fab fa-node-js", text: "Node.js & Express Architecture" },
                { icon: "fas fa-pepper-hot", text: "Python Flask REST APIs" },
                { icon: "fas fa-database", text: "MySQL & Relational Schema Design" },
                { icon: "fas fa-leaf", text: "MongoDB NoSQL Collections & Aggregations" },
                { icon: "fas fa-shield-halved", text: "CRUD Operations & API Security" },
                { icon: "fas fa-network-wired", text: "Postman API Testing & Debugging" }
            ],
            projects: [
                "Student Information Management Backend (Node.js + Express + MongoDB)",
                "Algorithmic Timetable Optimization Engine (Python Constraint Satisfaction)",
                "Gemini & Groq API Service Middleware Integration",
                "IBM Cognitive Class: Relational Database and SQL Certification"
            ],
            summary: "Candidate: Jeevitha Sakthivel | Target: Backend & Database Engineer | Match: 65% ATS Verified\nAcademics: B.E. CSE (AI & ML) - 8.8 CGPA (Arunai Engineering College)\nKey Skills: Node.js, Express.js, Flask, MySQL, MongoDB, REST APIs, Postman, Git\nCertifications: IBM Cognitive Class SQL & Relational Databases 101\nPhone: +91 6369660084 | Email: kayaljeevitha43@gmail.com"
        }
    };

    let currentMatchedRole = "aiml";

    function selectMatchedRole(roleKey) {
        const roleData = ROLE_DATA[roleKey];
        if (!roleData) return;
        currentMatchedRole = roleKey;

        // Update active tab buttons
        roleMatcherBtns.forEach(function (btn) {
            const r = btn.getAttribute("data-role");
            if (r === roleKey) {
                btn.classList.add("active");
                btn.setAttribute("aria-selected", "true");
            } else {
                btn.classList.remove("active");
                btn.setAttribute("aria-selected", "false");
            }
        });

        // Update score & status
        if (lensScoreNum) lensScoreNum.textContent = `${roleData.score}%`;
        if (lensScoreStatus) lensScoreStatus.textContent = roleData.status;
        if (scoreRingPath) {
            scoreRingPath.setAttribute("stroke-dasharray", roleData.dashArray);
        }

        // Render matched skill tags
        if (matchedSkillsTags) {
            let tagsHtml = "";
            roleData.skills.forEach(function (sk) {
                tagsHtml += `<span class="match-tag"><i class="${sk.icon}"></i> ${sk.text}</span>`;
            });
            matchedSkillsTags.innerHTML = tagsHtml;
        }

        // Render matched projects
        if (matchedProjectsList) {
            let projsHtml = "";
            roleData.projects.forEach(function (p) {
                projsHtml += `<span class="match-proj-item"><i class="fas fa-check-circle"></i> ${p}</span>`;
            });
            matchedProjectsList.innerHTML = projsHtml;
        }

        // Highlight matching skills in the skills-container below
        const allSkillCards = document.querySelectorAll(".skills-container .skill");
        allSkillCards.forEach(function (card) {
            card.classList.remove("lens-highlighted");
            const cardText = card.textContent.toLowerCase();
            const isMatch = roleData.skills.some(function (sk) {
                const words = sk.text.toLowerCase().split(" ");
                return words.some(w => w.length > 3 && cardText.includes(w));
            });
            if (isMatch) {
                card.classList.add("lens-highlighted");
                setTimeout(() => card.classList.remove("lens-highlighted"), 2500);
            }
        });

        playUiSound("click");
    }

    roleMatcherBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const roleKey = btn.getAttribute("data-role");
            selectMatchedRole(roleKey);
        });
    });

    if (copyRecruiterSummaryBtn) {
        copyRecruiterSummaryBtn.addEventListener("click", function () {
            const activeRole = ROLE_DATA[currentMatchedRole] || ROLE_DATA.aiml;
            copyTextQuick(activeRole.summary);
            playUiSound("success");
            showToast(`📋 Copied ATS Candidate Snapshot for ${activeRole.roleTitle}!`, "fas fa-check-circle");
        });
    }

});



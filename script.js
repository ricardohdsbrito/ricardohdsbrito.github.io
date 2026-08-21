// ==========================================================================
// 1. 手機版漢堡選單控制
// ==========================================================================
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });
}

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        if (hamburger && navMenu) {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }
    });
});

// ==========================================================================
// 2. 首頁打字機效果
// ==========================================================================
const words = ["Ricardo Brito."];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById("typewriter");

function type() {
    if (!typewriterElement) return;
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    typewriterElement.textContent = currentWord.substring(0, charIndex);
    let typeSpeed = isDeleting ? 60 : 150;

    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 1800;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typeSpeed = 600;
    }

    setTimeout(type, typeSpeed);
}

// ==========================================================================
// 3. CV Modal 控制
// ==========================================================================
function openCvModal(event) {
    event.preventDefault();
    const modal = document.getElementById('cvModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCvModal() {
    const modal = document.getElementById('cvModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCvModal();
    }
});

function submitCvRequest(event) {
    event.preventDefault();
    const form = event.target;
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    const statusDiv = document.getElementById('cvFormStatus');
    const submitBtn = form.querySelector('button');
    
    if (email) {
        statusDiv.style.display = 'block';
        statusDiv.style.background = 'rgba(0, 102, 255, 0.05)';
        statusDiv.style.color = '#0066FF';
        statusDiv.textContent = 'Sending request...';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        setTimeout(() => {
            statusDiv.style.background = 'rgba(34, 197, 94, 0.1)';
            statusDiv.style.color = '#22c55e';
            statusDiv.textContent = '✅ Request sent! I\'ll email you my CV shortly.';
            submitBtn.textContent = '✅ Sent!';
            submitBtn.style.background = '#22c55e';
            emailInput.value = '';
            setTimeout(() => {
                closeCvModal();
            }, 2000);
        }, 1000);
    }
}

// ==========================================================================
// 4. 聯絡表單
// ==========================================================================
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const submitBtn = document.getElementById('contactSubmitBtn');
            const statusDiv = document.getElementById('contactFormStatus');
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
            statusDiv.style.display = 'block';
            statusDiv.style.background = 'rgba(0, 102, 255, 0.05)';
            statusDiv.style.color = '#0066FF';
            statusDiv.textContent = 'Sending your message...';
            
            setTimeout(() => {
                statusDiv.style.background = 'rgba(34, 197, 94, 0.1)';
                statusDiv.style.color = '#22c55e';
                statusDiv.textContent = '✅ Message sent successfully! I\'ll get back to you within 24 hours.';
                submitBtn.innerHTML = '✅ Sent! <i class="fa-solid fa-check"></i>';
                submitBtn.style.background = '#22c55e';
                contactForm.reset();
                submitBtn.disabled = false;
            }, 1500);
        });
    }
});

// ==========================================================================
// 5. Blog 管理系統
// ==========================================================================
const allArticles = [
   { 
        id: 1, 
        date: "2026-08-10", 
        title: "From Metasploitable to $25k: My Bug Bounty Journey", 
        desc: "How I hacked Epic Games, Reddit, and Shopify without an OSCP", 
        link: "blog-template.html?file=article1.md",  // ← 改為這個
        icon: "fa-graduation-cap", 
        image: "images/abc.jpg"
    },
    
];

let isUnlocked = false;
let currentPage = 1;
const rowsPerPage = 6;
let currentSortOrder = "newest";

const blogGrid = document.getElementById("blog-grid");
const loadAllBtn = document.getElementById("load-all-blog-btn");
const loadAllContainer = document.getElementById("load-all-container");
const sortWrapper = document.getElementById("blog-sort-wrapper");
const sortSelect = document.getElementById("blog-sort");
const paginationContainer = document.getElementById("pagination");

function formatDate(dateStr) {
    const parts = dateStr.split('-');
    return `${parts[0]}年${parseInt(parts[1])}月${parseInt(parts[2])}日`;
}

function renderBlogSystem() {
    if (!blogGrid) return;
    let sortedArticles = [...allArticles];
    if (currentSortOrder === "newest") {
        sortedArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
        sortedArticles.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    let articlesToDisplay = [];

    if (!isUnlocked) {
        articlesToDisplay = sortedArticles.slice(0, 3);
        if (sortWrapper) sortWrapper.style.display = "none";
        if (paginationContainer) paginationContainer.style.display = "none";
        if (loadAllContainer) loadAllContainer.style.display = "block";
    } else {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        articlesToDisplay = sortedArticles.slice(start, end);
        if (sortWrapper) sortWrapper.style.display = "flex";
        if (paginationContainer) paginationContainer.style.display = "flex";
        if (loadAllContainer) loadAllContainer.style.display = "none";
        const sectionTitle = document.querySelector(".blog-section .section-title");
        if (sectionTitle) sectionTitle.textContent = "All Articles";
    }

    blogGrid.innerHTML = "";
    articlesToDisplay.forEach((article, index) => {
        const cardHtml = `
            <article class="blog-card fade-in" style="animation-delay: ${index * 0.05}s">
                <div class="blog-image" style="${article.image ? `background-image: url('${article.image}'); background-size: cover; background-position: center;` : ''}">
                    ${article.image ? '' : `<i class="fa-solid ${article.icon} fa-2xl"></i>`}
                </div>
                <div class="blog-content">
                    <span class="blog-date">${formatDate(article.date)}</span>
                    <h3><a href="${article.link}" class="blog-title-link">${article.title}</a></h3>
                    <p>${article.desc}</p>
                    <a href="${article.link}" class="read-more">閱讀更多 <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </article>
        `;
        blogGrid.innerHTML += cardHtml;
    });
    if (isUnlocked) { renderPaginationControls(sortedArticles.length); }
}

function renderPaginationControls(totalArticles) {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = "";
    const pageCount = Math.ceil(totalArticles / rowsPerPage);
    if (pageCount <= 1) return;
    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement("button");
        btn.classList.add("page-btn");
        btn.innerText = i;
        if (i === currentPage) btn.classList.add("active");
        btn.addEventListener("click", () => {
            currentPage = i;
            renderBlogSystem();
            document.getElementById("blog").scrollIntoView({ behavior: "smooth" });
        });
        paginationContainer.appendChild(btn);
    }
}

// ==========================================================================
// 6. Publications 引擎
// ==========================================================================
const scholarHologramPapers = [
    {
        id: 1,
        title: "A Comprehensive Review and Outlook of Non-Intrusive Load Monitoring Systems",
        authors: "<strong>R Brito</strong>, WH Choi, MGDC Junior, MC Wong",
        journal: "ACM Computing Surveys 58 (13), 1-28",
        year: 2026,
        link: "https://dl.acm.org/doi/pdf/10.1145/3814607",
        image: "images/ACM21.png",
        snippet: "Non-Intrusive Load Monitoring (NILM) enables the disaggregation of aggregate electrical consumption in residential, commercial, and industrial settings to identify operational appliances and quantify their individual energy usage, eliminating the need for per-appliance metering. Recent years have witnessed transformative advances driven by the widespread adoption of machine learning, particularly deep learning algorithms."
    },
    {
        id: 2,
        title: "Down Sampling Feature Extractor: Improving non-intrusive load monitoring via an efficient down-sampling and feature extraction strategy",
        authors: "<strong>R Brito</strong>, MC Wong, JL Li",
        journal: "Energy and AI, 100777",
        year: 2026,
        link: "https://sciencedirect.com",
        image: "images/energy.jpg",
        snippet: "This paper presents the Down Sampling Feature Extractor (DSFE), a novel and extendable algorithm for Non-Intrusive Load Monitoring (NILM). The proposed algorithm addresses the dual challenges of sampling frequency reduction for electrical appliance load signatures and the automatic extraction of discriminative features from the down-sampled data."
    },
    {
        id: 3,
        title: "Auto‐Cluster Quarter Hybrid Classification Algorithm Based on Instantaneous Active and Reactive Power",
        authors: "<strong>R Brito</strong>, MC Wong, MM Xiao, MG da Costa Junior",
        journal: "IET Smart Grid 8 (1), e70035",
        year: 2025,
        link: "https://ietresearch.onlinelibrary.wiley.com/doi/pdfdirect/10.1049/stg2.12008",
        image: "images/iet.jpg",
        snippet: "Nonintrusive load monitoring (NILM) load classification algorithms' performance and effectiveness are evaluated not only based on their classification accuracy but also based on their computational cost."
    },
    {
        id: 4,
        title: "Machine Learning Applied in Non-Intrusive Load Monitoring",
        authors: "<strong>R Brito</strong>",
        journal: "PQDT-Global",
        year: 2024,
        link: "https://www.proquest.com/openview/9e6b36f922cb3f206081e26cab964a01/1",
        image: "images/pro.png",
        snippet: "Non-Intrusive Load Monitoring (NILM) analyzes the total energy consumption and breaks it down into the detailed power consumption of each electrical appliance inside a household."
    },
    {
        id: 5,
        title: "IoT cloud-edge reconfigurable mixed-signal smart meter platform for arc fault detection",
        authors: "Ya-Jie Wu, <strong>R Brito</strong>, Wai-Hei Choi, Chi-Seng Lam, Man-Chung Wong, Sai-Weng Sin, Rui Paulo Martins",
        journal: "IEEE Internet of Things Journal",
        year: 2022,
        link: "https://ieeexplore.ieee.org/abstract/document/9904847/",
        image: "images/ieee.png",
        snippet: "Smart meter monitors electricity consumption through modern metering devices connected to the Internet via Internet of Things (IoT) technology."
    },
    {
        id: 6,
        title: "GPU-based parallel Shadow Features generation at neural system for improving gait human activity recognition",
        authors: "<strong>R Brito</strong>, RP Biuk-Aghai, S Fong",
        journal: "Multimedia Tools and Applications 80 (8), 12293-12308",
        year: 2021,
        link: "https://link.springer.com/article/10.1007/s11042-020-10274-0",
        image: "images/mut.png",
        snippet: "In this paper, we propose a new method for improving human activity recognition (HAR) datasets in order to increase their classification accuracy when trained with a certain classifier like a Neural Network."
    },
    {
        id: 7,
        title: "Instantaneous active and reactive load signature applied in non‐intrusive load monitoring systems",
        authors: "<strong>R Brito</strong>, MC Wong, HC Zhang, MG Da Costa Junior, CS Lam, CK Wong",
        journal: "IET Smart Grid 4 (1), 121-133",
        year: 2021,
        link: "https://ietresearch.onlinelibrary.wiley.com/doi/pdfdirect/10.1049/stg2.12008",
        image: "images/iet.jpg",
        snippet: "The performance of non‐intrusive load monitoring (NILM) systems heavily depends on the uniqueness of the load signature extracted from the electrical appliances."
    },
    {
        id: 8,
        title: "A Novel Algorithm for Neural Network Architecture Generation, Parameter Optimization and Feature Selection: ParFeatArch Generator",
        authors: "<strong>R Brito</strong>, S Fong, W Yaoyang, S Deb",
        journal: "Proceedings of the 2nd International Conference on Intelligent Systems",
        year: 2018,
        link: "https://google.com",
        image: "images/acm.jpg",
        snippet: "In this paper, we propose ParFeatArch Generator, a new algorithm for generating Neural Network architectures with optimal features and parameters through Particle Swarm Optimization."
    },
    {
        id: 9,
        title: "Generating neural networks with optimal features through particle swarm optimization",
        authors: "<strong>R Brito</strong>, S Fong, Y Zhuang, Y Wu",
        journal: "Proceedings of the International Conference on Big Data and Internet of Thing",
        year: 2017,
        link: "https://google.com",
        image: "images/acm.jpg",
        snippet: "In this paper, we propose a new algorithm for generating Neural Network architectures with optimal features through Particle Swarm Optimization."
    },
    {
        id: 10,
        title: "Detecting Unusual Human Activities Using GPU-Enabled Neural Network and Kinect Sensors",
        authors: "<strong>R Brito</strong>, S Fong, W Song, K Cho, C Bhatt, D Korzun",
        journal: "Internet of Things and Big Data Technologies for Next Generation Healthcare",
        year: 2017,
        link: "https://google.com",
        image: "images/springer.png",
        snippet: "Graphic Processing Units (GPU) and kinetic sensors are promising devices of Internet of Things (IoT) computing environments in various application domains, including mobile healthcare."
    },
    {
        id: 11,
        title: "Towards implementation of residual-feedback GMDH neural network on parallel GPU memory guided by a regression curve",
        authors: "<strong>R Brito</strong>, S Fong, K Cho, W Song, R Wong, S Mohammed, J Fiaidhi",
        journal: "The Journal of Supercomputing 72 (10), 3993-4020",
        year: 2016,
        link: "https://google.com",
        image: "images/super.png",
        snippet: "GMDH, which stands for Group Method Data Handling, is an evolutionary type of neural network. It has received much attention in the supercomputing research community because of its ability to optimize its internal structure for maximum prediction accuracy."
    },
    {
        id: 12,
        title: "GPU-enabled back-propagation artificial neural network for digit recognition in parallel",
        authors: "<strong>R Brito</strong>, S Fong, K Cho, W Song, R Wong, S Mohammed, J Fiaidhi",
        journal: "The Journal of Supercomputing 72 (10), 3868-3886",
        year: 2016,
        link: "https://google.com",
        image: "images/super.png",
        snippet: "In this paper, we show that the GPU (graphics processing unit) can be used not only for processing graphics, but also for high speed computing."
    }
];

let holoScholarPage = 1;
const holoScholarItemsPerPage = 3;
let holoScholarSort = "newest";

function initHoloScholarEngine() {
    const sortSelect = document.getElementById("scholar-sort-select");
    if (!sortSelect) return;
    sortSelect.addEventListener("change", (e) => {
        holoScholarSort = e.target.value;
        holoScholarPage = 1;
        renderHoloScholarPapers();
    });
    renderHoloScholarPapers();
}
function renderHoloScholarPapers() {
    const listWrapper = document.getElementById("dynamic-hologram-scholar-list");
    if (!listWrapper) return;
    let sortedPapers = [...scholarHologramPapers];
    if (holoScholarSort === "newest") {
        sortedPapers.sort((a, b) => b.year - a.year);
    } else {
        sortedPapers.sort((a, b) => a.year - b.year);
    }
    const startIndex = (holoScholarPage - 1) * holoScholarItemsPerPage;
    const endIndex = startIndex + holoScholarItemsPerPage;
    const slicedPapers = sortedPapers.slice(startIndex, endIndex);
    listWrapper.innerHTML = "";

    if (slicedPapers.length === 0) {
        listWrapper.innerHTML = `<p style="text-align:center;color:#5A738E;padding:40px 0;">No publications available.</p>`;
        return;
    }

    slicedPapers.forEach(paper => {
        const item = document.createElement("div");
        item.className = "new-hologram-item";
        item.innerHTML = `
            <div class="hologram-item-header">
                <div class="hologram-title-group">
                    <h4 class="hologram-item-title">${paper.title}</h4>
                    <div style="font-size: 13.5px; color: #008000; margin-top: 4px; font-weight: 500;">
                        ${paper.authors} - <em style="color:#5A738E; font-style:italic;">${paper.journal}</em>
                    </div>
                </div>
                <span class="hologram-item-capsule">${paper.year}</span>
            </div>
            <div class="hologram-expand-body">
                <div class="hologram-inner-layout">
                    <div class="holo-layout-left">
                        <p class="hologram-item-desc"><strong>Abstract：</strong>${paper.snippet}</p>
                    </div>
                    <div class="hologram-visual-box" style="background-color: #ffffff; padding: 8px; border: none; background: transparent;">
                        ${paper.image ? `<img src="${paper.image}" alt="Research Chart" style="width: 100%; height: 100%; object-fit: contain; border-radius: 6px; padding: 0;">` : `<i class="fa-solid fa-file-pdf"></i>`}
                    </div>
                </div>
            </div>
        `;
        
        const leftColumn = item.querySelector('.holo-layout-left');
        
        // ✅ 創建按鈕，文字用 <span> 包裹
        const btn = document.createElement('a');
        btn.href = paper.link;
        btn.target = '_blank';
        btn.className = 'hologram-action-btn';
        btn.setAttribute('onclick', 'event.stopPropagation();');
        
        // 用 span 包裹文字，方便單獨控制顏色
        btn.innerHTML = '<span style="color: #5A738E;">View Paper</span> <i class="fa-solid fa-arrow-up-right-from-square" style="color: #5A738E;"></i>';
        
        // 基本樣式
        btn.style.display = 'inline-flex';
        btn.style.alignItems = 'center';
        btn.style.gap = '8px';
        btn.style.textDecoration = 'none';
        btn.style.fontWeight = '700';
        btn.style.fontSize = '13px';
        btn.style.backgroundColor = '#ffffff';
        btn.style.padding = '8px 20px';
        btn.style.borderRadius = '50px';
        btn.style.border = '1px solid #e5e7eb';
        btn.style.transition = 'all 0.3s ease';
        btn.style.cursor = 'pointer';
        btn.style.marginTop = '4px';
        
        // ✅ 懸浮時 - 改變 span 和 i 的顏色
        btn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#0066FF';
            this.style.borderColor = '#0066FF';
            // 改變 span 文字顏色
            const span = this.querySelector('span');
            if (span) span.style.color = '#ffffff';
            // 改變 icon 顏色
            const icon = this.querySelector('i');
            if (icon) icon.style.color = '#ffffff';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#ffffff';
            this.style.borderColor = '#e5e7eb';
            const span = this.querySelector('span');
            if (span) span.style.color = '#5A738E';
            const icon = this.querySelector('i');
            if (icon) icon.style.color = '#5A738E';
        });
        
        leftColumn.appendChild(btn);

        item.addEventListener("click", function() {
            if (this.classList.contains("active")) {
                this.classList.remove("active");
            } else {
                document.querySelectorAll("#dynamic-hologram-scholar-list .new-hologram-item").forEach(el => el.classList.remove("active"));
                this.classList.add("active");
            }
        });
        listWrapper.appendChild(item);
    });
    renderHoloScholarPagination(sortedPapers.length);
}
function renderHoloScholarPagination(totalItems) {
    const paginationWrapper = document.getElementById("scholar-pagination");
    if (!paginationWrapper) return;
    paginationWrapper.innerHTML = "";
    const totalPages = Math.ceil(totalItems / holoScholarItemsPerPage);
    if (totalPages <= 1) {
        paginationWrapper.style.minHeight = "60px";
        return;
    }
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.className = `scholar-page-btn ${holoScholarPage === i ? 'active' : ''}`;
        btn.innerText = i;
        btn.addEventListener("click", () => {
            holoScholarPage = i;
            renderHoloScholarPapers();
            const section = document.getElementById("publications");
            if (section) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 70;
                const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
        paginationWrapper.appendChild(btn);
    }
}

// ==========================================================================
// 7. CVE 引擎
// ==========================================================================
const cveDataEngine = [
    {
        id: 1,
        cveId: "CVE-2025-12669",
        icon: "fa-chart-line",
        year: 2025,
        title: "Cross-site Scripting issue in achievement email notifications impacts GitLab CE/EE",
        subtitle: "GitLab has remediated an issue that could have allowed an authenticated user to inject HTML and JavaScript into email notifications sent to other users due to improper input sanitization.",
        desc: "Impacted Versions: GitLab CE/EE: all versions from 15.11 before 18.9.7, 18.10 before 18.10.6, and 18.11 before 18.11.3",
        cvssLink: "https://docs.gitlab.com/releases/patches/patch-release-gitlab-18-11-3-released/?nav=18.11.3#cve-2025-12669---cross-site-scripting-issue-in-achievement-email-notifications-impacts-gitlab-ceee",
        cvssText: "(CVSS:3.1/AV:N/AC:L/PR:L/UI:R/S:C/C:L/I:L/A:N)",
        cveLink: "https://www.cve.org/CVERecord?id=CVE-2025-12669"
    },
    {
        id: 2,
        cveId: "CVE-2024-7057",
        icon: "fa-code",
        year: 2024,
        title: "Reports can access and download job artifacts despite use of settings to prevent it",
        subtitle: "An information disclosure vulnerability in GitLab CE/EE affecting all versions starting from 16.7 prior to 17.0.5, starting from 17.1 prior to 17.1.3, and starting from 17.2 prior to 17.2.1 where job artifacts can be inappropriately exposed to users lacking the proper authorization level.",
        desc: "It is now mitigated in the latest release and is assigned CVE-2024-7057",
        cvssLink: "https://docs.gitlab.com/releases/patches/patch-release-gitlab-17-2-1-released/?nav=17.2.1#reports-can-access-and-download-job-artifacts-despite-use-of-settings-to-prevent-it",
        cvssText: "(CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:N/A:N, 4.3)",
        cveLink: "https://www.cve.org/CVERecord?id=CVE-2024-7057"
    },
    {
        id: 3,
        cveId: "CVE-2024-5318",
        icon: "fa-bug",
        year: 2024,
        title: "Guest user can view dependency lists of private projects through job artifacts",
        subtitle: "An issue has been discovered in GitLab CE/EE affecting all versions starting from 11.11 prior to 16.10.6, starting from 16.11 prior to 16.11.3, and starting from 17.0 prior to 17.0.1. A Guest user can view dependency lists of private projects through job artifacts.",
        desc: "It is now mitigated in the latest release and is assigned CVE-2024-5318.",
        cvssLink: "https://docs.gitlab.com/releases/patches/patch-release-gitlab-17-0-1-released/?nav=17.0.1#guest-user-can-view-dependency-lists-of-private-projects-through-job-artifacts",
        cvssText: "(CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:N/A:N, 4.3)",
        cveLink: "https://www.cve.org/CVERecord?id=CVE-2024-5318"
    },
    {
        id: 4,
        cveId: "CVE-2023-4532",
        icon: "fa-server",
        year: 2023,
        title: "Unauthorised association of CI jobs for Machine Learning experiments",
        subtitle: "An issue has been discovered in GitLab affecting all versions starting from 16.2 before 16.2.8, all versions starting from 16.3 before 16.3.5, all versions starting from 16.4 before 16.4.1. Users were capable of linking CI/CD jobs of private projects which they are not a member of.",
        desc: "It is now mitigated in the latest release and is assigned CVE-2023-4532.",
        cvssLink: "https://docs.gitlab.com/releases/patches/patch-release-gitlab-16-4-1-released/?nav=16.4.1#unauthorised-association-of-ci-jobs-for-machine-learning-experiments",
        cvssText: "(CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:N/A:N, 4.3).",
        cveLink: "https://www.cve.org/CVERecord?id=CVE-2023-4532"
    },
    {
        id: 5,
        cveId: "CVE-2023-4018",
        icon: "fa-microchip",
        year: 2023,
        title: "User is capable of creating Model experiment and updating existing run's status in public project",
        subtitle: "An issue has been discovered in GitLab CE/EE affecting all versions starting from 16.2 before 16.2.5, all versions starting from 16.3 before 16.3.1. Due to improper permission validation it was possible to create model experiments in public projects.",
        desc: "It is now mitigated in the latest release and is assigned CVE-2023-4018.",
        cvssLink: "https://docs.gitlab.com/releases/patches/patch-release-gitlab-16-3-1-released/?nav=16.3.1#user-is-capable-of-creating-model-experiment-and-updating-existing-runs-status-in-public-project",
        cvssText: "(CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:L/A:N, 4.3).",
        cveLink: "https://www.cve.org/CVERecord?id=CVE-2023-4018"
    },
    {
        id: 6,
        cveId: "CVE-2023-1936",
        icon: "fa-terminal",
        year: 2023,
        title: "Improper Access Control leading to feature exposure",
        subtitle: "An issue has been discovered in GitLab CE/EE affecting specific versions where proper check enforcement was missing on operational scopes. This led to state interaction options becoming visible to global scopes.",
        desc: "It is now mitigated in the latest release and is assigned CVE-2023-1936.",
        cvssLink: "https://docs.gitlab.com/releases/patches/patch-release-gitlab-16-1-1-released/?nav=16.1.1#private-email-address-of-service-desk-issue-creator-disclosed-via-issues-api",
        cvssText: "(CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:N/A:N, 4.3).",
        cveLink: "https://www.cve.org/CVERecord?id=CVE-2023-1936"
    }
];

let cveCurrentPage = 1;
const cveItemsPerPage = 3;
let cveCurrentSort = "newest";

function renderCveDashboard() {
    const listWrapper = document.getElementById("dynamic-cve-list");
    if (!listWrapper) return;
    
    let processedData = [...cveDataEngine];

    if (cveCurrentSort === "newest") {
        processedData.sort((a, b) => b.year - a.year || b.id - a.id);
    } else {
        processedData.sort((a, b) => a.year - b.year || a.id - a.id);
    }

    const startIndex = (cveCurrentPage - 1) * cveItemsPerPage;
    const endIndex = startIndex + cveItemsPerPage;
    const paginatedData = processedData.slice(startIndex, endIndex);

    listWrapper.innerHTML = "";

    if (paginatedData.length === 0) {
        listWrapper.innerHTML = `<p style="text-align:center;color:#5A738E;padding:40px 0;">No CVE data available.</p>`;
        return;
    }

    paginatedData.forEach(item => {
        const cvssTagHtml = item.cvssText ? `
            <a href="${item.cvssLink}" class="inline-link-premium" target="_blank" onclick="event.stopPropagation();">
                ${item.cvssText} <i class="fa-solid fa-arrow-up-right-from-square link-icon" style="font-size: 11px;"></i>
            </a>
        ` : '';

        // 🌟 CVE 專用 HTML - 沒有圖片框
        const itemHtml = `
            <div class="new-hologram-item cve-animate-render">
                <div class="hologram-item-header">
                    <div class="hologram-title-group">
                        <h4 class="cve-title">
                            <i class="fa-solid ${item.icon}"></i> ${item.cveId}
                        </h4>
                        <div>${item.title}</div>
                    </div>
                    <span class="hologram-item-capsule">${item.year}</span>
                </div>
                
                <div class="hologram-expand-body">
                    <!-- 🌟 CVE 專用：只有左欄，沒有圖片框 -->
                    <div class="cve-single-column">
                        <p class="hologram-item-desc"><strong>Description：</strong>${item.subtitle}</p>
                        <p class="hologram-item-desc">
                            ${item.desc} 
                            ${cvssTagHtml}
                        </p>
                        <a href="${item.cveLink}" target="_blank" class="hologram-action-btn" onclick="event.stopPropagation();" style="display: inline-flex; align-items: center; gap: 8px; color: #5A738E; text-decoration: none; font-weight: 700; font-size: 13px; background-color: #ffffff; padding: 8px 20px; border-radius: 50px; border: 1px solid #e5e7eb; transition: all 0.3s ease; cursor: pointer; margin-top: 4px;">
    View CVE Details <i class="fa-solid fa-arrow-up-right-from-square"></i>
</a>

                    </div>
                </div>
            </div>
        `;

        listWrapper.insertAdjacentHTML("beforeend", itemHtml);
    });

    // 綁定點擊事件
    document.querySelectorAll("#dynamic-cve-list .new-hologram-item").forEach(item => {
        item.addEventListener("click", function() {
            if (this.classList.contains("active")) {
                this.classList.remove("active");
            } else {
                document.querySelectorAll("#dynamic-cve-list .new-hologram-item").forEach(el => el.classList.remove("active"));
                this.classList.add("active");
            }
        });
    });

    renderCvePagination(processedData.length);
}
function renderCvePagination(totalItems) {
    const paginationWrapper = document.getElementById("cve-pagination");
    if (!paginationWrapper) return;

    const totalPages = Math.ceil(totalItems / cveItemsPerPage);
    paginationWrapper.innerHTML = "";

    if (totalPages <= 1) {
        paginationWrapper.style.minHeight = "60px";
        return;
    }

    for (let i = 1; i <= totalPages; i++) {
        const isActive = i === cveCurrentPage ? "active" : "";
        const btn = document.createElement("button");
        btn.className = `cve-page-btn ${isActive}`;
        btn.textContent = i;
        btn.setAttribute("data-page", i);
        
        btn.addEventListener("click", function() {
            cveCurrentPage = parseInt(this.getAttribute("data-page"));
            renderCveDashboard();
            
            const section = document.getElementById("portfolio");
            if (section) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 70;
                const targetPosition = section.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
        
        paginationWrapper.appendChild(btn);
    }
}

// ==========================================================================
// 8. 語言影片切換 & Lightbox
// ==========================================================================
document.addEventListener('DOMContentLoaded', function() {
    // Tabs switching
    const tabButtons = document.querySelectorAll('.tab-toggle-btn');
    const stageItems = document.querySelectorAll('.cinema-stage-item');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const targetStage = button.getAttribute('data-target');
            stageItems.forEach(stage => {
                if (stage.classList.contains(targetStage)) {
                    stage.classList.add('active');
                } else {
                    stage.classList.remove('active');
                }
            });
        });
    });

    // Video slider
    const slides = document.querySelectorAll('.video-slide');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');
    let currentSlideIndex = 0;
    if (slides.length > 0 && prevBtn && nextBtn) {
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            if (index >= slides.length) { currentSlideIndex = 0; }
            else if (index < 0) { currentSlideIndex = slides.length - 1; }
            else { currentSlideIndex = index; }
            slides[currentSlideIndex].classList.add('active');
        }
        nextBtn.addEventListener('click', () => showSlide(currentSlideIndex + 1));
        prevBtn.addEventListener('click', () => showSlide(currentSlideIndex - 1));
    }

    // Certificate Lightbox
    const certCards = document.querySelectorAll('.cert-card');
    const lightbox = document.getElementById('certLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const closeBtn = document.querySelector('.lightbox-close-btn');
    const overlay = document.querySelector('.lightbox-overlay');

    if (lightbox && lightboxImg) {
        certCards.forEach(card => {
            card.addEventListener('click', function(e) {
                const imgUrl = this.getAttribute('data-img');
                if (imgUrl) {
                    lightboxImg.src = imgUrl;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => { lightboxImg.src = ''; }, 400);
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (overlay) overlay.addEventListener('click', closeLightbox);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
});

// ==========================================================================
// 9. 統計數字動畫
// ==========================================================================
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetNumber = parseInt(target.getAttribute('data-target'));
                animateNumber(target, targetNumber);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => {
        observer.observe(num);
    });
}

function animateNumber(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 50);
    const stepTime = 30;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = current;
        }
    }, stepTime);
}

// ==========================================================================
// 10. 全局初始化
// ==========================================================================
document.addEventListener("DOMContentLoaded", function() {
    // 打字機
    if (typewriterElement) {
        setTimeout(type, 500);
    }
    
    // Blog
    if (loadAllBtn) {
        loadAllBtn.addEventListener("click", () => {
            isUnlocked = true;
            currentPage = 1;
            renderBlogSystem();
        });
    }
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            currentSortOrder = e.target.value;
            currentPage = 1;
            renderBlogSystem();
        });
    }
    renderBlogSystem();
    
    // Publications
    initHoloScholarEngine();
    
    // CVE
    const cveSortSelect = document.getElementById("cve-sort-select");
    if (cveSortSelect) {
        cveSortSelect.addEventListener("change", function(e) {
            cveCurrentSort = e.target.value;
            cveCurrentPage = 1;
            renderCveDashboard();
        });
    }
    renderCveDashboard();
    
    // 統計數字
    initStatsCounter();
});

/* ==========================================================================
   導航滾動 - 確保所有區塊標題可見
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 70;
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                
                // 計算偏移量（導航欄高度 + 額外空間）
                let offset = navbarHeight + 15;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

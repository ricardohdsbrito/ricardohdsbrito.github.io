// ==========================================================================
// 1. 手機版漢堡選單控制 (Hamburger Menu)
// ==========================================================================
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

if (hamburger && navMenu) {
    // 點擊漢堡按鈕時，切換開啟/關閉狀態
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });
}

// 點擊選單連結後，自動將選單收回去
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        if (hamburger && navMenu) {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }
    });
});


// ==========================================================================
// 2. 首頁打字機動態輸入效果 (Typewriter Effect)
// ==========================================================================
const words = ["Ricardo Brito.", "A DEVELOPER.", "A Ethical Hacker."]; // 這裡可以改成你的英文名字或稱呼
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById("typewriter");

function type() {
    if (!typewriterElement) return; // 如果找不到元素就先不執行，防止報錯

    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        charIndex--; // 刪除字元
    } else {
        charIndex++; // 增加字元
    }

    typewriterElement.textContent = currentWord.substring(0, charIndex);

    let typeSpeed = isDeleting ? 60 : 150; // 刪除字的速度較快，打字較慢

    // 當單字完全打完
    if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 1800; // 在畫面上清晰停留 1.8 秒
        isDeleting = true;
    } 
    // 當單字完全刪除乾淨
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length; // 輪流播放下一個單字
        typeSpeed = 600; // 停頓半秒後打新字
    }

    setTimeout(type, typeSpeed);
}
// ==========================================================================
// 新增：作品集長方形 Q&A 模式手風琴驅動 (Portfolio Accordion)
// ==========================================================================
function initPortfolioAccordion() {
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach(header => {
        header.addEventListener("click", function() {
            const item = this.parentElement; // 抓到最外層的 .accordion-item
            const content = item.querySelector(".accordion-content"); // 抓到展開方格

            const isOpen = item.classList.contains("active");

            // 先把所有其他打開的作品全部收起來
            document.querySelectorAll(".accordion-item").forEach(otherItem => {
                otherItem.classList.remove("active");
                const otherContent = otherItem.querySelector(".accordion-content");
                if (otherContent) otherContent.style.maxHeight = null;
            });

            // 如果原本是關閉的，現在將它打開
            if (!isOpen) {
                item.classList.add("active");
                // 動態計算內容物的實際像素高度，達成平滑動畫
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
}


// ==========================================================================
// 3. 解鎖型網誌管理系統 (初始 3 篇 ➔ 點擊解鎖 6 篇分頁與日期排序)
// ==========================================================================
const allArticles = [
    { id: 1, date: "2026-08-10", title: "From Metasploitable to $25k: My Bug Bounty Journey", desc: "How I hacked Epic Games, Reddit, and Shopify without an OSCP", link: "blog-template.html?file=article1.md&v=6" , icon: "fa-graduation-cap" ,image: "images/abc.jpg"},
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
    return `${parts}年${parseInt(parts)}月${parseInt(parts)}日`;
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
        if (sectionTitle) sectionTitle.textContent = "所有文章";
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
// 5. 全局初始化啟動中心 (DOMContentLoaded 與 window.load)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    if (typeof typewriterElement !== "undefined" && typewriterElement) { 
        setTimeout(type, 500); 
    }
    if (typeof initPortfolioAccordion === "function") {
        initPortfolioAccordion();
    }
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
});

/* ==========================================================================
   29. 完全體：學術論文全息手風琴獨立控制引擎 (Hologram Scholar Engine)
   ========================================================================== */
const scholarHologramPapers = [
    {
        id: 1,
        title: "A Comprehensive Review and Outlook of Non-Intrusive Load Monitoring Systems",
        authors: "<strong>R Brito</strong>, WH Choi, MGDC Junior, MC Wong",
        journal: "ACM Computing Surveys 58 (13), 1-28",
        year: 2026,
        link: "https://dl.acm.org/doi/pdf/10.1145/3814607",
        image: "images/ACM21.png",
        techs: ["IEEE XPLORE", "FIRST AUTHOR"],
        snippet: "Non-Intrusive Load Monitoring (NILM) enables the disaggregation of aggregate electrical consumption in residential, commercial, and industrial settings to identify operational appliances and quantify their individual energy usage, eliminating the need for per-appliance metering. Recent years have witnessed transformative advances driven by the widespread adoption of machine learning, particularly deep learning algorithms, fundamentally reshaping methodologies for appliance classification and energy disaggregation. Concurrently, the proliferation of increasingly higher-frequency NILM datasets has been instrumental in developing sophisticated algorithms reliant on such data. This review article synthesizes the most significant recent advancements in residential NILM research, elucidating the field’s trajectory. We propose a novel, comprehensive NILM framework structured into five core components: Data …"
    },
    {
        id: 2,
        title: "Down Sampling Feature Extractor: Improving non-intrusive load monitoring via an efficient down-sampling and feature extraction strategy",
        authors: "<strong>R Brito</strong>, MC Wong, JL Li",
        journal: "Energy and AI, 100777",
        year: 2026,
        link: "https://sciencedirect.com",
        image: "images/energy.jpg",
        techs: ["SCI JOURNAL (Q1)", "SCOPUS"],
        snippet: "This paper presents the Down Sampling Feature Extractor (DSFE), a novel and extendable algorithm for Non-Intrusive Load Monitoring (NILM). The proposed algorithm addresses the dual challenges of sampling frequency reduction for electrical appliance load signatures and the automatic extraction of discriminative features from the down-sampled data. Its extendable nature is characterized by two key hyper-parameters: the down-sampling factor and the dimensionality of the output feature vector. The DSFE algorithm is implemented via an autoencoder neural network, which learns feature representations end-to-end directly from NILM data. These high-quality features enable the use of simple, computationally efficient classifiers, such as k-Nearest Neighbors (KNN), for the load classification task. Evaluated on the WHITED dataset, the proposed method achieves a load classification accuracy of 95.66 …"
    },
    {
        id: 3,
        title: "Auto‐Cluster Quarter Hybrid Classification Algorithm Based on Instantaneous Active and Reactive Power",
        authors: "<strong>R Brito</strong>, MC Wong, MM Xiao, MG da Costa Junior",
        journal: "IET Smart Grid 8 (1), e70035",
        year: 2025,
        link: "https://ietresearch.onlinelibrary.wiley.com/doi/pdfdirect/10.1049/stg2.70035",
       image: "images/iet.jpg",
        techs: ["ACM DIGITAL LIBRARY"],
        snippet: "Nonintrusive load monitoring (NILM) load classification algorithms' performance and effectiveness are evaluated not only based on their classification accuracy but also based on their computational cost. In recent literature a lot of hybrid approaches have been proposed in order to enhance load classification accuracy. These methods simply combine different NILM algorithms to enhance load classification accuracy, without taking into consideration the increased computational costs. In other words, these methods improve load classification accuracy but at the expense of speed and efficiency, which make them impractical to use in real life. This paper provides a review and a categorisation of hybrid methods in NILM load classification and proposes a novel hybrid approach based on the instantaneous p‐q load signature, which considers different characteristics of load signatures with the goal of computational cost …"
    },
    {
        id: 4,
        title: "Machine Learning Applied in Non-Intrusive Load Monitoring",
        authors: "<strong>R Brito</strong>",
        journal: "PQDT-Global",
        year: 2024,
        link: "https://www.proquest.com/openview/9e6b36f922cb3f206081e26cab964a01/1?pq-origsite=gscholar&cbl=2026366&diss=y",
        image: "images/pro.png",
        techs: ["INTERNATIONAL JOURNAL"],
        snippet: "Non-Intrusive Load Monitoring (NILM) analyzes the total energy consumption and breaks it down into the detailed power consumption of each electrical appliance inside a household. To perform this task, it is necessary to mathematically represent the behavior of an electrical appliance. This is accomplished by load signatures, which describe the behavior of electrical appliances."
    },
    {
        id: 5,
        title: "IoT cloud-edge reconfigurable mixed-signal smart meter platform for arc fault detection",
        authors: "Ya-Jie Wu,<strong>R Brito</strong>,Wai-Hei Choi, Chi-Seng Lam, Man-Chung Wong, Sai-Weng Sin, Rui Paulo Martins",
        journal: "IEEE Internet of Things Journal",
        year: 2022,
        link: "https://ieeexplore.ieee.org/abstract/document/9904847/",
        image: "images/ieee.png",
        techs: ["CONFERENCE PROCEEDINGS"],
        snippet: "Smart meter monitors electricity consumption through modern metering devices connected to the Internet via Internet of Things (IoT) technology, which can provide intelligent and fast applications on-site such as arc fault protection based on nonintrusive monitoring load classification with fast safety responses for varying electric loads. Traditional three, four, and five layers of the IoT architecture cannot support such fast responses under loading variation. This article aims to propose six layers of IoT Cloud-Edge Infrastructure equipped with a reconfigurable mixed-signal controller as a smart meter platform for adaptation to different environments and, for example, deal with fast arc fault detection corresponding to different load characteristics. Such an architecture can reduce the processing time for safety, reduce bandwidth for communication, improve arc detection accuracy under different loading environments, and …"
    },
    {
        id: 6,
        title: "GPU-based parallel Shadow Features generation at neural system for improving gait human activity recognition",
        authors: "<strong>R Brito</strong>, RP Biuk-Aghai, S Fong",
        journal: "Multimedia Tools and Applications 80 (8), 12293-12308",
        year: 2021,
        link: "https://link.springer.com/article/10.1007/s11042-020-10274-0",
        image: "images/mut.png",
        techs: ["CONFERENCE PROCEEDINGS"],
        snippet: "In this paper, we propose a new method for improving human activity recognition (HAR) datasets in order to increase their classification accuracy when trained with a certain classifier like a Neural Network. In this paper a novel training/testing process for building/testing a classification model for human activity recognition (HAR) is proposed. Traditionally, HAR is done by a classifier that learns what activities a person is doing by training with skeletal data obtained from a motion sensor such as Microsoft Kinect or accelerometer sensors. These skeletal data are the spatial coordinates (x, y, z) of different parts of the human body. In addition to the spatial features that describe current positions in the skeletal data, new features called Shadow Features are used to improve the supervised learning efficiency and accuracy of Neural Network classifiers. Shadow Features are inferred from the dynamics of body movements …"
    },
    {
        id: 7,
        title: "Instantaneous active and reactive load signature applied in non‐intrusive load monitoring systems",
        authors: "<strong>R Brito</strong>, MC Wong, HC Zhang, MG Da Costa Junior, CS Lam, CK Wong",
        journal: "IET Smart Grid 4 (1), 121-133",
        year: 2021,
        link: "https://ietresearch.onlinelibrary.wiley.com/doi/pdfdirect/10.1049/stg2.12008",
        image: "images/iet.jpg",
        techs: ["CONFERENCE PROCEEDINGS"],
        snippet: "The performance of non‐intrusive load monitoring (NILM) systems heavily depends on the uniqueness of the load signature extracted from the electrical appliances. Different load signatures have been proposed. Recently, in particular, v–i trajectory feature extraction is attracting more and more attention due to its unique characteristics. Herein, instantaneous p–q load signature (IpqLS) feature extraction is first proposed and applied in NILM, which shows that conventional methods cannot distinguish load signatures under some situations. Applying IpqLS with several machine learning algorithms is not only extracting unique features compared to the overlapping problems of P–Q and v–i trajectory but also improving load classification accuracy. Simulations and experimental results verified the effectiveness of the proposed method."
    },
    {
        id: 8,
        title: "A Novel Algorithm for Neural Network Architecture Generation, Parameter Optimization and Feature Selection: ParFeatArch Generator",
        authors: "<strong>R Brito</strong>, S Fong, W Yaoyang, S Deb",
        journal: "Proceedings of the 2nd International Conference on Intelligent Systems, Metaheuristics & Swarm Intelligence",
        year: 2018,
        link: "https://google.com",
        image: "images/acm.jpg",
        techs: ["CONFERENCE PROCEEDINGS"],
        snippet: "In this paper, we propose ParFeatArch Generator, a new algorithm for generating Neural Network architectures with optimal features and parameters through Particle Swarm Optimization. Selecting the best architecture for a Neural Network is usually done through a trial and error process, in which the number of layers is selected usually based on previous experience and then the network is trained and tested. When using Neural Networks as classifiers in feature selection algorithms, usually the number of layers in the Neural Network is selected prior to using the Neural Network as a classifier to the feature selection algorithm. In this work we propose a new generative algorithm called ParFeatArch Generator, which is based on PSO and combines the feature selection process with the Neural Network architecture selection process and parameter optimization in one algorithm which generates the Neural Network …"
    },
    {
        id: 9,
        title: "Generating neural networks with optimal features through particle swarm optimization",
        authors: "<strong>R Brito</strong>, S Fong, Y Zhuang, Y Wu",
        journal: "Proceedings of the International Conference on Big Data and Internet of Thing",
        year: 2017,
        link: "https://google.com",
        image: "images/acm.jpg",
        techs: ["CONFERENCE PROCEEDINGS"],
        snippet: "In this paper, we propose a new algorithm for generating Neural Network architectures with optimal features through Particle Swarm Optimization. Selecting the best architecture for a Neural Network is usually done through a trial and error process, in which the number of layers is selected usually based on previous experience and then the network is trained and tested. When using Neural Networks as classifiers in feature selection algorithms, usually the number of layers in the Neural Network is selected prior to using the Neural Network as a classifier to the feature selection algorithm. In this paper we propose a new generative algorithm based on PSO which combines the feature selection process with the Neural Network topology selection process in one algorithm which generates the Neural Network topology while at the same time performs feature selection and evaluates the Neural Network topology to …"
    },
    {
        id: 10,
        title: "Detecting Unusual Human Activities Using GPU-Enabled Neural Network and Kinect Sensors",
        authors: "<strong>R Brito</strong>, S Fong, W Song, K Cho, C Bhatt, D Korzun",
        journal: "Internet of Things and Big Data Technologies for Next Generation Healthcare",
        year: 2017,
        link: "https://google.com",
        image: "images/springer.png",
        techs: ["CONFERENCE PROCEEDINGS"],
        snippet: "Graphic Processing Units (GPU) and kinetic sensors are promising devices of Internet of Things (IoT) computing environments in various application domains, including mobile healthcare. In this chapter a novel training/testing process for building/testing a classification model for unusual human activities (UHA) using ensembles of Neural Networks running on NVIDIA GPUs is proposed. Traditionally, UHA is done by a classifier that learns what activities a person is doing by training with skeletal data obtained from a motion sensor such as Microsoft Kinect . These skeletal data are the spatial coordinates (x, y, z) of different parts of the human body. The numeric information forms time series, temporal records of movement sequences that can be used for training an ensemble of Neural Networks. In addition to the spatial features that describe current positions in the skeletal data, new features called shadow features are …"
    },
    {
        id: 11,
        title: "Towards implementation of residual-feedback GMDH neural network on parallel GPU memory guided by a regression curve",
        authors: "<strong>R Brito</strong>, S Fong, K Cho, W Song, R Wong, S Mohammed, J Fiaidhi",
        journal: "The Journal of Supercomputing 72 (10), 3993-4020",
        year: 2016,
        link: "https://google.com",
        image: "images/super.png",
        techs: ["CONFERENCE PROCEEDINGS"],
        snippet: "GMDH, which stands for Group Method Data Handling, is an evolutionary type of neural network. It has received much attention in the supercomputing research community because of its ability to optimize its internal structure for maximum prediction accuracy. GMDH works by evolving itself from a basic network, expanding its number of neurons and hidden layer until no further performance gain can be obtained. Earlier on, the authors proposed a novel strategy that extends existing GMDH neural network techniques. The new strategy, called residual-feedback, retains and reuses past prediction errors as part of the multivariate sample data that provides relevant multivariate inputs to the GMDH neural networks. This is important because the strength of GMDH, like any neural network, is in predicting outcomes from multivariate data, and it is very noise-tolerant. GMDH is a well-known ensemble type of prediction …"
    },
    {
        id: 12,
        title: "GPU-enabled back-propagation artificial neural network for digit recognition in parallel",
        authors: "<strong>R Brito</strong>, S Fong, K Cho, W Song, R Wong, S Mohammed, J Fiaidhi",
        journal: "The Journal of Supercomputing 72 (10), 3868-3886",
        year: 2016,
        link: "https://google.com",
        image: "images/super.png",
        techs: ["CONFERENCE PROCEEDINGS"],
        snippet: "In this paper, we show that the GPU (graphics processing unit) can be used not only for processing graphics, but also for high speed computing. We provide a comparison between the times taken on the CPU and GPU to perform the training and testing of a back-propagation artificial neural network. We implemented two neural networks for recognizing handwritten digits; one consists of serial code executed on the CPU, while the other is a GPU-based version of the same system which executes in parallel. As an experiment for performance evaluation, a system for neural network training on the GPU is developed to reduce training time. The programming environment that the system is based on is CUDA which stands for compute unified device architecture, which allows a programmer to write code that will run on an NVIDIA GPU card. Our results over an experiment of digital image recognition using neural network …"
    }
];

let holoScholarPage = 1;
const holoScholarItemsPerPage = 4; // 🌟 超過 4 篇全自動分頁
let holoScholarSort = "newest";

document.addEventListener("DOMContentLoaded", () => {
    initHoloScholarEngine();
});

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

        // 3. 智慧動態注入 HTML（已完美剷除 techs 標籤）
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
                    <!-- 左欄：學術摘要與 DOI 按鈕 -->
                    <div class="holo-layout-left">
                        <p class="hologram-item-desc"><strong>Abstract：</strong>${paper.snippet}</p>
                        <a href="${paper.link}" target="_blank" class="hologram-action-btn" onclick="event.stopPropagation();">
                            view paper > (DOI) <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                    </div>
                    
                    <!-- 🌟 滿血修正版：強行將 cover 改為 contain，並換上純淨白底，圖片 100% 標準符合絕不切邊！ -->
                    <div class="hologram-visual-box" style="background-color: #ffffff; padding: 8px;">
                        ${paper.image ? 
                            `<img src="${paper.image}" alt="Research Chart" style="width: 100%; height: 100%; object-fit: contain; border-radius: 6px;">` : 
                            `<i class="fa-solid ${paper.icon}"></i>`
                        }
                    </div>
                </div>
            </div>

        `;

        item.addEventListener("click", () => {
            if (item.classList.contains("active")) {
                item.classList.remove("active");
            } else {
                document.querySelectorAll(".new-hologram-item").forEach(el => el.classList.remove("active"));
                item.classList.add("active");
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
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.className = `scholar-page-btn ${holoScholarPage === i ? 'active' : ''}`;
        btn.innerText = i;

        btn.addEventListener("click", () => {
            holoScholarPage = i;
            renderHoloScholarPapers();
            document.querySelector(".scholar-hologram-publications-section").scrollIntoView({ behavior: "smooth", block: "nearest" });
        });

        paginationWrapper.appendChild(btn);
    }
}
//new video page and leaunage
document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. 大分頁切換邏輯 (Tabs Switching)
    // -------------------------------------------------------------
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

    // -------------------------------------------------------------
    // 2. 影片箭頭輪播邏輯 (Video Slider)
    // -------------------------------------------------------------
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
            
            slides.forEach((slide, idx) => {
                if (idx !== currentSlideIndex) {
                    const iframe = slide.querySelector('iframe');
                    if (iframe) {
                        const currentSrc = iframe.src;
                        iframe.src = '';
                        iframe.src = currentSrc;
                    }
                }
            });
        }

        nextBtn.addEventListener('click', () => showSlide(currentSlideIndex + 1));
        prevBtn.addEventListener('click', () => showSlide(currentSlideIndex - 1));
    }

    // -------------------------------------------------------------
    // 3. 新增：證書 Lightbox 燈箱邏輯 (Certificates Lightbox)
    // -------------------------------------------------------------
    const certCards = document.querySelectorAll('.cert-card');
    const lightbox = document.getElementById('certLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const closeBtn = document.querySelector('.lightbox-close-btn');
    const overlay = document.querySelector('.lightbox-overlay');

    if (lightbox && lightboxImg) {
       // 證書 Lightbox 邏輯
certCards.forEach(card => {
    card.addEventListener('click', () => {
        const imgUrl = card.getAttribute('data-img');  // 讀取 data-img
        if (imgUrl) {
            lightboxImg.src = imgUrl;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

        // 關閉燈箱功能
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; /* 🌟 解鎖背景滾動 */
            setTimeout(() => { lightboxImg.src = ''; }, 400); /* 動態淡出後清空圖源 */
        };

        // 綁定各種關閉觸發點
        closeBtn.addEventListener('click', closeLightbox);
        overlay.addEventListener('click', closeLightbox);
        
        // 額外優化：按下鍵盤 ESC 鍵也能安全關閉
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
});

/* ==========================================================================
   31. 大廠級·全息微光 CVE 智慧控制引擎 (JS 區塊 A：數據庫陣列與變數)
   ========================================================================== */

// 1. 核心數據儲存庫：完整 6 個 CVE 資料陣列
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
        cvssLink: "https://docs.gitlab.com/releases/patches/patch-release-gitlab-17-2-1-released/?nav=17.2.1#reports-can-access-and-download-job-artifacts-despite-use-of-settings-to-prevent-it",
        cvssText: "(CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:N/A:N, 4.3)",
        desc: "It is now mitigated in the latest release and is assigned CVE-2024-7057",
        cveLink: "https://www.cve.org/CVERecord?id=CVE-2024-7057 "
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
    }
];

// 2. 運行狀態引擎控制變數
let cveCurrentPage = 1;
const cveItemsPerPage = 4; // 🌟 核心控制：每頁限制 4 筆數據
let cveCurrentSort = "newest";
/* ==========================================================================
   31. 大廠級·全息微光 CVE 智慧控制引擎 (JS 區塊 B：數據庫推入與動態對稱渲染)
   ========================================================================== */

// 1. 數據庫後半段推入：補齊剩餘 3 個 CVE 專案數據
cveDataEngine.push(
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
        title: "User is capable of creating Model experiment and updating existing run’s status in public project",
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
);

// 2. 核心分頁與排序數據切片渲染函數
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

    paginatedData.forEach(item => {
        // ✅ 保留 CVSS 文字連結（點擊文字打開 cvssLink）
        const cvssTagHtml = item.cvssText ? `
            <a href="${item.cvssLink}" class="inline-link-premium" target="_blank" onclick="event.stopPropagation();">
                ${item.cvssText} <i class="fa-solid fa-arrow-up-right-from-square link-icon"></i>
            </a>
        ` : '';

        // ❌ 不要新增 cvssButtonHtml

        const itemHtml = `
            <div class="new-hologram-item cve-animate-render">
                <div class="hologram-item-header">
                    <div class="hologram-title-group">
                        <h4 class="hologram-item-title cve-title">
                            <i class="fa-solid ${item.icon}" style="margin-right: 10px;"></i> ${item.cveId}
                        </h4>
                        <div style="font-size: 13.5px; color: #5A738E; margin-top: 4px; font-weight: 500;">
                            ${item.title}
                        </div>
                    </div>
                    <span class="hologram-item-capsule">${item.year}</span>
                </div>
                
                <div class="hologram-expand-body">
                    <div class="hologram-inner-layout" style="grid-template-columns: 1fr !important;">
                        <div class="holo-layout-left">
                            <p class="hologram-item-desc"><strong>Description：</strong>${item.subtitle}</p>
                            <p class="hologram-item-desc">
                                ${item.desc} 
                                ${cvssTagHtml}  <!-- ✅ 只保留這裡 -->
                            </p>
                            <a href="${item.cveLink}" target="_blank" class="hologram-action-btn" onclick="event.stopPropagation();">
                                View CVE Details <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        listWrapper.insertAdjacentHTML("beforeend", itemHtml);
    });

    // 綁定手風琴點擊行為
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
/* ==========================================================================
   31. 大廠級·全息微光 CVE 智慧控制引擎 (JS 區塊 C：手風琴、分頁按鈕與監聽啟動)
   ========================================================================== */

// 4. 核心函數：處理手風琴展開、動態高度計算與同頁排他折疊
function initCveAccordionBehavior() {
    const items = document.querySelectorAll("#dynamic-cve-list .accordion-item");
    
    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        if (header && content) {
            header.addEventListener('click', () => {
                // 排他邏輯：點開新的，自動縮回同頁面其他已展開的項目
                items.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.accordion-content').style.maxHeight = null;
                    }
                });

                item.classList.toggle('active');
                if (item.classList.contains('active')) {
                    content.style.maxHeight = content.scrollHeight + "px";
                } else {
                    content.style.maxHeight = null;
                }
            });
        }
    });
}

// 5. 核心函數：動態渲染 1, 2... 分頁按鈕並還原正確架構
function renderCvePagination(totalItems) {
    const paginationWrapper = document.getElementById("cve-pagination");
    if (!paginationWrapper) return;

    const totalPages = Math.ceil(totalItems / cveItemsPerPage);
    paginationWrapper.innerHTML = "";

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const isActive = i === cveCurrentPage ? "active" : "";
        paginationWrapper.insertAdjacentHTML("beforeend", `<button class="cve-page-btn ${isActive}" data-page="${i}">${i}</button>`);
    }

    // 綁定頁碼按鈕點擊切換事件
    document.querySelectorAll("#portfolio .cve-page-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            cveCurrentPage = parseInt(btn.getAttribute("data-page"));
            renderCveDashboard();
            
            // 頂級體感優化：換頁後自動平滑滾動回 CVE 區塊頂部
            const portfolioSection = document.getElementById("portfolio");
            if (portfolioSection) {
                portfolioSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// 6. 監聽排序下拉選單的即時切換動作與初始化啟動
document.addEventListener("DOMContentLoaded", () => {
    const sortSelect = document.getElementById("cve-sort-select");
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            cveCurrentSort = e.target.value;
            cveCurrentPage = 1; // 排序切換後，自動重置回第一頁
            renderCveDashboard();
        });
    }

    // 初始化整個引擎，啟動第一次動態渲染
    renderCveDashboard();
});

/* ==========================================================================
   統計數據數字滾動動畫 (Stats Counter Animation)
   ========================================================================== */

function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers.length === 0) return;
    
    // 使用 Intersection Observer 監控區塊是否進入視窗
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetNumber = parseInt(target.getAttribute('data-target'));
                animateNumber(target, targetNumber);
                observer.unobserve(target); // 只觸發一次
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => {
        observer.observe(num);
    });
}

function animateNumber(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 50); // 50 幀完成動畫
    const duration = 1500; // 1.5 秒
    const stepTime = duration / 50;
    
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

// 在 DOMContentLoaded 中初始化
document.addEventListener('DOMContentLoaded', () => {
    // ... 你原本的代碼 ...
    
    // 新增統計數字動畫
    initStatsCounter();
});

/* ==========================================================================
   CV Modal 彈窗控制
   ========================================================================== */

// 打開 Modal
function openCvModal(event) {
    event.preventDefault();
    const modal = document.getElementById('cvModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 鎖定背景滾動
}

// 關閉 Modal
function closeCvModal() {
    const modal = document.getElementById('cvModal');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // 解鎖背景滾動
}

// 點擊 ESC 鍵關閉
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeCvModal();
    }
});

// Email 表單提交
function submitCvRequest(event) {
    event.preventDefault();
    const form = event.target;
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    if (email) {
        // 顯示成功訊息
        const button = form.querySelector('button');
        const originalText = button.textContent;
        button.textContent = '✅ Sent!';
        button.style.background = '#22c55e';
        
        // 這裡可以加上實際的發送邏輯（例如通過 API 發送）
        console.log('CV Request from:', email);
        
        // 開啟 mailto 方便你手動回覆
        window.location.href = `mailto:ricardohdsbrito@gmail.com?subject=CV Request from ${email}&body=Hi Ricardo, I would like to request your full CV. My email is ${email}`;
        
        // 3秒後重置按鈕
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 3000);
        
        emailInput.value = '';
    }
}

/* ==========================================================================
   聯絡表單 - EmailJS 發送
   ========================================================================== */

// 初始化 EmailJS（用你的 Public Key）
(function() {
    emailjs.init("YOUR_EMAILJS_PUBLIC_KEY");
})();

// 聯絡表單提交
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('contactSubmitBtn');
    const statusDiv = document.getElementById('contactFormStatus');
    
    // 獲取表單數據
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // 顯示加載狀態
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
    statusDiv.style.display = 'block';
    statusDiv.style.background = 'rgba(0, 102, 255, 0.05)';
    statusDiv.style.color = '#0066FF';
    statusDiv.textContent = 'Sending your message...';
    
    // 發送 Email
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        to_email: 'ricardohdsbrito@gmail.com'  // ← 改成你的 Email
    })
    .then(function(response) {
        // 成功
        statusDiv.style.background = 'rgba(34, 197, 94, 0.1)';
        statusDiv.style.color = '#22c55e';
        statusDiv.textContent = '✅ Message sent successfully! I\'ll get back to you within 24 hours.';
        submitBtn.innerHTML = '✅ Sent! <i class="fa-solid fa-check"></i>';
        submitBtn.style.background = '#22c55e';
        document.getElementById('contactForm').reset();
    })
    .catch(function(error) {
        // 失敗
        statusDiv.style.background = 'rgba(239, 68, 68, 0.1)';
        statusDiv.style.color = '#ef4444';
        statusDiv.textContent = '❌ Something went wrong. Please try again or connect via LinkedIn.';
        submitBtn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>';
        submitBtn.disabled = false;
    });
});

// CV Modal Email 表單
document.getElementById('cvEmailForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('cvEmailInput');
    const statusDiv = document.getElementById('cvFormStatus');
    const email = emailInput.value.trim();
    const submitBtn = this.querySelector('button');
    
    if (email) {
        statusDiv.style.display = 'block';
        statusDiv.style.background = 'rgba(0, 102, 255, 0.05)';
        statusDiv.style.color = '#0066FF';
        statusDiv.textContent = 'Sending request...';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_CV_TEMPLATE_ID', {
            user_email: email,
            to_email: 'ricardohdsbrito@gmail.com'
        })
        .then(function() {
            statusDiv.style.background = 'rgba(34, 197, 94, 0.1)';
            statusDiv.style.color = '#22c55e';
            statusDiv.textContent = '✅ Request sent! I\'ll email you my CV shortly.';
            submitBtn.textContent = '✅ Sent!';
            submitBtn.style.background = '#22c55e';
            emailInput.value = '';
            setTimeout(() => {
                closeCvModal();
            }, 3000);
        })
        .catch(function() {
            statusDiv.style.background = 'rgba(239, 68, 68, 0.1)';
            statusDiv.style.color = '#ef4444';
            statusDiv.textContent = '❌ Please try again or connect via LinkedIn.';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send →';
        });
    }
});
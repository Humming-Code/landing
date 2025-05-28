document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    const loader = document.querySelector(".loader");
    loader.style.opacity = "0";
    loader.style.transition = "opacity 0.5s ease";

    // Remove from DOM after fade out
    setTimeout(function () {
      loader.style.display = "none";
    }, 500);
  }, 3000); // 3 seconds

  // Initialize interactive behaviors after DOM ready
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const nav = document.querySelector(".nav");
  const header = document.querySelector(".header");

  // Toggle mobile menu and accessibility attributes
  mobileMenuToggle.addEventListener("click", () => {
    const isExpanded = !nav.classList.toggle("active");
    mobileMenuToggle.classList.toggle("active");
    document.body.classList.toggle("no-scroll");
    mobileMenuToggle.setAttribute(
      "aria-expanded",
      String(nav.classList.contains("active"))
    );
    mobileMenuToggle.setAttribute(
      "aria-label",
      nav.classList.contains("active") ? "메뉴 닫기" : "메뉴 열기"
    );
  });

  // Close mobile menu on navigation link click
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenuToggle.classList.remove("active");
      nav.classList.remove("active");
      document.body.classList.remove("no-scroll");
    });
  });

  // Header background change on scroll
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });

  // 스크롤 트랜지션 초기화
  function initScrollAnimations() {
    // GSAP 등록
    gsap.registerPlugin(ScrollTrigger);

    // 섹션 페이드인 애니메이션
    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // 서비스 카드 순차적 애니메이션
    const serviceCards = document.querySelectorAll(".service-card");
    serviceCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: ".services-grid",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // 헤더 스크롤 효과
    gsap.fromTo(
      "header",
      { y: -100 },
      {
        y: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          toggleActions: "play none none none",
        },
      }
    );

    // 통계 숫자 카운트업 애니메이션
    const stats = document.querySelectorAll(".stat-number");
    stats.forEach((stat) => {
      const target = parseInt(stat.getAttribute("data-count"));
      ScrollTrigger.create({
        trigger: stat,
        start: "top 80%",
        onEnter: () => {
          gsap.to(stat, {
            duration: 2,
            innerText: target,
            snap: { innerText: 1 },
            ease: "power2.out",
          });
        },
      });
    });

    // 이미지 요소 애니메이션
    const images = document.querySelectorAll(".reveal-image");
    images.forEach((image) => {
      gsap.fromTo(
        image,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: image,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    });
  }

  // 프로세스 아이콘 트랜지션 애니메이션
  function initProcessIconAnimations() {
    const processItems = document.querySelectorAll(".process-item-intro");

    if (!processItems.length) return;

    // 메인 타임라인 생성
    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".process-showcase",
        start: "top 70%",
        toggleActions: "play none none none",
      },
    });

    // 각 프로세스 아이템 애니메이션
    processItems.forEach((item) => {
      const delay = parseFloat(item.getAttribute("data-delay")) || 0;
      const icon = item.querySelector(".process-icon i");
      const title = item.querySelector(".process-title");
      const desc = item.querySelector(".process-desc");

      // 아이템 자체 애니메이션
      mainTimeline.to(
        item,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          delay: delay,
        },
        delay
      );

      // 아이콘 애니메이션
      mainTimeline.to(
        icon,
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        delay + 0.2
      );

      // 타이틀 애니메이션
      mainTimeline.to(
        title,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        delay + 0.4
      );

      // 설명 애니메이션
      mainTimeline.to(
        desc,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        delay + 0.5
      );
    });

    // 특별 효과: 아이콘 흔들림 애니메이션
    processItems.forEach((item) => {
      const icon = item.querySelector(".process-icon");

      // 마우스 진입 시 효과
      item.addEventListener("mouseenter", () => {
        gsap.to(icon, {
          rotationY: 180,
          duration: 0.6,
          ease: "power2.out",
        });
      });

      // 마우스 떠날 때 효과
      item.addEventListener("mouseleave", () => {
        gsap.to(icon, {
          rotationY: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      });
    });
  }

  // 프로세스 캐러셀 초기화 및 관리
  function initProcessCarousel() {
    const track = document.querySelector(".carousel-track");
    const items = document.querySelectorAll(".process-item-intro");
    const nextButton = document.querySelector(".carousel-btn.next");
    const prevButton = document.querySelector(".carousel-btn.prev");
    const indicatorsContainer = document.querySelector(".carousel-indicators");

    if (!track || !items.length) return;

    let currentIndex = 0;
    const itemCount = items.length;

    // 인디케이터 생성
    for (let i = 0; i < itemCount; i++) {
      const indicator = document.createElement("div");
      indicator.classList.add("indicator");
      if (i === 0) indicator.classList.add("active");
      indicator.addEventListener("click", () => goToSlide(i));
      indicatorsContainer.appendChild(indicator);
    }

    const indicators = document.querySelectorAll(".indicator");

    // 슬라이드 이동 함수
    function goToSlide(index) {
      if (index < 0) index = itemCount - 1;
      if (index >= itemCount) index = 0;

      track.style.transform = `translateX(-${index * 100}%)`;
      currentIndex = index;

      // 인디케이터 업데이트
      indicators.forEach((ind, i) => {
        ind.classList.toggle("active", i === currentIndex);
      });

      // GSAP 애니메이션으로 현재 아이템 강조
      gsap.fromTo(
        items[currentIndex].querySelector(".process-icon"),
        { scale: 0.8, rotation: -10 },
        { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.7)" }
      );

      gsap.fromTo(
        items[currentIndex].querySelector(".process-title"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.2 }
      );

      gsap.fromTo(
        items[currentIndex].querySelector(".process-desc"),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.3 }
      );
    }

    // 다음 슬라이드로 이동
    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    // 이전 슬라이드로 이동
    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    // 버튼 이벤트 등록
    nextButton.addEventListener("click", nextSlide);
    prevButton.addEventListener("click", prevSlide);

    // 자동 슬라이드 설정
    let autoSlideInterval;

    function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, 2000);
    }

    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    // 마우스 오버 시 자동 슬라이드 일시 중지
    const carouselContainer = document.querySelector(".carousel-container");
    carouselContainer.addEventListener("mouseenter", stopAutoSlide);
    carouselContainer.addEventListener("mouseleave", startAutoSlide);

    // 초기 애니메이션 설정
    gsap.set(items, { opacity: 0 });
    gsap.set(items[0], { opacity: 1 });

    // 스크롤 트리거 설정
    ScrollTrigger.create({
      trigger: ".process-carousel",
      start: "top 75%",
      onEnter: () => {
        gsap.to(items[0], { opacity: 1, duration: 0.5 });
        goToSlide(0);
        startAutoSlide();
      },
    });

    // 터치 스와이프 지원
    let startX, moveX;
    let isDragging = false;

    carouselContainer.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoSlide();
      },
      { passive: true }
    );

    carouselContainer.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;
        moveX = e.touches[0].clientX;
      },
      { passive: true }
    );

    carouselContainer.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;

      if (startX - moveX > 50) {
        nextSlide();
      } else if (moveX - startX > 50) {
        prevSlide();
      }

      startAutoSlide();
    });
  }

  // 페이지 로드 완료 후 실행
  window.addEventListener("load", function () {
    // 스크롤 애니메이션 초기화
    initScrollAnimations();

    // 프로세스 아이콘 애니메이션 초기화
    initProcessIconAnimations();

    // 프로세스 캐러셀 초기화
    initProcessCarousel();
  });
});

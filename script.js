// === HEADER/FOOTER LOGIC ===
function attachToggleMenu() {
  const toggleBtn = document.querySelector(".menu-toggle");
  const menu = document.getElementById("nav-menu");

  if (toggleBtn && menu) {
    toggleBtn.addEventListener("click", () => {
      menu.classList.toggle("show");
    });
  }
}

function highlightCurrentNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  console.log("Current page:", currentPage); // 👈 Debug

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    console.log("Checking:", link.dataset.page); // 👈 Debug
    if (link.dataset.page === currentPage) {
      console.log("Matched:", link.href); // 👈 Debug
      link.classList.add("active");
    }
  });
}

// Highlight current page in nav menu
function highlightCurrentNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  console.log("Current page:", currentPage); // ✅ will show in console

  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    console.log("Checking:", link.dataset.page);
    if (link.dataset.page === currentPage) {
      console.log("Matched:", link.href);
      link.classList.add("active");
    }
  });
}


fetch("header.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("header").innerHTML = data;

    // Wait a moment for DOM to update, then run functions
    setTimeout(() => {
      attachToggleMenu();
      highlightCurrentNav();
    }, 0);
  });

// Load footer
fetch("footer.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });


// === SLIDESHOW LOGIC ===
const slideIndices = {};

function changeSlide(buildingId, n) {
  const slides = document.querySelectorAll(`.slide-${buildingId}`);
  if (!slides.length) return;

  if (slideIndices[buildingId] === undefined) slideIndices[buildingId] = 0;

  slideIndices[buildingId] = (slideIndices[buildingId] + n + slides.length) % slides.length;

  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === slideIndices[buildingId]);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const allSlides = document.querySelectorAll('img[class*="slide-"]');
  const buildingGroups = {};

  allSlides.forEach(slide => {
    const match = slide.className.match(/slide-(\d+)/);
    if (match) {
      const buildingId = match[1];
      if (!buildingGroups[buildingId]) buildingGroups[buildingId] = [];
      buildingGroups[buildingId].push(slide);
    }
  });

  for (const id in buildingGroups) {
    slideIndices[id] = 0;
    buildingGroups[id].forEach((slide, i) => {
      slide.classList.toggle("active", i === 0);
    });
  }
});

// === SWIPE + DRAG SUPPORT ===
document.querySelectorAll('.slideshow-container').forEach(container => {
  let startX = 0;
  let isDragging = false;

  // Touch start
  container.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });

  container.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    handleSwipe(container, startX, endX);
  });

  // Mouse start
  container.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX;
  });

  container.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.clientX;
    handleSwipe(container, startX, endX);
  });

  container.addEventListener('mouseleave', () => {
    isDragging = false;
  });
});

function handleSwipe(container, startX, endX) {
  const deltaX = endX - startX;
  if (Math.abs(deltaX) > 50) {
    const idMatch = container.id.match(/slideshow-(\d+)/);
    if (!idMatch) return;
    const buildingId = idMatch[1];

    if (deltaX < 0) {
      changeSlide(buildingId, 1); // Next
    } else {
      changeSlide(buildingId, -1); // Previous
    }
  }
}

// Prevent image dragging in slideshows
document.querySelectorAll('.slide').forEach(slide => {
  slide.setAttribute('draggable', 'false');
});

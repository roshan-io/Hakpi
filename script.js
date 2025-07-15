
 // script for menu


	  const menuIcon = document.getElementById("menuIcon");
    const menu = document.getElementById("menuPanel");
    const overlay = document.getElementById("overlay");
    const content = document.getElementById("content");

    menuIcon.addEventListener("click", () => {
      const isOpen = menu.classList.contains("open");
      if (isOpen) {
        closeMenu();
      } else {
        menu.classList.add("open");
        overlay.classList.add("show");
        content.classList.add("blurred");
        menuIcon.classList.add("open");
      }
    });

    function closeMenu() {
      menu.classList.remove("open");
      overlay.classList.remove("show");
      content.classList.remove("blurred");
      menuIcon.classList.remove("open");
    }



// script for bg


// script for panels 


    const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    } else {
      entry.target.classList.remove('show');
    }
  });
}, {
  threshold: 0.3
});

document.querySelectorAll('.panel').forEach(panel => {
  observer.observe(panel);
});


// auto-reload



  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'style.css?v=' + new Date().getTime();
  document.head.appendChild(css);






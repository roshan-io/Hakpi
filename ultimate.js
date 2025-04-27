document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('container');
  let draggedRow = null;
  let initialTouch = null;
  let isTouch = false;
  let draggingStarted = false;  // Flag to detect if dragging should start
  let isScrolling = false;  // Flag to check if we're trying to scroll
  let scrollTimeout = null;  // Used to debounce the scrolling effect
  let dragStartPosition = null;  // To track the initial position when dragging starts

  // Function to handle dragging start (mouse or touch)
  function onDragStart(e) {
    e.preventDefault(); // Prevent default behavior for both touch and mouse

    if (e.target.classList.contains('panel-row') && !draggingStarted) {
      draggedRow = e.target;
      draggedRow.style.opacity = '0.5';
      draggingStarted = true;
      dragStartPosition = e.clientY || (isTouch && e.touches[0].clientY); // Track initial position

      // For touch devices, track touch start position
      if (e.type === "touchstart") {
        isTouch = true;
        initialTouch = e.touches[0];
      }

      // Prevent drag from starting immediately (delay)
      setTimeout(() => {
        if (draggingStarted) {
          draggedRow.style.position = 'absolute';
        }
      }, 200); // Add a delay of 200ms before dragging starts
    }
  }

  // Function to handle drag move (mouse or touch)
  function onMove(e) {
    e.preventDefault(); // Prevent default behavior for both touch and mouse

    if (draggedRow && draggingStarted) {
      const position = e.clientY || (isTouch && e.touches[0].clientY);
      draggedRow.style.top = position - draggedRow.offsetHeight / 2 + 'px';

      // Custom scroll logic when dragging near the top or bottom of the page
      if (!isScrolling) {
        const scrollThreshold = 30; // Distance from the top/bottom to start scrolling

        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY;

        // Scroll down when the dragged row reaches the bottom of the window
        if (position + draggedRow.offsetHeight > windowHeight - scrollThreshold) {
          isScrolling = true;
          scrollPage('down');
        }
        // Scroll up when the dragged row reaches the top of the window
        else if (position < scrollThreshold) {
          isScrolling = true;
          scrollPage('up');
        }
        else {
          isScrolling = false; // Stop scrolling when the row is not near the top or bottom
        }
      }
    } else if (!draggingStarted && !isScrolling) {
      // If not dragging and not scrolling, allow normal page scroll
      const scrollPosition = e.clientY || (isTouch && e.touches[0].clientY);
      if (Math.abs(scrollPosition - dragStartPosition) < 5) {
        // If drag movement is very small (like a scroll), allow scrolling
        isScrolling = true;
        scrollPage('down');
      }
    }
  }

  // Function for smooth scrolling
  function scrollPage(direction) {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      window.scrollBy(0, direction === 'down' ? 10 : -10); // Scroll slowly
    }, 50); // Add a short delay to ensure smooth scroll
  }

  // Function to handle drop (reordering)
  function onDrop(e) {
    if (draggedRow) {
      const hoveredRow = e.target.closest('.panel-row');
      if (hoveredRow && hoveredRow !== draggedRow) {
        container.insertBefore(draggedRow, hoveredRow); // Reorder row
      }
      draggedRow.style.position = '';
      draggedRow.style.top = '';
      draggedRow.style.opacity = '1';
      draggingStarted = false; // Reset dragging state
      draggedRow = null;
    }
  }

  // Add mouse events for drag and drop functionality
  container.addEventListener('dragstart', onDragStart);
  container.addEventListener('dragend', function () {
    if (draggedRow) {
      draggedRow.style.opacity = '1';
    }
    draggingStarted = false;
    draggedRow = null;
  });

  // Mouse-specific move and drop
  container.addEventListener('dragover', onMove);
  container.addEventListener('drop', onDrop);

  // Add touch events for drag and drop functionality
  container.addEventListener('touchstart', onDragStart, { passive: false });
  container.addEventListener('touchmove', onMove, { passive: false });
  container.addEventListener('touchend', function (e) {
    if (draggedRow) {
      draggedRow.style.opacity = '1';
      draggedRow.style.position = '';
      draggedRow.style.top = '';
      draggingStarted = false;
      draggedRow = null;
    }
  });

  // Prevent default behavior of dragover event on the container to allow dropping
  container.addEventListener('dragover', function (e) {
    e.preventDefault();
  });

  // Prevent default behavior for touch move
  container.addEventListener('touchmove', function (e) {
    e.preventDefault();
  });

  // Handle click for showing the delete button
  const rows = document.querySelectorAll('.panel-row');
  rows.forEach(row => {
    row.setAttribute('draggable', 'true');
    
    // Handle click for showing the delete button
    row.addEventListener('click', function () {
      document.querySelectorAll('.delete-btn').forEach(btn => btn.remove());
      const bin = document.createElement('button');
      bin.classList.add('delete-btn');
      bin.innerHTML = '🗑️';
      bin.onclick = function(event) {
        event.stopPropagation(); // Prevent triggering row's click event
        row.remove(); // Remove row
      };
      row.appendChild(bin);
    });

    // Handle double-click to edit text
    const textPanel = row.querySelector('.text-panel');
    if (textPanel) {
      textPanel.addEventListener('dblclick', function (e) {
        e.stopPropagation(); // Prevent row click event
        const originalText = textPanel.innerText;
        textPanel.setAttribute('contenteditable', 'true');
        textPanel.focus();

        textPanel.addEventListener('blur', function handler() {
          textPanel.removeAttribute('contenteditable');
          textPanel.removeEventListener('blur', handler);
        });
      });
    }

    // Handle double-click to upload a new image
    const imagePanel = row.querySelector('.image-panel img');
    if (imagePanel) {
      imagePanel.addEventListener('dblclick', function (e) {
        e.stopPropagation();
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        fileInput.click();

        fileInput.onchange = function() {
          const file = fileInput.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
              imagePanel.src = e.target.result; // Update image source
            };
            reader.readAsDataURL(file);
          }
          document.body.removeChild(fileInput);
        };
      });
    }
  });
});
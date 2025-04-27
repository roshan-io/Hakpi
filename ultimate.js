
document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('container');
  let draggedRow = null;

  container.addEventListener('dragstart', function (e) {
    if (e.target.classList.contains('panel-row')) {
      draggedRow = e.target;
      e.dataTransfer.effectAllowed = 'move';

      // Reduce opacity of the dragged row
      draggedRow.style.opacity = '0.5';
    }
  });

  container.addEventListener('dragover', function (e) {
    e.preventDefault(); // Prevent default scrolling behavior
    const target = e.target.closest('.panel-row');
    if (target && target !== draggedRow) {
      const rect = target.getBoundingClientRect();
      const next = (e.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
      container.insertBefore(draggedRow, next ? target.nextSibling : target);
    }
  });

  container.addEventListener('dragend', function () {
    // Reset opacity after drag is completed
    if (draggedRow) {
      draggedRow.style.opacity = '1';
    }
    draggedRow = null;
  });

  // Add drag attribute to rows
  const rows = document.querySelectorAll('.panel-row');
  rows.forEach(row => {
    row.setAttribute('draggable', 'true');

    // Click to show bin button
    row.addEventListener('click', function (e) {
      // Remove existing bin buttons
      document.querySelectorAll('.delete-btn').forEach(btn => btn.remove());

      // Create new bin button
      const bin = document.createElement('button');
      bin.classList.add('delete-btn');
      bin.innerHTML = '🗑️';
      bin.onclick = function(event) {
        event.stopPropagation(); // Prevent triggering the row's click event
        row.remove(); // Remove the row
      };
      row.appendChild(bin);
    });

    // Double-click to edit text in text panel
    const textPanel = row.querySelector('.text-panel');
    if (textPanel) {
      textPanel.addEventListener('dblclick', function (e) {
        e.stopPropagation(); // Prevent row click event
        const originalText = textPanel.innerText;
        textPanel.setAttribute('contenteditable', 'true');
        textPanel.focus();

        // Optional: When done editing (on blur), disable contenteditable
        textPanel.addEventListener('blur', function handler() {
          textPanel.removeAttribute('contenteditable');
          textPanel.removeEventListener('blur', handler);
        });
      });
    }

    // Double-click to upload a new image in image panel
    const imagePanel = row.querySelector('.image-panel img');
    if (imagePanel) {
      imagePanel.addEventListener('dblclick', function (e) {
        e.stopPropagation(); // Prevent row click event
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

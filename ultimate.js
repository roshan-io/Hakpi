document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('container');

  container.addEventListener('click', function (e) {
    const row = e.target.closest('.panel-row');
    if (row) {
      // Remove existing delete buttons and number boxes
      document.querySelectorAll('.delete-btn, .row-number').forEach(el => el.remove());

      // Create delete (bin) button
      const bin = document.createElement('button');
      bin.classList.add('delete-btn');
      bin.innerHTML = '🗑️';
      bin.style.position = 'absolute';
      bin.style.top = '10px';
      bin.style.right = '10px';
      bin.style.zIndex = '10';
      bin.style.cursor = 'pointer';
      bin.style.background = 'transparent';
      bin.style.border = 'none';
      bin.style.fontSize = '18px';

      bin.onclick = function (event) {
        event.stopPropagation();
        row.remove();
      };
      row.appendChild(bin);

      // Create number input box
      const rowNumberInput = document.createElement('input');
      rowNumberInput.classList.add('row-number');
      rowNumberInput.type = 'text'; // allow easier editing
      rowNumberInput.readOnly = true; // make read-only by default
      const currentIndex = Array.from(container.children).indexOf(row) + 1; // +1 to start from 1
      rowNumberInput.value = currentIndex;

      // Style for small dark blurred input
      Object.assign(rowNumberInput.style, {
        position: 'absolute',
        top: '40px',
        right: '10px',
        width: '30px',
        height: '25px',
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '5px',
        color: 'white',
        textAlign: 'center',
        fontSize: '12px',
        zIndex: '10',
        outline: 'none',
      });

      // Allow double-click to edit
      let clickCount = 0;
      rowNumberInput.addEventListener('click', function (e) {
        clickCount++;
        setTimeout(() => {
          if (clickCount === 2) {
            rowNumberInput.readOnly = false;
            rowNumberInput.focus();
            rowNumberInput.select();
          }
          clickCount = 0;
        }, 250);
      });

      // On blur, reorder properly
      rowNumberInput.addEventListener('blur', function () {
        if (!rowNumberInput.readOnly) {
          rowNumberInput.readOnly = true; // lock again after editing

          let newIndex = parseInt(rowNumberInput.value, 10) - 1; // -1 because position in array starts from 0
          const rows = Array.from(container.querySelectorAll('.panel-row')).filter(r => r !== row); // Exclude current

          if (isNaN(newIndex) || newIndex < 0) newIndex = 0;
          if (newIndex >= rows.length) newIndex = rows.length;

          if (newIndex === rows.length) {
            container.appendChild(row);
          } else {
            container.insertBefore(row, rows[newIndex]);
          }

          // After moving, update all visible numbers
          updateRowNumbers();
        }
      });

      row.appendChild(rowNumberInput);
      row.style.position = 'relative';
    }
  });

  function updateRowNumbers() {
    const rows = Array.from(container.querySelectorAll('.panel-row'));
    rows.forEach((row, index) => {
      const input = row.querySelector('.row-number');
      if (input) {
        input.value = index + 1;
      }
    });
  }

  // Double-click to edit text
  container.addEventListener('dblclick', function (e) {
    const textPanel = e.target.closest('.text-panel');
    if (textPanel) {
      e.stopPropagation();
      textPanel.setAttribute('contenteditable', 'true');
      textPanel.focus();
      textPanel.addEventListener('blur', function handler() {
        textPanel.removeAttribute('contenteditable');
        textPanel.removeEventListener('blur', handler);
      });
    }
  });

  // Double-click to upload image
  container.addEventListener('dblclick', function (e) {
    const img = e.target.closest('.image-panel img');
    if (img) {
      e.stopPropagation();
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
      fileInput.click();

      fileInput.onchange = function () {
        const file = fileInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
        document.body.removeChild(fileInput);
      };
    }
  });
});
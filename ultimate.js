document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('container');

  // Single click to show bin and row number box
  container.addEventListener('click', function (e) {
    const row = e.target.closest('.panel-row');
    if (row) {
      // Remove existing delete buttons and row number inputs
      document.querySelectorAll('.delete-btn, .row-number').forEach(el => el.remove());

      // Create bin button
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

      bin.onclick = function(event) {
        event.stopPropagation();
        row.remove();
      };
      row.appendChild(bin);

      // Create small dark blurred row number input
      const rowNumberInput = document.createElement('input');
      rowNumberInput.classList.add('row-number');
      rowNumberInput.type = 'number';
      rowNumberInput.min = '1';
      rowNumberInput.value = Array.from(container.children).indexOf(row) + 1;

      // style it to look nice
      rowNumberInput.style.position = 'absolute';
      rowNumberInput.style.top = '40px';
      rowNumberInput.style.right = '10px';
      rowNumberInput.style.width = '30px';
      rowNumberInput.style.height = '25px';
      rowNumberInput.style.background = 'rgba(0, 0, 0, 0.5)';
      rowNumberInput.style.backdropFilter = 'blur(4px)';
      rowNumberInput.style.border = '1px solid rgba(255, 255, 255, 0.2)';
      rowNumberInput.style.borderRadius = '5px';
      rowNumberInput.style.color = 'white';
      rowNumberInput.style.textAlign = 'center';
      rowNumberInput.style.fontSize = '12px';
      rowNumberInput.style.zIndex = '10';

      rowNumberInput.onblur = function() {
        let newIndex = parseInt(rowNumberInput.value, 10) - 1;
        if (isNaN(newIndex)) return;

        const rows = Array.from(container.querySelectorAll('.panel-row'));
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= rows.length) newIndex = rows.length - 1;

        container.insertBefore(row, rows[newIndex]);
      };

      row.appendChild(rowNumberInput);
      row.style.position = 'relative'; // necessary to properly place bin and number box
    }
  });

  // Double click to edit text
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

  // Double click to upload image
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
document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('container');

  // Click to show bin button and row number input
  container.addEventListener('click', function (e) {
    const row = e.target.closest('.panel-row');
    
    if (row) {
      // Remove existing bin buttons and row number inputs
      document.querySelectorAll('.delete-btn, .row-number').forEach(btn => btn.remove());

      // Create new bin button
      const bin = document.createElement('button');
      bin.classList.add('delete-btn');
      bin.innerHTML = '🗑️';
      bin.onclick = function(event) {
        event.stopPropagation(); // Prevent triggering the row's click event
        row.remove(); // Remove the row
      };
      row.appendChild(bin);

      // Create row number input with same size as delete button
      const rowNumberInput = document.createElement('input');
      rowNumberInput.classList.add('row-number');
      rowNumberInput.type = 'number';
      rowNumberInput.placeholder = 'Row No.';
      rowNumberInput.value = Array.from(container.children).indexOf(row) + 1; // Set the current row number
      rowNumberInput.style.width = '30px'; // Adjust width to be the same as the bin button
      rowNumberInput.style.marginTop = '5px'; // Position the input below the bin icon

      rowNumberInput.onblur = function() {
        const newRowNumber = parseInt(rowNumberInput.value, 10);
        if (!isNaN(newRowNumber) && newRowNumber >= 1 && newRowNumber <= container.children.length) {
          reorderRows(newRowNumber - 1); // Reorder rows based on the entered number
        }
      };

      row.appendChild(rowNumberInput);
    }
  });

  // Reorder rows based on the row number entered
  function reorderRows(newRowIndex) {
    const rows = Array.from(container.children);
    const rowToMove = rows.find(row => row.querySelector('.row-number').value == newRowIndex + 1);
    if (rowToMove) {
      // Find the position to insert the row into
      const targetIndex = newRowIndex;
      const targetRow = rows[targetIndex];
      
      // Insert the row before the target row (or at the end if targetIndex is out of bounds)
      if (targetRow) {
        container.insertBefore(rowToMove, targetRow);
      } else {
        container.appendChild(rowToMove); // If no target row exists, append to the end
      }
    }
  }

  // Double-click to edit text in text panel
  container.addEventListener('dblclick', function (e) {
    const textPanel = e.target.closest('.text-panel');
    if (textPanel) {
      const originalText = textPanel.innerText;
      textPanel.setAttribute('contenteditable', 'true');
      textPanel.focus();

      // Optional: When done editing (on blur), disable contenteditable
      textPanel.addEventListener('blur', function handler() {
        textPanel.removeAttribute('contenteditable');
        textPanel.removeEventListener('blur', handler);
      });
    }
  });

  // Double-click to upload a new image in image panel
  container.addEventListener('dblclick', function (e) {
    const imagePanel = e.target.closest('.image-panel img');
    if (imagePanel) {
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
    }
  });
});
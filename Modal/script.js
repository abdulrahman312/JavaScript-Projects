'use strict';

const modal = document.querySelector('.modal');
const overLay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.show-modal');

// Add event listerner on buttons to open the modal
for (let btn of btnsOpenModal) {
    btn.addEventListener('click', toggleHiddenClass);
}

// Add event listerner on the close button
btnCloseModal.addEventListener('click', toggleHiddenClass);

// Add event listener on overlay to close modal
overLay.addEventListener('click', toggleHiddenClass);

// Add keydown event to close modal when esc key is pressed
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        if (!(modal.classList.contains('hidden'))) {
            toggleHiddenClass();
        }
    }
})

// Function to toggle between the hidden classes
function toggleHiddenClass() {
    modal.classList.toggle("hidden");
    overLay.classList.toggle("hidden");
}


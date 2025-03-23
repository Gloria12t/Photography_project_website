// Photography Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // ===== Header Auto-Hide on Scroll =====
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    const scrollThreshold = 100; // Adjust this value as needed
    
    window.addEventListener('scroll', function() {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Check if we've scrolled past the threshold
        if (currentScroll > scrollThreshold) {
            // Scrolling down
            if (currentScroll > lastScrollTop) {
                header.classList.add('header-hidden');
            } 
            // Scrolling up
            else {
                header.classList.remove('header-hidden');
            }
        } else {
            // At the top of the page
            header.classList.remove('header-hidden');
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
    });
    
    // ===== Smooth Scrolling for Navigation =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== Initialize Lightbox =====
    // ===== Initialize Lightbox =====
if (typeof lightbox !== 'undefined') {
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true,
        'fadeDuration': 300,
        'imageFadeDuration': 300
    });
}
    // ===== Gallery Functionality: Filtering, Loading, and Like Buttons =====
    // Initialize variables
    const filterButtons = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('load-more');
    const galleryGrid = document.querySelector('.gallery-grid');
    const photoItems = document.querySelectorAll('.photo-item');
    
    // Set initial visible photos (first 6)
    let visiblePhotos = 18;
    
    // Add event listeners to filter buttons
    if (filterButtons.length > 0) {
        // Initialize gallery display
        updateGalleryDisplay();
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Reset visible photos count when changing filters
                visiblePhotos = 6;
                
                // Filter photos
                filterPhotos(filterValue);
                
                // Check if we need to show the Load More button
                checkLoadMoreButton(filterValue);
            });
        });
    }
    
    // Load More button functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            if (filterButtons.length > 0) {
                // For filtered gallery
                // Get current active filter
                const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                
                // Show 6 more photos
                visiblePhotos += 6;
                
                // Update display
                updateGalleryDisplay();
                
                // Check if we need to hide the Load More button
                checkLoadMoreButton(activeFilter);
            } else {
                // Original load more functionality (for non-filtered gallery)
                const photoContainer = document.querySelector('.gallery-section');
                const firstRow = document.querySelector('.gallery-section .row');
                
                if (firstRow) {
                    // Clone the first row of photos
                    const newRow = firstRow.cloneNode(true);
                    
                    // Insert before the load more button container
                    loadMoreBtn.parentElement.before(newRow);
                    
                    // Update lightbox so it works with new elements
                    lightbox.reload();
                    
                    // Initialize like buttons for new photos
                    const newButtons = newRow.querySelectorAll('.photo-like-btn');
                    const existingButtons = document.querySelectorAll('.photo-like-btn');
                    
                    newButtons.forEach((button, i) => {
                        const newIndex = existingButtons.length - newButtons.length + i;
                        const count = button.querySelector('span');
                        
                        // Reset the like count for new photos
                        count.textContent = "0";
                        button.classList.remove('liked');
                        
                        // Clone and replace to remove existing event listeners
                        const freshButton = button.cloneNode(true);
                        button.parentNode.replaceChild(freshButton, button);
                        
                        freshButton.addEventListener('click', function(e) {
                            e.stopPropagation();
                            e.preventDefault();
                            
                            let newPhotoLikes = localStorage.getItem(`photo-${newIndex}`) ? 
                                              parseInt(localStorage.getItem(`photo-${newIndex}`)) : 0;
                            
                            if(freshButton.classList.contains('liked')) {
                                freshButton.classList.remove('liked');
                                newPhotoLikes--;
                                localStorage.setItem(`photo-${newIndex}-liked`, 'false');
                            } else {
                                freshButton.classList.add('liked');
                                newPhotoLikes++;
                                localStorage.setItem(`photo-${newIndex}-liked`, 'true');
                            }
                            
                            freshButton.querySelector('span').textContent = newPhotoLikes;
                            localStorage.setItem(`photo-${newIndex}`, newPhotoLikes);
                        });
                    });
                    
                    // Hide load more button after a certain number of rows
                    const totalRows = document.querySelectorAll('.gallery-section .row').length;
                    if(totalRows >= 4) {
                        loadMoreBtn.style.display = 'none';
                    }
                }
            }
        });
    }
    
    // Initialize like buttons
    initializeLikeButtons();
    
    // Function to filter photos
    function filterPhotos(filter) {
        photoItems.forEach(item => {
            if (filter === 'all' || item.classList.contains(filter)) {
                item.style.display = '';  // Show item
            } else {
                item.style.display = 'none';  // Hide item
            }
        });
        
        // Update which photos to show based on visibility count
        updateGalleryDisplay();
    }
    
    // Function to update gallery display
    function updateGalleryDisplay() {
        if (filterButtons.length === 0) return; // Skip if no filter buttons
        
        let visibleCount = 0;
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        
        photoItems.forEach(item => {
            // First check if it passes the current filter
            const passesFilter = activeFilter === 'all' || item.classList.contains(activeFilter);
            
            if (passesFilter) {
                visibleCount++;
                
                // Show only up to the visible photos limit
                if (visibleCount <= visiblePhotos) {
                    item.style.display = '';
                    
                    // Add animation class if this is a newly revealed photo
                    if (visibleCount > visiblePhotos - 6) {
                        item.classList.add('new');
                        // Remove animation class after animation completes
                        setTimeout(() => {
                            item.classList.remove('new');
                        }, 500);
                    }
                } else {
                    item.style.display = 'none';
                }
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Function to check if Load More button should be shown
    function checkLoadMoreButton(filter) {
        if (!loadMoreBtn) return;
        
        let filteredTotal = 0;
        
        // Count total number of photos that match the filter
        photoItems.forEach(item => {
            if (filter === 'all' || item.classList.contains(filter)) {
                filteredTotal++;
            }
        });
        
        // Show/hide Load More button based on count
        if (visiblePhotos >= filteredTotal) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }
    
    // ===== Contact Form Handling =====
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Hide any existing messages
            formSuccess.style.display = 'none';
            formError.style.display = 'none';
            
            // Simple form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if(name && email && subject && message) {
                // Show success message (in real app, you'd send data to server here)
                formSuccess.style.display = 'flex';
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                }, 5000);
            } else {
                // Show error message
                formError.style.display = 'flex';
            }
        });
    }
    
    // ===== Back to Top Button =====
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if(window.pageYOffset > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Function to initialize like buttons
    function initializeLikeButtons() {
        const likeButtons = document.querySelectorAll('.photo-like-btn');
        
        likeButtons.forEach((button, index) => {
            const count = button.querySelector('span');
            let photoLikes = localStorage.getItem(`photo-${index}`) ? 
                              parseInt(localStorage.getItem(`photo-${index}`)) : 0;
            
            // Set initial count
            count.textContent = photoLikes;
            
            // Check if previously liked
            if (localStorage.getItem(`photo-${index}-liked`) === 'true') {
                button.classList.add('liked');
            }
            
            // Remove existing event listeners by cloning and replacing the button
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add event listener
            newButton.addEventListener('click', function(e) {
                console.log('Button clicked, index:', index);
                console.log('Current like status:', newButton.classList.contains('liked'));
                e.preventDefault();
                e.stopPropagation();
                
                if (newButton.classList.contains('liked')) {
                    newButton.classList.remove('liked');
                    photoLikes--;
                    localStorage.setItem(`photo-${index}-liked`, 'false');
                } else {
                    newButton.classList.add('liked');
                    photoLikes++;
                    localStorage.setItem(`photo-${index}-liked`, 'true');
                }
                
                newButton.querySelector('span').textContent = photoLikes;
                localStorage.setItem(`photo-${index}`, photoLikes);
            
            
           
            });
        });
    }
  });
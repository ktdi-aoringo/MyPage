// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for animation
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.research-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
});

// Add typing effect to hero title
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const nameText = '北代 絢大';
        const subtitleText = 'Ayato Kitadai';
        
        // Clear the content first and create structure
        heroTitle.innerHTML = '';
        heroTitle.style.opacity = '1';
        
        // Create name element
        const nameElement = document.createElement('span');
        heroTitle.appendChild(nameElement);
        
        // Create line break
        const lineBreak = document.createElement('br');
        heroTitle.appendChild(lineBreak);
        
        // Create subtitle element
        const subtitleElement = document.createElement('span');
        subtitleElement.className = 'hero-subtitle';
        heroTitle.appendChild(subtitleElement);
        
        let nameIndex = 0;
        let subtitleIndex = 0;
        
        const typeWriter = () => {
            if (nameIndex < nameText.length) {
                nameElement.textContent += nameText.charAt(nameIndex);
                nameIndex++;
                setTimeout(typeWriter, 50);
            } else if (subtitleIndex < subtitleText.length) {
                if (subtitleIndex === 0) {
                    // Small delay before starting subtitle
                    setTimeout(() => {
                        subtitleElement.textContent += subtitleText.charAt(subtitleIndex);
                        subtitleIndex++;
                        setTimeout(typeWriter, 50);
                    }, 200);
                } else {
                    subtitleElement.textContent += subtitleText.charAt(subtitleIndex);
                    subtitleIndex++;
                    setTimeout(typeWriter, 50);
                }
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add hover effects to navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Mobile menu toggle (for future enhancement)
const createMobileMenu = () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    // This is a placeholder for mobile menu functionality
    // Can be enhanced later as needed
};

// Initialize mobile menu
document.addEventListener('DOMContentLoaded', createMobileMenu);

// CV Publication Sorting and Filtering
document.addEventListener('DOMContentLoaded', () => {
    // Only run on CV page
    if (!document.getElementById('sort-by')) return;
    
    const sortSelect = document.getElementById('sort-by');
    const filterSelect = document.getElementById('filter-category');
    const coauthorsSelect = document.getElementById('filter-coauthors');
    const firstAuthorCheckbox = document.getElementById('filter-first-author');
    const resetButton = document.getElementById('reset-sort');
    
    // Store original order
    const originalOrder = new Map();
    
    // Initialize original order and extract coauthors
    const allCoauthors = new Map();
    
    document.querySelectorAll('.cv-publication-list').forEach(list => {
        const items = Array.from(list.children);
        originalOrder.set(list, items.map(item => item.cloneNode(true)));
        
        // Extract coauthors from each publication
        items.forEach(item => {
            const authors = extractAllAuthors(item.innerHTML);
            authors.forEach(author => {
                if (author !== 'A. Kitadai') { // Exclude self
                    allCoauthors.set(author, (allCoauthors.get(author) || 0) + 1);
                }
            });
        });
    });
    
    // Filter coauthors who appear in 2+ publications
    const frequentCoauthors = Array.from(allCoauthors.entries())
        .filter(([author, count]) => count >= 2)
        .map(([author, count]) => author)
        .sort();
    
    // Populate coauthors select
    populateCoauthorsSelect(frequentCoauthors);
    
    // Extract year from publication text
    function extractYear(text) {
        // Look for 4-digit years, prioritizing those at the end or followed by period/comma
        const yearMatches = text.match(/\b(\d{4})\b/g);
        if (!yearMatches) return 0;
        
        // Convert to numbers and find the most recent year
        const years = yearMatches.map(Number).filter(year => year >= 1900 && year <= 2030);
        return years.length > 0 ? Math.max(...years) : 0;
    }
    
    // Extract author from publication text
    function extractAuthor(text) {
        const authorMatch = text.match(/^([^;]+)/);
        return authorMatch ? authorMatch[1].trim() : '';
    }
    
    // Extract all authors from publication HTML
    function extractAllAuthors(html) {
        // Remove any leading numbering like "[P1] " or similar
        const cleanHtml = html.replace(/^\[[^\]]+\]\s*/, '');
        // Extract the author section (everything before the first semicolon or quote)
        const authorMatch = cleanHtml.match(/^([^;"]+)/);
        if (!authorMatch) return [];
        
        const authorSection = authorMatch[1];
        // Remove HTML tags and split by common separators
        const plainText = authorSection.replace(/<[^>]*>/g, '');
        const authors = plainText.split(/,|\sand\s/)
            .map(author => author.trim())
            .filter(author => author.length > 0 && !author.match(/^\d+$/));
        
        return authors;
    }
    
    // Populate coauthors select dropdown
    function populateCoauthorsSelect(authors) {
        coauthorsSelect.innerHTML = '';
        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = author;
            option.textContent = author;
            coauthorsSelect.appendChild(option);
        });
    }
    
    // Check if A.Kitadai is first author
    function isFirstAuthor(html) {
        // Remove any leading numbering like "[P1] " or similar
        const cleanHtml = html.replace(/^\[[^\]]+\]\s*/, '');
        // Check if text starts with A. Kitadai (with or without strong tags)
        // Look for <strong>A. Kitadai</strong> or just A. Kitadai at the beginning
        return /^(<strong>)?\s*A\.\s*Kitadai(<\/strong>)?[\s,;]/.test(cleanHtml) || 
               /^<strong>A\.\s*Kitadai<\/strong>[\s,;]/.test(cleanHtml);
    }
    
    // Sort publications
    function sortPublications(sortBy) {
        document.querySelectorAll('.cv-publication-list').forEach(list => {
            const items = Array.from(list.children);
            
            let sortedItems;
            switch(sortBy) {
                case 'year-desc':
                    sortedItems = items.sort((a, b) => {
                        const yearA = extractYear(a.textContent);
                        const yearB = extractYear(b.textContent);
                        return yearB - yearA;
                    });
                    break;
                    
                case 'year-asc':
                    sortedItems = items.sort((a, b) => {
                        const yearA = extractYear(a.textContent);
                        const yearB = extractYear(b.textContent);
                        return yearA - yearB;
                    });
                    break;
                    
                case 'author':
                    sortedItems = items.sort((a, b) => {
                        const authorA = extractAuthor(a.textContent);
                        const authorB = extractAuthor(b.textContent);
                        return authorA.localeCompare(authorB);
                    });
                    break;
                    
                default:
                    // Use original order
                    const originalItems = originalOrder.get(list);
                    if (originalItems) {
                        sortedItems = originalItems.map(item => item.cloneNode(true));
                    } else {
                        sortedItems = items;
                    }
                    break;
            }
            
            // Clear and re-append sorted items
            list.innerHTML = '';
            sortedItems.forEach(item => {
                list.appendChild(item);
            });
            
            // Add sorted class for styling
            if (sortBy !== 'default') {
                list.classList.add('sorted');
            } else {
                list.classList.remove('sorted');
            }
        });
    }
    
    // Filter publications by category
    function filterPublications(category) {
        document.querySelectorAll('.cv-subsection').forEach(section => {
            const list = section.querySelector('.cv-publication-list');
            if (!list) return;
            
            if (category === 'all') {
                section.classList.remove('hidden');
            } else {
                const hasCategory = list.classList.contains(category);
                section.classList.toggle('hidden', !hasCategory);
            }
        });
    }
    
    // Filter publications by coauthors
    function filterByCoauthors(selectedAuthors) {
        if (selectedAuthors.length === 0) {
            // Show all if no authors selected
            document.querySelectorAll('.cv-publication-list li').forEach(item => {
                item.classList.remove('hidden-by-coauthor');
            });
            return;
        }
        
        document.querySelectorAll('.cv-publication-list').forEach(list => {
            const items = Array.from(list.children);
            
            items.forEach(item => {
                const authors = extractAllAuthors(item.innerHTML);
                const hasSelectedAuthor = selectedAuthors.some(selectedAuthor => 
                    authors.some(author => author.includes(selectedAuthor))
                );
                
                if (hasSelectedAuthor) {
                    item.classList.remove('hidden-by-coauthor');
                } else {
                    item.classList.add('hidden-by-coauthor');
                }
            });
        });
    }
    
    // Filter publications by first author
    function filterByFirstAuthor(showFirstAuthorOnly) {
        document.querySelectorAll('.cv-publication-list').forEach(list => {
            const items = Array.from(list.children);
            
            items.forEach(item => {
                if (showFirstAuthorOnly) {
                    const isFirst = isFirstAuthor(item.innerHTML);
                    if (isFirst) {
                        item.classList.remove('hidden-by-first-author');
                    } else {
                        item.classList.add('hidden-by-first-author');
                    }
                } else {
                    item.classList.remove('hidden-by-first-author');
                }
            });
        });
    }
    
    // Apply all filters
    function applyAllFilters() {
        const categoryFilter = filterSelect.value;
        const selectedCoauthors = Array.from(coauthorsSelect.selectedOptions).map(option => option.value);
        const firstAuthorFilter = firstAuthorCheckbox.checked;
        
        // Apply category filter
        filterPublications(categoryFilter);
        
        // Apply coauthor filter
        filterByCoauthors(selectedCoauthors);
        
        // Apply first author filter
        filterByFirstAuthor(firstAuthorFilter);
        
        // Update display based on all filters
        updateItemVisibility();
    }
    
    // Update item visibility based on all applied filters
    function updateItemVisibility() {
        document.querySelectorAll('.cv-publication-list li').forEach(item => {
            const hiddenByCoauthor = item.classList.contains('hidden-by-coauthor');
            const hiddenByFirstAuthor = item.classList.contains('hidden-by-first-author');
            
            if (hiddenByCoauthor || hiddenByFirstAuthor) {
                item.style.display = 'none';
            } else {
                item.style.display = 'block';
            }
        });
    }
    
    // Reset to original state
    function resetSortFilter() {
        sortSelect.value = 'default';
        filterSelect.value = 'all';
        
        // Clear coauthors selection
        Array.from(coauthorsSelect.options).forEach(option => {
            option.selected = false;
        });
        
        // Uncheck first author checkbox
        firstAuthorCheckbox.checked = false;
        
        sortPublications('default');
        applyAllFilters();
    }
    
    // Event listeners
    sortSelect.addEventListener('change', (e) => {
        sortPublications(e.target.value);
        // Apply filters after sorting
        setTimeout(() => applyAllFilters(), 10);
    });
    
    filterSelect.addEventListener('change', (e) => {
        applyAllFilters();
    });
    
    coauthorsSelect.addEventListener('change', (e) => {
        applyAllFilters();
    });
    
    firstAuthorCheckbox.addEventListener('change', (e) => {
        applyAllFilters();
    });
    
    resetButton.addEventListener('click', resetSortFilter);
});
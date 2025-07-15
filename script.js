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

// Hero title is now static - no typing effect needed

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
    
    // Name mapping for English and Japanese names
    const nameMapping = {
        'M. Fujita': '藤田正典',
        'N. Nishino': '西野成昭',
        'Y. Tsurusaki': '鶴崎祐大',
        'Y. Fukasawa': '深澤祐援',
        'S. Lee': '李相直',
        'Z. Zhou': '周澤宇',
        'M. Kobayashi': '小林美充希',
        'U. Sato': '佐藤詩',
        'K. Akashi': '明石圭佑',
        'S. Sugihara': '杉原秀一',
        'Z. Cheng': '成也',
        'Y. Dai': '戴雨',
        'Y. Takenoya': '竹ノ谷悠',
        'K. Ogawa': '小川健太',
        'T. Nakashima': '中島拓',
        'R. Ishikawa': '石川竜一郎',
        'J. Teng': '滕健勇',
        'K. Nishiyama': '西山浩平',
        'H. Sawazaki': '澤崎遙夏',
        'X. Shang': '尚暁',
        'T. Oyama': '大山拓',
        'R. Wada': '和田亮',
        'R. Miratsu': '美良津亮',
        'T. Nakamura': '中村太一',
        'H. Watanabe': '渡邊光',
        'Y. Nagaai': '永合由美子',
        'T. Natsume': '夏目哲',
        'F. Miyahara': '宮原史明',
        'T. Itoh': '伊藤拓海',
        'H. Takahashi': '高橋裕紀',
        'K. Sumikura': '隅藏康一',
        'N. Mizutani': '水谷尚紀'
    };
    
    // Create reverse mapping (Japanese to English)
    const reverseNameMapping = {};
    Object.keys(nameMapping).forEach(english => {
        reverseNameMapping[nameMapping[english]] = english;
    });
    
    // Function to normalize names (convert to preferred display form)
    function normalizeAuthorName(name) {
        const trimmed = name.trim();
        
        // If it's an English name that has a Japanese equivalent, use Japanese
        if (nameMapping[trimmed]) {
            return nameMapping[trimmed];
        }
        
        // If it's a Japanese name that has an English equivalent, keep Japanese
        if (reverseNameMapping[trimmed]) {
            return trimmed;
        }
        
        // Return original name if no mapping found
        return trimmed;
    }
    
    // Function to check if two names refer to the same person
    function isSamePerson(name1, name2) {
        const norm1 = normalizeAuthorName(name1);
        const norm2 = normalizeAuthorName(name2);
        return norm1 === norm2;
    }
    
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
                if (author !== 'A. Kitadai' && author !== '北代絢大') { // Exclude self
                    const normalizedName = normalizeAuthorName(author);
                    if (normalizedName !== 'A. Kitadai' && normalizedName !== '北代絢大') {
                        allCoauthors.set(normalizedName, (allCoauthors.get(normalizedName) || 0) + 1);
                    }
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
    
    // Check if a string is likely to be a person's name
    function isPersonName(name) {
        // Remove common title/degree patterns
        const cleanName = name.replace(/^(Dr\.?|Prof\.?|Mr\.?|Ms\.?|Mrs\.?)\s+/i, '');
        
        // Exclude patterns that are clearly not names
        const excludePatterns = [
            /^\d+年\d+月$/,           // 2023年3月 format
            /^\d{4}年\d{1,2}月$/,     // Year-month format
            /^\d{4}$/,               // Just year numbers
            /^\d+月$/,               // Just month
            /^\d+年$/,               // Just year with 年
            /^\d+月\d+日$/,          // Date format
            /^\d+日$/,               // Just day
            /\d{4}年\d{1,2}月/,     // Contains year-month anywhere
            /^(大阪|東京|京都|神奈川|愛知|福岡|北海道|沖縄|島根|高知|兵庫|千葉|埼玉|茨城|栃木|群馬|山梨|長野|新潟|富山|石川|福井|静岡|岐阜|三重|滋賀|奈良|和歌山|鳥取|岡山|広島|山口|徳島|香川|愛媛|佐賀|長崎|熊本|大分|宮崎|鹿児島|青森|岩手|宮城|秋田|山形|福島)$/,
            /^(pp?\.|pages?|vol\.|volume|no\.|number)\s*\d+/i,  // Page numbers, volumes
            /^IEEE|ACM|IFIP|CIRP|Conference|Workshop|Symposium/i,  // Conference names
            /^Proceedings|Journal|Trans\.|Trans|Transactions/i,     // Publication types
            /^\d+\s*-\s*\d+$/,       // Page ranges like "3250-3257"
            /^\d+\s*,\s*\d+/,        // Number sequences
            /^R&R$/,                 // R&R (Revise and Resubmit)
            /^Under Review$/i,       // Under Review
            /Italia?|Portugal|Spain|United Kingdom|Mexico|Greece/i,  // Country names
            /^(January|February|March|April|May|June|July|August|September|October|November|December)$/i,  // Months
            /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?$/i,  // Abbreviated months
            /^\d+\s*-\s*\d+,?\s+(June|July|March|April|May|August|September|October|November|December)\s*,?\s*\d{4}/i,  // Date ranges
            /^\d+\s*,\s*\d+\s*-\s*\d+$/,  // Volume, page range
            /^\w+\s+(Italy|Portugal|Spain|United Kingdom|Mexico|Greece|Japan|USA|UK)$/i,  // City, Country
            /^\w+\s*,\s*\w+\s*,\s*\d+\s*-\s*\d+,?\s*\d{4}/,  // Complex publication info
            /^\[発表予定\]$/,           // [発表予定]
            /^発表予定$/,              // 発表予定
            /^\d+月\d+日-\d+日$/,      // Date ranges in Japanese
            /^\d+-\d+\s*月$/,           // Month ranges
            /^\d+月\d+日$/,            // Specific dates
            /^\d+月\d+日-\d+日$/       // Date ranges
        ];
        
        // Check if name matches any exclude pattern
        if (excludePatterns.some(pattern => pattern.test(cleanName))) {
            return false;
        }
        
        // Additional checks for person names
        // Names typically have alphabetic characters and maybe some punctuation
        if (!/^[A-Za-z\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s\.,'-]+$/.test(cleanName)) {
            return false;
        }
        
        // Names are typically between 2-50 characters
        if (cleanName.length < 2 || cleanName.length > 50) {
            return false;
        }
        
        // Additional specific exclusions for common non-name patterns
        const specificExclusions = [
            '大阪', '東京', '京都', '神奈川', '愛知', '福岡', '北海道', '沖縄', '島根', '高知',
            '兵庫', '千葉', '埼玉', '茨城', '栃木', '群馬', '山梨', '長野', '新潟', '富山',
            '石川', '福井', '静岡', '岐阜', '三重', '滋賀', '奈良', '和歌山', '鳥取', '岡山',
            '広島', '山口', '徳島', '香川', '愛媛', '佐賀', '長崎', '熊本', '大分', '宮崎', '鹿児島',
            '青森', '岩手', '宮城', '秋田', '山形', '福島'
        ];
        
        if (specificExclusions.includes(cleanName)) {
            return false;
        }
        
        // Should contain at least one letter
        if (!/[A-Za-z\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(cleanName)) {
            return false;
        }
        
        return true;
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
        // Split by comma and "and" (with optional &), then clean up
        const authors = plainText.split(/,|\s+and\s+|\s+&\s+/)
            .map(author => author.trim())
            .filter(author => {
                // Basic filters
                if (author.length === 0 || author.match(/^\d+$/)) {
                    return false;
                }
                // Apply person name filter
                return isPersonName(author);
            });
        
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
        const isFirst = /^(<strong>)?\s*A\.\s*Kitadai(<\/strong>)?[\s,;]/.test(cleanHtml) || 
                       /^<strong>A\.\s*Kitadai<\/strong>[\s,;]/.test(cleanHtml);
        return isFirst;
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
    
    // Legacy function - now handled in applyAllFilters
    function filterByCoauthors(selectedAuthors) {
        // This function is now integrated into applyAllFilters
        // Keeping for backward compatibility
    }
    
    // Legacy function - now handled in applyAllFilters
    function filterByFirstAuthor(showFirstAuthorOnly) {
        // This function is now integrated into applyAllFilters
        // Keeping for backward compatibility
    }
    
    // Apply all filters
    function applyAllFilters() {
        const categoryFilter = filterSelect.value;
        const selectedCoauthors = Array.from(coauthorsSelect.selectedOptions).map(option => option.value);
        const firstAuthorFilter = firstAuthorCheckbox.checked;
        
        // Apply category filter (section level)
        filterPublications(categoryFilter);
        
        // Apply item-level filters
        document.querySelectorAll('.cv-publication-list').forEach(list => {
            const items = Array.from(list.children);
            
            items.forEach(item => {
                let shouldShow = true;
                
                // Check coauthor filter
                if (selectedCoauthors.length > 0) {
                    const authors = extractAllAuthors(item.innerHTML);
                    const normalizedAuthors = authors.map(author => normalizeAuthorName(author));
                    const hasSelectedAuthor = selectedCoauthors.some(selectedAuthor => 
                        normalizedAuthors.some(author => author === selectedAuthor)
                    );
                    if (!hasSelectedAuthor) {
                        shouldShow = false;
                    }
                }
                
                // Check first author filter
                if (firstAuthorFilter) {
                    const isFirst = isFirstAuthor(item.innerHTML);
                    if (!isFirst) {
                        shouldShow = false;
                    }
                }
                
                // Apply visibility
                if (shouldShow) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Legacy function - now handled in applyAllFilters
    function updateItemVisibility() {
        // This function is now integrated into applyAllFilters
        // Keeping for backward compatibility
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
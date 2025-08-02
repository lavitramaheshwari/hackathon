// SafeSpace - Complete JavaScript Functionality

// User Data Management
let userData = {
    avatar: '🦊',
    name: 'Anonymous Fox',
    karma: 0,
    moods: [],
    achievements: [],
    gamesPlayed: 0,
    breathingSessions: 0,
    communityPosts: 0,
    daysActive: 1,
    lastActive: new Date().toDateString(),
    gameScores: {
        memory: 0,
        color: 0,
        words: 0,
        click: 0
    }
};

// Load user data from localStorage
function loadUserData() {
    const saved = localStorage.getItem('safeSpaceUser');
    if (saved) {
        userData = JSON.parse(saved);
        updateUserDisplay();
        checkDailyLogin();
    }
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem('safeSpaceUser', JSON.stringify(userData));
}

// Check daily login
function checkDailyLogin() {
    const today = new Date().toDateString();
    if (userData.lastActive !== today) {
        userData.daysActive++;
        userData.lastActive = today;
        updateKarma(50); // Daily login bonus
        showNotification('Welcome back! +50 karma for daily login! 🎉');
        saveUserData();
    }
}

// Update user display
function updateUserDisplay() {
    document.getElementById('userAvatar').textContent = userData.avatar;
    document.getElementById('userName').textContent = `Anonymous ${userData.name}`;
    document.getElementById('karmaPoints').textContent = userData.karma;
    updateStats();
    updateAchievements();
}

// Initialize particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particles = ['✨', '⭐', '💫', '🌟'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.fontSize = Math.random() * 20 + 10 + 'px';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 20 + 20) + 's';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particlesContainer.appendChild(particle);
    }
}

// Support type selection
let currentSupport = 'academic';

function selectSupport(type) {
    currentSupport = type;
    
    // Update UI
    document.querySelectorAll('.support-type').forEach(el => el.classList.remove('active'));
    document.getElementById(type + 'Support').classList.add('active');
    
    // Update chat title
    const titles = {
        academic: 'Academic Support Assistant',
        social: 'Social Support Friend',
        emotional: 'Emotional Care Companion'
    };
    document.getElementById('chatTitle').textContent = titles[type];
    
    // Update quick actions
    updateQuickActions(type);
    
    // Add animation
    const chatWrapper = document.querySelector('.chat-wrapper');
    chatWrapper.style.animation = 'none';
    setTimeout(() => {
        chatWrapper.style.animation = 'fadeIn 0.5s ease';
    }, 10);
}

function updateQuickActions(type) {
    const quickActions = document.getElementById('quickActions');
    const actions = {
        academic: [
            { icon: '📝', text: 'Homework Help', action: 'homework' },
            { icon: '📊', text: 'Exam Prep', action: 'exam' },
            { icon: '📖', text: 'Study Tips', action: 'study' },
            { icon: '🎯', text: "Can't Focus", action: 'focus' },
            { icon: '⏰', text: 'Time Management', action: 'time' }
        ],
        social: [
            { icon: '👥', text: 'Friend Issues', action: 'friends' },
            { icon: '💔', text: 'Feeling Lonely', action: 'lonely' },
            { icon: '🤝', text: 'Making Friends', action: 'makefriends' },
            { icon: '😰', text: 'Peer Pressure', action: 'pressure' },
            { icon: '💬', text: 'Communication', action: 'communication' }
        ],
        emotional: [
            { icon: '😰', text: 'Anxiety', action: 'anxiety' },
            { icon: '😢', text: 'Feeling Down', action: 'sad' },
            { icon: '😤', text: 'Stress', action: 'stress' },
            { icon: '😴', text: "Can't Sleep", action: 'sleep' },
            { icon: '🤗', text: 'Need Support', action: 'support' }
        ]
    };
    
    quickActions.innerHTML = actions[type].map(action => 
        `<button class="quick-btn" onclick="quickQuestion('${action.action}')">${action.icon} ${action.text}</button>`
    ).join('');
}

// Quick question handler
function quickQuestion(topic) {
    // Send predefined message to chatbot
    const chatbot = document.getElementById('chatbot');
    const messages = {
        homework: "I need help with my homework",
        exam: "I'm stressed about an upcoming exam",
        study: "I need some study tips",
        focus: "I'm having trouble focusing",
        time: "I need help managing my time",
        friends: "I'm having issues with my friends",
        lonely: "I'm feeling lonely",
        makefriends: "I want to make new friends",
        pressure: "I'm dealing with peer pressure",
        communication: "I need help communicating better",
        anxiety: "I'm feeling anxious",
        sad: "I'm feeling down",
        stress: "I'm really stressed",
        sleep: "I can't sleep",
        support: "I need someone to talk to"
    };
    
    // You could implement postMessage to send to iframe
    console.log('Sending to chatbot:', messages[topic]);
    showNotification(`Asking about: ${messages[topic]}`);
}

// Mood tracking
function setMood(mood) {
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    
    // Save mood data
    const moodData = {
        mood: mood,
        timestamp: new Date().toISOString(),
        date: new Date().toDateString()
    };
    userData.moods.push(moodData);
    
    // Keep only last 7 days of moods
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    userData.moods = userData.moods.filter(m => new Date(m.timestamp) > sevenDaysAgo);
    
    updateKarma(10);
    saveUserData();
    updateMoodChart();
    showNotification('Mood recorded! +10 karma 🌟');
    
    // Check for achievements
    checkAchievements();
}

// Update mood chart
function updateMoodChart() {
    const moodChart = document.getElementById('moodChart');
    if (!moodChart) return;
    
    // Group moods by day
    const moodsByDay = {};
    const moodEmojis = {
        happy: '😊',
        okay: '😐',
        sad: '😢',
        anxious: '😰',
        angry: '😠'
    };
    
    // Get last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toDateString());
    }
    
    // Count moods per day
    days.forEach(day => {
        const dayMoods = userData.moods.filter(m => m.date === day);
        if (dayMoods.length > 0) {
            // Get most recent mood of the day
            moodsByDay[day] = dayMoods[dayMoods.length - 1].mood;
        }
    });
    
    // Create chart
    moodChart.innerHTML = days.map(day => {
        const mood = moodsByDay[day];
        const height = mood ? '100%' : '10%';
        const emoji = mood ? moodEmojis[mood] : '';
        return `<div class="mood-bar" style="height: ${height}" data-mood="${emoji}"></div>`;
    }).join('');
}

// Karma system
function updateKarma(points) {
    userData.karma += points;
    const karmaElement = document.getElementById('karmaPoints');
    
    // Animate karma update
    karmaElement.style.transform = 'scale(1.5)';
    karmaElement.textContent = userData.karma;
    setTimeout(() => {
        karmaElement.style.transform = 'scale(1)';
    }, 300);
    
    saveUserData();
    checkAchievements();
}

// Section navigation
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Show selected section
    const sectionId = section + 'Section';
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
        sectionElement.classList.add('active');
    }
    
    // Update active nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === section) {
            item.classList.add('active');
        }
    });
    
    // Load section-specific content
    switch(section) {
        case 'community':
            loadCommunityPosts();
            break;
        case 'stats':
            updateStats();
            updateMoodChart();
            break;
    }
}

// Avatar selection
function showAvatarSelection() {
    document.getElementById('avatarModal').style.display = 'block';
}

function selectAvatar(emoji, name) {
    userData.avatar = emoji;
    userData.name = name;
    updateUserDisplay();
    saveUserData();
    closeModal('avatarModal');
    showNotification(`Avatar changed to ${emoji} ${name}!`);
}

// Modal controls
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Memory Game
let memoryGame = {
    cards: [],
    flipped: [],
    matched: [],
    moves: 0,
    score: 0,
    timer: null,
    seconds: 0
};

function startMemoryGame() {
    document.getElementById('memoryGameModal').style.display = 'block';
    resetMemoryGame();
}

function resetMemoryGame() {
    // Reset game state
    memoryGame = {
        cards: [],
        flipped: [],
        matched: [],
        moves: 0,
        score: 0,
        timer: null,
        seconds: 0
    };
    
    // Create card pairs
    const emojis = ['🌟', '💝', '🌈', '🦋', '🌸', '🎨', '🎵', '📚'];
    const cards = [...emojis, ...emojis];
    
    // Shuffle cards
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    memoryGame.cards = cards;
    
    // Create grid
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = cards.map((emoji, index) => 
        `<div class="memory-card" onclick="flipCard(${index})" data-index="${index}">
            <span style="display: none;">${emoji}</span>
        </div>`
    ).join('');
    
    // Update display
    document.getElementById('memoryScore').textContent = '0';
    document.getElementById('memoryMoves').textContent = '0';
    document.getElementById('memoryTime').textContent = '0:00';
    
    // Start timer
    clearInterval(memoryGame.timer);
    memoryGame.timer = setInterval(updateMemoryTimer, 1000);
}

function flipCard(index) {
    if (memoryGame.flipped.length >= 2) return;
    if (memoryGame.flipped.includes(index)) return;
    if (memoryGame.matched.includes(index)) return;
    
    const card = document.querySelector(`[data-index="${index}"]`);
    const emoji = card.querySelector('span');
    
    card.classList.add('flipped');
    emoji.style.display = 'block';
    memoryGame.flipped.push(index);
    
    if (memoryGame.flipped.length === 2) {
        memoryGame.moves++;
        document.getElementById('memoryMoves').textContent = memoryGame.moves;
        
        setTimeout(() => checkMemoryMatch(), 500);
    }
}

function checkMemoryMatch() {
    const [first, second] = memoryGame.flipped;
    const firstCard = document.querySelector(`[data-index="${first}"]`);
    const secondCard = document.querySelector(`[data-index="${second}"]`);
    
    if (memoryGame.cards[first] === memoryGame.cards[second]) {
        // Match!
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        memoryGame.matched.push(first, second);
        memoryGame.score += 100;
        document.getElementById('memoryScore').textContent = memoryGame.score;
        
        // Check if game is complete
        if (memoryGame.matched.length === memoryGame.cards.length) {
            clearInterval(memoryGame.timer);
            const finalScore = memoryGame.score - (memoryGame.moves * 5) + (300 - memoryGame.seconds);
            
            if (finalScore > userData.gameScores.memory) {
                userData.gameScores.memory = finalScore;
                saveUserData();
                showNotification(`New high score: ${finalScore}! 🎉`);
            }
            
            updateKarma(20);
            userData.gamesPlayed++;
            saveUserData();
            
            setTimeout(() => {
                alert(`Congratulations! You completed the game in ${memoryGame.moves} moves and ${memoryGame.seconds} seconds!`);
            }, 500);
        }
    } else {
        // No match
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.querySelector('span').style.display = 'none';
        secondCard.querySelector('span').style.display = 'none';
    }
    
    memoryGame.flipped = [];
}

function updateMemoryTimer() {
    memoryGame.seconds++;
    const minutes = Math.floor(memoryGame.seconds / 60);
    const seconds = memoryGame.seconds % 60;
    document.getElementById('memoryTime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function closeGame(modalId) {
    closeModal(modalId);
    if (memoryGame.timer) {
        clearInterval(memoryGame.timer);
    }
}

// Color Match Game
let colorGame = {
    targetColor: '',
    score: 0,
    level: 1
};

function startColorMatch() {
    document.getElementById('colorMatchModal').style.display = 'block';
    colorGame.score = 0;
    colorGame.level = 1;
    nextColorRound();
}

function nextColorRound() {
    // Generate random target color
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    colorGame.targetColor = `rgb(${r}, ${g}, ${b})`;
    
    document.getElementById('targetColor').style.background = colorGame.targetColor;
    
    // Generate options (including correct one)
    const options = [colorGame.targetColor];
    
    // Add similar colors
    for (let i = 0; i < 5; i++) {
        const variance = 50 - (colorGame.level * 5); // Colors get more similar as level increases
        const nr = Math.max(0, Math.min(255, r + (Math.random() - 0.5) * variance * 2));
        const ng = Math.max(0, Math.min(255, g + (Math.random() - 0.5) * variance * 2));
        const nb = Math.max(0, Math.min(255, b + (Math.random() - 0.5) * variance * 2));
        options.push(`rgb(${Math.floor(nr)}, ${Math.floor(ng)}, ${Math.floor(nb)})`);
    }
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    
    // Display options
    const container = document.getElementById('colorOptions');
    container.innerHTML = options.map(color => 
        `<div class="color-option" style="background: ${color}" onclick="checkColor('${color}')"></div>`
    ).join('');
    
    document.getElementById('colorScore').textContent = colorGame.score;
    document.getElementById('colorLevel').textContent = colorGame.level;
    document.getElementById('colorMessage').textContent = '';
}

function checkColor(color) {
    const message = document.getElementById('colorMessage');
    
    if (color === colorGame.targetColor) {
        colorGame.score += colorGame.level * 10;
        colorGame.level++;
        message.textContent = '✅ Correct! Great job!';
        message.style.color = '#10b981';
        
        if (colorGame.score > userData.gameScores.color) {
            userData.gameScores.color = colorGame.score;
            saveUserData();
        }
        
        setTimeout(nextColorRound, 1000);
    } else {
        message.textContent = '❌ Try again!';
        message.style.color = '#ef4444';
        colorGame.score = Math.max(0, colorGame.score - 5);
        document.getElementById('colorScore').textContent = colorGame.score;
    }
}
function startWordPuzzle() {
    document.getElementById('wordPuzzleModal').style.display = 'block';
    const gridSize = 8;
    const words = ['JOY', 'KIND', 'LOVE', 'PEACE', 'HOPE', 'BRAVE', 'CALM', 'HAPPY'];
    let grid = Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    );
    let wordPositions = {}; // Store positions for each word

    // Place words horizontally in random rows
    words.forEach(word => {
        let placed = false;
        while (!placed) {
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * (gridSize - word.length + 1));
            // Check if space is available
            let canPlace = true;
            for (let i = 0; i < word.length; i++) {
                if (grid[row][col + i] !== undefined && grid[row][col + i].length > 1) {
                    canPlace = false;
                    break;
                }
            }
            if (canPlace) {
                for (let i = 0; i < word.length; i++) {
                    grid[row][col + i] = word[i];
                }
                // Save positions for highlighting
                wordPositions[word] = [];
                for (let i = 0; i < word.length; i++) {
                    wordPositions[word].push({ row, col: col + i });
                }
                placed = true;
            }
        }
    });

    // Render grid with IDs
    let gridHTML = '';
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            gridHTML += `<span id="cell-${r}-${c}" style="display:inline-block;width:32px;height:32px;line-height:32px;text-align:center;font-size:1.2rem;background:#2226;border-radius:4px;color:#fff;border:1px solid #444;margin:1px;transition:background 0.2s;">${grid[r][c]}</span>`;
        }
    }
    document.getElementById('wordGrid').innerHTML = gridHTML;

    window.foundWordsList = [];
    window.positiveWords = words;
    window.wordPositions = wordPositions;
    document.getElementById('foundWords').textContent = '';
    document.getElementById('wordInput').value = '';
}
// Word Puzzle (Simple Version)
function submitWord() {
    const input = document.getElementById('wordInput').value.trim().toUpperCase();
    const validWords = window.positiveWords;
    if (validWords.includes(input) && !window.foundWordsList.includes(input)) {
        window.foundWordsList.push(input);
        document.getElementById('foundWords').textContent = 'Found: ' + window.foundWordsList.join(', ');
        // Highlight the word
        if (window.wordPositions && window.wordPositions[input]) {
            window.wordPositions[input].forEach(pos => {
                const cell = document.getElementById(`cell-${pos.row}-${pos.col}`);
                if (cell) {
                    cell.style.background = '#4ade80';
                    cell.style.color = '#222';
                    cell.style.fontWeight = 'bold';
                }
            });
        }
        if (typeof updateKarma === "function") updateKarma(10);
        if (typeof userData !== "undefined") {
            userData.gamesPlayed++;
            if (typeof saveUserData === "function") saveUserData();
        }
        if (typeof showNotification === "function") showNotification('Great! +10 karma');
        if (window.foundWordsList.length === validWords.length) {
            if (typeof showNotification === "function") showNotification('You found all the words! 🎉');
        }
    } else if (window.foundWordsList.includes(input)) {
        if (typeof showNotification === "function") showNotification('Already found!');
    } else {
        if (typeof showNotification === "function") showNotification('Not a valid word!');
    }
    document.getElementById('wordInput').value = '';
}
function startClickCalm() {
    document.getElementById('clickCalmModal').style.display = 'block';
    let count = 0;
    let timeLeft = 10; // seconds
    let timer = null;
    const btn = document.getElementById('clickBtn');
    const countSpan = document.getElementById('clickCount');
    const timerDiv = document.getElementById('clickTimer');
    btn.disabled = false;
    btn.textContent = "Click Me!";
    countSpan.textContent = "0";
    timerDiv.textContent = "Time left: 10s";

    function endGame() {
        btn.disabled = true;
        btn.textContent = "Done!";
        timerDiv.textContent = `Time's up! Total Clicks: ${count}`;
        // Update high score
        if (count > (userData.gameScores.click || 0)) {
            userData.gameScores.click = count;
            showNotification(`New high score: ${count}! 🎉`);
        }
        updateKarma(Math.floor(count / 5) * 5);
        userData.gamesPlayed++;
        saveUserData();
        if (document.getElementById('clickBest')) {
            document.getElementById('clickBest').textContent = userData.gameScores.click || 0;
        }
    }

    btn.onclick = function () {
        if (timer === null) {
            // Start timer on first click
            timer = setInterval(() => {
                timeLeft--;
                timerDiv.textContent = `Time left: ${timeLeft}s`;
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    endGame();
                }
            }, 1000);
        }
        count++;
        countSpan.textContent = count;
    };

    // Reset and cleanup when modal is closed
    const closeBtn = document.querySelector('#clickCalmModal button[onclick*="closeModal"]');
    if (closeBtn) {
        closeBtn.onclick = function () {
            document.getElementById('clickCalmModal').style.display = 'none';
            if (timer) clearInterval(timer);
        };
    }
}
   
let breathingActive = false;
let breathingInterval = null;

function startBreathingExercise() {
    if (breathingActive) {
        stopBreathing();
        return;
    }
    
    breathingActive = true;
    const circle = document.getElementById('breathingCircle');
    const text = document.getElementById('breathingText');
    const button = event.target;
    
    button.textContent = 'Stop Breathing';
    circle.classList.add('breathing-active');
    
    let phase = 0;
    const phases = ['Breathe In', 'Hold', 'Breathe Out', 'Hold'];
    const durations = [4000, 4000, 4000, 4000];
    
    function nextPhase() {
        if (!breathingActive) return;
        
        text.textContent = phases[phase];
        phase = (phase + 1) % 4;
        
        breathingInterval = setTimeout(nextPhase, durations[phase]);
    }
    
    nextPhase();
    
    // Track session
    userData.breathingSessions++;
    updateKarma(15);
    saveUserData();
    showNotification('Great job focusing on your breath! +15 karma 🧘');
}

function stopBreathing() {
    breathingActive = false;
    clearTimeout(breathingInterval);
    
    const circle = document.getElementById('breathingCircle');
    const text = document.getElementById('breathingText');
    const button = document.querySelector('.breathing-container .btn-primary');
    
    circle.classList.remove('breathing-active');
    text.textContent = 'Click Start';
    button.textContent = 'Start Breathing';
}

// Meditation Timer
let meditationTime = 5;
let meditationInterval = null;

function setMeditationTime(minutes) {
    meditationTime = minutes;
    document.getElementById('meditationTimer').textContent = `${minutes}:00`;
    
    // Update active button
    document.querySelectorAll('.timer-controls .btn-secondary').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function startMeditation() {
    if (meditationInterval) {
        clearInterval(meditationInterval);
        meditationInterval = null;
        event.target.textContent = 'Start Meditation';
        return;
    }
    
    let totalSeconds = meditationTime * 60;
    const timerDisplay = document.getElementById('meditationTimer');
    event.target.textContent = 'Stop Meditation';
    
    meditationInterval = setInterval(() => {
        totalSeconds--;
        
        if (totalSeconds <= 0) {
            clearInterval(meditationInterval);
            meditationInterval = null;
            event.target.textContent = 'Start Meditation';
            timerDisplay.textContent = `${meditationTime}:00`;
            
            showNotification('Meditation complete! Great job! +20 karma 🧘');
            updateKarma(20);
            userData.breathingSessions++;
            saveUserData();
            
            // Play completion sound
            playSound('complete');
            return;
        }
        
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Sound therapy
let currentSound = null;

function playSound(soundType) {
    // In a real app, you would load and play actual audio files
    // For now, we'll simulate it
    
    if (currentSound === soundType) {
        // Stop sound
        document.querySelectorAll('.sound-btn').forEach(btn => btn.classList.remove('active'));
        currentSound = null;
        showNotification('Sound stopped');
    } else {
        // Play new sound
        document.querySelectorAll('.sound-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        currentSound = soundType;
        showNotification(`Playing ${soundType} sounds... 🎵`);
    }
}

function adjustVolume() {
    const volume = document.getElementById('volumeSlider').value;
    console.log('Volume set to:', volume);
}

// Community Features
let communityPosts = [
    {
        id: 1,
        avatar: '🦊',
        author: 'Anonymous Fox',
        time: '2 hours ago',
        category: 'academic',
        title: 'How do you deal with exam anxiety?',
        content: "I have a big exam coming up and I'm feeling really overwhelmed. Any tips?",
        replies: 12,
        supports: 45,
        meToos: 23
    },
    {
        id: 2,
        avatar: '🐼',
        author: 'Anonymous Panda',
        time: '5 hours ago',
        category: 'social',
        title: 'Making friends in a new school',
        content: "Just moved to a new city and starting fresh. It's harder than I thought to connect with people.",
        replies: 8,
        supports: 67,
        meToos: 31
    },
    {
        id: 3,
        avatar: '🦉',
        author: 'Anonymous Owl',
        time: '1 day ago',
        category: 'emotional',
        title: 'Dealing with stress and burnout',
        content: "Feeling exhausted lately. Between school, work, and everything else, I'm struggling to keep up.",
        replies: 24,
        supports: 89,
        meToos: 56
    }
];

function showCommunityTab(tab) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Load content based on tab
    switch(tab) {
        case 'posts':
            loadCommunityPosts();
            break;
        case 'groups':
            loadSupportGroups();
            break;
        case 'stories':
            loadSuccessStories();
            break;
    }
}

function loadCommunityPosts() {
    const content = document.getElementById('communityContent');
    content.innerHTML = communityPosts.map(post => `
        <div class="post-card">
            <div class="post-header">
                <span class="post-avatar">${post.avatar}</span>
                <span class="post-author">${post.author}</span>
                <span class="post-time">${post.time}</span>
            </div>
            <h3 class="post-title">${post.title}</h3>
            <p class="post-content">${post.content}</p>
            <div class="post-actions">
                <button class="action-btn" onclick="showReplies(${post.id})">💬 ${post.replies} replies</button>
                <button class="action-btn" onclick="supportPost(${post.id})">❤️ ${post.supports} Support</button>
                <button class="action-btn" onclick="meToo(${post.id})">🤗 ${post.meToos} Me too</button>
            </div>
        </div>
    `).join('');
}

function loadSupportGroups() {
    const content = document.getElementById('communityContent');
    content.innerHTML = `
        <div class="support-groups-grid">
            <div class="group-card">
                <h3>📚 Study Buddies</h3>
                <p>Find anonymous study partners for any subject</p>
                <span>👥 234 members</span>
            </div>
            <div class="group-card">
                <h3>😰 Anxiety Support</h3>
                <p>Share experiences and coping strategies</p>
                <span>👥 567 members</span>
            </div>
            <div class="group-card">
                <h3>🌈 LGBTQ+ Safe Space</h3>
                <p>A supportive community for all identities</p>
                <span>👥 423 members</span>
            </div>
            <div class="group-card">
                <h3>🎮 Gaming & Chill</h3>
                <p>Connect through games and fun activities</p>
                <span>👥 789 members</span>
            </div>
        </div>
    `;
}

function loadSuccessStories() {
    const content = document.getElementById('communityContent');
    content.innerHTML = `
        <div class="success-stories">
            <div class="post-card">
                <h3>🌟 From Failing to A's</h3>
                <p>"I was struggling so much with math, but the study tips here completely changed my approach. Just got my first A!"</p>
                <span>- Anonymous Student</span>
            </div>
            <div class="post-card">
                <h3>💪 Overcoming Social Anxiety</h3>
                <p>"The breathing exercises and community support helped me finally join a club at school. Small steps, big victories!"</p>
                <span>- Anonymous Warrior</span>
            </div>
            <div class="post-card">
                <h3>🤝 Found My People</h3>
                <p>"Was feeling so alone after moving. This community reminded me that everyone struggles sometimes. Now I have real friends!"</p>
                <span>- Anonymous Friend</span>
            </div>
        </div>
    `;
}

function createPost() {
    document.getElementById('postModal').style.display = 'block';
}

function submitPost() {
    const category = document.getElementById('postCategory').value;
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    
    if (!category || !title || !content) {
        alert('Please fill in all fields');
        return;
    }
    
    // Add new post
    const newPost = {
        id: communityPosts.length + 1,
        avatar: userData.avatar,
        author: `Anonymous ${userData.name}`,
        time: 'Just now',
        category: category,
        title: title,
        content: content,
        replies: 0,
        supports: 0,
        meToos: 0
    };
    
    communityPosts.unshift(newPost);
    
    // Update stats
    userData.communityPosts++;
    updateKarma(30);
    saveUserData();
    
    // Clear form and close modal
    document.getElementById('postCategory').value = '';
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    closeModal('postModal');
    
    // Reload posts
    loadCommunityPosts();
    showNotification('Post created! +30 karma for contributing! 🎉');
}

function supportPost(postId) {
    const post = communityPosts.find(p => p.id === postId);
    if (post) {
        post.supports++;
        loadCommunityPosts();
        updateKarma(5);
        showNotification('+5 karma for supporting others! ❤️');
    }
}

function meToo(postId) {
    const post = communityPosts.find(p => p.id === postId);
    if (post) {
        post.meToos++;
        loadCommunityPosts();
        showNotification("You're not alone! 🤗");
    }
}

function showReplies(postId) {
    alert('Reply feature coming soon! This will show threaded conversations.');
}

// Resources
const resources = {
    'study-tips': {
        title: '📖 Study Tips & Techniques',
        content: `
            <h3>Effective Study Strategies</h3>
            <ul>
                <li><strong>Pomodoro Technique:</strong> Study for 25 minutes, then take a 5-minute break</li>
                <li><strong>Active Recall:</strong> Test yourself instead of just re-reading notes</li>
                <li><strong>Spaced Repetition:</strong> Review material at increasing intervals</li>
                <li><strong>Mind Mapping:</strong> Create visual connections between concepts</li>
            </ul>
            
            <h3>Creating the Right Environment</h3>
            <ul>
                <li>Find a quiet, dedicated study space</li>
                <li>Remove distractions (phone, social media)</li>
                <li>Use background music or white noise if it helps</li>
                <li>Keep water and healthy snacks nearby</li>
            </ul>
            
            <h3>Memory Techniques</h3>
            <ul>
                <li><strong>Mnemonics:</strong> Create memorable phrases or acronyms</li>
                <li><strong>Visualization:</strong> Create mental images of concepts</li>
                <li><strong>Teaching:</strong> Explain concepts to others (or yourself)</li>
                <li><strong>Chunking:</strong> Break information into smaller groups</li>
            </ul>
        `
    },
    'time-management': {
        title: '⏰ Time Management Guide',
        content: `
            <h3>Planning Your Day</h3>
            <ul>
                <li>Use a planner or digital calendar</li>
                <li>Block time for specific tasks</li>
                <li>Include breaks and self-care</li>
                <li>Set realistic daily goals</li>
            </ul>
            
            <h3>Prioritization Methods</h3>
            <ul>
                <li><strong>Eisenhower Matrix:</strong> Urgent vs Important</li>
                <li><strong>ABC Method:</strong> A=Critical, B=Important, C=Nice to have</li>
                <li><strong>Time Boxing:</strong> Allocate fixed time periods</li>
                <li><strong>2-Minute Rule:</strong> Do quick tasks immediately</li>
            </ul>
            
            <h3>Avoiding Procrastination</h3>
            <ul>
                <li>Break large tasks into smaller steps</li>
                <li>Start with the easiest part</li>
                <li>Remove temptations from your workspace</li>
                <li>Reward yourself for completing tasks</li>
            </ul>
        `
    },
    'test-anxiety': {
        title: '📝 Dealing with Test Anxiety',
        content: `
            <h3>Before the Test</h3>
            <ul>
                <li>Prepare thoroughly but avoid cramming</li>
                <li>Get enough sleep the night before</li>
                <li>Eat a healthy meal before the exam</li>
                <li>Arrive early to avoid rushing</li>
            </ul>
            
            <h3>During the Test</h3>
            <ul>
                <li>Take deep breaths to calm nerves</li>
                <li>Read instructions carefully</li>
                <li>Start with questions you know</li>
                <li>Manage your time wisely</li>
            </ul>
            
            <h3>Calming Techniques</h3>
            <ul>
                <li><strong>4-7-8 Breathing:</strong> Inhale 4, hold 7, exhale 8</li>
                <li><strong>Progressive Muscle Relaxation</strong></li>
                <li><strong>Positive Self-Talk:</strong> "I am prepared"</li>
                <li><strong>Visualization:</strong> Picture success</li>
            </ul>
        `
    },
    'making-friends': {
        title: '🤝 Making Friends Guide',
        content: `
            <h3>Starting Conversations</h3>
            <ul>
                <li>Smile and make eye contact</li>
                <li>Ask open-ended questions</li>
                <li>Find common interests</li>
                <li>Be genuinely interested in others</li>
            </ul>
            
            <h3>Building Connections</h3>
            <ul>
                <li>Join clubs or groups you're interested in</li>
                <li>Be consistent and reliable</li>
                <li>Share appropriate personal stories</li>
                <li>Follow up after meeting someone</li>
            </ul>
            
            <h3>Overcoming Social Anxiety</h3>
            <ul>
                <li>Start with small interactions</li>
                <li>Practice conversation starters</li>
                <li>Remember everyone feels awkward sometimes</li>
                <li>Focus on being kind rather than perfect</li>
            </ul>
        `
    },
    'stress-relief': {
        title: '😌 Stress Relief Techniques',
        content: `
            <h3>Quick Stress Busters</h3>
            <ul>
                <li>5-minute breathing exercises</li>
                <li>Quick walk or stretch</li>
                <li>Listen to calming music</li>
                <li>Practice gratitude (3 things)</li>
            </ul>
            
            <h3>Long-term Strategies</h3>
            <ul>
                <li>Regular exercise routine</li>
                <li>Consistent sleep schedule</li>
                <li>Healthy diet and hydration</li>
                <li>Mindfulness or meditation practice</li>
            </ul>
            
            <h3>When to Seek Help</h3>
            <ul>
                <li>Stress interferes with daily life</li>
                <li>Physical symptoms (headaches, stomach issues)</li>
                <li>Difficulty sleeping or eating</li>
                <li>Feeling overwhelmed constantly</li>
            </ul>
        `
    },
    'self-care': {
        title: '💝 Self-Care Basics',
        content: `
            <h3>Physical Self-Care</h3>
            <ul>
                <li>Maintain regular sleep schedule</li>
                <li>Eat nutritious meals</li>
                <li>Stay hydrated</li>
                <li>Exercise or move daily</li>
            </ul>
            
            <h3>Emotional Self-Care</h3>
            <ul>
                <li>Journal your thoughts and feelings</li>
                <li>Practice saying no to overcommitment</li>
                <li>Engage in hobbies you enjoy</li>
                <li>Connect with supportive people</li>
            </ul>
            
            <h3>Mental Self-Care</h3>
            <ul>
                <li>Take breaks from screens</li>
                <li>Learn something new for fun</li>
                <li>Practice mindfulness</li>
                <li>Limit negative self-talk</li>
            </ul>
        `
    }
};

function openResource(resourceId) {
    const resource = resources[resourceId];
    if (resource) {
        document.getElementById('resourceTitle').textContent = resource.title;
        document.getElementById('resourceContent').innerHTML = resource.content;
        document.getElementById('resourceModal').style.display = 'block';
    }
}

// Stats and Progress
function updateStats() {
    document.getElementById('daysActive').textContent = userData.daysActive;
    document.getElementById('gamesPlayed').textContent = userData.gamesPlayed;
    document.getElementById('breathingSessions').textContent = userData.breathingSessions;
    document.getElementById('communityPosts').textContent = userData.communityPosts;
    
    // Update game high scores
    document.getElementById('memoryBest').textContent = userData.gameScores.memory;
    document.getElementById('colorBest').textContent = userData.gameScores.color;
    document.getElementById('wordsBest').textContent = userData.gameScores.words;
    document.getElementById('clickBest').textContent = userData.gameScores.click;
    
    // Update daily progress
    updateDailyProgress();
}

function updateDailyProgress() {
    const progress = document.getElementById('dailyProgress');
    const todayMoods = userData.moods.filter(m => m.date === new Date().toDateString()).length;
    
    progress.innerHTML = `
        <div class="progress-item">
            <div class="progress-label">
                <span>Mood Check-ins</span>
                <span>${todayMoods}/5</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(todayMoods/5)*100}%"></div>
            </div>
        </div>
        <div class="progress-item">
            <div class="progress-label">
                <span>Daily Goal</span>
                <span>${Math.min(100, Math.floor((userData.karma % 100)))}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${Math.min(100, userData.karma % 100)}%"></div>
            </div>
        </div>
    `;
}

// Achievements
const achievements = [
    { id: 'first-steps', icon: '🌟', name: 'First Steps', condition: () => true },
    { id: 'reached-out', icon: '💬', name: 'Reached Out', condition: () => userData.karma > 0 },
    { id: 'helper', icon: '🤝', name: 'Helper', condition: () => userData.communityPosts >= 5 },
    { id: 'on-fire', icon: '🔥', name: 'On Fire', condition: () => userData.daysActive >= 7 },
    { id: 'zen-master', icon: '🧘', name: 'Zen Master', condition: () => userData.breathingSessions >= 10 },
    { id: 'game-champion', icon: '🏆', name: 'Game Champion', condition: () => userData.gamesPlayed >= 20 },
    { id: 'mood-tracker', icon: '📊', name: 'Mood Tracker', condition: () => userData.moods.length >= 30 },
    { id: 'karma-king', icon: '👑', name: 'Karma King', condition: () => userData.karma >= 1000 }
];

function updateAchievements() {
    const grid = document.getElementById('achievementGrid');
    if (!grid) return;
    
    grid.innerHTML = achievements.map(achievement => {
        const unlocked = achievement.condition();
        if (unlocked && !userData.achievements.includes(achievement.id)) {
            userData.achievements.push(achievement.id);
            saveUserData();
            showNotification(`Achievement Unlocked: ${achievement.name}! 🎉`);
        }
        
        return `
            <div class="achievement-item ${unlocked ? 'unlocked' : ''}" title="${achievement.name}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
            </div>
        `;
    }).join('');
}

function checkAchievements() {
    updateAchievements();
}

// Daily Tips
const dailyTips = [
    "Remember to take breaks every hour when studying. Your brain needs time to process information! 🧠",
    "Feeling overwhelmed? Try the 5-4-3-2-1 grounding technique: 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste. 🌈",
    "It's okay to ask for help. Everyone needs support sometimes, and reaching out is a sign of strength! 💪",
    "Stay hydrated! Drinking water can improve focus and reduce anxiety. Try to drink 8 glasses today! 💧",
    "Practice gratitude: Write down 3 things you're thankful for today. It can shift your perspective! 🙏",
    "Your feelings are valid. It's okay to not be okay sometimes. Be kind to yourself. 💝",
    "Try the Pomodoro Technique: 25 minutes of focused work, then a 5-minute break. Repeat! 🍅",
    "Connect with nature today, even if it's just looking out the window. Nature can reduce stress! 🌳",
    "Remember: Progress, not perfection. Every small step counts! 👣",
    "Take a few deep breaths right now. Inhale for 4, hold for 4, exhale for 4. Feel better? 🌬️"
];

function showDailyTip() {
    const tipElement = document.getElementById('dailyTip');
    if (tipElement) {
        const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];
        tipElement.textContent = randomTip;
    }
}

// Emergency Support
function showEmergency() {
    document.getElementById('crisisModal').style.display = 'block';
}

// Notifications
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(139, 92, 246, 0.9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize everything
window.addEventListener('load', () => {
    // Load user data
    loadUserData();
    
    // Create particles
    createParticles();
    
    // Hide loader after delay
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
    }, 2000);
    
    // Initialize with academic support
    selectSupport('academic');
    
    // Show daily tip
    showDailyTip();
    
    // Update stats
    updateStats();
    
    // Check achievements
    checkAchievements();
});

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
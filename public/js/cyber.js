// Matrix Background Effect
        function createMatrixEffect() {
            const matrixBg = document.getElementById('matrixBg');
            const chars = '1010';
            const charCount = 100;
            
            for (let i = 0; i < charCount; i++) {
                const char = document.createElement('div');
                char.className = 'matrix-char';
                char.textContent = chars.charAt(Math.floor(Math.random() * chars.length));
                char.style.left = Math.random() * 100 + 'vw';
                char.style.animationDuration = (Math.random() * 5 + 3) + 's';
                char.style.animationDelay = Math.random() * 5 + 's';
                matrixBg.appendChild(char);
            }
        }

        // Interactive Shell
        function initializeShell() {
            const shellInput = document.getElementById('shellInput');
            const shellOutput = document.getElementById('shellOutput');
            
            // Focus on input when clicking anywhere in the shell container
            document.querySelector('.shell-container').addEventListener('click', () => {
                shellInput.focus();
            });
            
            // Handle command input
            shellInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const command = shellInput.value.trim();
                    shellInput.value = '';
                    
                    // Add command to output
                    const commandLine = document.createElement('p');
                    commandLine.innerHTML = `root@fairwellito:~$ <span style="color: var(--hacker-green)">${command}</span>`;
                    shellOutput.appendChild(commandLine);
                    
                    // Process command
                    processCommand(command);
                    
                    // Scroll to bottom
                    shellOutput.scrollTop = shellOutput.scrollHeight;
                }
            });
        }
        
        function processCommand(command) {
            const shellOutput = document.getElementById('shellOutput');
            let response = '';
            
            switch(command.toLowerCase()) {
                case 'whoami':
                    response = '<p style="color: var(--hacker-blue)">fairwellito (Jose Acuna)</p>';
                    break;
                    
                case 'ls':
                    response = `
                        <p style="color: var(--hacker-green)">proyectos/</p>
                        <p style="color: var(--hacker-green)">certificaciones/</p>
                        <p style="color: var(--hacker-green)">habilidades/</p>
                    `;
                    break;
                    
                case 'ls -l':
                    response = '<p style="color: var(--hacker-purple)">¡Gracias por tu interés! 🎉</p>';
                    createConfetti();
                    break;
                    
                case 'help':
                    response = `
                        <p>Comandos disponibles:</p>
                        <p style="color: var(--hacker-green)">whoami</p>
                        <p style="color: var(--hacker-green)">ls</p>
                        <p style="color: var(--hacker-green)">ls -l</p>
                        <p style="color: var(--hacker-green)">help</p>
                        <p style="color: var(--hacker-green)">clear</p>
                    `;
                    break;
                    
                case 'clear':
                    shellOutput.innerHTML = '';
                    return;
                    
                default:
                    response = `<p style="color: #ff5f56">Comando no encontrado: ${command}. Escribe 'help' para ver los comandos disponibles.</p>`;
                    break;
            }
            
            const responseElement = document.createElement('div');
            responseElement.innerHTML = response;
            shellOutput.appendChild(responseElement);
        }
        
        // Confetti Effect
        function createConfetti() {
            const confettiContainer = document.getElementById('confettiContainer');
            const colors = ['#00ff41', '#00d4ff', '#ff00ff', '#ffff00', '#ff5f56'];
            
            for (let i = 0; i < 150; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
                confetti.style.animationDelay = (Math.random() * 2) + 's';
                confettiContainer.appendChild(confetti);
                
                // Remove confetti after animation
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }
        }

        // Mobile Navigation Toggle
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            icon.className = navMenu.classList.contains('active') ? 'bi bi-x-lg' : 'bi bi-list';
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.querySelector('i').className = 'bi bi-list';
            });
        });

        // Modal functions
        function showModal(src, alt) {
            const modal = document.getElementById('modal');
            const modalImg = document.getElementById('modalImg');
            modal.style.display = 'flex';
            modalImg.src = src;
            modalImg.alt = alt;
            document.body.style.overflow = 'hidden';
        }

        function hideModal() {
            document.getElementById('modal').style.display = 'none';
            document.body.style.overflow = '';
        }

        document.addEventListener('keydown', function(e) {
            if(e.key === 'Escape') hideModal();
        });

        // Scroll to top button
        const scrollTop = document.getElementById('scrollTop');

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTop.style.display = 'flex';
            } else {
                scrollTop.style.display = 'none';
            }
        });

        scrollTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Project card mouse tracking effect
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mouse-x', x + '%');
                card.style.setProperty('--mouse-y', y + '%');
            });
        });

        // Typing effect for terminal
        const terminalText = document.querySelector('.typing-text');
        if (terminalText) {
            const originalText = 'root@fairwellito:~$ whoami';
            let i = 0;
            
            function typeWriter() {
                if (i < originalText.length) {
                    terminalText.textContent += originalText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            }
            
            setTimeout(typeWriter, 500);
        }

        // Add active state to nav links based on scroll position
        window.addEventListener('scroll', () => {
            let current = '';
            const sections = document.querySelectorAll('section[id]');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= (sectionTop - 100)) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.style.color = '';
                if (link.getAttribute('href').substring(1) === current) {
                    link.style.color = 'var(--hacker-green)';
                    link.style.textShadow = '0 0 10px var(--hacker-green)';
                }
            });
        });

        // Initialize effects when page loads
        document.addEventListener('DOMContentLoaded', function() {
            createMatrixEffect();
            initializeShell();
        });


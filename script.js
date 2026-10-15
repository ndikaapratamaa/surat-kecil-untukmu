        // State Management
        const state = {
            isOpen: false,
            isPlayingMusic: false,
            isTyping: false,
            recipient: 'Cintaku',
            sender: 'Pengagum Rahasiamu',
            question: 'Maukah kamu jadi milikku? ❤️',
            message: `Setiap detik yang kuhabiskan untuk memikirkanmu mengisi duniaku dengan kehangatan dan keajaiban yang manis. 

Kamu adalah lagu yang tak henti-hentinya dimainkan oleh hatiku dan mimpi yang tak pernah ingin aku akhiri. 

Terima kasih telah membawa begitu banyak warna ke dalam hidupku! ✨`,
            typeSpeed: 40,
            useRandomMessage: true,   // false jika pesan diisi manual / dari link
            lastMessageIndex: -1
        };

        // DOM Elements
        const envelope = document.getElementById('envelope');
        const letterPaper = document.getElementById('letterPaper');
        const typewriterBox = document.getElementById('typewriterBox');
        const letterFooter = document.getElementById('letterFooter');
        const letterTo = document.getElementById('letterTo');
        const senderNameDisplay = document.getElementById('senderNameDisplay');
        const proposalQuestion = document.getElementById('proposalQuestion');
        const recipientHeaderTitle = document.getElementById('recipientHeaderTitle');

        const musicBtn = document.getElementById('musicBtn');
        const musicIcon = document.getElementById('musicIcon');
        const customizeBtn = document.getElementById('customizeBtn');
        const shareBtn = document.getElementById('shareBtn');

        const customModal = document.getElementById('customModal');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const customizeForm = document.getElementById('customizeForm');

        const inputTo = document.getElementById('inputTo');
        const inputFrom = document.getElementById('inputFrom');
        const inputQuestion = document.getElementById('inputQuestion');
        const inputMessage = document.getElementById('inputMessage');
        const submitBtn = document.getElementById('submitBtn');
        const submitBtnLabel = document.getElementById('submitBtnLabel');

        const yesBtn = document.getElementById('yesBtn');
        const noBtn = document.getElementById('noBtn');
        const celebrationOverlay = document.getElementById('celebrationOverlay');
        const closeCelebrationBtn = document.getElementById('closeCelebrationBtn');
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toastMsg');

        // ==========================================
        // 1. URL PARAMS ENCODING / DECODING
        // ==========================================
        function loadParamsFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('to')) state.recipient = urlParams.get('to');
            if (urlParams.has('from')) state.sender = urlParams.get('from');
            if (urlParams.has('q')) state.question = urlParams.get('q');
            if (urlParams.has('msg')) {
                state.useRandomMessage = false;
                try {
                    state.message = decodeURIComponent(escape(atob(urlParams.get('msg'))));
                } catch(e) {
                    state.message = urlParams.get('msg');
                }
            }
            updateDOMFromState();
        }

        function updateDOMFromState() {
            letterTo.textContent = `Untuk: ${state.recipient}`;
            senderNameDisplay.textContent = state.sender;
            proposalQuestion.textContent = state.question;
            recipientHeaderTitle.textContent = `Untuk ${state.recipient}`;

            inputTo.value = state.recipient;
            inputFrom.value = state.sender;
            inputQuestion.value = state.question;
            inputMessage.value = state.useRandomMessage ? '' : state.message;
        }

        // ==========================================
        // 2. WEB AUDIO SYNTHESIZER (ROMANTIC MELODY)
        // ==========================================
        let audioCtx = null;
        let melodyInterval = null;

        function initAudio() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
        }

        function playNote(freq, duration = 1.2, type = 'sine', volume = 0.08) {
            if (!audioCtx || !state.isPlayingMusic) return;

            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = type;
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

                gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start();
                osc.stop(audioCtx.currentTime + duration);
            } catch(e) {}
        }

        // Play romantic chord progression
        const notes = [
            261.63, 329.63, 392.00, 493.88, // Cmaj7 notes
            220.00, 261.63, 329.63, 392.00, // Am7 notes
            174.61, 220.00, 261.63, 349.23, // Fmaj7 notes
            196.00, 246.94, 293.66, 392.00  // G notes
        ];

        function startAmbientMusic() {
            initAudio();
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            state.isPlayingMusic = true;
            musicIcon.className = "fa-solid fa-volume-high text-rose-400 animate-pulse";

            let noteIdx = 0;
            melodyInterval = setInterval(() => {
                if (state.isPlayingMusic) {
                    playNote(notes[noteIdx % notes.length], 2.0, 'sine', 0.06);
                    if (noteIdx % 2 === 0) {
                        playNote(notes[(noteIdx + 2) % notes.length] * 1.5, 1.5, 'triangle', 0.03);
                    }
                    noteIdx++;
                }
            }, 600);
        }

        function stopAmbientMusic() {
            state.isPlayingMusic = false;
            musicIcon.className = "fa-solid fa-music text-rose-400";
            if (melodyInterval) clearInterval(melodyInterval);
        }

        musicBtn.addEventListener('click', () => {
            if (state.isPlayingMusic) {
                stopAmbientMusic();
            } else {
                startAmbientMusic();
            }
        });

        // Soft Typewriter Tick Sound
        function playTypeSound() {
            if (!audioCtx || !state.isPlayingMusic) return;
            playNote(800 + Math.random() * 200, 0.05, 'sine', 0.015);
        }

        // Envelope Open Rustle Sound
        function playOpenSound() {
            initAudio();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            playNote(400, 0.6, 'triangle', 0.1);
            setTimeout(() => playNote(600, 0.8, 'sine', 0.1), 150);
            setTimeout(() => playNote(800, 1.0, 'sine', 0.08), 300);
        }

        // Celebration Fanfare Sound
        function playCelebrationSound() {
            initAudio();
            const fanfare = [523.25, 659.25, 783.99, 1046.50];
            fanfare.forEach((f, i) => {
                setTimeout(() => playNote(f, 1.5, 'triangle', 0.15), i * 150);
            });
        }

        // ==========================================
        // 3. TYPEWRITER ANIMATION
        // ==========================================
        let typingTimeout = null;

        function startTypewriter(text, onComplete) {
            clearTimeout(typingTimeout);
            typewriterBox.textContent = '';
            typewriterBox.classList.add('typewriter-cursor');
            state.isTyping = true;
            letterFooter.style.opacity = '0';

            let index = 0;

            function typeNextChar() {
                if (index < text.length) {
                    typewriterBox.textContent += text.charAt(index);
                    if (text.charAt(index) !== ' ' && text.charAt(index) !== '\n') {
                        playTypeSound();
                    }
                    index++;
                    typingTimeout = setTimeout(typeNextChar, state.typeSpeed);
                } else {
                    typewriterBox.classList.remove('typewriter-cursor');
                    state.isTyping = false;
                    letterFooter.style.opacity = '1';
                    if (onComplete) onComplete();
                }
            }

            typeNextChar();
        }

        // Pilih pesan acak (tidak sama dengan pesan sebelumnya)
        function pickRandomMessage() {
            if (!Array.isArray(letterMessages) || letterMessages.length === 0) return state.message;
            let idx;
            do {
                idx = Math.floor(Math.random() * letterMessages.length);
            } while (letterMessages.length > 1 && idx === state.lastMessageIndex);
            state.lastMessageIndex = idx;
            return letterMessages[idx];
        }

        // ==========================================
        // 4. INTERACTIVE ENVELOPE OPENING
        // ==========================================
        envelope.addEventListener('click', (e) => {
            // Prevent trigger if clicking buttons inside letter paper
            if (e.target.closest('button')) return;

            if (!state.isOpen) {
                state.isOpen = true;
                envelope.classList.add('open');
                playOpenSound();

                if (state.useRandomMessage) {
                    state.message = pickRandomMessage();
                }

                if (!state.isPlayingMusic) {
                    startAmbientMusic();
                }

                // Start typewriter typing after flap animation finishes
                setTimeout(() => {
                    startTypewriter(state.message);
                }, 800);
            }
        });

        function resetLetter() {
            state.isOpen = false;
            clearTimeout(typingTimeout);
            envelope.classList.remove('open');
            typewriterBox.textContent = '';
            letterFooter.style.opacity = '0';
            resetNoButton();
        }

        // ==========================================
        // 5. PLAYFUL DODGING "NO" BUTTON
        // ==========================================
        // Kalimat yang muncul saat tombol "Tidak" didekati/diklik.
        // Makin sering dikejar, makin "memaksa" kalimatnya.
        const noPhrases = {
            early: [
                "Kamu yakin? 🥺",
                "Coba lagi! 😉",
                "Salah tombol, sayang! 💕",
                "Eits, tombolnya malu-malu! 🙈",
                "Hampir! Tapi belum beruntung 😜",
                "Tombolnya lagi nggak mau diklik~ 🎀",
                "Kok kamu tega sih? 😢",
                "Ups, dia kabur duluan! 💨"
            ],
            mid: [
                "Hanya boleh pilih IYA! ✨",
                "Tombol IYA-nya lebih cantik, lho 😘",
                "Jangan nyerah, klik yang kiri aja~ 👈",
                "Hatiku sudah bilang kamu mau 💘",
                "Kamu lucu banget kalau lagi usaha gitu 🥰",
                "Ayolah, sekali ini aja jawab IYA 🥹",
                "Jawabannya cuma satu, kok! 💖",
                "Kamu pikir bakal semudah itu? 😏"
            ],
            late: [
                "Wah, kamu keras kepala juga ya 😆",
                "Capek nggak ngejar terus? Klik IYA aja 🫶",
                "Tombol ini sudah pensiun, jangan dikejar 🏖️",
                "Aku bisa nunggu sampai kamu bilang IYA 💌",
                "Sudah ${n} kali loh... tetap nggak bisa 😂",
                "Tombol ini dibuat khusus supaya nggak bisa diklik 🔒",
                "Menyerah aja, takdir bilang IYA ✨",
                "Oke oke, kamu hebat. Sekarang klik IYA ya? 🥰"
            ]
        };

        const noLabels = ["Tidak", "Yakin?", "Hmm...", "Coba lagi", "Nggak bisa 😜", "Mustahil!", "Kejar aku!", "Hehe 🙈", "Ih!", "Nggak mau~"];

        let noAttempts = 0;
        let lastNoPhrase = '';
        let lastNoLabel = 'Tidak';
        let noOffset = { x: 0, y: 0 };
        let lastDodgeTime = 0;
        const pointer = { x: -9999, y: -9999 };

        // Pilih elemen acak dari array yang tidak sama dengan sebelumnya
        function pickDifferent(list, last) {
            if (list.length < 2) return list[0];
            let item;
            do { item = list[Math.floor(Math.random() * list.length)]; } while (item === last);
            return item;
        }

        function nextNoPhrase() {
            const tier = noAttempts < 5 ? noPhrases.early : noAttempts < 12 ? noPhrases.mid : noPhrases.late;
            const phrase = pickDifferent(tier, lastNoPhrase);
            lastNoPhrase = phrase;
            return phrase.replace('${n}', noAttempts);
        }

        function rectsOverlap(a, b, margin) {
            return !(a.right + margin < b.left || a.left - margin > b.right ||
                     a.bottom + margin < b.top || a.top - margin > b.bottom);
        }

        // Transisi cepat supaya tombol terasa "kabur" dengan sigap
        noBtn.style.transition = 'transform 0.1s cubic-bezier(0.2, 0.9, 0.3, 1.1), background-color 0.2s';
        noBtn.style.willChange = 'transform';

        function dodgeNoButton() {
            const now = performance.now();
            if (now - lastDodgeTime < 60) return;   // cegah getar berlebihan
            lastDodgeTime = now;

            noAttempts++;

            // Posisi dasar tombol (tanpa translate). Pakai nilai translate yang
            // sedang berlaku, bukan noOffset, supaya akurat walau animasi belum selesai.
            const cur = noBtn.getBoundingClientRect();
            const w = cur.width, h = cur.height;
            const m = new DOMMatrix(getComputedStyle(noBtn).transform);
            const baseLeft = cur.left - m.m41;
            const baseTop = cur.top - m.m42;

            // Area aman: di dalam kotak pertanyaan, di bawah teks pertanyaan,
            // dan tetap terlihat di layar serta di dalam kertas surat.
            const row = noBtn.parentElement.getBoundingClientRect();
            const card = noBtn.parentElement.parentElement.getBoundingClientRect();
            const paper = letterPaper.getBoundingClientRect();
            const vw = window.innerWidth, vh = window.innerHeight;

            const safe = {
                left:   Math.max(card.left + 6,  paper.left + 16, 10),
                right:  Math.min(card.right - 6, paper.right - 16, vw - 10),
                top:    Math.max(row.top - 6,    paper.top + 16, 10),
                bottom: Math.min(card.bottom - 6, paper.bottom - 16, vh - 10)
            };

            const minX = safe.left - baseLeft;
            const maxX = safe.right - w - baseLeft;
            const minY = safe.top - baseTop;
            const maxY = safe.bottom - h - baseTop;

            const yesRect = yesBtn.getBoundingClientRect();
            let best = null, bestScore = -1;

            for (let i = 0; i < 30; i++) {
                const x = minX + Math.random() * Math.max(0, maxX - minX);
                const y = minY + Math.random() * Math.max(0, maxY - minY);
                const rect = {
                    left: baseLeft + x, top: baseTop + y,
                    right: baseLeft + x + w, bottom: baseTop + y + h
                };
                if (rectsOverlap(rect, yesRect, 8)) continue;

                const cx = rect.left + w / 2, cy = rect.top + h / 2;
                const dCur = Math.hypot(x - noOffset.x, y - noOffset.y);
                const dPtr = Math.hypot(cx - pointer.x, cy - pointer.y);
                const score = Math.min(dCur, dPtr);   // jauh dari posisi lama & dari kursor
                if (score > bestScore) { bestScore = score; best = { x, y }; }
            }

            if (!best) best = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };

            noOffset = best;
            noBtn.style.transform = `translate(${best.x}px, ${best.y}px)`;

            // Ganti tulisan tombol & munculkan kalimat acak
            lastNoLabel = pickDifferent(noLabels, lastNoLabel);
            noBtn.textContent = lastNoLabel;
            showToast(nextNoPhrase());
        }

        noBtn.addEventListener('pointerenter', dodgeNoButton);
        noBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); dodgeNoButton(); });
        noBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); dodgeNoButton(); });
        noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); dodgeNoButton(); }, { passive: false });

        // Kabur sebelum kursor menyentuh tombol (radius 70px)
        document.addEventListener('pointermove', (e) => {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            if (!state.isOpen || e.pointerType === 'touch') return;
            const r = noBtn.getBoundingClientRect();
            if (r.width === 0) return;
            const near = 70;
            if (e.clientX > r.left - near && e.clientX < r.right + near &&
                e.clientY > r.top - near && e.clientY < r.bottom + near) {
                dodgeNoButton();
            }
        });

        // Reset posisi/label tombol saat surat ditutup ulang
        function resetNoButton() {
            noAttempts = 0;
            noOffset = { x: 0, y: 0 };
            noBtn.style.transform = '';
            noBtn.textContent = 'Tidak';
            lastNoLabel = 'Tidak';
        }

        // ==========================================
        // 6. YES BUTTON CELEBRATION & CONFETTI
        // ==========================================
        yesBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            playCelebrationSound();

            // Trigger Canvas Confetti
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#ff2a6d', '#ff758c', '#ffd166', '#ffffff']
                });

                // Heart confetti bursts
                setTimeout(() => {
                    confetti({
                        particleCount: 50,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 }
                    });
                    confetti({
                        particleCount: 50,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 }
                    });
                }, 300);
            }

            // Display Celebration Overlay
            setTimeout(() => {
                celebrationOverlay.classList.remove('opacity-0', 'pointer-events-none');
            }, 600);
        });

        closeCelebrationBtn.addEventListener('click', () => {
            celebrationOverlay.classList.add('opacity-0', 'pointer-events-none');
            resetLetter();
        });

        // ==========================================
        // 7. CUSTOMIZATION MODAL & FORM
        // ==========================================
        customizeBtn.addEventListener('click', () => {
            customModal.classList.remove('opacity-0', 'pointer-events-none');
        });

        closeModalBtn.addEventListener('click', () => {
            customModal.classList.add('opacity-0', 'pointer-events-none');
        });

        const WEB3FORMS_KEY = 'dc4997a3-02b4-44ac-ad4a-f3fb372487c5';

        customizeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            state.recipient = inputTo.value.trim() || 'Cintaku';
            state.sender = inputFrom.value.trim() || 'Pengagum Rahasiamu';
            state.question = inputQuestion.value.trim() || 'Maukah kamu jadi milikku? ❤️';
            const newMessage = inputMessage.value.trim();
            if (newMessage) {
                state.message = newMessage;
                state.useRandomMessage = false;
            } else {
                state.useRandomMessage = true;   // kosong = surat diisi pesan acak
            }

            // Kirim ke Web3Forms
            submitBtn.disabled = true;
            submitBtnLabel.textContent = 'Mengirim...';
            try {
                const res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({
                        access_key: WEB3FORMS_KEY,
                        subject: `💌 Surat baru dari ${state.sender} untuk ${state.recipient}`,
                        from_name: state.sender,
                        untuk: state.recipient,
                        dari: state.sender,
                        pertanyaan: state.question,
                        pesan: state.useRandomMessage ? '(kosong - memakai pesan acak)' : state.message
                    })
                });
                const data = await res.json();
                if (!res.ok || !data.success) throw new Error(data.message || 'Gagal mengirim');

                updateDOMFromState();
                customModal.classList.add('opacity-0', 'pointer-events-none');
                showToast('Pesan kamu tersampaikan🤫');
                resetLetter();
            } catch (err) {
                showToast('Gagal mengirim, coba lagi ya 🥺');
            } finally {
                submitBtn.disabled = false;
                submitBtnLabel.textContent = 'Kirim';
            }
        });

        // ==========================================
        // 8. LINK SHARING SYSTEM
        // ==========================================
        shareBtn.addEventListener('click', () => {
            showToast('Fitur ini masih dalam perbaikan😁');
        });

        // ==========================================
        // TOOLTIP CARA PAKAI
        // ==========================================
        const helpBtn = document.getElementById('helpBtn');
        const helpTip = document.getElementById('helpTip');
        const helpCloseBtn = document.getElementById('helpCloseBtn');

        function setHelp(open) {
            helpTip.classList.toggle('opacity-0', !open);
            helpTip.classList.toggle('pointer-events-none', !open);
            helpTip.classList.toggle('-translate-y-2', !open);
            helpBtn.setAttribute('aria-expanded', String(open));
        }
        helpBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            setHelp(helpTip.classList.contains('opacity-0'));
        });
        helpCloseBtn.addEventListener('click', () => setHelp(false));
        helpTip.addEventListener('click', (e) => e.stopPropagation());
        document.addEventListener('click', () => setHelp(false));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setHelp(false); });

        let toastTimer;
        function showToast(msg) {
            toastMsg.textContent = msg;
            toast.classList.remove('translate-y-20', 'opacity-0');
            clearTimeout(toastTimer);
            toastTimer = setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 3000);
        }

        // ==========================================
        // 9. BACKGROUND SPARKLE & FLOATING HEARTS CANVAS
        // ==========================================
        const canvas = document.getElementById('bgCanvas');
        const ctx = canvas.getContext('2d');

        let particles = [];
        let width, height;

        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = height + Math.random() * 100;
                this.size = Math.random() * 12 + 6;
                this.speedY = Math.random() * 1.2 + 0.4;
                this.speedX = (Math.random() - 0.5) * 0.8;
                this.opacity = Math.random() * 0.6 + 0.2;
                this.type = Math.random() > 0.4 ? 'heart' : 'sparkle';
                this.rotation = Math.random() * Math.PI * 2;
                this.rotSpeed = (Math.random() - 0.5) * 0.02;
            }

            update() {
                this.y -= this.speedY;
                this.x += this.speedX;
                this.rotation += this.rotSpeed;

                if (this.y < -20) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.globalAlpha = this.opacity;

                if (this.type === 'heart') {
                    ctx.fillStyle = '#ff2a6d';
                    ctx.beginPath();
                    const topCurveHeight = this.size * 0.3;
                    ctx.moveTo(0, topCurveHeight);
                    // Heart Bezier Curves
                    ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
                    ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
                    ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
                    ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    // Glowing Star Sparkle
                    ctx.fillStyle = '#ffd166';
                    ctx.beginPath();
                    for (let i = 0; i < 4; i++) {
                        ctx.lineTo(Math.cos((i * Math.PI) / 2) * this.size * 0.5, Math.sin((i * Math.PI) / 2) * this.size * 0.5);
                        ctx.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * this.size * 0.15, Math.sin((i * Math.PI) / 2 + Math.PI / 4) * this.size * 0.15);
                    }
                    ctx.closePath();
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        // Mouse Trail Interactive Glitter
        window.addEventListener('mousemove', (e) => {
            if (Math.random() > 0.6) {
                const p = new Particle();
                p.x = e.clientX;
                p.y = e.clientY;
                p.speedY = Math.random() * 0.8 + 0.2;
                p.size = Math.random() * 8 + 4;
                particles.push(p);
                if (particles.length > 80) particles.shift();
            }
        });

        // Initialize particles
        for (let i = 0; i < 45; i++) {
            const p = new Particle();
            p.y = Math.random() * height;
            particles.push(p);
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateCanvas);
        }

        // Initialize app on load
        window.onload = function() {
            loadParamsFromURL();
            animateCanvas();
        };

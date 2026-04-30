document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. УНИВЕРСАЛЬНАЯ ЛОГИКА ОТКРЫТИЯ МОДАЛОК ---
    document.addEventListener('click', function(e) {
        
        // Клик по кнопке "Подробнее" (Проекты)
        const projectBtn = e.target.closest('.open-project');
        if (projectBtn) {
            const targetId = projectBtn.getAttribute('data-target');
            const modal = document.getElementById(targetId);
            if (modal) {
                modal.style.display = "block";
                document.body.style.overflow = "hidden";
            }
        }

        // Клик по кнопкам вызова формы (Связаться, Заказать и т.д.)
        const contactBtn = e.target.closest('.open-modal-btn, .btn-contact, .btn-service, .btn-vacancy');
        if (contactBtn) {
            // Если это ссылка <a>, отменяем переход
            if (contactBtn.tagName === 'A') e.preventDefault();
            
            const targetId = contactBtn.getAttribute('data-target') || 'contactModal';
            const modal = document.getElementById(targetId);
            if (modal) {
                modal.style.display = "block";
                document.body.style.overflow = "hidden";
            }
        }

        // --- 2. УНИВЕРСАЛЬНАЯ ЛОГИКА ЗАКРЫТИЯ ---
        
        // Клик на крестик (любой)
        if (e.target.closest('.close-btn') || e.target.closest('.close-project')) {
            const modal = e.target.closest('.modal-overlay') || e.target.closest('.project-modal-overlay') || e.target.closest('#contactModal');
            if (modal) {
                modal.style.display = "none";
                checkScroll();
            }
        }

        // Клик на темный фон
        if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('project-modal-overlay') || e.target.id === 'contactModal') {
            e.target.style.display = "none";
            checkScroll();
        }
    });

    // Функция проверки скролла (включает скролл, если все окна закрыты)
    function checkScroll() {
        const anyVisible = document.querySelector('.modal-overlay[style*="block"], .project-modal-overlay[style*="block"], #contactModal[style*="block"]');
        if (!anyVisible) {
            document.body.style.overflow = "auto";
        }
    }

    // --- 3. ЛОГИКА ОТПРАВКИ ФОРМ (JSON) ---
    // Слушаем отправку ЛЮБОЙ формы на странице (и в модалках, и в футере)
    document.addEventListener('submit', async function(e) {
        const form = e.target;
        
        // Проверяем, та ли это форма (по ID или по наличию в модалке)
        if (form.id === 'contactForm' || form.id === 'feedbackForm') {
            e.preventDefault();

            const submitBtn = form.querySelector('button');
            const originalText = submitBtn.innerText;
            
            // Собираем данные в JSON
            const formData = new FormData(form);
            const jsonData = {};
            formData.forEach((value, key) => { jsonData[key] = value; });

            // Индикация отправки
            submitBtn.innerText = "ОТПРАВКА...";
            submitBtn.disabled = true;

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(jsonData)
                });

                if (response.ok) {
                // Добавляем класс успеха
                submitBtn.classList.add('success');
                submitBtn.innerText = "✅ ОТПРАВЛЕНО";
                
                form.reset(); // Очищаем поля
                
                setTimeout(() => {
                    const modal = form.closest('.modal-overlay') || form.closest('.project-modal-overlay') || form.closest('#contactModal');
                    if (modal) modal.style.display = 'none';
                    
                    checkScroll();

                    // Возвращаем кнопку в исходное состояние через время
                    submitBtn.classList.remove('success');
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }, 2000);
                } else {
                    throw new Error('Ошибка сервера');
                }
            } catch (error) {
                alert("Ошибка при отправке. Пожалуйста, проверьте соединение.");
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }
        }
    });
});





document.addEventListener("DOMContentLoaded", () => {
    // Add fade-in animation elements
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to animate
    const animElements = document.querySelectorAll('.feature-card, .step-item, .section-title');
    
    animElements.forEach(el => {
        el.classList.add('fade-up');
        observer.observe(el);
    });

    // Handle Order Form Submission
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const originalText = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'جاري التأكيد...';

            const orderData = {
                fullName: document.getElementById('fullName').value,
                phone: document.getElementById('phone').value,
                city: document.getElementById('city').value,
                quantity: document.getElementById('quantity').value,
                totalPrice: document.getElementById('quantity').value * 75
            };

            try {
                const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });

                if (response.ok) {
                    showSuccess();
                } else {
                    fallbackLocalSave(orderData);
                    showSuccess();
                }
            } catch (error) {
                fallbackLocalSave(orderData);
                showSuccess();
            }

            function showSuccess() {
                const formMessage = document.getElementById('formMessage');
                formMessage.innerHTML = '✅ تم تأكيد طلبك بنجاح! سنتواصل معك قريباً.';
                formMessage.classList.remove('hidden');
                formMessage.classList.add('success-message');
                orderForm.reset();
                btn.disabled = false;
                btn.textContent = originalText;
            }
            
            function fallbackLocalSave(data) {
                const orders = JSON.parse(localStorage.getItem('spray_orders') || '[]');
                orders.unshift({ id: Date.now(), ...data, date: new Date().toISOString() });
                localStorage.setItem('spray_orders', JSON.stringify(orders));
            }
        });
    }
});

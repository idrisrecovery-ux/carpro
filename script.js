document.addEventListener('DOMContentLoaded', function() {
    // --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ---
    let carDetails = {};
    let currentCarPhotos = [];
    let currentPhotoIndex = 0;
    let filteredCars = [];
    let currentCar = null;

    // --- 1. ПРИМЕНЕНИЕ НАСТРОЕК САЙТА ---
    function applySiteSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('siteSettings'));
            if (settings) {
                if (settings.siteTitle) {
                    document.title = settings.siteTitle;
                    const headerH1 = document.querySelector('header h1');
                    if (headerH1) headerH1.textContent = settings.siteTitle;
                }
                if (settings.heroTitle) {
                    const heroH2 = document.querySelector('.hero-content h2');
                    if (heroH2) heroH2.textContent = settings.heroTitle;
                }
                if (settings.heroSubtitle) {
                    const heroP = document.querySelector('.hero-content p');
                    if (heroP) heroP.textContent = settings.heroSubtitle;
                }
                if (settings.heroButtonText) {
                    const heroBtn = document.querySelector('.hero-content .btn');
                    if (heroBtn) heroBtn.textContent = settings.heroButtonText;
                }
                if (settings.collectionTitle) {
                    const collectionH2 = document.getElementById('collection');
                    if (collectionH2) collectionH2.textContent = settings.collectionTitle;
                }
                if (settings.footerText) {
                    const footerP = document.querySelector('footer .container p');
                    if (footerP) footerP.textContent = settings.footerText;
                }
            }
        } catch (e) {
            console.warn('Error applying settings:', e);
        }
    }

    // --- 2. ЗАГРУЗКА ДАННЫХ ---
    function loadCarDetails() {
        const savedCars = localStorage.getItem('premiumAutoGalleryCars');
        if (savedCars) {
            carDetails = JSON.parse(savedCars);
        } else {
            carDetails = getDefaultCarData();
            saveCarDetails();
        }
        filteredCars = Object.values(carDetails);
    }

    // СТАНДАРТНЫЕ ДАННЫЕ (Только необходимые поля)
    function getDefaultCarData() {
        return {
            mercedes1: { id: "mercedes1", title: "Mercedes A180", brand: "mercedes", price: "23900 AZN", year: "2015", mileage: "193412 km", engine: "1.5L Diesel", photos: ["images/a180/1.jpg", "images/a180/2.jpg", "images/a180/3.jpg", "images/a180/4.jpg", "images/a180/5.jpg"], videos: ["images/a180/vid1.mp4"] },
            mercedes2: { id: "mercedes2", title: "Mercedes E300", brand: "mercedes", price: "56000 AZN", year: "2019", mileage: "162671 km", engine: "2.0L Benzin", photos: ["images/e300/1.jpg", "images/e300/2.jpg", "images/e300/3.jpg", "images/e300/4.jpg", "images/e300/5.jpg"], videos: ["images/e300/vid1.mp4", "images/e300/vid2.mp4", "images/e300/vid3.mp4"] },
            toyota1: { id: "toyota1", title: "Toyota Aqua", brand: "toyota", price: "16500 AZN", year: "2018", mileage: "211982 km", engine: "1.5L Hybrid", photos: ["images/aqua8339/1.jpg", "images/aqua8339/2.jpg", "images/aqua8339/3.jpg", "images/aqua8339/4.jpg", "images/aqua8339/5.jpg"], videos: ["images/aqua8339/vid1.mp4", "images/aqua8339/vid2.mp4"] },
            kia1: { id: "kia1", title: "Kia Carnival", brand: "kia", price: "28000 AZN", year: "2015", mileage: "127413 km", engine: "2.2L Diesel", photos: ["images/carnival/1.jpg", "images/carnival/2.jpg", "images/carnival/3.jpg", "images/carnival/4.jpg", "images/carnival/5.jpg"], videos: ["images/carnival/vid1.mp4"] },
            hyundai1: { id: "hyundai1", title: "Hyundai Palisade", brand: "hyundai", price: "53500 AZN", year: "2019", mileage: "190671 km", engine: "2.2L Diesel", photos: ["images/palisade/1.jpg", "images/palisade/2.jpg", "images/palisade/3.jpg", "images/palisade/4.jpg", "images/palisade/5.jpg"], videos: ["images/palisade/vid1.mp4"] },
            hyundai2: { id: "hyundai2", title: "Hyundai Maxcruz", brand: "hyundai", price: "33500 AZN", year: "2016", mileage: "105992 km", engine: "2.2L Diesel", photos: ["images/maxcruz/1.jpg", "images/maxcruz/2.jpg", "images/maxcruz/3.jpg", "images/maxcruz/4.jpg", "images/maxcruz/5.jpg"], videos: [] },
            landrover1: { id: "landrover1", title: "Land Rover Freelander 2", brand: "landrover", price: "19900 AZN", year: "2011", mileage: "150000 km", engine: "2.2L Diesel", photos: ["images/landrover/1.jpg", "images/landrover/2.jpg", "images/landrover/3.jpg", "images/landrover/4.jpg", "images/landrover/5.jpg"], videos: ["images/landrover/vid1.mp4"] }
        };
    }

    function saveCarDetails() {
        localStorage.setItem('premiumAutoGalleryCars', JSON.stringify(carDetails));
    }

    // --- 3. ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ---
    function initCarsGrid() {
        applySiteSettings();
        loadCarDetails();
        renderCarsGrid(filteredCars);
        setupEventListeners();
    }
    
    // --- 4. НАСТРОЙКА СЛУШАТЕЛЕЙ СОБЫТИЙ ---
    function setupEventListeners() {
        // Фильтры
        document.getElementById('searchInput').addEventListener('input', filterCars);
        document.getElementById('priceFilter').addEventListener('change', filterCars);
        document.getElementById('yearFilter').addEventListener('change', filterCars);
        document.getElementById('engineFilter').addEventListener('change', filterCars);
        
        // Кнопки брендов
        document.querySelectorAll('.brand-btn').forEach(button => {
            button.addEventListener('click', function() {
                document.querySelectorAll('.brand-btn').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                filterCars();
            });
        });

        // Закрытие модалок по клику на фон
        document.getElementById('carModal').addEventListener('click', function(e) {
            if (e.target === this) closeCarModal();
        });

        // Навигация галереи
        document.getElementById('prevPhoto').addEventListener('click', function() {
            if (currentPhotoIndex > 0) {
                currentPhotoIndex--;
                updateFullscreenGallery();
            }
        });
        document.getElementById('nextPhoto').addEventListener('click', function() {
            if (currentPhotoIndex < currentCarPhotos.length - 1) {
                currentPhotoIndex++;
                updateFullscreenGallery();
            }
        });
        document.getElementById('closeFullscreen').addEventListener('click', closeFullscreenGallery);

        // Клавиатура
        document.addEventListener('keydown', function(e) {
            if (document.getElementById('fullscreenGallery').style.display === 'flex') {
                if (e.key === 'ArrowLeft' && currentPhotoIndex > 0) { currentPhotoIndex--; updateFullscreenGallery(); }
                if (e.key === 'ArrowRight' && currentPhotoIndex < currentCarPhotos.length - 1) { currentPhotoIndex++; updateFullscreenGallery(); }
                if (e.key === 'Escape') closeFullscreenGallery();
            } else if (document.getElementById('carModal').style.display === 'flex' && e.key === 'Escape') {
                closeCarModal();
            }
        });
    }
    
    // --- 5. РЕНДЕР СПИСКА МАШИН ---
    function renderCarsGrid(cars) {
        const carsContainer = document.getElementById('carsContainer');
        if (!carsContainer) return;

        if (cars.length === 0) {
            carsContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #7f8c8d;">
                    <h3>No vehicles found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            `;
            return;
        }
        
        carsContainer.innerHTML = '';
        
        // Отображаем новые первыми
        [...cars].reverse().forEach(car => {
            const photo = (car.photos && car.photos.length > 0) ? car.photos[0] : 'https://via.placeholder.com/350x220?text=No+Image';
            
            const carCard = document.createElement('div');
            carCard.className = 'car-card';
            carCard.dataset.brand = car.brand;
            carCard.innerHTML = `
                <div class="car-image" style="background-image: url('${photo}')" onerror="this.style.backgroundImage='url(https://via.placeholder.com/350x220?text=Image+Not+Found)'"></div>
                <div class="car-details">
                    <h3 class="car-title">${car.title}</h3>
                    <div class="car-price">${car.price}</div>
                    <div class="car-specs">
                        <span><i class="fas fa-calendar-alt"></i> ${car.year}</span>
                        <span><i class="fas fa-tachometer-alt"></i> ${car.mileage || ''}</span>
                        <span><i class="fas fa-gas-pump"></i> ${car.engine}</span>
                    </div>
                    <button class="btn view-details" data-car="${car.id}">View Details</button>
                </div>
            `;
            carsContainer.appendChild(carCard);
        });
        
        // Подключаем кнопки
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', function() {
                openCarModal(this.getAttribute('data-car'));
            });
        });
    }
    
    // --- 6. ЛОГИКА ФИЛЬТРАЦИИ ---
    function filterCars() {
        const search = document.getElementById('searchInput').value.toLowerCase();
        const priceFilter = document.getElementById('priceFilter').value;
        const yearFilter = document.getElementById('yearFilter').value;
        const engineFilter = document.getElementById('engineFilter').value;
        const activeBrand = document.querySelector('.brand-btn.active').getAttribute('data-brand');
        
        filteredCars = Object.values(carDetails).filter(car => {
            // Бренд
            if (activeBrand !== 'all' && car.brand !== activeBrand) return false;
            
            // Поиск
            const matchesSearch = !search || 
                car.title.toLowerCase().includes(search) ||
                car.brand.toLowerCase().includes(search);
            if (!matchesSearch) return false;
            
            // Год
            if (yearFilter && car.year != yearFilter) return false;
            
            // Двигатель
            if (engineFilter && !car.engine.toLowerCase().includes(engineFilter)) return false;
            
            // Цена
            if (priceFilter) {
                const p = parseInt(car.price.replace(/[^0-9]/g, '')) || 0;
                const [min, max] = priceFilter.split('-').map(Number);
                if (p < min || p > max) return false;
            }
            
            return true;
        });
        
        renderCarsGrid(filteredCars);
    }

    // --- 7. МОДАЛЬНОЕ ОКНО (ЧИСТАЯ ВЕРСИЯ) ---
    function openCarModal(carId) {
        currentCar = carDetails[carId];
        if (!currentCar) return;
        currentCarPhotos = currentCar.photos || [];
        
        const modal = document.getElementById('carModal');
        const content = document.getElementById('carModalContent');
        
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        
        // Скролл вверх при открытии
        setTimeout(() => {
            modal.scrollTop = 0;
            content.scrollTop = 0;
        }, 50);

        // Генерируем HTML для фото
        let photosHTML = '';
        if (currentCarPhotos.length > 0) {
            currentCarPhotos.forEach((src, i) => {
                photosHTML += `
                    <div class="gallery-item-container">
                        <div class="gallery-item" style="background-image: url('${src}')" data-index="${i}"></div>
                        <button class="download-single" data-src="${src}" data-filename="photo_${i+1}.jpg">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                `;
            });
        } else {
            photosHTML = '<p>No photos available</p>';
        }

        // Генерируем HTML для видео
        let videosHTML = '';
        if (currentCar.videos && currentCar.videos.length > 0) {
            videosHTML += '<div class="car-gallery-section"><h4 class="gallery-title">Videos</h4><div class="video-gallery">';
            currentCar.videos.forEach((src, i) => {
                videosHTML += `
                    <div class="video-item">
                        <video controls>
                            <source src="${src}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        <button class="download-single" data-src="${src}" data-filename="video_${i+1}.mp4" style="margin-top:10px;">
                            <i class="fas fa-download"></i> Download
                        </button>
                    </div>
                `;
            });
            videosHTML += '</div></div>';
        }

        // Собираем контент модалки (БЕЗ Description и Features)
        content.innerHTML = `
            <button class="modal-close-top" id="modalCloseTop">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="car-details-header">
                <h3>${currentCar.title}</h3>
                <div class="car-price">${currentCar.price}</div>
                <div class="car-specs" style="display: flex; gap: 2rem; margin-top: 1rem; flex-wrap: wrap; color: #7f8c8d;">
                    <span><i class="fas fa-calendar-alt"></i> ${currentCar.year}</span>
                    <span><i class="fas fa-tachometer-alt"></i> ${currentCar.mileage || ''}</span>
                    <span><i class="fas fa-gas-pump"></i> ${currentCar.engine}</span>
                </div>
            </div>
            
            <div class="car-details-content" style="padding-top: 1rem;">
                <div class="car-gallery-section">
                    <h4 class="gallery-title">Photo Gallery (${currentCarPhotos.length})</h4>
                    
                    <div class="gallery-actions">
                        ${currentCarPhotos.length > 0 ? `
                            <button class="btn btn-secondary" id="downloadAllPhotos">
                                <i class="fas fa-download"></i> Download All Photos
                            </button>
                        ` : ''}
                        ${currentCar.videos && currentCar.videos.length > 0 ? `
                            <button class="btn btn-tertiary" id="downloadAllVideos">
                                <i class="fas fa-download"></i> Download All Videos
                            </button>
                        ` : ''}
                        <div id="downloadProgress" class="download-progress" style="display: none;">
                            Preparing download...
                        </div>
                    </div>
                    
                    <div class="photo-gallery">
                        ${photosHTML}
                    </div>
                </div>
                
                ${videosHTML}
                
                <button class="close-modal" id="closeModalBottom" style="margin-top: 2rem;">Close Details</button>
            </div>
        `;

        // Вешаем обработчики
        document.getElementById('modalCloseTop').onclick = closeCarModal;
        document.getElementById('closeModalBottom').onclick = closeCarModal;
        
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.onclick = function() {
                openFullscreenGallery(parseInt(this.getAttribute('data-index')));
            };
        });
        
        document.querySelectorAll('.download-single').forEach(btn => {
            btn.onclick = function() {
                downloadSingleFile(this.getAttribute('data-src'), this.getAttribute('data-filename'));
            };
        });

        if (document.getElementById('downloadAllPhotos')) {
            document.getElementById('downloadAllPhotos').onclick = function() {
                downloadAllPhotos(currentCar);
            };
        }
        if (document.getElementById('downloadAllVideos')) {
            document.getElementById('downloadAllVideos').onclick = function() {
                downloadAllVideos(currentCar);
            };
        }
    }

    function closeCarModal() {
        document.getElementById('carModal').style.display = 'none';
        document.body.classList.remove('modal-open');
        currentCar = null;
    }

    // --- 8. ФУНКЦИИ СКАЧИВАНИЯ ---
    function downloadSingleFile(src, filename) {
        try {
            const link = document.createElement('a');
            link.href = src;
            link.download = filename;
            link.target = '_blank';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showDownloadNotification(filename);
        } catch (error) {
            // Fallback если прямая ссылка не работает (например, cross-origin)
            window.open(src, '_blank');
        }
    }

    function showDownloadNotification(filename) {
        const notification = document.createElement('div');
        notification.className = 'download-notification';
        notification.innerHTML = `<i class="fas fa-check-circle"></i> Downloading: ${filename}`;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // --- 9. ПОЛНОЭКРАННАЯ ГАЛЕРЕЯ ---
    function openFullscreenGallery(index) {
        currentPhotoIndex = index;
        updateFullscreenGallery();
        document.getElementById('fullscreenGallery').style.display = 'flex';
    }

    function updateFullscreenGallery() {
        const content = document.getElementById('fullscreenContent');
        content.innerHTML = `<img src="${currentCarPhotos[currentPhotoIndex]}" style="max-width: 100%; max-height: 90vh; border-radius: 8px;">`;
        document.getElementById('galleryCounter').textContent = `${currentPhotoIndex + 1} / ${currentCarPhotos.length}`;
    }

    function closeFullscreenGallery() {
        document.getElementById('fullscreenGallery').style.display = 'none';
    }

    // --- 10. МАССОВОЕ СКАЧИВАНИЕ (JSZip) ---
    async function downloadAllPhotos(car) {
        const btn = document.getElementById('downloadAllPhotos');
        const progress = document.getElementById('downloadProgress');
        if (!btn) return;
        
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        progress.style.display = 'block';
        progress.className = 'download-progress';
        progress.textContent = 'Starting download...';
        
        try {
            const zip = new JSZip();
            const folder = zip.folder(`${car.title} Photos`);
            
            for (let i = 0; i < car.photos.length; i++) {
                progress.textContent = `Loading photo ${i+1} of ${car.photos.length}...`;
                const response = await fetch(car.photos[i]);
                if (!response.ok) throw new Error('Network error');
                const blob = await response.blob();
                folder.file(`photo_${i+1}.jpg`, blob);
            }
            
            progress.textContent = 'Creating ZIP file...';
            const content = await zip.generateAsync({type: 'blob'});
            saveAs(content, `${car.title.replace(/\s+/g, '_')}_Photos.zip`);
            
            progress.textContent = 'Done!';
            progress.className = 'download-progress download-success';
        } catch (error) {
            console.error(error);
            progress.textContent = 'Error downloading photos.';
            progress.className = 'download-progress download-error';
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-download"></i> Download All Photos';
            setTimeout(() => { progress.style.display = 'none'; }, 5000);
        }
    }

    async function downloadAllVideos(car) {
        const btn = document.getElementById('downloadAllVideos');
        const progress = document.getElementById('downloadProgress');
        if (!btn) return;
        
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        progress.style.display = 'block';
        progress.className = 'download-progress';
        progress.textContent = 'Starting download...';
        
        try {
            const zip = new JSZip();
            const folder = zip.folder(`${car.title} Videos`);
            
            for (let i = 0; i < car.videos.length; i++) {
                progress.textContent = `Loading video ${i+1} of ${car.videos.length}...`;
                const response = await fetch(car.videos[i]);
                if (!response.ok) throw new Error('Network error');
                const blob = await response.blob();
                folder.file(`video_${i+1}.mp4`, blob);
            }
            
            progress.textContent = 'Creating ZIP file...';
            const content = await zip.generateAsync({type: 'blob'});
            saveAs(content, `${car.title.replace(/\s+/g, '_')}_Videos.zip`);
            
            progress.textContent = 'Done!';
            progress.className = 'download-progress download-success';
        } catch (error) {
            console.error(error);
            progress.textContent = 'Error downloading videos.';
            progress.className = 'download-progress download-error';
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-download"></i> Download All Videos';
            setTimeout(() => { progress.style.display = 'none'; }, 5000);
        }
    }

    // --- ЗАПУСК ПРИЛОЖЕНИЯ ---
    initCarsGrid();
});
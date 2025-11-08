document.addEventListener('DOMContentLoaded', function() {
    // --- ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ---
    let carDetails = {};
    let currentCarPhotos = [];
    let currentPhotoIndex = 0;
    let filteredCars = [];
    let currentCar = null;

    // --- 1. НАСТРОЙКИ САЙТА ---
    function applySiteSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('siteSettings'));
            if (settings) {
                if (settings.siteTitle) {
                    document.title = settings.siteTitle;
                    const h1 = document.querySelector('header h1');
                    if (h1) h1.textContent = settings.siteTitle;
                }
                if (settings.heroTitle) {
                    const h2 = document.querySelector('.hero-content h2');
                    if (h2) h2.textContent = settings.heroTitle;
                }
                if (settings.heroSubtitle) {
                    const p = document.querySelector('.hero-content p');
                    if (p) p.textContent = settings.heroSubtitle;
                }
                if (settings.heroButtonText) {
                    const btn = document.querySelector('.hero-content .btn');
                    if (btn) btn.textContent = settings.heroButtonText;
                }
                if (settings.collectionTitle) {
                    const coll = document.getElementById('collection');
                    if (coll) coll.textContent = settings.collectionTitle;
                }
                if (settings.footerText) {
                    const foot = document.querySelector('footer .container p');
                    if (foot) foot.textContent = settings.footerText;
                }
            }
        } catch (e) { console.warn('Settings error:', e); }
    }

    // --- 2. ЗАГРУЗКА ДАННЫХ ---
    function loadCarDetails() {
        const saved = localStorage.getItem('premiumAutoGalleryCars');
        if (saved) {
            carDetails = JSON.parse(saved);
        } else {
            carDetails = getDefaultCarData();
            saveCarDetails();
        }
        filteredCars = Object.values(carDetails);
    }

    // --- СТАНДАРТНЫЕ ДАННЫЕ (МАКСИМАЛЬНО ПОЛНЫЕ СПИСКИ ФОТО) ---
    function getDefaultCarData() {
        return {
            mercedes1: {
                id: "mercedes1", title: "Mercedes A180", brand: "mercedes", price: "23900 AZN", year: "2015", mileage: "193412 km", engine: "1.5L Diesel",
                photos: [
                    "images/a180/1.jpg", "images/a180/2.jpg", "images/a180/3.jpg", "images/a180/4.jpg", "images/a180/5.jpg",
                    "images/a180/6.jpg", "images/a180/7.jpg", "images/a180/8.jpg", "images/a180/9.jpg", "images/a180/10.jpg",
                    "images/a180/11.jpg", "images/a180/12.jpg", "images/a180/13.jpg", "images/a180/14.jpg", "images/a180/15.jpg",
                    "images/a180/16.jpg", "images/a180/17.jpg", "images/a180/18.jpg", "images/a180/19.jpg", "images/a180/20.jpg",
                    "images/a180/21.jpg", "images/a180/22.jpg", "images/a180/23.jpg", "images/a180/24.jpg", "images/a180/25.jpg"
                ],
                videos: ["images/a180/vid1.mp4"]
            },
            mercedes2: {
                id: "mercedes2", title: "Mercedes E300", brand: "mercedes", price: "56000 AZN", year: "2019", mileage: "162671 km", engine: "2.0L Benzin",
                photos: [
                    "images/e300/1.jpg", "images/e300/2.jpg", "images/e300/3.jpg", "images/e300/4.jpg", "images/e300/5.jpg",
                    "images/e300/6.jpg", "images/e300/7.jpg", "images/e300/8.jpg", "images/e300/9.jpg", "images/e300/10.jpg",
                    "images/e300/11.jpg", "images/e300/12.jpg", "images/e300/13.jpg", "images/e300/14.jpg", "images/e300/15.jpg",
                    "images/e300/16.jpg", "images/e300/17.jpg", "images/e300/18.jpg", "images/e300/19.jpg", "images/e300/20.jpg"
                ],
                videos: ["images/e300/vid1.mp4", "images/e300/vid2.mp4", "images/e300/vid3.mp4"]
            },
            toyota1: {
                id: "toyota1", title: "Toyota Aqua", brand: "toyota", price: "16500 AZN", year: "2018", mileage: "211982 km", engine: "1.5L Hybrid",
                photos: [
                    "images/aqua8339/1.jpg", "images/aqua8339/2.jpg", "images/aqua8339/3.jpg", "images/aqua8339/4.jpg",
                    "images/aqua8339/5.jpg", "images/aqua8339/6.jpg", "images/aqua8339/7.jpg", "images/aqua8339/8.jpg"
                ],
                videos: ["images/aqua8339/vid1.mp4", "images/aqua8339/vid2.mp4"]
            },
            kia1: {
                id: "kia1", title: "Kia Carnival", brand: "kia", price: "28000 AZN", year: "2015", mileage: "127413 km", engine: "2.2L Diesel",
                photos: [
                    "images/carnival/1.jpg", "images/carnival/2.jpg", "images/carnival/3.jpg", "images/carnival/4.jpg", "images/carnival/5.jpg",
                    "images/carnival/6.jpg", "images/carnival/7.jpg", "images/carnival/8.jpg", "images/carnival/9.jpg", "images/carnival/10.jpg",
                    "images/carnival/11.jpg", "images/carnival/12.jpg", "images/carnival/13.jpg", "images/carnival/14.jpg", "images/carnival/15.jpg",
                    "images/carnival/16.jpg", "images/carnival/17.jpg", "images/carnival/18.jpg", "images/carnival/19.jpg", "images/carnival/20.jpg",
                    "images/carnival/21.jpg", "images/carnival/22.jpg", "images/carnival/23.jpg", "images/carnival/24.jpg", "images/carnival/25.jpg",
                    "images/carnival/26.jpg", "images/carnival/27.jpg"
                ],
                videos: ["images/carnival/vid1.mp4", "images/carnival/vid2.mp4"]
            },
            hyundai1: {
                id: "hyundai1", title: "Hyundai Palisade", brand: "hyundai", price: "53500 AZN", year: "2019", mileage: "190671 km", engine: "2.2L Diesel",
                photos: [
                    "images/palisade/1.jpg", "images/palisade/2.jpg", "images/palisade/3.jpg", "images/palisade/4.jpg", "images/palisade/5.jpg",
                    "images/palisade/6.jpg", "images/palisade/7.jpg", "images/palisade/8.jpg", "images/palisade/9.jpg", "images/palisade/10.jpg",
                    "images/palisade/11.jpg", "images/palisade/12.jpg", "images/palisade/13.jpg"
                ],
                videos: ["images/palisade/vid1.mp4", "images/palisade/vid2.mp4", "images/palisade/vid3.mp4"]
            },
            hyundai2: {
                id: "hyundai2", title: "Hyundai Maxcruz", brand: "hyundai", price: "33500 AZN", year: "2016", mileage: "105992 km", engine: "2.2L Diesel",
                photos: [
                    "images/maxcruz/1.jpg", "images/maxcruz/2.jpg", "images/maxcruz/3.jpg", "images/maxcruz/4.jpg", "images/maxcruz/5.jpg",
                    "images/maxcruz/6.jpg", "images/maxcruz/7.jpg", "images/maxcruz/8.jpg", "images/maxcruz/9.jpg", "images/maxcruz/10.jpg",
                    "images/maxcruz/11.jpg", "images/maxcruz/12.jpg", "images/maxcruz/13.jpg"
                ],
                videos: []
            },
            landrover1: {
                id: "landrover1", title: "Land Rover Freelander 2", brand: "landrover", price: "19900 AZN", year: "2011", mileage: "150000 km", engine: "2.2L Diesel",
                photos: [
                    "images/landrover/1.jpg", "images/landrover/2.jpg", "images/landrover/3.jpg", "images/landrover/4.jpg", "images/landrover/5.jpg",
                    "images/landrover/6.jpg", "images/landrover/7.jpg", "images/landrover/8.jpg", "images/landrover/9.jpg", "images/landrover/10.jpg",
                    "images/landrover/11.jpg", "images/landrover/12.jpg", "images/landrover/13.jpg", "images/landrover/14.jpg", "images/landrover/15.jpg",
                    "images/landrover/16.jpg", "images/landrover/17.jpg", "images/landrover/18.jpg", "images/landrover/19.jpg", "images/landrover/20.jpg",
                    "images/landrover/21.jpg", "images/landrover/22.jpg", "images/landrover/23.jpg", "images/landrover/24.jpg", "images/landrover/25.jpg",
                    "images/landrover/26.jpg", "images/landrover/27.jpg", "images/landrover/28.jpg", "images/landrover/29.jpg"
                ],
                videos: ["images/landrover/vid1.mp4", "images/landrover/vid2.mp4"]
            }
        };
    }
    function saveCarDetails() { localStorage.setItem('premiumAutoGalleryCars', JSON.stringify(carDetails)); }

    // --- 3. ИНИЦИАЛИЗАЦИЯ ---
    function initCarsGrid() {
        applySiteSettings();
        loadCarDetails();
        renderCarsGrid(filteredCars);
        setupEventListeners();
    }
    
    // --- 4. СЛУШАТЕЛИ ---
    function setupEventListeners() {
        ['searchInput', 'priceFilter', 'yearFilter', 'engineFilter'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', filterCars);
        });
        document.querySelectorAll('.brand-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.brand-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterCars();
            });
        });
        document.getElementById('carModal').addEventListener('click', e => { if (e.target === this) closeCarModal(); });
        document.getElementById('prevPhoto').addEventListener('click', () => navigateGallery(-1));
        document.getElementById('nextPhoto').addEventListener('click', () => navigateGallery(1));
        document.getElementById('closeFullscreen').addEventListener('click', closeFullscreenGallery);
        document.addEventListener('keydown', e => {
            if (document.getElementById('fullscreenGallery').style.display === 'flex') {
                if (e.key === 'ArrowLeft') navigateGallery(-1);
                if (e.key === 'ArrowRight') navigateGallery(1);
                if (e.key === 'Escape') closeFullscreenGallery();
            } else if (document.getElementById('carModal').style.display === 'flex' && e.key === 'Escape') closeCarModal();
        });
    }
    
    // --- 5. РЕНДЕР ---
    function renderCarsGrid(cars) {
        const container = document.getElementById('carsContainer');
        if (!container) return;
        if (cars.length === 0) {
            container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:#7f8c8d;"><h3>No vehicles found</h3></div>`;
            return;
        }
        container.innerHTML = '';
        [...cars].reverse().forEach(car => {
            const photo = (car.photos && car.photos.length) ? car.photos[0] : 'https://via.placeholder.com/350x220?text=No+Image';
            container.innerHTML += `
                <div class="car-card" data-brand="${car.brand}">
                    <div class="car-image" style="background-image: url('${photo}')" onerror="this.style.backgroundImage='url(https://via.placeholder.com/350x220?text=Error)'"></div>
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
                </div>
            `;
        });
        document.querySelectorAll('.view-details').forEach(btn => btn.addEventListener('click', () => openCarModal(btn.getAttribute('data-car'))));
    }
    
    function filterCars() {
        const search = document.getElementById('searchInput').value.toLowerCase();
        const priceVal = document.getElementById('priceFilter').value;
        const yearVal = document.getElementById('yearFilter').value;
        const engineVal = document.getElementById('engineFilter').value;
        const brandVal = document.querySelector('.brand-btn.active').getAttribute('data-brand');
        
        filteredCars = Object.values(carDetails).filter(car => {
            if (brandVal !== 'all' && car.brand !== brandVal) return false;
            if (search && !car.title.toLowerCase().includes(search) && !car.brand.toLowerCase().includes(search)) return false;
            if (yearVal && car.year != yearVal) return false;
            if (engineVal && !car.engine.toLowerCase().includes(engineVal)) return false;
            if (priceVal) {
                const p = parseInt(car.price.replace(/[^0-9]/g, '')) || 0;
                const [min, max] = priceVal.split('-').map(Number);
                if (p < min || p > max) return false;
            }
            return true;
        });
        renderCarsGrid(filteredCars);
    }

    // --- 6. МОДАЛКА ---
    function openCarModal(carId) {
        currentCar = carDetails[carId];
        if (!currentCar) return;
        currentCarPhotos = currentCar.photos || [];
        
        const modal = document.getElementById('carModal');
        const content = document.getElementById('carModalContent');
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        setTimeout(() => { modal.scrollTop = 0; content.scrollTop = 0; }, 10);

        const photosHTML = currentCarPhotos.length ? currentCarPhotos.map((src, i) => 
            `<div class="gallery-item-container"><div class="gallery-item" style="background-image: url('${src}')" data-index="${i}"></div><button class="download-single" data-src="${src}" data-filename="photo_${i+1}.jpg"><i class="fas fa-download"></i> Download</button></div>`
        ).join('') : '<p>No photos</p>';

        const videosHTML = (currentCar.videos && currentCar.videos.length) ? 
            `<div class="car-gallery-section"><h4 class="gallery-title">Videos</h4><div class="video-gallery">${currentCar.videos.map((src, i) => 
                `<div class="video-item"><video controls><source src="${src}" type="video/mp4"></video><button class="download-single" data-src="${src}" data-filename="video_${i+1}.mp4" style="margin-top:10px;"><i class="fas fa-download"></i> Download</button></div>`
            ).join('')}</div></div>` : '';

        content.innerHTML = `
            <button class="modal-close-top" id="modalCloseTop"><i class="fas fa-times"></i></button>
            <div class="car-details-header">
                <h3>${currentCar.title}</h3>
                <div class="car-price">${currentCar.price}</div>
                <div class="car-specs" style="display:flex; gap:2rem; margin-top:1rem; color:#777; flex-wrap:wrap;">
                    <span><i class="fas fa-calendar-alt"></i> ${currentCar.year}</span>
                    <span><i class="fas fa-tachometer-alt"></i> ${currentCar.mileage || ''}</span>
                    <span><i class="fas fa-gas-pump"></i> ${currentCar.engine}</span>
                </div>
            </div>
            <div class="car-details-content" style="padding-top:1rem;">
                <div class="car-gallery-section">
                    <h4 class="gallery-title">Photos (${currentCarPhotos.length})</h4>
                    <div class="gallery-actions">
                        ${currentCarPhotos.length ? `<button class="btn btn-secondary" id="downloadAllPhotos"><i class="fas fa-download"></i> Download All Photos</button>` : ''}
                        ${currentCar.videos && currentCar.videos.length ? `<button class="btn btn-tertiary" id="downloadAllVideos"><i class="fas fa-download"></i> Download All Videos</button>` : ''}
                        <div id="downloadProgress" class="download-progress" style="display:none;">Preparing...</div>
                    </div>
                    <div class="photo-gallery">${photosHTML}</div>
                </div>
                ${videosHTML}
                <button class="close-modal" id="closeModalBottom">Close</button>
            </div>
        `;

        document.getElementById('modalCloseTop').onclick = closeCarModal;
        document.getElementById('closeModalBottom').onclick = closeCarModal;
        document.querySelectorAll('.gallery-item').forEach(item => item.onclick = () => openFullscreen(parseInt(item.dataset.index)));
        document.querySelectorAll('.download-single').forEach(btn => btn.onclick = () => downloadFile(btn.dataset.src, btn.dataset.filename));
        if(document.getElementById('downloadAllPhotos')) document.getElementById('downloadAllPhotos').onclick = () => downloadAll(currentCar, 'photos');
        if(document.getElementById('downloadAllVideos')) document.getElementById('downloadAllVideos').onclick = () => downloadAll(currentCar, 'videos');
    }

    function closeCarModal() {
        document.getElementById('carModal').style.display = 'none';
        document.body.classList.remove('modal-open');
        currentCar = null;
    }

    // --- 7. ФАЙЛЫ ---
    function downloadFile(src, filename) {
        try {
            const a = document.createElement('a'); a.href = src; a.download = filename; a.target = '_blank';
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            showNotify(filename);
        } catch (e) { window.open(src, '_blank'); }
    }
    function showNotify(filename) {
        const n = document.createElement('div'); n.className = 'download-notification';
        n.innerHTML = `<i class="fas fa-check-circle"></i> Downloading: ${filename}`;
        document.body.appendChild(n); setTimeout(() => n.classList.add('show'), 100);
        setTimeout(() => { n.classList.remove('show'); setTimeout(() => n.remove(), 300); }, 3000);
    }
    function openFullscreen(index) { currentPhotoIndex = index; updateGallery(); document.getElementById('fullscreenGallery').style.display = 'flex'; }
    function updateGallery() {
        document.getElementById('fullscreenContent').innerHTML = `<img src="${currentCarPhotos[currentPhotoIndex]}" style="max-width:100%; max-height:90vh; border-radius:8px;">`;
        document.getElementById('galleryCounter').textContent = `${currentPhotoIndex + 1} / ${currentCarPhotos.length}`;
    }
    function closeFullscreenGallery() { document.getElementById('fullscreenGallery').style.display = 'none'; }
    function navigateGallery(dir) {
        const newIndex = currentPhotoIndex + dir;
        if (newIndex >= 0 && newIndex < currentCarPhotos.length) { currentPhotoIndex = newIndex; updateGallery(); }
    }

    // --- 8. МАССОВОЕ СКАЧИВАНИЕ ---
    async function downloadAll(car, type) {
        if (typeof JSZip === 'undefined') return alert('Error: JSZip library missing!');
        const btnId = type === 'photos' ? 'downloadAllPhotos' : 'downloadAllVideos';
        const files = type === 'photos' ? car.photos : car.videos;
        const ext = type === 'photos' ? 'jpg' : 'mp4';
        const btn = document.getElementById(btnId);
        const progress = document.getElementById('downloadProgress');
        if (!btn || !files.length) return;
        
        btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        progress.style.display = 'block'; progress.className = 'download-progress';
        
        try {
            const zip = new JSZip();
            const folder = zip.folder(`${car.title} ${type}`);
            let count = 0;
            for (let i = 0; i < files.length; i++) {
                progress.textContent = `Loading ${type.slice(0,-1)} ${i+1}/${files.length}...`;
                try {
                    const resp = await fetch(files[i]);
                    if (!resp.ok) throw new Error('Net error');
                    folder.file(`${type.slice(0,-1)}_${i+1}.${ext}`, await resp.blob());
                    count++;
                } catch (e) { console.error('Load failed:', files[i]); }
            }
            if (count === 0) throw new Error('No files loaded (check Live Server)');
            progress.textContent = 'Archiving...';
            saveAs(await zip.generateAsync({type:'blob'}), `${car.title.replace(/\s+/g,'_')}_${type}.zip`);
            progress.textContent = 'Done!'; progress.className += ' download-success';
        } catch (e) {
            alert('Download failed: ' + e.message);
            progress.textContent = 'Error'; progress.className += ' download-error';
        } finally {
            btn.disabled = false; btn.innerHTML = `<i class="fas fa-download"></i> Download All ${type.charAt(0).toUpperCase() + type.slice(1)}`;
            setTimeout(() => { if (progress.className.includes('success')) progress.style.display = 'none'; }, 5000);
        }
    }

    initCarsGrid();
});
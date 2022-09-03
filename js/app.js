// get data from API 
const loadData = () => {
    fetch('https://openapi.programming-hero.com/api/news/categories')
        .then(res => res.json())
        .then(data => displayCategories(data.data.news_category))
        .catch(err => console.log(err));
}

loadData();

// display categories
const displayCategories = categories => {
    const ul = document.getElementById('ul');
    categories.forEach(category => {
        const { category_id, category_name } = category;
        const li = document.createElement('li');
        li.classList.add('py-2', 'py-sm-0');
        li.innerHTML = `
            <a class="fw-bold" onclick="loadNews('${category_id}', '${category_name}')">${category_name}</a>    
        `;
        ul.appendChild(li);
    });
}

// load news data 
const loadNews = (categoryId, category_name) => {
    spinLoader(true);
    fetch(`https://openapi.programming-hero.com/api/news/category/${categoryId}`)
        .then(res => res.json())
        .then(data => displayNews(data.data, category_name))
        .catch(err => console.log(err));
}

// display news 
const displayNews = (newsData, category_name) => {
    const notFound = document.getElementById('notFound');
    if (newsData.length === 0) {
        notFound.classList.remove('d-none');
    }
    else {
        notFound.classList.add('d-none');
    }

    const newsCount = document.getElementById('newsCount');
    const cardContainer = document.getElementById('card-container');
    cardContainer.classList.remove('d-none');
    newsCount.innerText = newsData.length + ` Items Found for Category ${category_name}`;

    const newsDisplay = document.getElementById('news-display');
    newsDisplay.textContent = '';

    newsData.sort((a, b) => b.total_view - a.total_view);
    newsData.forEach(news => {
        const { _id, title, thumbnail_url, details, author, total_view } = news;
        const { name, published_date, img } = author;
        const div = document.createElement('div');
        div.innerHTML = `
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-2">
                    <img src="${thumbnail_url}" class="img-fluid p-3 card-image rounded-start h-100 w-100" alt="...">
                </div>
                <div class="col-md-10">
                    <div class="card-body px-4">
                        <h5 class="card-title mb-4 mt-3 fw-bold">${title}</h5>
                        <p class="card-text text-justify text-muted">${details.length > 500 ? details.slice(0, 500) + '...' : details}</p>
                        <div class="row row-cols-1 row-cols-md-4 mt-4">
                            <div class="d-flex justify-content-center justify-content-md-start">
                                <img src="${img}" class="rounded-circle user-image" alt="">
                                <div class="ps-3">
                                    <h6 class="mb-1">${name == null ? 'No Data Available' : name}</h6>
                                    <p class="text-muted">${published_date == null ? 'No Data Available' : published_date}</p>
                                </div>
                            </div>
                            <div class="d-flex align-items-center justify-content-center">
                                <p><i class="fa-solid fa-eye"></i></p>
                                <p class="ps-2">${total_view == null ? 'No Data Available' : total_view}</p>
                            </div>
                            <div class="d-flex align-items-center justify-content-center">
                                <p><i class="fa-solid fa-star"></i></p>
                                <p><i class="fa-solid fa-star"></i></p>
                                <p><i class="fa-solid fa-star"></i></p>
                                <p><i class="fa-solid fa-star"></i></p>
                                <p><i class="fa-regular fa-star-half-stroke"></i></p>
                            </div>
                            <div class="d-flex align-items-center justify-content-center">
                                <button class="btn" onclick="modalNewsLoad('${_id}')" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-arrow-right text-primary"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        newsDisplay.appendChild(div);
    });
    spinLoader(false);
}

// modal load data 
const modalNewsLoad = async newsId => {
    try {
        const res = await fetch(`https://openapi.programming-hero.com/api/news/${newsId}`);
        const data = await res.json();
        modalNewsDisplay(data.data);
    } catch (error) {
        console.log(error);
    }
}


// modal Show Data 
const modalNewsDisplay = modalData => {
    const modalBody = document.getElementById('modalBody');
    modalData.forEach(data => {
        const { image_url, title, author, total_view, rating, details } = data;
        const { name, published_date, img } = author;
        const modalTitle = document.getElementById('modalTitle');
        modalTitle.innerText = `${name == null ? 'No Data Available' : name}'s Report`;
        modalBody.innerHTML = `
        <div class="card">
            <img src="${image_url}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-text">${title}</h5>
                <p class="card-text mt-4">${details.length > 400 ? details.slice(0, 400) : details}</p>
                <div class="row row-cols-1 row-cols-md-3 mt-4">
                    <div class="d-flex justify-content-center justify-content-md-start">
                        <img src="${img}" class="rounded-circle user-image" alt="">
                        <div class="ps-3">
                            <h6 class="mb-1">${name == null ? 'No Data Available' : name}</h6>
                            <p class="text-muted">${published_date == null ? 'No Data Available' : published_date}</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center justify-content-center">
                        <p><i class="fa-solid fa-eye"></i></p>
                        <p class="ps-2">${total_view == null ? 'No Data Available' : total_view}</p>
                    </div>
                    <div class="d-flex align-items-center justify-content-center">
                        <p class="me-2">${rating.number}</p>
                        <p><i class="fa-solid fa-star"></i></p>
                        <p><i class="fa-solid fa-star"></i></p>
                        <p><i class="fa-solid fa-star"></i></p>
                        <p><i class="fa-solid fa-star"></i></p>
                        <p><i class="fa-regular fa-star-half-stroke"></i></p>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
}

// Spinner loading 
const spinLoader = isLoading => {
    const spinner = document.getElementById('spinner');
    if (isLoading) {
        spinner.classList.remove('d-none');
    }
    else {
        spinner.classList.add('d-none');
    }
}


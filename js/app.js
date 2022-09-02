
const loadData = () => {
    fetch('https://openapi.programming-hero.com/api/news/categories')
        .then(res => res.json())
        .then(data => displayCategories(data.data.news_category))
        .catch(err => console.log(err));
}

loadData();

const displayCategories = categories => {
    const ul = document.getElementById('ul');
    categories.forEach(category => {
        const { category_id, category_name } = category;
        const li = document.createElement('li');
        li.innerHTML = `
            <a onclick="loadNews('${category_id}', '${category_name}')">${category_name}</a>    
        `;
        ul.appendChild(li);
    });
}

const loadNews = (categoryId, category_name) => {
    fetch(`https://openapi.programming-hero.com/api/news/category/${categoryId}`)
        .then(res => res.json())
        .then(data => displayNews(data.data, category_name))
        .catch(err => console.log(err));
}

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
    console.log(newsData);

    const newsDisplay = document.getElementById('news-display');
    newsDisplay.textContent = '';
    newsData.forEach(news => {
        const { title, thumbnail_url, details, author, total_view } = news;
        const { name, published_date, img } = author;
        const div = document.createElement('div');
        div.innerHTML = `
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-2">
                    <img src="${thumbnail_url}" class="img-fluid p-3 rounded-start h-100 w-100" alt="...">
                </div>
                <div class="col-md-10">
                    <div class="card-body px-4">
                        <h5 class="card-title mb-4 mt-3 fw-bold">${title}</h5>
                        <p class="card-text text-justify text-muted">${details.length > 500 ? details.slice(0, 500) + '...' : details}</p>
                        <div class="row row-cols-1 row-cols-md-4 mt-4">
                            <div class="d-flex">
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
                                <button class="btn"><i class="fa-solid fa-arrow-right text-primary"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        newsDisplay.appendChild(div);
    })
}
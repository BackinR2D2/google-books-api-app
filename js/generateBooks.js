const booksSection = document.querySelector('.pickedbooks');

async function getBook (author) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${author}`;
    const req = await fetch(url);
    const bookInfo = await req.json();
    return bookInfo;
}

function generateRandNum (n) {
    return Math.floor(Math.random() * n);
}

const authors = [
    'Tudor Arghezi',
    'Liviu Rebreanu',
    'Mihai Eminescu',
    'Ioan Slavici',
    'George Calinescu',
    'Nichita Stanescu',
    'George Bacovia',
    'Ion Creanga',
    'Camil Petrescu',
    'Ion Luca Caragiale',
    'Camil Petrescu',
    'Mihail Sadoveanu',
    'Mircea Eliade',
    'Mircea Cartarescu',
    'Mihail Sadoveanu',
    'Lucian Blaga',
    'Emil Cioran',
    'Ana Blandiana',
    'George Cosbuc',
    'Marin Preda',
    'Mihai Sorescu'
];

function generateRandNums () {
    const nums = [];
    for(let i = 0; i < 6; i++) {
        let randomNum = generateRandNum(authors.length - 1);
        if(nums.indexOf(randomNum) === -1) {
            nums.push(randomNum);
        } else {
            for(let i = 0; i < authors.length - 1; i++) {
                if(nums.indexOf(i) === -1) {
                    randomNum = i;
                }
            }
            nums.push(randomNum);
        }
    }
    return nums;
}

function generateBooksInfo () {

    const randomNumbers = generateRandNums();
    randomNumbers.forEach(async n => {
        
        const author = authors[n];
        const bookInfo = await getBook(author);
        const data = (bookInfo.items).filter(el => el.volumeInfo.imageLinks && el.volumeInfo.pageCount && el.volumeInfo.authors);
        const randomNum = generateRandNum(data.length - 1);
        let info = data[randomNum];
        const imgUrl = (info.volumeInfo.imageLinks.thumbnail).split('http');
        imgUrl[0] = 'https';
        const modifiedImgUrl = imgUrl.join('');
        const template = `
            <div class="imgContainer">
                <img src="${modifiedImgUrl}" class="card-img-top" alt="coperta_poza">
            </div>
            <div class="cardData">
                <h4 class="card-title">${info.volumeInfo.title}</h4>
                <h5 class="card-subtitle mb-2 text-muted">${info.volumeInfo.authors.length > 1 ? info.volumeInfo.authors.join(', ') : info.volumeInfo.authors[0]}</h5>
                <hr>
                <p>Numarul de pagini - ${info.volumeInfo.pageCount}</p>
                <p>Data publicarii - ${info.volumeInfo.publishedDate}</p>
                <p class="bookinfolink">
                    <a href="${info.volumeInfo.infoLink}" target="_blank">Mai multe informatii despre carte</a>
                </p>
                <div class="saveBook">
                    <button type="button" ${localStorage.getItem(info.id) ? 'disabled' : ''} class="btn btn-success" onclick="handleSave('${info.id}')">Salveaza cartea</button>
                </div>
            </div>

            <div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
                <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true" >
                    <div class="toast-header">
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        Carte salvata cu succes!
                    </div>
                </div>
            </div>

        `;
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book', 'card');
        bookDiv.innerHTML = template;
        booksSection.append(bookDiv);
    })
}

function handleSave (info) {
    if(!localStorage.getItem(info)) {
        const toastEx = document.getElementById('liveToast');
        const toast = new bootstrap.Toast(toastEx);
        toast._config.delay = 1500;
        toast.show();
        localStorage.setItem(info, info);
    } else {
        alert('Cartea este deja salvata.')
    }
}

generateBooksInfo();


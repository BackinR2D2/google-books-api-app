function convertToUC (str) {
    const s = str.split('');
    s[0] = s[0].toUpperCase();
    return s.join('');
}
let id = 0;
const titleInp = document.querySelector('input[placeholder="Titlu"]');
const nameInp = document.querySelector('input[placeholder="Autor"]');
const form = document.querySelector('form');
const booksSection = document.querySelector('.pickedbooks');

const booksPerPage = 10;
const startIndex = 0;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setTimeout(() => {
        booksSection.innerHTML = '';
    }, 500);
    const data = {
        name: nameInp.value,
        title: titleInp.value,
    };
    let infos;
    const baseUrl = 'https://www.googleapis.com/books/v1/volumes?maxResults=40&q=';
    if(data.name !== '') {
        const req = await fetch(`${baseUrl}${data.title}+inauthor:${data.name}`);
        infos = await req.json();
    } else {
        const req = await fetch(`${baseUrl}${data.title}`);
        infos = await req.json();
    }
    const booksInfo = infos.items.filter(el => el.volumeInfo.imageLinks && el.volumeInfo.pageCount && el.volumeInfo.authors);
    booksInfo.forEach(info => {
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
                <div class="bookInformation">
                    <p>Numarul de pagini - ${info.volumeInfo.pageCount}</p>
                    <p>Data publicarii - ${info.volumeInfo.publishedDate ? info.volumeInfo.publishedDate : 'nespecificat'}</p>
                    <p class="bookinfolink">
                        <a href="${info.volumeInfo.previewLink}" target="_blank">Mai multe informatii despre carte</a>
                    </p>
                </div>
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
    nameInp.value = '';
    titleInp.value = '';
})

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
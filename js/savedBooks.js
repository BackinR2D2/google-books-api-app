const savedBooksSection = document.querySelector('.pickedbooks');
const disclaimer = document.querySelector('.disclaimer');

window.onload = () => {
    if(localStorage.length === 0) {
        const div = document.createElement('div');
        const p = document.createElement('p');
        p.textContent = 'Pentru a adauga o carte in lista mergeti pe pagina de cautare a cartilor sau pe pagina principala si selectati ce doriti sa salvati.';
        const link = document.createElement('a');
        link.setAttribute('href', '/html/books.html');
        link.classList.add('link-info');
        link.textContent = 'Pagina de cautare a cartilor';

        const hplink = document.createElement('a');
        hplink.setAttribute('href', '/html/homepage.html');
        hplink.classList.add('link-info');
        hplink.textContent = 'Pagina principala';

        div.append(p);
        div.append(link);
        div.append(document.createElement('br'));
        div.append(hplink);
        disclaimer.append(div);
    }
}

async function getBookInfo (id) {
    const baseUrl = 'https://www.googleapis.com/books/v1/volumes/';
    const req = await fetch(`${baseUrl}${id}`);
    const data = await req.json();
    return data;
}

async function getBooks () {
    for(let i = 0; i < localStorage.length; i++) {
        const id = localStorage.getItem(localStorage.key(i));
        const info = await getBookInfo(id);
        const template = `
            <div class="imgContainer">
                <img src="${info.volumeInfo.imageLinks?.thumbnail}" class="card-img-top" alt="coperta_poza">
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
                <div class="removeBook">
                <button type="button" class="btn btn-danger" onclick="handleRemove('${info.id}')">Sterge cartea</button>
                </div>
            </div>

            <div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
                <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true" >
                    <div class="toast-header">
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        Carte stearsa cu succes!
                    </div>
                </div>
            </div>
        `;
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book', 'card');
        bookDiv.setAttribute('id', info.id);
        bookDiv.innerHTML = template;
        savedBooksSection.append(bookDiv);
    }
}

function handleRemove (id) {
    const el = document.getElementById(id);
    setTimeout(() => {
        el.remove();
    }, 500);
    const toastEx = document.getElementById('liveToast');
    const toast = new bootstrap.Toast(toastEx);
    toast._config.delay = 1500;
    toast.show();
    localStorage.removeItem(id);
}

getBooks()
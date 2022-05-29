// const image = document.querySelector('.cats__img')
const cats = document.querySelector('.cats')
const btnGenerate = document.querySelector('#btnGenerate')


async function getCats() {
    loading()
    const API_URL = `https://api.thecatapi.com/v1/images/search?limit=4&api_key=37913eac-fbf8-4e9a-9b64-f3fd348c7ec2`

    const resp = await fetch(API_URL)
    const result = await resp.json()


    addImgs(result)
}

getCats()


function addImgs(imgs) {

    limpiarHTML()

    imgs.map(img => {
        const ARTICLE = document.createElement('article')
        ARTICLE.classList.add('cats__content')

        const IMG = document.createElement('img')
        IMG.src = img.url
        const BTN = document.createElement('button')
        BTN.classList.add('btnToogleFavorite')
        BTN.textContent = '❤'

        ARTICLE.appendChild(IMG)
        ARTICLE.appendChild(BTN)
        cats.appendChild(ARTICLE)
    })



    setTimeout(() => {
        finishLoading()
    }, 1000);
}


function limpiarHTML() {
    while (cats.firstChild) {
        cats.removeChild(cats.firstChild)
    }
}

function loading() {
    btnGenerate.disabled = true;
    btnGenerate.innerHTML = `
    <svg
        class="ring"
        viewBox="25 25 50 50"
        stroke-width="5"
    >
        <circle cx="50" cy="50" r="20" />
    </svg>
    `
}

function finishLoading() {
    btnGenerate.disabled = false;
    btnGenerate.innerText = 'Generar'

}

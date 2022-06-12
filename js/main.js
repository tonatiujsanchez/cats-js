
const cats = document.querySelector('.cats')
const btnGenerate = document.querySelector('#btnGenerate')
const navBtns = document.querySelectorAll('.nav__btn')

let pageActive = 'btnHome'
navBtns.forEach( navBtn => {
    navBtn.addEventListener('click', navegation)
})


const API_URL = 'https://api.thecatapi.com/v1'
const API_KEY = '37913eac-fbf8-4e9a-9b64-f3fd348c7ec2'
const QUANTITY_CATS = 6;

let catsFavorites = []

async function init() {
    await loadFavoritesCats()
    await getCats()
}
init()



async function navegation({ target }) {
    
    if(target.id === pageActive) return;
    
    navBtns.forEach( navBtn =>{
        navBtn.classList.remove('active')
    })

    target.classList.add('active')
    pageActive= target.id

    if( pageActive === 'btnHome' ){
        getCats()
    }else {
        const favorites = await loadFavoritesCats()
        const favoritesImgs = favorites.map( fav => ({ ...fav, url: fav.image.url }) )
        addImgs(favoritesImgs)
    }
}


async function getCats() {
    loading()
    const URL_RANDOM = `${API_URL}/images/search?limit=${QUANTITY_CATS}&api_key=${API_KEY}`

    const resp = await fetch(URL_RANDOM)
    const result = await resp.json()

    if( resp.status !== 200 ) {
        console.log( resp.status + data.message );
        return
    }

    addImgs(result)
}


// Peticion realizada con Headers
async function loadFavoritesCats() {

    // const URL_FAVORITES = `${API_URL}/favourites?api_key=${API_KEY}`
    const URL_FAVORITES = `${API_URL}/favourites`
    const resp = await fetch(URL_FAVORITES,{
        method: 'GET',
        headers: {
            'x-api-key': API_KEY
        }
    })
    const result = await resp.json()

    if( resp.status !== 200 ) {
        console.log( resp.status + data.message );
        return
    }

    const favoritesTemp = result.map( fav => ({ ...fav, isFavorite: true }) )
    catsFavorites = [ ...favoritesTemp ]

    return favoritesTemp
}   



function toogleFavorite( cat, htmlCat ) {

    if( cat.image_id ){
        const favoriteCat = catsFavorites.find( fav => fav.image_id === cat.image_id )
        console.log('IsFavorite')
        deleteFavorite( favoriteCat.id, htmlCat )
    }else{
        const favoriteCat = catsFavorites.find( fav => fav.image_id === cat.id )
        
        if(favoriteCat){
            deleteFavorite( favoriteCat.id, htmlCat )
        }else{
            saveFavoriteCat(cat, htmlCat)
        }
    }
}



async function saveFavoriteCat(cat, htmlCat) {

    // const URL_FAVORITES = `${API_URL}/favourites?api_key=${API_KEY}`
    const URL_FAVORITES = `${API_URL}/favourites`
    const resp = await fetch(URL_FAVORITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
        },
        body: JSON.stringify({
            image_id: cat.id,  
        })
    })

    const result = await resp.json()

    if(!htmlCat){
        return
    }

    if( resp.status !== 200 ) {
        console.log( resp.status + data.message );
    }else{

        catsFavorites = [ ...catsFavorites, { 
            ...cat, 
            image: {
                id: cat.id,
                url: cat.url
            },
            image_id: cat.id,
            id: result.id, 
            isFavorite: true
        }]

        htmlCat.childNodes[1].classList.add('activeFavorite')
    }
}



async function deleteFavorite( favoriteId, htmlCat ) {

    // const URL_FAVORITES_DELETE = `https://api.thecatapi.com/v1/favourites/${favoriteId}?api_key=${API_KEY}`
    const URL_FAVORITES_DELETE = `https://api.thecatapi.com/v1/favourites/${favoriteId}`
    
    const resp = await fetch(URL_FAVORITES_DELETE,{
        method: 'DELETE',
        headers: {
            'x-api-key': API_KEY
        }
    })
    const result = await resp.json()
    
    if( resp.status !== 200 ) {
        console.log( resp.status + data.message )
        return
    }
    
    // Remover del Arr
    catsFavorites = catsFavorites.filter( fav => fav.id !== favoriteId )

    // Remover Clase
    htmlCat.childNodes[1].classList.remove('activeFavorite')
    
    // Remover del HTML
    if( pageActive !== 'btnHome' ){
        htmlCat.remove()
    }

}



function addImgs(imgs) {

    clearHTML()

    imgs.map(img => {
        const ARTICLE = document.createElement('article')
        ARTICLE.classList.add('cats__content')

        const IMG = document.createElement('img')
        IMG.src = img.url

        const BTN = document.createElement('button')
        BTN.classList.add('btnToogleFavorite')
        BTN.textContent = '❤'
        
        if(img.isFavorite || catsFavorites.some( fav=> fav.image_id === img.id )  ){
            BTN.classList.add('activeFavorite')

        }

        BTN.onclick = () => toogleFavorite(img, ARTICLE)

        ARTICLE.appendChild(IMG)
        ARTICLE.appendChild(BTN)
        cats.appendChild(ARTICLE)
    })

    setTimeout(() => {
        finishLoading()
    }, 1000);
}


async function uploadImage() {
    
    loading()

    const URL_UPLOAD_IMAGE = `https://api.thecatapi.com/v1/images/upload`

    const form = document.getElementById('uploadingForm')
    const formData = new FormData(form)

    const resp = await fetch(URL_UPLOAD_IMAGE, {
        method: 'POST',
        headers: {
            // 'Content-Type': 'multipart/form-data',
            'x-api-key': API_KEY,
        },
        body: formData
    })

    const result = await resp.json()
    
    
    if( resp.status !== 201 ){
        console.log('hubo un error al subir el archivo');   
    }else{
        console.log('subiendo foto...', result);
        console.log('subiendo foto...', result.url);
    }
    saveFavoriteCat(result)
    finishLoading()

}

function clearHTML() {
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

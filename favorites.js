let favoritesList = []
//Restore favorites from the local storage

if (localStorage.getItem("fav") && localStorage.getItem("fav") !== null) {
    favoritesList = JSON.parse(localStorage.getItem("fav"))
    console.log(favoritesList)
}


function addToFavorites(breedArray, divId) {
    let addToFav = document.getElementById(divId).lastChild

    addToFav.addEventListener("click", () => {
        if (favoritesList.indexOf(breedArray.id) >= 0) {
            addToFav.setAttribute("src", "https://img.icons8.com/?size=100&id=85038&format=png&color=000000")
            favoritesList.splice(favoritesList.indexOf(breedArray.id), 1)
        }
        else {
            addToFav.setAttribute("src", "https://img.icons8.com/?size=100&id=85138&format=png&color=000000")
            favoritesList.push(breedArray.id)
        }

        localStorage.setItem("fav", JSON.stringify(favoritesList))
        console.log(localStorage.getItem("fav"))
    })
}

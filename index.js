/*
[1] Fetch info from the API
[2] create a div for each breed
    each div contains:
        - image
        - h2 name
        - h3 group
        - chart for activity level* ?
        - p for weight and size ?
        - favorites icon in the top right corner
[3] use data to create search&filter function:
    - filter by size
    - search by name
    - multiple filters (group, size, exercise, kid friendly, etc)
[4] show the search results on the same page over the main sections
[5] icon to remove filters and clear the search results section 
[6] save favorited breeds to web-storage

[7] breed info page:
    main display grid:
        - 2fr 1fr 1fr 1fr
        - image, h2 breed name, h3 breed group, h4 breed height, weight, lifespan, li personality traits (flex), p breed desc, charts
*/
const main = document.querySelector("main")
let allSection = document.getElementById('all-breeds')
let popularSection = document.getElementById('popular')
let searchContainer = document.getElementById("search-container")
let searchResultsH2 // h2 title for search results
let searchResultsSection //section to display breed divs
let removeFilters = document.getElementById("remove-filters")

let breedContainer // individual divs for the breeds
let breedData //the result from API


fetch('https://registry.dog/api/v1')
    .then(response => response.json())
    .then(result => {
        displayOnPage(result)
        breedData = result.data
    })


//DISPLAYS THE BREEDS
function displayOnPage(result) {
    for (breed of result.data) {
        breedContainer = document.createElement('div')
        let breedImage = document.createElement('img')
        let breedName = document.createElement('h3')
        let breedLink = document.createElement("a")
        let breedGroup = document.createElement('h4')
        let favoriteIcon = document.createElement("img") //Should be the last child! used in a favorite function

        breedContainer.append(breedImage, breedName, breedGroup, favoriteIcon)
        allSection.appendChild(breedContainer)
        breedName.appendChild(breedLink)

        breedContainer.setAttribute("id", breed.id)
        // breedContainer.setAttribute("class", breed.id) 
        breedLink.href = `https://ofedchen.github.io/dog-breed-website/breed-page.html?breed_id=${breed.id}` //to open the page with additional info
        breedLink.textContent = breed.general.name
        breedGroup.textContent = breed.general.group
        breedImage.setAttribute("src", breed.images.small.studio)

        if (favoritesList.indexOf(breed.id) >= 0) {
            favoriteIcon.setAttribute("src", "https://img.icons8.com/?size=100&id=85138&format=png&color=000000")
        }
        else {
            favoriteIcon.setAttribute("src", "https://img.icons8.com/?size=100&id=85038&format=png&color=000000")
        }
        favoriteIcon.setAttribute("class", "favorite")

        addToFavorites(breed, breedContainer.getAttribute("id"))

        //randomly selects which breeds to whow in the Popular section
        if (breed.general.popularity > 4) {
            let add = Math.floor(Math.random() * 7)
            if (add > 4) {
                let breedContainerPop = breedContainer.cloneNode(true)
                breedContainerPop.setAttribute("id", breed.id + "-pop")
                popularSection.appendChild(breedContainerPop)
                addToFavorites(breed, breedContainerPop.getAttribute("id"))
            }
        }
    }
}


//SHOW FILTERS
let hidden = true
document.querySelector(".icon").addEventListener("click", () => {
    if (hidden) {
        document.querySelector("#filters").style.display = "flex"
        hidden = false
    } else {
        document.querySelector("#filters").style.display = "none"
        hidden = true
    }
})

//SEARCH AND FILTERS FUNCTION
function filterSearch(breedArray) {
    let counter = 0

    for (breed of breedArray) {
        if (document.getElementById("searchfield").value.length >= 2) {
            if (!breed.general.name.toLowerCase().includes(document.getElementById("searchfield").value)) {
                continue
            }
        }

        if (document.getElementById("filter-size").value) {
            if (Number(document.getElementById("filter-size").value) !== breed.physical.size) {
                continue
            }
        }

        if (document.getElementById("filter-group").value) {
            if (document.getElementById("filter-group").value !== breed.general.group) {
                continue
            }
        }

        if (document.getElementById("filter-child").value) {
            if (Number(document.getElementById("filter-child").value) !== breed.behavior.childFriendly) {
                continue
            }
        }

        if (document.getElementById("filter-exercise").value) {
            if (Number(document.getElementById("filter-exercise").value) !== breed.care.exerciseNeeds) {
                continue
            }
        }

        counter += 1
        let breedContainerSearch = document.getElementById(breed.id).cloneNode(true)
        breedContainerSearch.setAttribute("id", breed.id + "-search")
        searchResultsSection.appendChild(breedContainerSearch)
        addToFavorites(breed, breedContainerSearch.getAttribute("id"))
    }
    return counter
}

//DISPLAY SEARCH RESULTS 
function displaySearchResults() {
    searchContainer.innerHTML = ""
    searchResultsH2 = document.createElement("h2")
    searchResultsSection = document.createElement("section")
    searchContainer.appendChild(searchResultsSection)
    searchContainer.insertBefore(searchResultsH2, searchResultsSection)

    let counterResults = filterSearch(breedData)

    searchResultsH2.innerHTML = `Search results for "${document.getElementById("searchfield").value}" (${counterResults})`
    document.getElementById("sizes").style.display = "none"
    removeFilters.style.display = "block"
}


//APPLYING ALL FILTERS AND SEARCH
//Button event
document.querySelector("button").addEventListener("click", (breedData) => displaySearchResults(breedData))

//Enter key event
document.addEventListener(
    "keydown",
    (event) => {
        const keyName = event.key;

        if (keyName === "Enter")
            displaySearchResults(breedData)
    });


// CLEARING THE SEARCH RESULTS
removeFilters.addEventListener("click", () => {
    searchContainer.innerHTML = ""
    removeFilters.style.display = "none"
    document.getElementById("sizes").style.display = "flex"
    document.querySelector("#filters").style.display = "none"
    hidden = true

    let filtersToRemove = document.querySelectorAll("select")
    for (filter of filtersToRemove) {
        filter.value = ""
    }
    document.getElementById("searchfield").value = ""
})

// QUICK FILTERS BY SIZE
let sizes = document.querySelectorAll("li")
for (let size of sizes) {
    size.addEventListener("click", () => {
        searchContainer.innerHTML = ""
        searchResultsH2 = document.createElement("h2")
        searchResultsSection = document.createElement("section")
        searchResultsH2.textContent = size.textContent + " breeds"
        searchContainer.appendChild(searchResultsH2)
        searchContainer.appendChild(searchResultsSection)

        filterBySize(breedData, size.getAttribute("id"))
    })
}

// FUNCTION FOR QUICK FILTERS BY SIZE
function filterBySize(breedData, id) {

    for (breed of breedData) {
        if (Number(id) === breed.physical.size) {
            let breedContainerSearch = document.getElementById(breed.id).cloneNode(true)
            breedContainerSearch.setAttribute("id", breed.id + "-filter")
            searchResultsSection.appendChild(breedContainerSearch)

            addToFavorites(breed, breedContainerSearch.getAttribute("id"))

            removeFilters.style.display = "block"
        }
    }
}



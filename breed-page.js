const parameters = new URLSearchParams(window.location.search)
const searchParam = parameters.get("breed_id")
console.log(searchParam)

let breedData

let pageTitle = document.querySelector("title")
let pageHeading1 = document.querySelector("h1")

let breedInfoSection = document.querySelector("main")
let breedImage = document.createElement('img')
let breedName = document.querySelector('h2')
let breedGroup = document.querySelector('h3')
let breedHeight = document.getElementById('b-height')
let breedWeight = document.getElementById('b-weight')
let breedLifespan = document.getElementById('b-lifespan')
let breedTraits = document.querySelector('ul')
let breedDescription = document.querySelector('p')
let figureChart = document.querySelector('figure')
let favoriteIcon = document.createElement("img") //Should be the last child! used in a favorite function

breedInfoSection.insertBefore(breedImage, breedName)
breedInfoSection.appendChild(favoriteIcon)

let labels = [0]


fetch('https://registry.dog/api/v1')
    .then(response => response.json())
    .then(result => {
        displayBreedInfo(result, searchParam)
        breedData = result.data
    })


function displayBreedInfo(result, param) {

    for (let breed of result.data) {

        if (breed.id === param) {

            breedInfoSection.setAttribute("id", breed.id)
            breedName.textContent = breed.general.name
            breedGroup.textContent = breed.general.group
            breedImage.setAttribute("src", breed.images.large.outdoors)
            breedHeight.textContent = "Height: ~" + Math.round(breed.general.height / 0.39370) + " cm"
            breedWeight.textContent = "Weight: ~" + Math.round(breed.general.weight * 0.453) + " kg"
            breedLifespan.textContent = "Lifespan: " + breed.general.lifespan + " years"
            breedDescription.textContent = breed.general.longDescription

            let persTraits = breed.general.personalityTraits
            for (let trait of persTraits) {
                let bTrait = document.createElement("li")
                breedTraits.appendChild(bTrait)
                bTrait.textContent = trait
            }


            pageTitle.textContent = `${breed.general.name}: breed information`
            pageHeading1.textContent = `Discover everything about ${breed.general.name}!`


            if (favoritesList.indexOf(breed.id) >= 0) {
                favoriteIcon.setAttribute("src", "https://img.icons8.com/?size=100&id=85138&format=png&color=000000")
            }
            else {
                favoriteIcon.setAttribute("src", "https://img.icons8.com/?size=100&id=85038&format=png&color=000000")
            }
            favoriteIcon.setAttribute("class", "favorite")

            addToFavorites(breed, breedInfoSection.getAttribute("id"))

            let dataEx = [Number(breed.care.exerciseNeeds)]
            let dataFam = [Number(breed.behavior.familyAffection)]
            let dataChild = [Number(breed.behavior.childFriendly)]
            let dataTrain = [Number(breed.care.trainingDifficulty)]

            createChart(dataEx, "Exercise needs")
            createChart(dataTrain, "Training Difficulty")
            createChart(dataFam, "Family Affection")
            createChart(dataChild, "Child Friendly")
        }

    }
}


function createChart(chartData, chartTitle) {
    const canvas = document.createElement("canvas")
    figureChart.appendChild(canvas)
    canvas.width = 160
    canvas.height = canvas.width * 0.6

    return new Chart(canvas, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                axis: 'y',
                fill: false,
                showLine: true,
                tension: 0,
                borderColor: "rgb(16, 102, 201)",
                borderWidth: 2,
                pointBorderColor: "rgb(16, 102, 201)",
                pointBackgroundColor: "rgb(16, 102, 201)",
                pointRadius: 8,
                data: chartData
            }]
        },
        options: {
            responsive: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: chartTitle,
                    font: {
                        size: 18,
                        weight: 'bold',
                        family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    },
                    align: 'center'
                }
            },
            indexAxis: 'y',
            scales: {
                x: {
                    type: 'linear',
                    min: 0,
                    max: 6,
                    ticks: {
                        stepSize: 1,
                        font: {
                            weight: 'bold',
                            size: 14
                        },
                        callback: function (value) {
                            return value === 6 || value === 0 ? '' : value;
                        }
                    },
                    grid: {
                        tickLength: 5
                    }
                },
                y: {
                    ticks: {
                        font: {
                            weight: 'bold',
                            size: 14
                        },
                        mirror: true,
                        callback: function (value) {
                            return value === 0 ? '' : value;
                        }
                    },
                    grid: {
                        tickLength: 5
                    }
                }
            },
            layout: {
                padding: {
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10
                }
            }
        }
    });
}



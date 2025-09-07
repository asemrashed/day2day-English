const apiUrl = 'https://openapi.programming-hero.com/api'

// scroll effect
function scrollToElement(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' }); 
    }
}
const learnBtn = document.querySelectorAll('.learnBtn')
learnBtn.forEach(btn => {
    btn.addEventListener('click', ()=> scrollToElement('lesson-section'))
})
const faqBtn = document.querySelectorAll('.faqBtn')
faqBtn.forEach(btn => {
    btn.addEventListener('click', ()=> scrollToElement('faq-section'))
})
// text to audio
function speak(text, rate=1, pitch=1, volume=1) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    speechSynthesis.speak(utterance);
}

// button section
const loadLessons = () => {
    fetch(`${apiUrl}/levels/all`)
        .then(res => res.json())
        .then(json => displayLessonsBtn(json.data))
        .catch(error => console.log(error))
}
const displayLessonsBtn = (lessons) => {
    const btnContainer = document.getElementById('btn-container')
    btnContainer.innerHTML = ""
    for (let lesson of lessons) {
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
            <button onclick= "loadLevel(${lesson.level_no})" id="lesson${lesson.level_no}" class="btn btn-xs lesson-btn md:btn-md border-none bg-gray-100  text-blue-600 shadow-md shadow-slate-300 hover:shadow-lg hover:bg-blue-800 hover:text-white">
                <i class="fa-solid fa-book-open"></i>
                Lesson ${lesson.level_no}
            </button>
        `
        btnContainer.appendChild(btnDiv)
    }
}
loadLessons()

const handleSearch = () => {
    removeActive()
    const input = document.getElementById('inputTxt')
    const value = input.value.trim().toLowerCase()
    fetch(apiUrl + '/words/all')
        .then(res => res.json())
        .then(json => {
            const filteredWords = json.data.filter(searhed => {
                const result = searhed.word.toLowerCase().includes(value)
                return result
            })
            displayLessonsWord(filteredWords)
            input.value= ""
        })
}
const searchBtn = document.getElementById('searchBtn')
searchBtn.addEventListener('click', handleSearch)
// loading section
const loading = document.getElementById('loading')
const handleLoading = (status) => {
    if (status == true) {
        lessonContainer.classList.add('hidden')
        loading.classList.remove('hidden')
        loading.classList.add('loadingDiv')
    } else {
        loading.classList.add('hidden')
        lessonContainer.classList.remove('hidden')
        loading.classList.remove('loadingDiv')
    }
}

// Lesson section
const removeActive = () => {
    const lessonBTn = document.querySelectorAll('.lesson-btn')
    lessonBTn.forEach(btn => btn.classList.remove('active'))
}
const loadLevel = (id) => {
    const btn = document.getElementById(`lesson${id}`)
    handleLoading(true)
    fetch(`${apiUrl}/level/${id}`)
        .then(res => res.json())   
        .then((datas) => {
            removeActive()
            btn.classList.add('active')
            displayLessonsWord(datas.data)
        })
        .catch(err => console.log(err))
}

const lessonContainer = document.getElementById('lesson-container')
const displayLessonsWord = (words) => {
    lessonContainer.innerHTML = ``
    if (words.length > 0) {
        lessonContainer.style.display = 'grid';
        for (let word of words) {
            const wordDiv = document.createElement("div")
            wordDiv.innerHTML = `
            <div class="card col-span-1 bg-white text-neutral-content text-black ">
                <div class="card-body items-center text-center">
                    <h2 class="card-title">${word.word ? word.word :'Not found'}</h2>
                    <p>Meaning /Pronounciation</p>
                    <h2 class='text-lg text-[#18181B] font-bold'>${word.meaning? word.meaning:'অর্থ পাওয়া যায়নি'}/${word.pronunciation? word.pronunciation:'শব্দ পাওয়া যায়নি'}</h2>
                    <div class="w-full card-actions justify-between mt-2">
                        <button id="modalBtn" onclick="loadWordDetails(${word.id})" class="btn bg-blue-100 border-none"><img src="../assets/Vector.svg" alt="info"></button>
                        <button id="voiceBtn" onclick="speak('${word.word}')" class="btn bg-blue-100 border-none"><i class="fa-solid fa-volume-high"></i></button>
                    </div>
                </div>
            </div>
        `
        lessonContainer.appendChild(wordDiv)
        }
        handleLoading(false)
    } else {
        lessonContainer.style.display = 'block';
        const wordDiv = document.createElement("div")
            wordDiv.innerHTML = `
            <div class="flex col-span-3 flex-col items-center justify-center rounded-xl gap-4 py-5 md:py-10 bg-slate-200">
                <img src="../assets/alert-error.png" alt="alert">
                <p class="text-xs md:text-sm text-orange-600"><span class="bangla-font">এই </span>Lesson <span class="bangla-font">এ এখনো কোন</span> Vocabulary <span class="bangla-font">যুক্ত করা হয়নি।</span></p>
                <h2 class="text-xl md:text-2xl text-blue-700 font-semibold">
                    <span class="bangla-font">নেক্সট</span> Lesson <span class="bangla-font">এ যান</span>
                </h2>
            </div>
        `
        lessonContainer.appendChild(wordDiv)
        handleLoading(false)
    }
}

// Modal section
const loadWordDetails = (id) => {
    fetch(`${apiUrl}/word/${id}`)
        .then(res => res.json())
        .then(json => displayModal(json.data))
        .catch(err => console.log(err))
}
const displayModal = (lesson) => {
    const modalContainer = document.getElementById('modalContainer')
    modalContainer.innerHTML = ""
    const modalDiv = document.createElement('div')
    modalDiv.innerHTML = `
        <dialog id="my_modal_5" class="w-full modal modal-bottom sm:modal-middle">
            <div class="modal-box full">
              <h2 class="text-lg font-bold">${lesson.word} (<i class="fa-solid fa-microphone-lines"></i>: ${lesson.meaning} )</h2>
              <p class="mt-4 font-bold">Meaning</p>
              <p class="bangla-font" >${lesson.meaning}</p>

              <p class="mt-4 font-bold">Example</p>
              <p class="bangla-font" >${lesson.sentence}</p>

              <p class="mt-4 font-bold bangla-font">সমার্থক শব্দ গুলো</p>
              <div id="btns flex gap-2">
              ${lesson.synonyms.map(syno => `<button class="px-2 py-1 border text-sm border-gray-300 rounded-md">${syno}</button>`).join(" ")}
              </div>
              <div class="modal-action">
              <form method="dialog">
                  <button class="btn bg-blue-600 text-white hover:bg-blue-700 border-none">Complete Learning</button>
              </form>
              </div>
          </div>
        </dialog>
    `
    modalContainer.appendChild(modalDiv)
    my_modal_5.showModal()
}


faqDetails = [
    {
        id: 1, que: "How can I start learning English on this  ?",
        ans: "You can start by exploring our beginner lessons, interactive exercises, and quizzes. We also offer structured courses to guide you step by step."
    },
    {
        id: 2, que: "Is this website free to use?",
        ans: "Yes, Its free to use."
    },
    {
        id: 3, que: "Do I need to create an account?",
        ans: "It would be awesome, but you can learn without any account also."
    },
    {
        id: 4, que: "How can I build my English vocabulary?",
        ans: "Follow our lessons step by step."
    },
    {
        id: 5, que: "Do you offer certificates for completed courses?",
        ans: "For now, ans is no, But we plan for future."
    },
]
// FaQ section
const loadFaq = (faqs) => {
    const faqContainer = document.getElementById("faq-container")
    faqContainer.innerHTML= ''
    for (let faq of faqs) {
        const faqDiv = document.createElement("div")
        faqDiv.innerHTML = `
            <div class="w-full flex flex-col bg-slate-200 p-3 rounded-sm md:rounded-md gap-2">
                <div class="flex justify-between font-semibold text-sm">
                    <p>${faq.id}. ${faq.que}</p>
                    <button onclick='toggleFaq(${faq.id})' id="faqBtn${faq.id}" class="faqbtn cursor-pointer">+</button>
                </div>
                <div id="faqAns${faq.id}" class="ans text-sm hidden">=>${faq.ans}</div>
            </div>
        `
        faqContainer.appendChild(faqDiv)
    }

}
loadFaq(faqDetails)
// FAQ Toggling
let toggled = false
const toggleFaq = (id) => {
    const btn = document.getElementById(`faqBtn${id}`)
    const ans = document.getElementById(`faqAns${id}`)
    toggled = !toggled
    if (toggled) {
        btn.innerText = '+' ? '-' : '+'
        ans.style.display= 'block'
    } else {
        btn.innerText = '-' ? '+' : '-'
        ans.style.display= 'none'
    }
}



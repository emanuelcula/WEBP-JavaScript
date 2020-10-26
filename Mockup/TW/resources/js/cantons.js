// ALL CANTON NAMES WITH THEIR SHORTCUT
let canton_list = [
    { name: 'Zürich', code: 'ZH' },
    { name: 'St. Gallen', code: 'SG' },
    { name: 'Graubünden', code: 'GB' },
  
];

// SELECT SEARCH CANTON ELEMENTS
const search_canton_element = document.querySelector(".search-canton");
const canton_list_element = document.querySelector(".canton-list");
const change_canton_btn = document.querySelector(".change-canton");
const close_list_btn = document.querySelector(".close");
const input = document.getElementById('search-input')

// CREATE THE CANTON LIST
function createcantonList(){
    const num_cantons = canton_list.length;

    let i = 0, ul_list_id;

    canton_list.forEach( (canton, index) => {
        if( index % Math.ceil(num_cantons/num_of_ul_lists) == 0){
            ul_list_id = `list-${i}`;
            canton_list_element.innerHTML += `<ul id='${ul_list_id}'></ul>`;
            i++;
        }

        document.getElementById(`${ul_list_id}`).innerHTML += `
            <li onclick="fetchData('${canton.name}')" id="${canton.name}">
            ${canton.name}
            </li>
        `;
    })
}

let num_of_ul_lists = 3;
createcantonList();

// SHOW/HIDE THE CANTON LIST ON CLICK EVENT
change_canton_btn.addEventListener("click", function(){
    input.value = "";
    resetcantonList();
    search_canton_element.classList.toggle("hide");
    search_canton_element.classList.add("fadeIn");
});

close_list_btn.addEventListener("click", function(){
    search_canton_element.classList.toggle("hide");
});

canton_list_element.addEventListener("click", function(){
    search_canton_element.classList.toggle("hide");
});

// CANTON FILTER
/* input event fires up whenever the value of the input changes */
input.addEventListener("input", function(){
    let value = input.value.toUpperCase();

    canton_list.forEach( canton => {
        if( canton.name.toUpperCase().startsWith(value)){
            document.getElementById(canton.name).classList.remove("hide");
        }else{
            document.getElementById(canton.name).classList.add("hide");
        }
    })
})

// RESET CANTON LIST (SHOW ALL THE CANTONS )
function resetcantonList(){
    canton_list.forEach( canton => {
        document.getElementById(canton.name).classList.remove("hide");
    })
}
const categories =  Array.from(document.getElementsByClassName("category"));
console.log(categories);

categories.forEach(category => {
    category.addEventListener('click', e => {
        const choice = e.target; 
        console.log(choice);
        const selectedCategory = choice.dataset["category"];
        console.log(selectedCategory);
        localStorage.setItem('chosenCategory',selectedCategory);
        return window.location.assign("./game.html");
    })
});
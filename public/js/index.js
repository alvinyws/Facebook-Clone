//FRONTEND JAVASCRIPT
function attachClickEvents() {
    const stories = document.querySelectorAll(".story");
    for (let story of stories) {
        submit(story);
        edit(story);
        ConfirmRemove(story);
    }
}

function submit(story) {
    const button = document.querySelector("#submitbutton");

    button.addEventListener("click", (e) => {
        e.preventDefault();
        storyId = story.dataset.id;

        fetch(`http://localhost:3000/story/${storyId}`, {
            method: "POST"
        }).then((res) => res.json())

        console.log('Story successfully posted.')
    });
}


function edit(story) {
    const content = document.querySelector(".story");
    const edButton = story.querySelector("#editButton");

    edButton.addEventListener("click", (e) => {
        e.preventDefault();
        storyId = story.dataset.id;
        // const input = document.createElement('input');

        fetch(`http://localhost:3000/story/${storyId}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' }
        }).then(() => {
            content.contentEditable = true;
            content.style.backgroundColor = "#dddbdb";
            // input.type = 'text';
            // input.value = story.textContent;
            edButton.innerText = 'Save';
            // await story.save();
        }).then((res) => res.json())
            .catch(err => console.log('Story edit failed!'))

    });
}


function ConfirmRemove(story) {
    const delButton = story.querySelector("#deleteButton");

    delButton.addEventListener("click", (e) => {
        e.preventDefault();
        storyId = story.dataset.id;
        let result = confirm("Are you sure you want to delete?");

        fetch(`http://localhost:3000/story/${storyId}`, {
            method: "DELETE"
        }).then(async () => {
            if (result == true) {
                await story.remove();
                console.log('Story has been deleted.');
            } else {
                return false;
            }
        }).catch(err => console.error)
    });
}


document.addEventListener("DOMContentLoaded", attachClickEvents);
const JSON_URL = "https://shahnawazhussain28.github.io/webdata.json"
const BASE_FOLDER = "https://shahnawazhussain28.github.io/"

async function fetchAndDisplayProjects() {
    let webContainer = document.getElementById("project-container");
    let res = await fetch(JSON_URL);
    let json = await res.json();
    let content = 
        `<div class="row">
            <div class="card col-sm m-1">
                <img class="card-img-top h-50" src="https://static.wixstatic.com/media/713b90_7841ba78e810446f8765776b69ee76e3~mv2.png" alt="Project Image">
                <div class="card-body">
                    <h5 class="card-title">Unfair Chat</h5>
                    <p class="card-text">A fully fledged chatting application with some Unfair features</p>
                    <p class="card-text"> Technologies: 
                        <span class="px-2 py-1 bg-dark text-white rounded">React</span> 
                        <span class="px-2 py-1 bg-dark text-white rounded">Bootstrap</span>
                        <span class="px-2 py-1 bg-dark text-white rounded">Node</span> 
                        <span class="px-2 py-1 bg-dark text-white rounded">Express</span> 
                        <span class="px-2 py-1 bg-dark text-white rounded">Socket</span> 
                        <span class="px-2 py-1 bg-dark text-white rounded">Full Stack</span> 
                        <span class="px-2 py-1 bg-dark text-white rounded">RestAPI</span> 
                    </p>
                    <a href="https://unfairchat.onrender.com" class="btn btn-primary">DEMO</a>
                </div>
            </div>
    `;
    for (let i = 0; i < json.length; i++) {
        content += `
            ${(i+1) % 3 == 0 ? `</div> <div class="row">` : ``}
            <div class="card col-sm m-1">
                <img class="card-img-top h-50" style="object-fit: cover;" src="${BASE_FOLDER+json[i].thumbLink}" alt="Project Image">
                <div class="card-body">
                    <h5 class="card-title">${json[i].name}</h5>
                    <p class="card-text">${json[i].description}</p>
                    <p class="card-text"> Technologies: 
                    ${json[i].tech.map(t => (
                        `<span class="px-2 py-1 bg-dark text-white rounded"> ${t} </span>`
                    ))}
                    </p>
                    <a href="${BASE_FOLDER+json[i].link}" class="btn btn-primary">DEMO</a>
                </div>
            </div>`
    }
    webContainer.innerHTML = content;
}

fetchAndDisplayProjects()
class Github {
    constructor() {
        this.client_id = 'c495535cd03407d1a1f4';
        this.client_secret = 'e2f7788d1ee9ee666bf4d6b20358a6bc4e5fe6aa';
        this.repos_count = 5;
        this.repos_sort = 'created: asc';
    }

    async getUser(user) {
        const profileResponse = await fetch(`https://api.github.com/users/${user}?client_id=${this.client_id}&client_secret=${this.client_secret}`);

        const repoResponse = await fetch(`https://api.github.com/users/${user}/repos?per_page=${this.repos_count}&sort=${this.repos_sort}&client_id=${this.client_id}&client_secret=${this.client_secret}`);

        const profile = await profileResponse.json();
        const repos = await repoResponse.json();

        return {
            profile,
            repos
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class UI{
    constructor() {
        this.profile = document.getElementById('profile');
    }

    // display profile
    showProfile(user) {
        // this.clearAlert();
        this.profile.innerHTML = `
            <div class="card card-body mb3">
                <div class="row">
                    <div class="col-md-3">
                        <img src="${
                        user.avatar_url
                        }" alt="image" class="img-fluid mb-2">
                        <a href="${
                        user.html_url
                        }" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
                    </div>
                    <div class="col-md-9">
                        <span class="badge badge-primary">Public Repos: ${
                        user.public_repos
                        }</span>
                        <span class="badge badge-secondary">Public Gists: ${
                        user.public_gists
                        }</span>
                        <span class="badge badge-success">Public Follwers: ${
                        user.followers
                        }</span>
                        <span class="badge badge-info">Public Following: ${
                        user.following
                        }</span>
                        <br><br>
                        <ul class="list-group">
                            <li class="list-group-item">Company: ${
                            user.company
                            }</li>
                            <li class="list-group-item">Website/Blog: ${
                            user.blog
                            }</li>
                            <li class="list-group-item">Location: ${
                            user.location
                            }</li>
                            <li class="list-group-item">Member Since: ${
                            user.created_at
                            }</li>
                        </ul>
                    </div>
                </div>
        </div>
        <h3 class="page-heading mb-3">Latest Repos</h3>
        <div id="repos"></div>
        `;
    }

    // Display Repos
    showRepos(repos){
        let output = '';

        repos.forEach(repo=>{
            output += `
                <div class="card card-body mb-2">
                    <div class="row">
                        <div class="col-md-6">
                            <a href="${
                              repo.html_url
                            }" target="_blank">${repo.name}</a>
                        </div>
                        <div class="col-md-6">
                            <span class="badge badge-primary">Stars: ${repo.stargazers_count}</span>
                            <span class="badge badge-secondary">Watchers: ${repo.watchers_count}</span>
                            <span class="badge badge-success">Fork: ${repo.forks_count}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        // Output repos
        document.getElementById('repos').innerHTML = output;
    }

    // show alert message 
    showAlert(message, className){
        // Clear any remaining alert
        this.clearAlert();
        // Create div
        const div = document.createElement('div');
        // Add classes
        div.className = className;
        // Add text
        div.appendChild(document.createTextNode(message));
        // Get parent 
        const container = document.querySelector('.searchContainer');
        // Get search box
        const search = document.querySelector('.search');
        // Insert alert
        container.insertBefore(div, search);

        // Timeout after 3 sec
        setTimeout(()=>{
            this.clearAlert();
        },3000);
    }
    // clear Alert messge
    clearAlert() {
        const currentAlert = document.querySelector('.alert');

        if(currentAlert){
            currentAlert.remove();
        }
    }

    // clear profile 
    clearProfile(){
        this.profile.innerHTML = '';
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Init
const github = new Github;
const ui = new UI;
// Search Input
const searchUser = document.getElementById('searchUser');


// Search input event listener
searchUser.addEventListener('keyup', e=>{
    // Get input text
    const userText = e.target.value;

    if(userText !== ''){
        github.getUser(userText)
            .then(data => {
                if(data.profile.message === 'Not Found'){
                    // Show alert
                    ui.showAlert('User not founded', 'alert alert-danger');
                }else {
                    // Show profile
                    ui.showProfile(data.profile);
                    // Show repos
                    ui.showRepos(data.repos);
                }
            })
    }else {
        // clear profile
        ui.clearProfile();
    }
});
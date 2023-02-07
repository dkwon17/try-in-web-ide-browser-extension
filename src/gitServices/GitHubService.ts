import { getCurrentEndpoint } from "../preferences";
import { GitService } from "./GitService";
import { getProjectURL } from "./util";

export class GitHubService implements GitService {

    /**
     * @returns true if current page is a GitHub page to inject the button to
     */
    public static matches(): boolean {
        const actionBarExists = window.document.getElementsByClassName('file-navigation').length > 0;
        const btnGroupExists = window.document.getElementsByClassName('BtnGroup').length > 0;
        return actionBarExists && btnGroupExists;
    }

    public async injectButton() {
        const project = getProjectURL();
        const container = document.createElement('div');
        container.className = 'float-right';
        const link = window.document.createElement('a');

        const currentEndpoint = await getCurrentEndpoint();
        link.href = currentEndpoint.url + '/#' + project;
        link.target = '_blank';
        link.title = 'Open the project on ' + currentEndpoint.url;
        link.className = 'btn btn-primary ml-2'
        link.appendChild(window.document.createTextNode('Web IDE'));
        container.appendChild(link);

        const actionBar = window.document.querySelector('.file-navigation');
        const btnGroup = actionBar.getElementsByClassName('BtnGroup');
        // if (btnGroup && btnGroup.length > 0 && btnGroup[0].classList.contains('float-right')) {
        //     actionBar.insertBefore(link, btnGroup[0]);
        // } else {
        //     actionBar.appendChild(link);
        // }

        // const html = `
        // <div class="my-prefix-btn-group ml-2">
        //     <button type="button" class="my-prefix-btn my-prefix-btn-primary">Web IDE</button>
        //     <button type="button" class="my-prefix-btn my-prefix-btn-primary my-prefix-dropdown-toggle my-prefix-dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        //     <span class="sr-only">Toggle Dropdown</span>
        //     </button>
        //     <div class="my-prefix-dropdown-menu">
        //     <a class="my-prefix-dropdown-item" href="#">Action</a>
        //     <a class="my-prefix-dropdown-item" href="#">Another action</a>
        //     <a class="my-prefix-dropdown-item" href="#">Something else here</a>
        //     <div class="my-prefix-dropdown-divider"></div>
        //     <a class="my-prefix-dropdown-item" href="#">Separated link</a>
        //     </div>
        // </div>
        // `;

        // <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossorigin="anonymous"></script>
        // <script src="
        // https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.min.js
        // "></script>


    //     const html = `
    //     <div class="dropdown">
    //     <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
    //       Dropdown button
    //     </button>
    //     <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    //       <li><a class="dropdown-item" href="#">Action</a></li>
    //       <li><a class="dropdown-item" href="#">Another action</a></li>
    //       <li><a class="dropdown-item" href="#">Something else here</a></li>
    //     </ul>
    //   </div>
    //     `;

        const html = `
        <div class="tiki dropdown">
        <button class="tiki btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
          Dropdown button
        </button>
        <ul class="tiki dropdown-menu" aria-labelledby="dropdownMenuButton1">
          <li><a class="tiki dropdown-item" href="#">Action</a></li>
          <li><a class="tiki dropdown-item" href="#">Another action</a></li>
          <li><a class="tiki dropdown-item" href="#">Something else here</a></li>
        </ul>
      </div>
        `;

        actionBar.innerHTML += html;
    }
}

import ReactDOM from "react-dom/client";

import { Endpoint } from "../../../../preferences/preferences";
import { GitHubButtonInjector } from "../GitHubButtonInjector";
import { Button } from "../Button";
import { getProjectURL } from "../../util";

export interface GitHubInjectionStrategy {
    inject(endpoints: Endpoint[]): Promise<void>
}

export function getInjectionStrategy(): GitHubInjectionStrategy | undefined {
    if (isFileNavigationStrategy()) {
        return new FileNavigationStrategy();
    }

    if (isButtonStrategy()) {
        return new ButtonStrategy();
    }
    return undefined;
}


export class FileNavigationStrategy implements GitHubInjectionStrategy {

    private static GITHUB_ELEMENT = ".file-navigation";

    public async inject(endpoints: Endpoint[]) {

        const ghElement = document.querySelector(
            FileNavigationStrategy.GITHUB_ELEMENT
        );
        if (!ghElement) {
            throw new Error(
                `Could find element (${FileNavigationStrategy.GITHUB_ELEMENT}) to inject button into.`
            );
        }

        const rootElement = document.createElement("div");
        rootElement.id = GitHubButtonInjector.BUTTON_ID;
        const root = ReactDOM.createRoot(rootElement);
        root.render(
            <Button endpoints={endpoints} projectURL={getProjectURL()} additionalClasses={['ml-2']}/>
        );

        if (document.getElementById(GitHubButtonInjector.BUTTON_ID)) {
            return;
        }

        ghElement.appendChild(rootElement);
    }
}

export class ButtonStrategy implements GitHubInjectionStrategy {
    public async inject(endpoints: Endpoint[]) {
        const codeBtn = this.getCodeBtn();
        const rootElement = document.createElement("div");
        rootElement.id = GitHubButtonInjector.BUTTON_ID;
        const root = ReactDOM.createRoot(rootElement);
        root.render(
            <Button endpoints={endpoints} projectURL={getProjectURL()} />
        );

        if (document.getElementById(GitHubButtonInjector.BUTTON_ID)) {
            return;
        }

        codeBtn.parentElement.appendChild(rootElement);
    }

    private getCodeBtn(): HTMLElement | undefined {
        const btnList = document.getElementsByTagName(
            "button"
        );
        for (const btn of btnList) {
            if ((btn as HTMLElement).innerText.indexOf("Code") > -1) {
                return btn as HTMLElement;
            }
        }
        return undefined;
    }
}

function isFileNavigationStrategy() {
    const actionBar = document.querySelector(
        ".file-navigation"
    );

    if (!actionBar) {
        return false;
    }

    return codeBtnExists(actionBar);
}

function codeBtnExists(element: Element): boolean {
    const btnList = element.getElementsByTagName(
        "summary"
    );
    for (const btn of btnList) {
        if ((btn as HTMLElement).innerText.indexOf("Code") > -1) {
            return true;
        }
    }
    return false;
}

function isButtonStrategy() {
    const btnList = document.getElementsByTagName(
        "button"
    );
    for (const btn of btnList) {
        if ((btn as HTMLElement).innerText.indexOf("Code") > -1) {
            return true;
        }
    }
    return false;
}
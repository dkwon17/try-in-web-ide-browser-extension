import ReactDOM from "react-dom/client";

import { Endpoint } from "../../../../preferences/preferences";
import { GitHubButtonInjector } from "../GitHubButtonInjector";
import { Button } from "../Button";
import { getProjectURL } from "../../util";

// The 'Dev Spaces' button is injected into the GitHub UI in one of two ways.
// This is because GitHub updated it's front-end UI, rendering the old method of injecting the button obsolete.
// The old method still needs to be supported however, to support for older GitHub Enterprise instances.
//
// FileNavigationStrategy: Injects the 'Dev Spaces' button into the '.file-navigation' div. This is the old method of injecting the button.
// ButtonStrategy: Injects the 'Dev Spaces' button by finding the 'Code' button and injecting the button into it's parent div.
export interface GitHubInjectionStrategy {
    inject(endpoints: Endpoint[]): Promise<void>;
}

export function getInjectionStrategy(): GitHubInjectionStrategy | undefined {
    if (FileNavigationStrategy.matches()) {
        return new FileNavigationStrategy();
    }

    if (ButtonStrategy.matches()) {
        return new ButtonStrategy();
    }
    return undefined;
}


/**
 * Injects the 'Dev Spaces' button into the '.file-navigation' div.
 */
export class FileNavigationStrategy implements GitHubInjectionStrategy {

    private static GITHUB_ELEMENT = ".file-navigation";

    public static matches(): boolean {
        const actionBar = document.querySelector(
            ".file-navigation"
        );
    
        if (!actionBar) {
            return false;
        }
    
        return this.codeBtnExists(actionBar);
    }

    private static codeBtnExists(element: Element): boolean {
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

/**
 * Injects the 'Dev Spaces' button into the parent div of the '<button> <> Code </button>' element.
 */
export class ButtonStrategy implements GitHubInjectionStrategy {

    public static matches(): boolean {
        return !!this.getCodeBtn();
    }

    private static getCodeBtn(): HTMLElement | undefined {
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

    public async inject(endpoints: Endpoint[]) {
        const codeBtn = ButtonStrategy.getCodeBtn();
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


}

/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import ReactDOM from "react-dom/client";

import { Endpoint } from "../../../../preferences/preferences";
import { GitHubButtonInjector } from "../GitHubButtonInjector";
import { Button } from "../Button";
import { getProjectURL } from "../../util";
import { GitHubInjectionStrategy } from './GitHubInjectionStrategy';

/**
 * Injects the 'Dev Spaces' button into the '.file-navigation' div.
 * 
 * In this case, the GitHub 'Code' button is a <summary> element, which is a descendant of the '.file-navigation' div.
 */
export class FileNavigationStrategy implements GitHubInjectionStrategy {

    private static GITHUB_ELEMENT = ".file-navigation";

    /**
     * @returns true if current page is a GitHub page with the file-navigation div
     */
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

    /**
     * Injects the 'Dev Spaces' button into the file-navigation div.
     * @param endpoints array of Dev Spaces endpoints
     */
    public async inject(endpoints: Endpoint[]): Promise<void> {

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

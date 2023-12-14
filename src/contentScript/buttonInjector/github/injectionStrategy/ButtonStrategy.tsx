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
 * Injects the 'Dev Spaces' button into the parent div of the 'Code' button.
 * 
 * In this case, the GitHub 'Code' button is a <button> element.
 */
export class ButtonStrategy implements GitHubInjectionStrategy {

    /**
     * @returns true if current page is a GitHub page with the 'Code' <button> element
     */
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

    /**
     * Injects the 'Dev Spaces' button into the parent div of the 'Code' button.
     * @param endpoints array of Dev Spaces endpoints
     */
    public async inject(endpoints: Endpoint[]): Promise<void> {
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

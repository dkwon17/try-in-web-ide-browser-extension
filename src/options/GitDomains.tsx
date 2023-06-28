/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { useEffect, useState } from "react";

import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/utilities/Spacing/spacing.css";
import "@patternfly/patternfly/utilities/Float/float.css";

import {
    getGitDomains,
    saveGitDomains,
} from "../preferences/preferences";
import { GitDomainList } from './GitDomainList';
import { sanitizeUrl } from './util';
import { FormUI } from './FormUI';

export const GitDomains = () => {
    const [domains, setDomains] = useState<string[]>([]);

    useEffect(() => {
        updateDomains().catch(console.error);
    }, []);

    const updateDomains = async () => {
        const domains = await getGitDomains();
        setDomains(domains);
    };

    const addNewDomain = async (newDomain: string) => {
        const sanitizedDomain = sanitizeUrl(newDomain);
        const granted = await promptPermissions(sanitizedDomain);

        if (!granted) {
            return false;
        }

        const newDomains = [...domains, sanitizedDomain];
        await saveGitDomains(newDomains);
        await updateDomains();
        return true;
    };

    const deleteDomain = async (domain: string) => {
        const removed = await removePermissions(domain);
        console.log(`removed: ${removed} for domain: ${domain}`)
        if (!removed) {
            return;
        }

        const newDomains = domains.filter((d) => d != domain);

        await saveGitDomains(newDomains);
        await updateDomains();
    };

    const promptPermissions = (domain: string) => {
        return chrome.permissions.request({
            permissions: ['scripting'],
            origins: [ getOriginPattern(domain) ]
        });
    }

    const removePermissions = (domain: string) => {
        return chrome.permissions.remove({
            origins: [ getOriginPattern(domain) ]
        });
    }

    const getOriginPattern = (domain: string) => {
        return domain + "/*";
    }

    const list = domains.length && (
        <GitDomainList
            domains={domains}
            onClickDelete={deleteDomain}
        />
    );

    return (
        <FormUI onAdd={addNewDomain}
        textInputInvalidText={["Provide the URL of your GitHub Enterprise instance, e.g.,", <br/> ,"https://github.my-company.com"]}
        textInputAriaLabel="add github enterprise domain"
        textInputPlaceholder="Add GitHub Enterprise domain"
        >
            {list}
        </FormUI>
    );
};

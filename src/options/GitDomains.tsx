/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { Fragment, useEffect, useState } from "react";

import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/utilities/Spacing/spacing.css";
import "@patternfly/patternfly/utilities/Float/float.css";

import { Button } from "@patternfly/react-core/components/Button";
import {
    Card,
    CardBody,
    CardTitle,
} from "@patternfly/react-core/components/Card";
import { Divider } from "@patternfly/react-core/components/Divider";
import { Split, SplitItem } from "@patternfly/react-core/layouts/Split";
import { Form, FormGroup } from "@patternfly/react-core/components/Form";
import { TextInput } from "@patternfly/react-core/components/TextInput";
import { ExclamationCircleIcon } from "@patternfly/react-icons/dist/js/icons/exclamation-circle-icon";

import {
    getGitDomains,
    saveGitDomains,
} from "../preferences/preferences";
import { GitDomainList } from './GitDomainList';

export const GitDomains = () => {
    const [domains, setDomains] = useState<string[]>([]);
    const [newDomain, setNewDomain] = useState<string>("");

    type validate = "success" | "error" | "default";
    const [newDomainStatus, setNewDomainStatus] =
        useState<validate>("default");

    useEffect(() => {
        updateDomains().catch(console.error);
    }, []);

    const updateDomains = async () => {
        const domains = await getGitDomains();
        setDomains(domains);
    };

    const handleNewEndpointUrlChange = (
        newUrl: string,
        _event: React.FormEvent<HTMLInputElement>
    ) => {
        setNewDomain(newUrl);
        if (newUrl === "") {
            setNewDomainStatus("default");
        } else if (isUrl(newUrl)) {
            setNewDomainStatus("success");
        } else {
            setNewDomainStatus("error");
        }
    };

    const isUrl = (str: string) => {
        try {
            new URL(str);
        } catch {
            return false;
        }
        return true;
    };

    const addNewDomain = async () => {
        const sanitizedDomain = sanitizeDomain(newDomain);
        const granted = await promptPermissions(sanitizedDomain);

        if (!granted) {
            setNewDomain("");
            setNewDomainStatus("default");
            return;
        }

        const newDomains = [...domains, sanitizedDomain];
        await saveGitDomains(newDomains);
        await updateDomains();
        setNewDomain("");
        setNewDomainStatus("default");
    };



    const sanitizeDomain = (str: string) => {
        let res = str;
        while (res.charAt(res.length - 1) === "/") {
            res = res.substring(0, res.length - 1);
        }
        return res;
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

    const helperTextInvalid = (
        <Split className="pf-u-mt-xs">
            <SplitItem>
                <ExclamationCircleIcon
                    color="var(--pf-global--danger-color--100)"
                    className="pf-u-mr-xs"
                />
            </SplitItem>
            <SplitItem>
                <div className="pf-c-form__helper-text pf-m-error">
                    Provide the URL of your Dev Spaces installation, e.g.,
                    https://devspaces.mycluster.mycorp.com
                </div>
            </SplitItem>
        </Split>
    );

    return (
        <Fragment>
            {list}
            <Divider className="pf-u-mt-md pf-u-mb-md" />
            <Split>
                <SplitItem className="form-text-input">
                    <Form>
                        <FormGroup
                            validated={newDomainStatus}
                            helperTextInvalid={helperTextInvalid}
                            helperTextInvalidIcon={<ExclamationCircleIcon />}
                        >
                            <TextInput
                                type="text"
                                aria-label="new endpoint"
                                validated={newDomainStatus}
                                value={newDomain}
                                placeholder="Add GitHub Enterprise domain"
                                onChange={handleNewEndpointUrlChange}
                            />
                        </FormGroup>
                    </Form>
                </SplitItem>
                <SplitItem className="form-fill" isFilled></SplitItem>
                <SplitItem>
                    <Button
                        variant="primary"
                        onClick={addNewDomain}
                        isDisabled={
                            newDomain.length === 0 ||
                            newDomainStatus === "error"
                        }
                    >
                        Add
                    </Button>
                </SplitItem>
            </Split>
        </Fragment>
    );
};

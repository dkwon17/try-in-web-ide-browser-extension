/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { Fragment, PropsWithChildren, ReactNode, useEffect, useState } from "react";

import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/utilities/Spacing/spacing.css";
import "@patternfly/patternfly/utilities/Float/float.css";

import { Button } from "@patternfly/react-core/components/Button";
import { Divider } from "@patternfly/react-core/components/Divider";
import { Split, SplitItem } from "@patternfly/react-core/layouts/Split";
import { Form, FormGroup } from "@patternfly/react-core/components/Form";
import { TextInput } from "@patternfly/react-core/components/TextInput";
import { ExclamationCircleIcon } from "@patternfly/react-icons/dist/js/icons/exclamation-circle-icon";

interface Props {
    onAdd: (str: string) => Promise<boolean>;
    textInputInvalidText: ReactNode[];
    textInputAriaLabel: string;
    textInputPlaceholder: string;
}

export const FormUI = (props: PropsWithChildren<Props>) => {
    const [newUrl, setNewUrl] = useState<string>("");

    type validate = "success" | "error" | "default";
    const [newUrlStatus, setNewUrlStatus] =
        useState<validate>("default");

    const handleNewUrlChange = (
        newUrl: string,
        _event: React.FormEvent<HTMLInputElement>
    ) => {
        setNewUrl(newUrl);
        if (newUrl === "") {
            setNewUrlStatus("default");
        } else if (isUrl(newUrl)) {
            setNewUrlStatus("success");
        } else {
            setNewUrlStatus("error");
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
                    {props.textInputInvalidText}
                </div>
            </SplitItem>
        </Split>
    );

    return (
        <Fragment>
            {props.children}
            <Divider className="pf-u-mt-md pf-u-mb-md" />
            <Split>
                <SplitItem className="form-text-input">
                    <Form>
                        <FormGroup
                            validated={newUrlStatus}
                            helperTextInvalid={helperTextInvalid}
                            helperTextInvalidIcon={<ExclamationCircleIcon />}
                        >
                            <TextInput
                                type="text"
                                aria-label={props.textInputAriaLabel}
                                validated={newUrlStatus}
                                value={newUrl}
                                placeholder={props.textInputPlaceholder}
                                onChange={handleNewUrlChange}
                            />
                        </FormGroup>
                    </Form>
                </SplitItem>
                <SplitItem className="form-fill" isFilled></SplitItem>
                <SplitItem>
                    <Button
                        variant="primary"
                        onClick={() => {
                            props.onAdd(newUrl).then((success) => {
                                if (success) {
                                    setNewUrl("");
                                    setNewUrlStatus("default");
                                }
                            });
                        }}
                        isDisabled={
                            newUrl.length === 0 ||
                            newUrlStatus === "error"
                        }
                    >
                        Add
                    </Button>
                </SplitItem>
            </Split>
        </Fragment>
    );
};

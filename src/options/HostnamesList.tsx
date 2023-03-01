/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import {
    Split,
    SplitItem,
    Label,
    SimpleList,
    SimpleListItem,
    Truncate,
} from "@patternfly/react-core";
import { Endpoint } from "../preferences/preferences";
import { DropdownMenu } from "./DropdownMenu";

interface Props {
    endpoints: Endpoint[];
    onClickSetDefault: (endpoint: Endpoint) => void;
    onClickDelete: (endpoint: Endpoint) => void;
}

export const HostnamesList = (props: Props) => {
    const listItems = props.endpoints.map((endpoint: Endpoint, i: number) => {
        return (
            <SimpleListItem
                key={"item-" + i}
                component="a"
                onClick={(e) => e.preventDefault()}
            >
                <Split>
                    <SplitItem>
                        <Truncate content={endpoint.url} />
                    </SplitItem>
                    {endpoint.active && (
                        <SplitItem>
                            <Label
                                className="pf-u-ml-sm pf-u-mr-sm"
                                isCompact
                                color="blue"
                            >
                                Default
                            </Label>
                        </SplitItem>
                    )}

                    <SplitItem isFilled />
                    <SplitItem>
                        <DropdownMenu
                            isReadOnly={endpoint.readonly}
                            isDefault={endpoint.active}
                            onClickSetDefault={() =>
                                props.onClickSetDefault(endpoint)
                            }
                            onClickDelete={() => props.onClickDelete(endpoint)}
                        />
                    </SplitItem>
                </Split>
            </SimpleListItem>
        );
    });

    return <SimpleList data-testid="hostnames-list">{listItems}</SimpleList>;
};

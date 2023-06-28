/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { Split, SplitItem } from "@patternfly/react-core/layouts/Split";
import { Label } from "@patternfly/react-core/components/Label";
import {
    SimpleList,
    SimpleListItem,
} from "@patternfly/react-core/components/SimpleList";
import { TrashIcon } from "@patternfly/react-icons/dist/js/icons/trash-icon";
import { Truncate } from "@patternfly/react-core/components/Truncate";


interface Props {
    domains: string[];
    onClickDelete: (domain: string) => void;
}

export const GitDomainList = (props: Props) => {
    const listItems = props.domains.map((domain: string, i: number) => {
        return (
            <SimpleListItem
                key={"item-" + i}
                component="a"
                onClick={(e) => e.preventDefault()}
            >
                <Split>
                    <SplitItem>
                        <Truncate content={domain} />
                    </SplitItem>
                    <SplitItem isFilled />
                    <SplitItem>
                        <TrashIcon onClick={() => props.onClickDelete(domain)}/>
                    </SplitItem>
                </Split>
            </SimpleListItem>
        );
    });

    return <SimpleList data-testid="gitdomains-list">{listItems}</SimpleList>;
};

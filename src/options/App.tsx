/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { useEffect, useState } from "react";

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
    PageSection,
    PageSectionVariants,
    PageBreadcrumb,
    Breadcrumb,
    BreadcrumbItem,
    Tabs,
    Tab,
    TabContent,
    TabContentBody,
    TabTitleText,
    Title,
    DescriptionList,
    DescriptionListGroup,
    DescriptionListTerm,
    DescriptionListDescription,
    Label,
    LabelGroup,
    Flex,
    FlexItem,
} from "@patternfly/react-core";
import {
    Endpoint,
    getEndpoints,
    saveEndpoints,
} from "../preferences/preferences";
import { EndpointsList } from "./EndpointsList";
import "./styles/App.css";
import { DevSpacesEndpoints } from './DevSpacesEndpoints';
import { GitDomains } from './GitDomains';

export const App = () => {
    const [activeTabKey, setActiveTabKey] = useState(0);

    // Toggle currently active tab
    const handleTabClick = (event, tabIndex) => {
        setActiveTabKey(tabIndex);
    };

    return (
        <Card>
            <PageSection
                type="tabs"
                variant={PageSectionVariants.light}
                isWidthLimited
            >
                <Tabs
                    activeKey={activeTabKey}
                    onSelect={handleTabClick}
                    usePageInsets
                    id="open-tabs-example-tabs-list"
                >
                    <Tab
                        eventKey={0}
                        title={
                            <TabTitleText>Dev Spaces endpoints</TabTitleText>
                        }
                        tabContentId={`tabContent${0}`}
                    />
                    <Tab
                        eventKey={1}
                        title={
                            <TabTitleText>
                                GitHub Enterprise domains
                            </TabTitleText>
                        }
                        tabContentId={`tabContent${1}`}
                    />
                </Tabs>
            </PageSection>
            <PageSection isWidthLimited variant={PageSectionVariants.light}>
                <TabContent
                    key={0}
                    eventKey={0}
                    id={`tabContent${0}`}
                    activeKey={activeTabKey}
                    hidden={0 !== activeTabKey}
                >
                    <TabContentBody>
                        <DevSpacesEndpoints/>
                    </TabContentBody>
                </TabContent>
                <TabContent
                    key={1}
                    eventKey={1}
                    id={`tabContent${1}`}
                    activeKey={activeTabKey}
                    hidden={1 !== activeTabKey}
                >
                    <TabContentBody>
                      <GitDomains/>
                    </TabContentBody>
                </TabContent>
            </PageSection>
        </Card>
    );
};

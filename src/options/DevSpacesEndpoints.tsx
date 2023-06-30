/*-----------------------------------------------------------------------------------------------
 *  Copyright (c) Red Hat, Inc. All rights reserved.
 *  Licensed under the MIT License. See LICENSE file in the project root for license information.
 *-----------------------------------------------------------------------------------------------*/

import { Fragment, useEffect, useState } from "react";

import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/utilities/Spacing/spacing.css";
import "@patternfly/patternfly/utilities/Float/float.css";

import {
    Endpoint,
    getEndpoints,
    saveEndpoints,
} from "../preferences/preferences";
import { EndpointsList } from "./EndpointsList";
import { sanitizeUrl } from './util';
import { FormUI } from './FormUI';

export const DevSpacesEndpoints = () => {
    const [endpoints, setEndpoints] = useState<Endpoint[]>([]);

    useEffect(() => {
        updateEndpoints().catch(console.error);
    }, []);

    const updateEndpoints = async () => {
        const endpoints = await getEndpoints();
        setEndpoints(endpoints);
    };

    const addNewEndpoint = async (newEndpointUrl: string) => {
        const sanitizedEndpoint = sanitizeUrl(newEndpointUrl);
        const newEndpoints = endpoints.concat({
            url: sanitizedEndpoint,
            active: false,
            readonly: false,
        });
        try {
            await saveEndpoints(newEndpoints);
            await updateEndpoints();
        } catch (err) {
            return false;
        }
        return true;
    };

    const setDefault = async (endpoint: Endpoint) => {
        const newEndpoints = [...endpoints];
        newEndpoints.forEach((e) => {
            e.active = e == endpoint;
        });
        await saveEndpoints(newEndpoints);
        await updateEndpoints();
    };

    const deleteEndpoint = async (endpoint: Endpoint) => {
        const newEndpoints = endpoints.filter((e) => e != endpoint);
        await saveEndpoints(newEndpoints);
        await updateEndpoints();
    };

    const list = endpoints.length && (
        <EndpointsList
            endpoints={endpoints}
            onClickSetDefault={setDefault}
            onClickDelete={deleteEndpoint}
        />
    );

    return (
        <FormUI onAdd={addNewEndpoint}
        textInputInvalidText={["Provide the URL of your Dev Spaces installation, e.g.,",
        <br/>,
        "https://devspaces.mycluster.mycorp.com"]}
        textInputAriaLabel="new endpoint"
        textInputPlaceholder="Add endpoint"
        >
            {list}
        </FormUI>
    );
};